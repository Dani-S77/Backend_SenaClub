// src/posts/schemas/post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // Referencia al User (ObjectId) para futuras operaciones si se desea populate
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId | string;

  // Nombre para mostrar del autor (guardado al crear el post para uso rápido en frontend)
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  club: string;

  // Likes
  @Prop({ type: [String], default: [] })
  likedBy: string[];

  @Prop({ default: 0 })
  likesCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
