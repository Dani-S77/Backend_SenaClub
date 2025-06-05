import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class NewDto {
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @Matches(/[A-Za-z]/, { message: 'El título no puede contener solo números' })
  readonly title: string;

  @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
  @IsString({ message: 'El contenido debe ser una cadena de texto' })
  @MinLength(10, { message: 'El contenido debe tener al menos 10 caracteres' })
  @Matches(/[A-Za-z]/, { message: 'El contenido no puede contener solo números' })
  readonly content: string;

}