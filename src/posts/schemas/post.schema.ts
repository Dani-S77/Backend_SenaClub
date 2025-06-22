import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // ID del autor, tomado del token
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  club: string;

  // Likes
  @Prop({ type: [String], default: [] })
  likedBy: string[];

  @Prop({ default: 0 })
  likesCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);