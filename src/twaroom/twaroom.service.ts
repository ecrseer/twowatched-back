import { Injectable } from '@nestjs/common';

import { Twaroom } from './entities/twaroom.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TwaMessage } from './entities/twamessage.schema';
import { MovieDocument } from '../movies/entities/movie.schema';

@Injectable()
export class TwaroomService {
  constructor(
    @InjectModel(Twaroom.name) private TwaroomModel: Model<Twaroom>,
  ) {}

  async create(movie?: MovieDocument) {
    const MOCK_ROOM: Omit<Twaroom, '_id'> = {
      name: `${new Date().toLocaleDateString()}-name`,
      media_story_id: `${movie._id}`,
      messages: [],
      usersCharacters: {},
    };
    const created = new this.TwaroomModel(MOCK_ROOM);
    const room = await created.save();
    return { room, created };
  }

  public async findAll() {
    return await this.TwaroomModel.find();
  }

  public async findOne(room_id: string) {
    return await this.TwaroomModel.findOne({ _id: room_id }).exec();
  }

  public async add_message(
    room_id: string,
    message: TwaMessage,
  ): Promise<Twaroom> {
    const updated = await this.TwaroomModel.findOneAndUpdate(
      { _id: room_id },
      { $push: { messages: message } },
      { new: true },
    );

    return updated;
  }

  public async get_most_count_movies_roleplays_from_user(user_id: string) {
    const most_chatted_movies_from_user = this.TwaroomModel.aggregate([
      {
        $match: {
          'messages.sender_user_id': user_id,
        },
      },
      {
        $project: {
          movie_id: '$media_story_id',
        },
      },
      {
        $group: {
          _id: '$movie_id',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $addFields: {
          movieObjectId: {
            $toObjectId: '$_id',
          },
        },
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'movieObjectId',
          foreignField: '_id',
          as: 'card_movie',
        },
      },
    ]).exec();
    return most_chatted_movies_from_user;
  }
}
