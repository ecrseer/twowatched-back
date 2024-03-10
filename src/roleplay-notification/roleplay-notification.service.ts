import { Injectable } from '@nestjs/common';
import { RoleplayNotification } from './entities/roleplay-notification.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TwaroomGateway } from '../twaroom/twaroom.gateway';

@Injectable()
export class RoleplayNotificationService {
  constructor(
    @InjectModel(RoleplayNotification.name)
    private roleplayNotificationModel: Model<RoleplayNotification>,
  ) {}

  async join_acceptance_roleplay_notification(
    movie_id: string,
    user_id: string,
  ) {
    const already_notified = await this.roleplayNotificationModel
      .findOne({
        movie_id,
      })
      .exec();

    if (!already_notified) {
      await this.roleplayNotificationModel.create({
        movie_id,
        acceptance_pool: {
          user_id: [],
        },
      });
    }

    const current_notification = await this.roleplayNotificationModel
      .findOne({
        movie_id,
      })
      .exec();
    if (current_notification.acceptance_pool[user_id]) {
    }
  }
}
