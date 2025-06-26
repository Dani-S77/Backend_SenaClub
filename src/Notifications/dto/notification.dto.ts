import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(['info', 'success', 'error', 'warning', 'alert'])
  type: string;
}