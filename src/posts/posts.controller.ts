import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './schemas/post.schemas';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  
  @Get('club/:clubId')
  async findByClub(@Param('clubId') clubId: string): Promise<PostEntity[]> {
    return this.postsService.findByClub(clubId);
  }


  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<PostEntity[]> {
    return this.postsService.findByUser(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.remove(id);
  }
}