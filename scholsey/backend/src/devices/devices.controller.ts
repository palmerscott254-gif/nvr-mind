import { 
  Controller, 
  Get, 
  Post, 
  Delete,
  Body, 
  Param, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDeviceDto, UpdateLocationDto } from './dto/device.dto';
import { SendCommandDto } from './dto/command.dto';
import { CreateGeofenceDto } from './dto/geofence.dto';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('link')
  async linkDevice(@Request() req, @Body() dto: CreateDeviceDto) {
    return this.devicesService.linkDevice(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserDevices(@Request() req) {
    return this.devicesService.getUserDevices(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDevice(@Request() req, @Param('id') id: string) {
    return this.devicesService.getDevice(id, req.user.id);
  }

  @Post('location/:deviceId')
  async updateLocation(
    @Param('deviceId') deviceId: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.devicesService.updateLocation(deviceId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async unlinkDevice(@Request() req, @Param('id') id: string) {
    return this.devicesService.unlinkDevice(id, req.user.id);
  }

  // Security & Remote Control Endpoints
  @UseGuards(JwtAuthGuard)
  @Post('command')
  async sendCommand(@Request() req, @Body() dto: SendCommandDto) {
    return this.devicesService.sendCommand(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('commands/:deviceId')
  async getPendingCommands(@Request() req, @Param('deviceId') deviceId: string) {
    return this.devicesService.getPendingCommands(deviceId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('geofence')
  async createGeofence(@Request() req, @Body() dto: CreateGeofenceDto) {
    return this.devicesService.createGeofence(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('geofences/list')
  async getGeofences(@Request() req) {
    return this.devicesService.getGeofences(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('geofence/:id')
  async deleteGeofence(@Request() req, @Param('id') id: string) {
    return this.devicesService.deleteGeofence(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('activity/logs')
  async getActivityLogs(@Request() req) {
    return this.devicesService.getActivityLogs(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/mark-stolen')
  async markAsStolen(@Request() req, @Param('id') id: string) {
    return this.devicesService.markDeviceAsStolen(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/mark-safe')
  async markAsSafe(@Request() req, @Param('id') id: string) {
    return this.devicesService.markDeviceAsSafe(id, req.user.id);
  }
}
