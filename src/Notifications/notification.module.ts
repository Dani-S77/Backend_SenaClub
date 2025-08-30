import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';
import {
  Notification,
  NotificationSchema,
} from './Schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService], // Exportamos el servicio para que otros módulos lo puedan usar
})
export class NotificationsModule {}
