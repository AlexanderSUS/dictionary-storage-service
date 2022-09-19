import { DataSource } from 'typeorm';
import postgresConnectionOptions from 'src/config/postgresConnectionOptions';

const AppDataSource = new DataSource({
  ...postgresConnectionOptions,
});

export default AppDataSource;
