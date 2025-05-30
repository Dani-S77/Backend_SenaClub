import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News } from './Schemas/new.schema';
import { NewDto } from './dto/new.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  async create(newDto: NewDto): Promise<{ message: string; newsId: string }> {
    try {
      const news = new this.newsModel(newDto);
      const savedNews = await news.save();
      
      // Usar toString() en el ID asegurándose que es un ObjectId
      const newsId = savedNews._id instanceof Types.ObjectId 
        ? savedNews._id.toString() 
        : String(savedNews._id);
        
      return {
        message: 'Noticia creada exitosamente',
        newsId
      };
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
      // Validar si el ID es válido
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`ID de noticia no válido: ${id}`);
      }

      const result = await this.newsModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException(`Noticia con ID "${id}" no encontrada`);
      }
      
      return {
        message: 'Noticia eliminada exitosamente'
      };
    } catch (error) {
      // Verifica si el error es una instancia de NotFoundException
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar noticia: ${error.message}`);
    }
  }


    async updateNews(id: string, updateDto: NewDto): Promise<News> {
      try {
        // Validar si el ID es válido
        if (!Types.ObjectId.isValid(id)) {
          throw new NotFoundException(`ID de noticia no válido: ${id}`);
        }
    
        const updatedNews = await this.newsModel.findByIdAndUpdate(
          id,
          {
            title: updateDto.title,
            content: updateDto.content,
          },
          { new: true } // Para devolver el documento actualizado
        );
    
        if (!updatedNews) {
          throw new NotFoundException(`Noticia con ID "${id}" no encontrada`);
        }
    
        return updatedNews;
      } catch (error) {
        // Verifica si el error es una instancia de NotFoundException
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new Error(`Error al actualizar noticia: ${error.message}`);
      }
    }
  
}