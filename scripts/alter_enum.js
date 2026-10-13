import sequelize from '../lib/db.js';

async function updateEnum() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Adding to enum type
    try {
      await sequelize.query(`ALTER TYPE "enum_dokumen_pendaftaran_jenis_dokumen" ADD VALUE 'khs_terakhir';`);
      console.log('Added khs_terakhir to enum');
    } catch (e) {
      console.log('khs_terakhir might already exist:', e.message);
    }
    
    try {
      await sequelize.query(`ALTER TYPE "enum_dokumen_pendaftaran_jenis_dokumen" ADD VALUE 'sktm';`);
      console.log('Added sktm to enum');
    } catch (e) {
      console.log('sktm might already exist:', e.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database or alter type:', error);
    process.exit(1);
  }
}

updateEnum();
