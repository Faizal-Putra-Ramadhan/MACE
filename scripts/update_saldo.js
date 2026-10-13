import sequelize from '../lib/db.js';

async function updateData() {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');

    const [results, metadata] = await sequelize.query(`
      UPDATE pendaftaran 
      SET saldo = nominal_dana 
      WHERE saldo = 0 AND nominal_dana > 0 AND status = 'lolos_berkas';
    `);
    
    console.log('Rows updated:', metadata.rowCount);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateData();
