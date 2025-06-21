import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  // Crear nuevo post
  async create(createDto: { title: string; content: string; club: string; user: string }): Promise<Post> {
    const created = new this.postModel(createDto);
    return created.save();
  }

  // Obtener todos los posts, ordenados por fecha descendente
  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  // Obtener un post por ID (para ver autor, permisos, etc.)
  async findById(id: string): Promise<Post | null> {
    return this.postModel.findById(id).lean().exec();
  }

  // Actualizar post (parcial)
  async update(id: string, updateDto: Partial<{ title: string; content: string; club: string }>): Promise<Post> {
    const updated = await this.postModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Post no encontrado');
    return updated;
  }

  // Eliminar post y sus comentarios asociados
  async remove(id: string): Promise<void> {
    const deleted = await this.postModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Post no encontrado');
    // Eliminar todos los comentarios de este post
    await this.commentModel.deleteMany({ postId: id }).exec();
  }

  // Añadir like
  async addLike(postId: string, userId: string): Promise<{ likesCount: number }> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) throw new NotFoundException('Post no encontrado');
    if (post.likedBy.includes(userId)) {
      throw new ForbiddenException('Ya has dado like a este post');
    }
    post.likedBy.push(userId);
    post.likesCount = post.likedBy.length;
    await post.save();
    return { likesCount: post.likesCount };
  }

  // Quitar like
  async removeLike(postId: string, userId: string): Promise<{ likesCount: number }> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) throw new NotFoundException('Post no encontrado');
    const idx = post.likedBy.indexOf(userId);
    if (idx === -1) {
      throw new ForbiddenException('No has dado like a este post');
    }
    post.likedBy.splice(idx, 1);
    post.likesCount = post.likedBy.length;
    await post.save();
    return { likesCount: post.likesCount };
  }

  // Obtener comentarios de un post
  async fetchComments(postId: string): Promise<Comment[]> {
    const exists = await this.postModel.exists({ _id: postId });
    if (!exists) throw new NotFoundException('Post no encontrado');
    return this.commentModel.find({ postId }).sort({ createdAt: 1 }).lean().exec();
  }

  // Añadir comentario
  async addComment(postId: string, userId: string, username: string, content: string): Promise<Comment> {
    const exists = await this.postModel.exists({ _id: postId });
    if (!exists) throw new NotFoundException('Post no encontrado');
    const comment = new this.commentModel({ postId, userId, username, content });
    return comment.save();
  }

  // Eliminar comentario (sólo autor o admin)
  async removeComment(postId: string, commentId: string, userId: string, isAdmin: boolean): Promise<void> {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment || comment.postId !== postId) {
      throw new NotFoundException('Comentario no encontrado para este post');
    }
    if (comment.userId !== userId && !isAdmin) {
      throw new ForbiddenException('No autorizado para eliminar este comentario');
    }
    await this.commentModel.deleteOne({ _id: commentId }).exec();
  }
}