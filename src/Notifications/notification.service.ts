import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './Schemas/notification.schema';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async create(NotificationDto: NotificationDto): Promise<Notification> {
    try {
      const createdNotification = new this.notificationModel(NotificationDto);
      return await createdNotification.save();
    } catch (error) {
      throw new BadRequestException({
        error: 'Error al crear la notificación',
        message: error.message,
      });
    }
  }
}