import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  // Registro de usuario
  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    const { firstName, lastName, email, password, phone, rol, clubs } = signupDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Este correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      rol: rol ?? 'user',
      clubs,
    });

    await newUser.save();

    return { message: 'Usuario registrado exitosamente' };
  }

  // Login y generación de token con validación de adminCode si es admin
  async login(
    loginDto: LoginDto
  ): Promise<{ 
    token?: string; 
    rol?: string; 
    firstName?: string; 
    lastName?: string; 
    requireAdminCode?: boolean; 
    message?: string; 
  }> {
    const { email, password, adminCode } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // Si el usuario es admin, validamos el adminCode
    if (user.rol === 'admin') {
      // Logs para depuración
      console.log('ADMIN_CODE (env):', process.env.ADMIN_CODE);
      console.log('adminCode (frontend):', adminCode);

      // Si no se envió el código, pedirlo
      if (!adminCode) {
        return {
          message: 'Por favor ingresa el código de administrador',
          requireAdminCode: true,
          rol: 'admin'
        };
      }
      // Si el código es incorrecto (comparación sin espacios extra y case-sensitive)
      if (adminCode.trim() !== (process.env.ADMIN_CODE || '').trim()) {
        return {
          message: 'Código de administrador incorrecto',
          requireAdminCode: true,
          rol: 'admin'
        };
      }
    }

    // Token y respuesta normal
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      rol: user.rol,
      firstName: user.firstName,
      lastName: user.lastName,
      clubs: user.clubs,
    });

    return {
      token,
      rol: user.rol,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  // Método para que un usuario se una a un club
  async joinClub(userId: string, club: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    if (!user.clubs.includes(club)) {
      user.clubs.push(club);
      await user.save();
    }
    return user;
  }

  // Método para que un usuario abandone un club
  async leaveClub(userId: string, club: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    user.clubs = user.clubs.filter(c => c !== club);
    await user.save();
    return user;
  }
}