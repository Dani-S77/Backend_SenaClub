import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PostDto {
  @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
  @IsString({ message: 'El contenido debe ser una cadena de texto' })
  @MinLength(5, { message: 'El contenido debe tener al menos 5 caracteres' })
  readonly content: string;

  @IsNotEmpty({ message: 'El ID del usuario no puede estar vacío' })
  @IsString({ message: 'El ID del usuario debe ser una cadena de texto' })
  readonly userId: string;
}