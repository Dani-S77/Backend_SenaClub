import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ default: 'user' })
  rol: string; 

  @Prop()
  phone: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [String], default: [] })
  clubs: string[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);