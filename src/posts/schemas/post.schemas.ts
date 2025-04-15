import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false, default: 'anonimo' }) 
  user: string;

  @Prop({ required: true })
  club: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);