import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ['info', 'success', 'error', 'warning'], default: 'info' })
  type: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);