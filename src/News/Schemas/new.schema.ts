import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Añadir timestamps para createdAt y updatedAt
export class News extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // Si prefieres definir createdAt explícitamente:
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);