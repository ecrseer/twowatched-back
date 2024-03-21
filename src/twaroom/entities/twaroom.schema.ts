import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TwaMessage } from './twamessage.schema';
import { TmdbCastMember } from '../../movies/entities/Tmdb';

export type TwaroomDocument = HydratedDocument<Twaroom>;
type iUserId = string;

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

  @Prop({ type: Object })
  usersCharacters: Record<iUserId, TmdbCastMember>;
}

export const TwaroomSchema = SchemaFactory.createForClass(Twaroom);
