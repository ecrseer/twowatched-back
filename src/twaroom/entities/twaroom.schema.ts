import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TwaMessage } from './twamessage.schema';

export type TwaroomDocument = HydratedDocument<Twaroom>;

@Schema({ timestamps: true })
export class Twaroom {
  @Prop()
  messages: TwaMessage[];

  @Prop()
  name: string;

  @Prop()
  media_story_id: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TwaroomSchema = SchemaFactory.createForClass(Twaroom);
