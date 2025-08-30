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
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: Number(config.get<string>('SMTP_PORT')),
          secure: config.get<string>('SMTP_SECURE') === 'true',
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