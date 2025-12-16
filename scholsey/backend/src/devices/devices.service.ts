import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto, UpdateLocationDto } from './dto/device.dto';
import { SendCommandDto } from './dto/command.dto';
import { CreateGeofenceDto } from './dto/geofence.dto';
import { DevicesGateway } from './devices.gateway';

@Injectable()
export class DevicesService {
  constructor(
    private prisma: PrismaService,
    private gateway: DevicesGateway,
  ) {}

  async linkDevice(userId: string, dto: CreateDeviceDto) {
    // Check if device already exists
    const existing = await this.prisma.device.findUnique({
      where: { deviceId: dto.deviceId },
    });

    if (existing) {
      // Update ownership if device exists
      const updated = await this.prisma.device.update({
        where: { deviceId: dto.deviceId },
        data: { userId, name: dto.name },
        include: {
          locationUpdates: {
            orderBy: { timestamp: 'desc' },
            take: 1,
          },
        },
      });
      // Notify the user about device update
      this.gateway.notifyDeviceUpdate(userId, updated);
      return updated;
    }

    const created = await this.prisma.device.create({
      data: {
        name: dto.name,
        deviceId: dto.deviceId,
        userId,
      },
      include: {
        locationUpdates: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });
    this.gateway.notifyDeviceUpdate(userId, created);
    return created;
  }

  async getUserDevices(userId: string) {
    return this.prisma.device.findMany({
      where: { userId },
      include: {
        locationUpdates: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastSeen: 'desc' },
    });
  }

  async getDevice(deviceId: string, userId: string) {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        locationUpdates: {
          orderBy: { timestamp: 'desc' },
          take: 50, // Last 50 location updates
        },
      },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.userId !== userId) {
      throw new ForbiddenException('Not authorized to access this device');
    }

    return device;
  }

  async updateLocation(deviceId: string, dto: UpdateLocationDto) {
    // Find device by deviceId (unique identifier from phone)
    const device = await this.prisma.device.findUnique({
      where: { deviceId },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    // Update device status
    const updatedDevice = await this.prisma.device.update({
      where: { deviceId },
      data: {
        batteryLevel: dto.batteryLevel,
        isCharging: dto.isCharging,
        lastSeen: new Date(),
        lastLatitude: dto.latitude,
        lastLongitude: dto.longitude,
        lastCity: dto.city || undefined,
        lastIpAddress: dto.ipAddress || undefined,
      },
    });

    // Create location update
    const locationUpdate = await this.prisma.locationUpdate.create({
      data: {
        deviceId: device.id,
        latitude: dto.latitude,
        longitude: dto.longitude,
        accuracy: dto.accuracy,
        altitude: dto.altitude,
        speed: dto.speed,
        heading: dto.heading,
        ipAddress: dto.ipAddress,
        city: dto.city,
      },
    });

    // Emit real-time updates to the owning user
    this.gateway.notifyDeviceUpdate(device.userId, updatedDevice);
    this.gateway.notifyLocationUpdate(device.userId, {
      deviceId: device.id,
      latitude: locationUpdate.latitude,
      longitude: locationUpdate.longitude,
      timestamp: locationUpdate.timestamp,
    });

    return {
      device,
      location: locationUpdate,
    };
  }

  async unlinkDevice(deviceId: string, userId: string) {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this device');
    }

    await this.prisma.device.delete({
      where: { id: deviceId },
    });

    // Notify user so UI can reflect removal
    this.gateway.notifyDeviceUpdate(userId, { id: deviceId, deleted: true });
    
    // Log activity
    await this.logActivity(userId, 'device_unlinked', true, { deviceId });
    
    return { message: 'Device unlinked successfully' };
  }

  // Security & Remote Control Methods
  async sendCommand(userId: string, dto: SendCommandDto) {
    const device = await this.prisma.device.findUnique({
      where: { deviceId: dto.deviceId },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.userId !== userId) {
      throw new ForbiddenException('Not authorized to control this device');
    }

    const command = await this.prisma.deviceCommand.create({
      data: {
        deviceId: device.id,
        commandType: dto.commandType,
        status: 'pending',
      },
    });

    // Update device status based on command
    if (dto.commandType === 'lock') {
      await this.prisma.device.update({
        where: { id: device.id },
        data: { isLocked: true },
      });
    } else if (dto.commandType === 'wipe') {
      await this.prisma.device.update({
        where: { id: device.id },
        data: { isWiped: true, securityStatus: 'stolen' },
      });
    } else if (dto.commandType === 'alarm_on') {
      await this.prisma.device.update({
        where: { id: device.id },
        data: { alarmActive: true },
      });
    } else if (dto.commandType === 'alarm_off') {
      await this.prisma.device.update({
        where: { id: device.id },
        data: { alarmActive: false },
      });
    }

    // Notify device via WebSocket
    this.gateway.notifyDeviceCommand(device.userId, command);
    
    // Log activity
    await this.logActivity(userId, 'command_sent', true, { 
      commandType: dto.commandType, 
      deviceId: device.id 
    });

    return command;
  }

  async getPendingCommands(deviceId: string, userId: string) {
    const device = await this.prisma.device.findUnique({
      where: { deviceId },
    });

    if (!device || device.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.deviceCommand.findMany({
      where: {
        deviceId: device.id,
        status: 'pending',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGeofence(userId: string, dto: CreateGeofenceDto) {
    const geofence = await this.prisma.geofence.create({
      data: {
        userId,
        name: dto.name,
        latitude: dto.latitude,
        longitude: dto.longitude,
        radius: dto.radius,
        alertOnEnter: dto.alertOnEnter,
        alertOnExit: dto.alertOnExit,
      },
    });

    await this.logActivity(userId, 'geofence_created', true, { geofenceId: geofence.id });
    return geofence;
  }

  async getGeofences(userId: string) {
    return this.prisma.geofence.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteGeofence(geofenceId: string, userId: string) {
    const geofence = await this.prisma.geofence.findUnique({
      where: { id: geofenceId },
    });

    if (!geofence || geofence.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    await this.prisma.geofence.delete({
      where: { id: geofenceId },
    });

    await this.logActivity(userId, 'geofence_deleted', true, { geofenceId });
    return { message: 'Geofence deleted' };
  }

  async markDeviceAsStolen(deviceId: string, userId: string) {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device || device.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    const updated = await this.prisma.device.update({
      where: { id: deviceId },
      data: { securityStatus: 'stolen' },
    });

    this.gateway.notifyDeviceUpdate(userId, updated);
    await this.logActivity(userId, 'device_marked_stolen', true, { deviceId });
    
    return updated;
  }

  async markDeviceAsSafe(deviceId: string, userId: string) {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device || device.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    const updated = await this.prisma.device.update({
      where: { id: deviceId },
      data: { 
        securityStatus: 'safe',
        isLocked: false,
        alarmActive: false,
      },
    });

    this.gateway.notifyDeviceUpdate(userId, updated);
    await this.logActivity(userId, 'device_marked_safe', true, { deviceId });
    
    return updated;
  }

  async getActivityLogs(userId: string) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100, // Last 100 activities
    });
  }

  private async logActivity(
    userId: string, 
    action: string, 
    success: boolean = true, 
    metadata: any = null
  ) {
    await this.prisma.activityLog.create({
      data: {
        userId,
        action,
        success,
        metadata,
      },
    });
  }
}
