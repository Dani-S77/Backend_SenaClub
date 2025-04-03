import { Body, Post, Get, Controller } from '@nestjs/common';
import { sign } from 'crypto';
import { NotificationsService } from './notification.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post()
  create(@Body() notificationDto: NotificationDto): Promise<{ message: string; notificationId: string }> {
    return this.notificationsService.create(notificationDto);
  }

  @Get()
  getNotifications(): Promise<any[]> {
    return this.notificationsService.getAllNotifications();
  }
}