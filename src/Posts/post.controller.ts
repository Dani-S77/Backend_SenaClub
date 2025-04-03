import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { PostsService } from './post.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('post')
  @UseGuards(JwtAuthGuard)
  async create(@Body('content') content: string, @Request() req) {
    console.log('Usuario autenticado:', req.user);
    return this.postsService.create(content, req.user.userId);
  }

  @Get('my-posts')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Request() req) {
    return this.postsService.findByUser(req.user.userId);
  }
}
