import sequelize from '../lib/db.js';
import { DataTypes } from 'sequelize';

async function updateSchema() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Add column saldo
    await sequelize.query('ALTER TABLE pendaftaran ADD COLUMN IF NOT EXISTS saldo BIGINT DEFAULT 0;');
    console.log('Column saldo added.');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database or alter table:', error);
    process.exit(1);
  }
}

updateSchema();
