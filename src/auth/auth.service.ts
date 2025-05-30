import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    const { firstName, lastName, email, password, phone, rol } = signupDto;

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
    });

    await newUser.save();

    return { message: 'Usuario registrado exitosamente' };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; rol: string; firstName: string; lastName: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      rol: user.rol,
      firstName: user.firstName,
      lastName: user.lastName,
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
    user.clubs = user.clubs.filter(c => c !== club);
    await user.save();
    return user;
  }
}