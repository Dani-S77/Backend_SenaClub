import { Controller, Body, Post, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  // Verificar correo: envía el código
  @Post('send-code')
  async sendCode(
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<{ message: string }> {
    await this.mailService.sendVerificationCode(email, code);
    return { message: 'Código enviado' };
  }

  // Registro
  @Post('signup')
  signUp(@Body() signupDto: SignupDto): Promise<{ message: string }> {
    return this.authService.signup(signupDto);
  }

  // Login
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{
    token?: string;
    rol?: string;
    firstName?: string;
    lastName?: string;
    requireAdminCode?: boolean;
    message?: string;
  }> {
    return this.authService.login(loginDto);
  }

  // Asociar club
  @UseGuards(JwtAuthGuard)
  @Patch(':userId/clubs')
  async joinClub(
    @Param('userId') userId: string,
    @Body('club') club: string,
  ): Promise<{ token: string; clubs: string[] }> {
    const user: UserDocument = await this.authService.joinClub(userId, club);
    const payload = {
      sub: user._id,
      email: user.email,
      rol: user.rol,
      firstName: user.firstName,
      lastName: user.lastName,
      clubs: user.clubs,
    };
    return { token: this.jwtService.sign(payload), clubs: user.clubs };
  }

  // Quitar club
  @UseGuards(JwtAuthGuard)
  @Delete(':userId/clubs/:club')
  async leaveClub(
    @Param('userId') userId: string,
    @Param('club') club: string,
  ): Promise<{ token: string; clubs: string[] }> {
    const decoded = decodeURIComponent(club);
    const user: UserDocument = await this.authService.leaveClub(userId, decoded);
    const payload = {
      sub: user._id,
      email: user.email,
      rol: user.rol,
      firstName: user.firstName,
      lastName: user.lastName,
      clubs: user.clubs,
    };
    return { token: this.jwtService.sign(payload), clubs: user.clubs };
  }
}
