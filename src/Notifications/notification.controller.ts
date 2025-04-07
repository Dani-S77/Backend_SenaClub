import { Body, Post, Get, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { sign } from 'crypto';
import { NotificationsService } from './notification.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() NotificationDto: NotificationDto) {
    try {
      const notification = await this.notificationsService.create(NotificationDto);
      return {
        error: '',
        message: 'Notificación creada correctamente',
        data: notification,
      };
    } catch (error) {
      return {
        error: 'Error al crear la notificación',
        message: error.message,
      };
    }
  }
}