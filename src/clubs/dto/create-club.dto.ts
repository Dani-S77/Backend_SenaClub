import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClubDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'El nombre del club es obligatorio' })
  name: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;
}