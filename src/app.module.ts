import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './Posts/post.module';
import { NotificationsModule } from './Notifications/notification.module';
import { NewsModule } from './News/new.module';


@Module({
  imports: [AuthModule, PostsModule, NotificationsModule, NewsModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
