import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ClubsModule } from './clubs/clubs.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { NotificationsModule } from './Notifications/notification.module';
import { NewsModule } from './News/new.module';
import { ReportsModule } from './reports/reports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Variables de entorno
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Mailer (Gmail SMTP)
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get<string>('SMTP_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),

    // Módulos de la app
    AuthModule,
    PostsModule,
    ClubsModule,
    UsuariosModule,
    NotificationsModule,
    NewsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


//mongodb+srv://admin:angel12345678@sena.xr6ag.mongodb.net/
//mongodb+srv://Admin:Dani772.@cluster0.ck5fe.mongodb.net/






















//http://localhost:3000/posts
//npm run start:dev
//npm run start:dev