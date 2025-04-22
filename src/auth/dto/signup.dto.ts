import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsArray,
    ArrayNotEmpty
  } from 'class-validator';
  
  export class SignupDto {
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;
  
    @IsNotEmpty()
    @IsString()
    readonly lastName: string;
  
    @IsNotEmpty()
    @IsString()
    readonly phone: string;
  
    @IsNotEmpty()
    @IsString()
    readonly rol: string;
  
    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter a correct email" })
    readonly email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
  
    @IsArray()
    @ArrayNotEmpty({ message: 'Select at least one club' })
    @IsString({ each: true })
    readonly clubs: string[];
  }