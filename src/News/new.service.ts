import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News } from './Schemas/new.schema';
import { NewDto } from './dto/new.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  async create(newDto: NewDto): Promise<{ message: string; newsId: string }> {
    const news = new this.newsModel(newDto);
    const savedNews = await news.save();
    return { 
      message: 'Noticia creada exitosamente', 
      newsId: (savedNews._id as Types.ObjectId).toHexString()
    };
  }

  async getAllNews(): Promise<News[]> {
    return this.newsModel.find().exec();
  }
}
