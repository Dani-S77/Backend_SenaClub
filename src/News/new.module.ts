import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController } from './new.controller';
import { NewsService } from './new.service';
import { News, NewsSchema } from './Schemas/new.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }])
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService] // Exportamos el servicio si se necesita en otros módulos
})
export class NewsModule {}