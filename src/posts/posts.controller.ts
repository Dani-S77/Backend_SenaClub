// src/posts/posts.controller.ts
import {
  Controller,
  Get,
  Post as HttpPost,
  Delete as HttpDelete,
  Patch,
  Param,
  Body,
  Request,
  UseGuards,
  HttpCode,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post as PostEntity } from './schemas/post.schema';
import { Comment } from './schemas/comment.schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Crear post
  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto, @Request() req): Promise<PostEntity> {
    const userId: string = req.user.userId;
    const username = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'anonimo';
    return this.postsService.create({
      title: createPostDto.title,
      content: createPostDto.content,
      club: createPostDto.club,
      user: userId,
      username,
    });
  }

  // Obtener todos los posts
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  // Actualizar post
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    // Verificar existencia y permisos
    const post = await this.postsService.findById(id);
    if (!post) throw new NotFoundException('Post no encontrado');
    const userId: string = req.user.userId;
    const isAdmin = req.user.rol === 'admin';

    // post.user puede ser ObjectId o string dependiendo de cómo se guardó; normalizamos a string
    const postUserId = (post as any).user?._id ?? (post as any).user;
    if (String(postUserId) !== String(userId) && !isAdmin) {
      throw new ForbiddenException('No tienes permiso para actualizar este post');
    }
    return this.postsService.update(id, updatePostDto);
  }

  // Eliminar post (sólo admin)
  @UseGuards(JwtAuthGuard)
  @HttpDelete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.rol === 'admin';
    if (!isAdmin) {
      throw new ForbiddenException('Solo admin puede eliminar posts');
    }
    await this.postsService.remove(id);
  }

  // Likes: añadir
  @UseGuards(JwtAuthGuard)
  @HttpPost(':id/like')
  async like(@Param('id') postId: string, @Request() req) {
    const userId: string = req.user.userId;
    return this.postsService.addLike(postId, userId);
  }

  // Likes: quitar
  @UseGuards(JwtAuthGuard)
  @HttpDelete(':id/like')
  async unlike(@Param('id') postId: string, @Request() req) {
    const userId: string = req.user.userId;
    return this.postsService.removeLike(postId, userId);
  }

  // Obtener comentarios
  @UseGuards(JwtAuthGuard)
  @Get(':id/comments')
  async getComments(@Param('id') postId: string): Promise<Comment[]> {
    return this.postsService.fetchComments(postId);
  }

  // Añadir comentario
  @UseGuards(JwtAuthGuard)
  @HttpPost(':id/comments')
  async addComment(
    @Param('id') postId: string,
    @Body() addCommentDto: AddCommentDto,
    @Request() req,
  ): Promise<Comment> {
    const userId: string = req.user.userId;
    const username = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'anonimo';
    const content = addCommentDto.content.trim().slice(0, 100);
    return this.postsService.addComment(postId, userId, username, content);
  }

  // Eliminar comentario
  @UseGuards(JwtAuthGuard)
  @HttpDelete(':postId/comments/:commentId')
  @HttpCode(204)
  async deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    const userId: string = req.user.userId;
    const isAdmin = req.user.rol === 'admin';
    await this.postsService.removeComment(postId, commentId, userId, isAdmin);
  }
}
