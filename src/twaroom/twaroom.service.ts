import { Injectable } from '@nestjs/common';
import { CreateTwaroomDto } from './dto/create-twaroom.dto';
import { UpdateTwaroomDto } from './dto/update-twaroom.dto';
import { Twaroom } from './entities/twaroom.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TwaMessage } from './entities/twamessage.schema';

@Injectable()
export class TwaroomService {
  constructor(
    @InjectModel(Twaroom.name) private TwaroomModel: Model<Twaroom>,
  ) {}

  async create(createTwaroomDto: CreateTwaroomDto) {
    const created = new this.TwaroomModel(createTwaroomDto);
    const result = await created.save();
    return { result, created };
  }

  public async findAll() {
    return await this.TwaroomModel.find();
  }

  public async findOne(room_id: string) {
    return await this.TwaroomModel.findOne({ _id: room_id }).exec();
  }

  public async add_message(room_id: string, message: TwaMessage) {
    const updated = await this.TwaroomModel.updateOne(
      { _id: room_id },
      { $push: { messages: message } },
    );
    return { updated };
  }

  remove(id: number) {
    return `This action removes a #${id} twaroom`;
  }
}
