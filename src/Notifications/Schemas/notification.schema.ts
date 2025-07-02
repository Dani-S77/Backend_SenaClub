import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    enum: ['info', 'success', 'error', 'warning', 'alert', 'global'],
    default: 'info'
  })
  type: string;

  // Opcional: Si tiene userId es personal, si es null es global
  @Prop({ required: false })
  userId?: string;

  // Para mostrar el nombre del remitente/admin si quieres
  @Prop({ required: false })
  userName?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);