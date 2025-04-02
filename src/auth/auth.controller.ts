import { Body, Post, Get, Controller } from '@nestjs/common';
import { sign } from 'crypto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { signUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signUp(@Body() signUpDto: signUpDto): Promise<{token:string}> {
        return this.authService.signup(signUpDto);
    }
    @Get('/login')
    login(@Body() loginDto: LoginDto): Promise<{token:string}> {
        return this.authService.login(loginDto);
    }

}
