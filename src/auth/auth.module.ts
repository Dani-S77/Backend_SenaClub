import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'test/.env', // Especifica la ruta correcta al archivo .env
      isGlobal: true, // Opcional: hace que ConfigModule sea global
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('JWT_SECRET:', config.get<string>('JWT_SECRET')); // Depuración
        console.log('JWT_EXPIRES:', config.get<string>('JWT_EXPIRES')); // Depuración
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('DB_URI');
        console.log('DB_URI desde ConfigService:', uri); // Depuración
        if (!uri) {
          throw new Error('DB_URI no está definido en el archivo .env');
        }
        return {
          uri: uri,
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <-- Agregar JwtStrategy aquí
  exports: [AuthService, JwtStrategy], 
})
export class AuthModule {}