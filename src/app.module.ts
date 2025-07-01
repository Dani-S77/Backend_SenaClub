import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ClubsModule } from './clubs/clubs.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { NotificationsModule } from './Notifications/notification.module';
import { NewsModule } from './News/new.module';
import { ReportsModule } from './reports/reports.module'; // ✅ Reportes

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexión a MongoDB usando variables de entorno
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Módulos funcionales
    AuthModule,
    PostsModule,
    ClubsModule,
    UsuariosModule,
    NotificationsModule,
    NewsModule,
    ReportsModule, // ✅ Módulo de reportes integrado aquí
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