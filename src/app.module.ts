import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WordsModule } from './words/words.module';
import { DataSource } from 'typeorm';
import { DictionaryApiModule } from './dictionary-api/dictionary-api.module';
import { WordsStorageModule } from './words-storage/words-storage.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TextModule } from './text/text.module';
import { PublicModule } from './public/public.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot(configuration),
    WordsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    DictionaryApiModule,
    AuthModule,
    WordsStorageModule,
    TextModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
