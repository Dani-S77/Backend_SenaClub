import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from './mail.service';

import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // ========================
  //  REGISTRO Y LOGIN EXISTENTES
  // ========================

  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    const { firstName, lastName, email, password, phone, rol, clubs } =
      signupDto;

    // Validar dominio de correo según rol
    if (rol === 'admin') {
      if (!email.endsWith('@sena.edu')) {
        throw new BadRequestException(
          'Solo se permiten correos @sena.edu para administradores',
        );
      }
    } else {
      if (!email.endsWith('@soy.sena.edu.co')) {
        throw new BadRequestException(
          'Solo se permiten correos @soy.sena.edu.co para aprendices',
        );
      }
    }

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

    // Enviar correo de verificación
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await this.mailService.sendVerificationCode(email, code);
      // Aquí podrías guardar el código en la base de datos si quieres validación posterior
    } catch (error) {
      console.error('Error enviando correo de verificación:', error);
    }

    return {
      message:
        'Usuario registrado exitosamente. Revisa tu correo para el código de verificación.',
    };
  }

  async login(loginDto: LoginDto): Promise<{
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

    if (user.rol === 'admin') {
      if (!adminCode) {
        return {
          message: 'Por favor ingresa el código de administrador',
          requireAdminCode: true,
          rol: 'admin',
        };
      }
      if (adminCode.trim() !== (process.env.ADMIN_CODE || '').trim()) {
        return {
          message: 'Código de administrador incorrecto',
          requireAdminCode: true,
          rol: 'admin',
        };
      }
    }

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

  async joinClub(userId: string, club: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    if (!user.clubs.includes(club)) {
      user.clubs.push(club);
      await user.save();
    }
    return user;
  }

  async leaveClub(userId: string, club: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    user.clubs = user.clubs.filter((c) => c !== club);
    await user.save();
    return user;
  }

  // ========================
  //  RECUPERACIÓN DE CONTRASEÑA
  // ========================

  async sendPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Por seguridad, no revelamos si el email existe
      return {
        message:
          'Si el correo existe, recibirás las instrucciones para restablecer tu contraseña',
      };
    }

    // Generar token de recuperación (expira en 15 minutos)
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'password-reset' },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    // Generar URL de reseteo
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
      await this.mailService.sendPasswordResetEmail(
        email,
        resetUrl,
        user.firstName,
      );
      return {
        message:
          'Si el correo existe, recibirás las instrucciones para restablecer tu contraseña',
      };
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new BadRequestException(
        'Error al enviar el correo de recuperación',
      );
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Token inválido');
      }

      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      if (newPassword.length < 6) {
        throw new BadRequestException(
          'La contraseña debe tener al menos 6 caracteres',
        );
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      // Enviar notificación de cambio
      try {
        await this.mailService.sendPasswordChangedNotification(
          user.email,
          user.firstName,
        );
      } catch (error) {
        console.error('Error enviando notificación:', error);
      }

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new BadRequestException('Token inválido o expirado');
      }
      throw error;
    }
  }
}
