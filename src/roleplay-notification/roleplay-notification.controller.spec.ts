import { Test, TestingModule } from '@nestjs/testing';
import { RoleplayNotificationController } from './roleplay-notification.controller';
import { RoleplayNotificationService } from './roleplay-notification.service';

describe('RoleplayNotificationController', () => {
  let controller: RoleplayNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleplayNotificationController],
      providers: [RoleplayNotificationService],
    }).compile();

    controller = module.get<RoleplayNotificationController>(RoleplayNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
