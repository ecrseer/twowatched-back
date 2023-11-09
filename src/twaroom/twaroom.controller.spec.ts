import { Test, TestingModule } from '@nestjs/testing';
import { TwaroomController } from './twaroom.controller';
import { TwaroomService } from './twaroom.service';

describe('TwaroomController', () => {
  let controller: TwaroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwaroomController],
      providers: [TwaroomService],
    }).compile();

    controller = module.get<TwaroomController>(TwaroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
