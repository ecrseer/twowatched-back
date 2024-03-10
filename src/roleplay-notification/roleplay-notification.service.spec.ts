import { Test, TestingModule } from '@nestjs/testing';
import { RoleplayNotificationService } from './roleplay-notification.service';

describe('RoleplayNotificationService', () => {
  let service: RoleplayNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleplayNotificationService],
    }).compile();

    service = module.get<RoleplayNotificationService>(RoleplayNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
