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

  async findAll(): Promise<Notification[]> {
    try {
      return await this.notificationModel.find().exec();
    } catch (error) {
      throw new BadRequestException({
        error: 'Error al obtener las notificaciones',
        message: error.message,
      });
    }
  }

  async update(id: string, notificationDto: NotificationDto): Promise<Notification> {
    try {
      console.log(`Actualizando notificación con ID: ${id}`);
      console.log('Datos recibidos:', notificationDto);
      
      // Validar que el ID tenga el formato correcto para MongoDB
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
      
      console.log('Notificación actualizada:', updatedNotification);
      return updatedNotification;
    } catch (error) {
      console.error('Error en actualización:', error);
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