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
}
