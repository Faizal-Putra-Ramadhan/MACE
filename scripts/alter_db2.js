import sequelize from '../lib/db.js';

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // 1. Add new ENUM values for dokumen types
    const newEnumValues = ['surat_rekomendasi_rektor', 'surat_rekomendasi_pimpinan'];
    for (const val of newEnumValues) {
      try {
        await sequelize.query(`ALTER TYPE "enum_dokumen_pendaftaran_jenis_dokumen" ADD VALUE '${val}';`);
        console.log(`Added '${val}' to enum`);
      } catch (e) {
        console.log(`'${val}' might already exist:`, e.message);
      }
    }

    // 2. Add data_diri JSONB column to pendaftaran table
    await sequelize.query(`ALTER TABLE pendaftaran ADD COLUMN IF NOT EXISTS data_diri JSONB;`);
    console.log('Added data_diri column to pendaftaran');

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
