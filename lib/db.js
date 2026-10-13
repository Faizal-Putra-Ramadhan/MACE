import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'mace',
} = process.env;

if (!process.env.DB_NAME) {
  console.error('CRITICAL ERROR: DB_NAME environment variable is not defined.');
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
