import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

type iUserId = string;

export type RoleplayNotificationDocument =
  HydratedDocument<RoleplayNotification>;

@Schema({ timestamps: true })
export class RoleplayNotification {
  @Prop()
  movie_id: string;

  @Prop()
  acceptance_pool: Record<iUserId, iUserId[]>[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const RoleplayNotificationSchema =
  SchemaFactory.createForClass(RoleplayNotification);
