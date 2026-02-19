import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  // host: process.env.DB_HOST,
  host: 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    __dirname + '/src/**/*.entity{.ts,.js}',
    './src/entities/entities/*.ts',
  ],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
