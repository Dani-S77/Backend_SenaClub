import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClubDocument = Club & Document;

@Schema()
export class Club {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const ClubSchema = SchemaFactory.createForClass(Club);