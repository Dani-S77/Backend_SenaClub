import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 👈 Importa esto
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './Posts/post.module';
import { NotificationsModule } from './Notifications/notification.module';
import { NewsModule } from './News/new.module';

@Module({
  imports: [
    // 👇 Conexión a tu base de datos en MongoDB Atlas
    MongooseModule.forRoot(
      'mongodb+srv://Admin:Dani772.@cluster0.ck5fe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    ),
    AuthModule,
    PostsModule,
    NotificationsModule,
    NewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
