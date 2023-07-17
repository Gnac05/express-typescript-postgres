import { join } from 'path';
import { DataSource } from 'typeorm';
import config from '@config';
import { logger } from '@/utils/logger';

/**
 * Database connection
 */
export const dbSource: DataSource = new DataSource({
  type: 'postgres',
  username: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: Number(config.db.port),
  database: config.db.database,
  migrationsTableName: config.projectName ? config.projectName + '_migrations' : 'migrations',
  installExtensions: true,
  metadataTableName: config.projectName ? config.projectName + '_db_metadata' : 'database_metadatas',
  applicationName: config.projectName,
  migrationsRun: config.isProduction ? false : true,
  synchronize: config.isProduction ? false : true,
  logging: config.isProduction ? false : true,
  entities: [join(__dirname, '../features/**/entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../features/**/migrations/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../features/**/subscribers/*.subscriber{.ts,.js}')],

  // Postgres specific options
  poolErrorHandler: (err: any) => {
    logger.error('--Postgres pool error: ');
    logger.error(err);
    logger.error('--Postgres pool error');
  },
});
