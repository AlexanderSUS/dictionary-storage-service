import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import postgresConnectionOptions from './postgresConnectionOptions';

export const typeOrmConfig: TypeOrmModuleOptions = {
  ...postgresConnectionOptions,
};
