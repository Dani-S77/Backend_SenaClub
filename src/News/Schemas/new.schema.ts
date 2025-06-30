import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class News extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
