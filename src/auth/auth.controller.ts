import { Body, Post, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signUp(@Body() signUpDto: signUpDto): Promise<{token:string}> {
        return this.authService.signup(signUpDto);
    }

}
