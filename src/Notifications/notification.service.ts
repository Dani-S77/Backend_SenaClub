import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './Schemas/notification.schema';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async create(notificationDto: NotificationDto): Promise<Notification> {
    try {
      const createdNotification = new this.notificationModel(notificationDto);
      return await createdNotification.save();
    } catch (error) {
      throw new BadRequestException({
        error: 'Error al crear la notificación',
        message: error.message,
      });
    }
  }

  // Nuevo: permite filtrar por tipo y/o userId
  async findAll(filter: { type?: string; userId?: string } = {}): Promise<Notification[]> {
  try {
    const query: any = {};
    if (filter.type) {
      query.type = filter.type;
    }
    if (filter.userId) {
      query.$or = [
        { userId: filter.userId },
        { type: 'alert' },
        { type: 'global' }
      ];
    }
    return await this.notificationModel.find(query).sort({ createdAt: -1 }).exec();
  } catch (error) {
    throw new BadRequestException({
      error: 'Error al obtener las notificaciones',
      message: error.message,
    });
  }
}

  async update(id: string, notificationDto: NotificationDto): Promise<Notification> {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new BadRequestException(`ID inválido: ${id}`);
      }
      const updatedNotification = await this.notificationModel.findByIdAndUpdate(
        id,
        notificationDto,
        { new: true }
      ).exec();

      if (!updatedNotification) {
        throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
      }
      return updatedNotification;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException({
        error: 'Error al actualizar la notificación',
        message: error.message,
      });
    }
  }
}