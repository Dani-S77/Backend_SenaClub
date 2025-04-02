import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  author: string; // Podría ser el ID del usuario

  @Prop()
  club: string; // Por ejemplo, "futbol"
}

export const PostSchema = SchemaFactory.createForClass(Post);