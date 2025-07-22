import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Uncomment these lines to use the Redis adapter:
  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisIoAdapter);
  console.log('=>(main.ts:13) process.env.PORT', process.env.PORT || 2);
  const padrao = process.env.NODE_ENV === 'production' ? 3000 : 3042;
  console.log('=>(main.ts:13) padrao', padrao);
  const port = process.env.PORT || padrao;
  console.log('🚀 ~ main ~xOR:', port);

  const corsOrigin =
    process.env.NODE_ENV === 'production'
      ? 'https://twowatched-front.vercel.app'
      : '*';
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
