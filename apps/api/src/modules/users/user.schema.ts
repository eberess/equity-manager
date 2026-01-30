import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true })
  businessUnit: string;

  @Prop({ default: 0 })
  shareCount: number;

  @Prop({ type: String, enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
