import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TwaMessageDocument = HydratedDocument<TwaMessage>;

@Schema()
export class TwaMessage {
  @Prop()
  content: string;

  @Prop()
  sender_user_id: string;
}

export const TwaMessageSchema = SchemaFactory.createForClass(TwaMessage);
