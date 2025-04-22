import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // payload tendrá sub, email, rol, firstName, lastName, clubs, iat, exp
  async validate(payload: any) {
    // Exponemos también name y clubs en request.user
    return {
      userId: payload.sub,
      email: payload.email,
      rol: payload.rol,
      firstName: payload.firstName,
      lastName: payload.lastName,
      clubs: payload.clubs,
    };
  }
}