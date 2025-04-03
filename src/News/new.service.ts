import { Body, Post, Get, Controller } from '@nestjs/common';
import { sign } from 'crypto';
import { NewDto } from './dto/new.dto';

export class NewsService {
  // Simulación de una base de datos en memoria (sin Mongoose por las restricciones)
  private news: any[] = [];

  async create(newDto: NewDto): Promise<{ message: string; newsId: string }> {
    const newsId = Date.now().toString(); // Genera un ID simple basado en timestamp
    const newNews = {
      ...newDto,
      createdAt: new Date(),
      id: newsId,
    };
    this.news.push(newNews);
    return { message: 'Noticia creada exitosamente', newsId };
  }

  async getAllNews(): Promise<any[]> {
    return this.news;
  }
}