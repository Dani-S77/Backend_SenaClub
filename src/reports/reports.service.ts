import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from '../usuarios/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { Comment, CommentDocument } from '../posts/schemas/comment.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async getReport() {
    const usuarios = await this.usuarioModel.find().lean().exec();

    const posts = await this.postModel.find().lean().exec();
    const postIds = posts.map((p) => p._id);
    const comentarios = await this.commentModel.find({ postId: { $in: postIds } }).lean().exec();

    const postsConComentarios = posts.map((post) => ({
      ...post,
      comentarios: comentarios.filter((c) => c.postId === post._id.toString()),
    }));

    return {
      usuarios,
      posts: postsConComentarios,
    };
  }
}