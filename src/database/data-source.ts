import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/environment-variables.interface';

config();

const configService = new ConfigService<EnvironmentVariables>();

const AppDataSource = new DataSource({
  type: 'postgres',
  database: configService.get('POSTGRES_DB'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  entities: ['dist/**/entities/*.entity.js'],
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
});

export default AppDataSource;
