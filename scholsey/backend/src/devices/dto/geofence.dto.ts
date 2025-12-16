import { IsString, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateGeofenceDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  @Min(10)
  radius: number; // meters, minimum 10m

  @IsBoolean()
  alertOnEnter: boolean = true;

  @IsBoolean()
  alertOnExit: boolean = true;
}
