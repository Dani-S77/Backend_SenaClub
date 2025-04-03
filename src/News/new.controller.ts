import { Body, Post, Get, Controller } from '@nestjs/common';
import { sign } from 'crypto';
import { NewsService } from './new.service';
import { NewDto } from './dto/new.dto';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post()
  create(@Body() newDto: NewDto): Promise<{ message: string; newsId: string }> {
    return this.newsService.create(newDto);
  }

  @Get()
  getNews(): Promise<any[]> {
    return this.newsService.getAllNews();
  }
}