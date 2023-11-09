import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TwaroomDocument = HydratedDocument<Twaroom>;

@Schema()
export class Twaroom {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const TwaroomSchema = SchemaFactory.createForClass(Twaroom);
