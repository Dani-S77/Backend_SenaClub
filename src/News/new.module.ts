import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController } from './new.controller';
import { NewsService } from './new.service';
import { News, NewsSchema } from './Schemas/new.schema';
import { NotificationsModule } from '../Notifications/notification.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    NotificationsModule, // Importamos el módulo de notificaciones
    UsuariosModule, // Importamos el módulo de usuarios
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
