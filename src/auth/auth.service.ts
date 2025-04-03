import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { signUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private readonly jwtService: JwtService,
    ) {}

    async signup(signUpDto: signUpDto): Promise<{ token: string }> {
        const { firstName, lastName, phone, email, password } = signUpDto;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('El correo ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
            firstName,
            lastName,
            phone,
            email,
            password: hashedPassword,
        });

        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Correo o contraseña inválidos');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Correo o contraseña inválidos');
        }

        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }
}