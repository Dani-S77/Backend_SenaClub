import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(['info', 'success', 'error', 'warning'])
  type: string;
}