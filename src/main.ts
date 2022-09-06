import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv';
import 'reflect-metadata';

async function bootstrap() {
  const port = process.env.PORT || 4000;

  const app = await NestFactory.create(AppModule);
  await app.listen(port, () => {
    console.log(`App runing on ${port} port`);
  });
}
bootstrap();
