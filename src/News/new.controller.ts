import { Body, Controller, Delete, Get, Param, Post, HttpException, HttpStatus } from '@nestjs/common';
import { sign } from 'crypto';
import { NewsService } from './new.service';
import { NewDto } from './dto/new.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  async create(@Body() newDto: NewDto) {
    try {
      return await this.newsService.create(newDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error al crear noticia: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getNews() {
    try {
      return await this.newsService.getAllNews();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error al obtener noticias: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteNews(@Param('id') id: string) {
    try {
      return await this.newsService.deleteNews(id);
    } catch (error) {
      // Si es un NotFoundException, retorna 404
      if (error.name === 'NotFoundException') {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      
      // Para cualquier otro error
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error al eliminar noticia: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}