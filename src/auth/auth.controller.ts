import {
  Controller,
  Body,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('signup')
  signUp(@Body() signupDto: SignupDto): Promise<{ message: string }> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  // Cambiado tipo de retorno para que acepte todos los posibles campos opcionales
  login(
    @Body() loginDto: LoginDto
  ): Promise<{
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
    @Body('club') club: string
  ): Promise<{ token: string; clubs: string[] }> {
    const user: UserDocument = await this.authService.joinClub(userId, club);
    const payload = {
      sub: user._id,
      email: user.email,
      rol: user.rol,
      firstName: user.firstName,
      lastName: user.lastName,
      clubs: user.clubs
    };
    const token = this.jwtService.sign(payload);
    return { token, clubs: user.clubs };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId/clubs/:club')
  async leaveClub(
    @Param('userId') userId: string,
    @Param('club') club: string
  ): Promise<{ token: string; clubs: string[] }> {
    const decoded = decodeURIComponent(club);
    const user: UserDocument = await this.authService.leaveClub(userId, decoded);
    const payload = {
      sub: user._id,
      email: user.email,
      rol: user.rol,
      firstName: user.firstName,
      lastName: user.lastName,
      clubs: user.clubs
    };
    const token = this.jwtService.sign(payload);
    return { token, clubs: user.clubs };
  }
}