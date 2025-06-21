import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  postId: string;       // ID del post al que pertenece

  @Prop({ required: true })
  userId: string;       // ID del autor del comentario

  @Prop({ required: true })
  username: string;     // Nombre para mostrar (extraído del token)

  @Prop({ required: true, maxlength: 100 })
  content: string;      // Texto del comentario, máximo 100 caracteres
}

export const CommentSchema = SchemaFactory.createForClass(Comment);