import { Test, TestingModule } from '@nestjs/testing';
import { TwaroomService } from './twaroom.service';

describe('TwaroomService', () => {
  let service: TwaroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwaroomService],
    }).compile();

    service = module.get<TwaroomService>(TwaroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
