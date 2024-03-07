import { TwaroomService } from '../twaroom.service';

import { mock_create_room } from './data-mocks';
import mongoose from 'mongoose';
import { createTestNestApp } from './utils';

describe('TwaroomService', () => {
  let service: TwaroomService;

  beforeEach(async () => {
    const { module } = await createTestNestApp();

    service = module.get<TwaroomService>(TwaroomService);
  });

  test('should be able to create', async () => {
    expect(service).toBeDefined();
    const result = await service.create(mock_create_room);
    expect(result?.created).toBeDefined();
    mongoose.connection.close();
  });
  afterEach(async () => {
    mongoose.connection.close();
  });
  // afterAll(async () => {
  //   ioClient.disconnect();
  // });
});
