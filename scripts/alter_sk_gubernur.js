import sequelize from '../lib/db.js';

async function migrate() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS sk_gubernur (
        id SERIAL PRIMARY KEY,
        kategori VARCHAR(100) UNIQUE NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('sk_gubernur table created/verified.');
    await sequelize.close();
    console.log('Done!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
