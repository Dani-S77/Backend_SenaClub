import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { NewsService } from './new.service';
import { NewDto } from './dto/new.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() newDto: NewDto, @Req() req: Request) {
    try {
      const user = req.user as any; // JWT decoded user
      const author = `${user.firstName} ${user.lastName}`;
      return await this.newsService.create({ ...newDto, author });
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
      if (error.name === 'NotFoundException') {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: error.message },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error al eliminar noticia: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateNews(@Param('id') id: string, @Body() updateDto: NewDto) {
    try {
      return await this.newsService.updateNews(id, updateDto);
    } catch (error) {
      if (error.name === 'NotFoundException') {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: error.message },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error al actualizar noticia: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}