import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './Schemas/user.schema';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}

  async create(notificationDto: NotificationDto): Promise<{ message: string; notificationId: string }> {
    const notification = new this.notificationModel({
      ...notificationDto,
      read: false,
      createdAt: new Date(),
    });
    const savedNotification = await notification.save();
    return { message: 'Notificación creada exitosamente', notificationId: (savedNotification._id as any).toString() };
  }

  async getAllNotifications(): Promise<any[]> {
    return this.notificationModel.find().exec();
  }
}