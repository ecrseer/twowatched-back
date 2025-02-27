import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Uncomment these lines to use the Redis adapter:
  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisIoAdapter);
  const port =
    process.env.PORT || process.env.NODE_ENV === 'production' ? 3000 : 3042;
  console.log('🚀 ~ main ~PORT:', port);
  app.enableCors({
    origin: 'https://twowatched-front.vercel.app', // Replace with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
