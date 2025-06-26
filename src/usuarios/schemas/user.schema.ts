import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; 
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({ collection: 'users',
   timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Usuario {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // Nuevo campo clubs
  @Prop({ type: [String], default: [] })
  clubs: string[];

  // Nuevo campo About Me
  @Prop({ type: String, default: '' })
  about: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);