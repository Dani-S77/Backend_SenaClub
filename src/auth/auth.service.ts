import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException
} from '@nestjs/common';
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
    const { email, password, firstName, lastName, phone, rol, clubs } = signupDto;
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new ConflictException('Este correo ya está registrado.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      rol,
      clubs
    });
    await newUser.save();
    return { message: 'Usuario registrado con éxito' };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; rol: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales incorrectas');

    const payload = {
      sub: user._id,
      email: user.email,
      rol: user.rol,
      firstName: user.firstName,
      lastName: user.lastName,
      clubs: user.clubs
    };
    const token = this.jwtService.sign(payload);
    return { token, rol: user.rol };
  }

  // Ahora devuelve UserDocument, que sí tiene _id
  async joinClub(userId: string, club: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!user.clubs.includes(club)) {
      user.clubs.push(club);
      await user.save();
    }
    return user;
  }

  async leaveClub(userId: string, club: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.clubs = user.clubs.filter(c => c !== club);
    await user.save();
    return user;
  }
}