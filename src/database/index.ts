import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } from '@config';

export const dbConnection: ConnectionOptions = {
  type: 'postgres',
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  //entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  entities: [join(__dirname, '../features/**/*.entity{.ts,.js}')],
  // migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  // subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
  migrations: [join(__dirname, '../features/**/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../features/**/*.subscriber{.ts,.js}')],
  cli: {
    entitiesDir: 'src/features/**/entities',
    migrationsDir: 'src/features/**/migration',
    subscribersDir: 'src/features/**/subscriber',
  },
};
