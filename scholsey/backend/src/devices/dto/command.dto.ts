import { IsString, IsEnum } from 'class-validator';

export enum CommandType {
  LOCK = 'lock',
  UNLOCK = 'unlock',
  WIPE = 'wipe',
  ALARM_ON = 'alarm_on',
  ALARM_OFF = 'alarm_off',
  LOCATE = 'locate',
}

export class SendCommandDto {
  @IsEnum(CommandType)
  commandType: CommandType;

  @IsString()
  deviceId: string;
}
