import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/user.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Comment, CommentSchema } from '../posts/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}