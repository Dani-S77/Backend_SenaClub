import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
  @IsString({ message: 'El mensaje debe ser una cadena de texto' })
  @MinLength(5, { message: 'El mensaje debe tener al menos 5 caracteres' })
  readonly message: string;

  @IsNotEmpty({ message: 'El ID del usuario no puede estar vacío' })
  @IsString({ message: 'El ID del usuario debe ser una cadena de texto' })
  readonly userId: string;
}