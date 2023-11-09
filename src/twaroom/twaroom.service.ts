import { Injectable } from '@nestjs/common';
import { CreateTwaroomDto } from './dto/create-twaroom.dto';
import { UpdateTwaroomDto } from './dto/update-twaroom.dto';
import { Twaroom } from './entities/twaroom.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TwaroomService {
  constructor(
    @InjectModel(Twaroom.name) private TwaroomModel: Model<Twaroom>,
  ) {}

  async create(createTwaroomDto: CreateTwaroomDto) {
    const created = new this.TwaroomModel(createTwaroomDto);
    const result = created.save();
    return { result, created };
  }

  findAll() {
    return `This action returns all twaroom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} twaroom`;
  }

  update(id: number, updateTwaroomDto: UpdateTwaroomDto) {
    return `This action updates a #${id} twaroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} twaroom`;
  }
}
