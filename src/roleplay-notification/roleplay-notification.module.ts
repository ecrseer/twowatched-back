import { Module } from '@nestjs/common';
import { RoleplayNotificationService } from './roleplay-notification.service';
import { RoleplayNotificationController } from './roleplay-notification.controller';
import {
  RoleplayNotification,
  RoleplayNotificationSchema,
} from './entities/roleplay-notification.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { TwaroomGateway } from '../twaroom/twaroom.gateway';
import { TwaroomService } from '../twaroom/twaroom.service';
import { TwaroomModule } from '../twaroom/twaroom.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoleplayNotification.name, schema: RoleplayNotificationSchema },
    ]),
  ],
  controllers: [RoleplayNotificationController],
  providers: [RoleplayNotificationService],
})
export class RoleplayNotificationModule {}
