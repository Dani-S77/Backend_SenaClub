import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { signUpDto } from './dto/signup.dto'; // Corrige la capitalización

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private readonly jwtService: JwtService,
    ) {}

    async signup(signUpDto: signUpDto): Promise<{ token: string }> {
        const { name, email, password } = signUpDto;

        // Verifica si el email ya está registrado
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('El correo ya está registrado');
        }

        // Hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea el nuevo usuario
        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Genera un token JWT
        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        // Busca al usuario por email
        const user = await this.userModel.findOne({ email });

        // Si no se encuentra el usuario, lanza una excepción
        if (!user) {
            throw new UnauthorizedException('Correo o contraseña inválidos');
        }

        // Compara la contraseña proporcionada con la almacenada
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        // Si las contraseñas no coinciden, lanza una excepción
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Correo o contraseña inválidos');
        }

        // Genera un token JWT
        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }
}