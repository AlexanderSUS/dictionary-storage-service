import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.PORT || 4000;

  const app = await NestFactory.create(AppModule);

  const docsConfig = new DocumentBuilder().setTitle('Dictionary-store').build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () => {
    console.log(`App runing on ${port} port`);
  });
}
bootstrap();
