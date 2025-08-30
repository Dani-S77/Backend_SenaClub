import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News } from './Schemas/new.schema';
import { NewDto } from './dto/new.dto';
import { NotificationsService } from '../Notifications/notification.service';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<News>,
    private notificationsService: NotificationsService,
    private usuariosService: UsuariosService,
  ) {}

  async create(newDto: Partial<News>): Promise<News> {
    try {
      const news = new this.newsModel(newDto);
      return await news.save(); // devuelve la noticia completa, no solo el mensaje
    } catch (error) {
      throw new Error(`Error al crear noticia: ${error.message}`);
    }
  }

  async getAllNews(): Promise<News[]> {
    try {
      return await this.newsModel.find().sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Error al obtener noticias: ${error.message}`);
    }
  }

  async deleteNews(id: string): Promise<{ message: string }> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`ID de noticia no válido: ${id}`);
      }
      const result = await this.newsModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Noticia con ID "${id}" no encontrada`);
      }
      return { message: 'Noticia eliminada exitosamente' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Error al eliminar noticia: ${error.message}`);
    }
  }

  async updateNews(id: string, updateDto: NewDto): Promise<News> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`ID de noticia no válido: ${id}`);
      }
      const updatedNews = await this.newsModel.findByIdAndUpdate(
        id,
        { title: updateDto.title, content: updateDto.content },
        { new: true },
      );
      if (!updatedNews) {
        throw new NotFoundException(`Noticia con ID "${id}" no encontrada`);
      }
      return updatedNews;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Error al actualizar noticia: ${error.message}`);
    }
  }
}
