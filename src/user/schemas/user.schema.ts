import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  externalId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
