import {
  Controller,
  Body,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
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

  // ========================
  //  RECUPERACIÓN DE CONTRASEÑA
  // ========================

  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  // ========================
  //  FUNCIONES EXISTENTES
  // ========================

  @Post('send-code')
  async sendCode(
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<{ message: string }> {
    await this.mailService.sendVerificationCode(email, code);
    return { message: 'Código enviado' };
  }

  @Post('signup')
  signUp(@Body() signupDto: SignupDto): Promise<{ message: string }> {
    return this.authService.signup(signupDto);
  }

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

  @UseGuards(JwtAuthGuard)
  @Delete(':userId/clubs/:club')
  async leaveClub(
    @Param('userId') userId: string,
    @Param('club') club: string,
  ): Promise<{ token: string; clubs: string[] }> {
    const decoded = decodeURIComponent(club);
    const user: UserDocument = await this.authService.leaveClub(
      userId,
      decoded,
    );
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

  @Post('test-email')
  async testEmail(@Body('email') email: string) {
    await this.mailService.sendSimpleTextEmail(
      email,
      'Este es un correo de prueba.',
    );
    return { message: 'Correo enviado (si la configuración es correcta).' };
  }
}
