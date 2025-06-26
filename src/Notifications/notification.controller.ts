import { Body, Post, Get, Put, Param, Query, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() notificationDto: NotificationDto) {
    try {
      const notification = await this.notificationsService.create(notificationDto);
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

  // Nuevo: recibe query params para filtrar
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('type') type?: string,
    @Query('userId') userId?: string,
  ) {
    try {
      const notifications = await this.notificationsService.findAll({ type, userId });
      return {
        error: '',
        message: 'Notificaciones obtenidas correctamente',
        data: notifications,
      };
    } catch (error) {
      return {
        error: 'Error al obtener las notificaciones',
        message: error.message,
      };
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() notificationDto: NotificationDto) {
    try {
      const updatedNotification = await this.notificationsService.update(id, notificationDto);
      return {
        error: '',
        message: 'Notificación actualizada correctamente',
        data: updatedNotification,
      };
    } catch (error) {
      return {
        error: 'Error al actualizar la notificación',
        message: error.message,
      };
    }
  }
}