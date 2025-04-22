import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signupDto: SignupDto): Promise<{ message: string }> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto
  ): Promise<{ token: string; rol: string }> {   // ← aquí cambiamos la firma
    return this.authService.login(loginDto);
  }
}