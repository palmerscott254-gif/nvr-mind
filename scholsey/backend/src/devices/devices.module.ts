import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesGateway } from './devices.gateway';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService, DevicesGateway],
})
export class DevicesModule {}
