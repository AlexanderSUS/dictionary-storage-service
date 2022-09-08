import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 4000;

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () => {
    console.log(`App runing on ${port} port`);
  });
}
bootstrap();
