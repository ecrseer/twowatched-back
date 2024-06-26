import { TwaroomService } from '../twaroom.service';

// import { mock_create_room } from './data-mocks';
import mongoose from 'mongoose';
import { createMyRealDBTestNestApp } from './utils';
import { randomId } from '../../utils';

describe('TwaroomService', () => {
  let service: TwaroomService;

  beforeEach(async () => {
    const { module } = await createMyRealDBTestNestApp();

    service = module.get<TwaroomService>(TwaroomService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    const MOCK_EXISTING_ID = '66149b56fcff978a0d128672';
    const random = randomId();
    const MOCK_NEW_MSG = {
      content: 'test 42' + random,
      sender_user_id: '66149aab5b5e831a494e6cfa',
    };
    const room = await service.add_message(MOCK_EXISTING_ID, MOCK_NEW_MSG);
    // const room = await service.findOne(MOCK_EXISTING_ID);

    expect(room).toBeDefined();
    expect(room.messages?.length > 0).toBeDefined();

    expect(room.messages?.at(-1).content).toEqual('test 42' + random);

    // expect(room.messages?.length > 0).toBeDefined();
  });

  test('should be able to create', async () => {
    // expect(service).toBeDefined();
    // const result = await service.create(mock_create_room);
    // expect(result?.created).toBeDefined();
    // console.log('~☠️ ~ test ~ result?.created:', result?.created);
  });
  afterEach(async () => {
    mongoose.connection.close();
  });

  // afterAll(async () => {
  //   ioClient.disconnect();
  // });
});
