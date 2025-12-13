import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto, UpdateLocationDto } from './dto/device.dto';
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
    return { message: 'Device unlinked successfully' };
  }
}
