import sequelize from '../lib/db.js';

// Migrasi: ubah kolom jenis_dokumen dari ENUM -> VARCHAR(100) supaya daftar
// dokumen pendaftaran bisa ditambah/diubah tanpa migrasi ENUM berulang.
// Idempotent: jika kolom sudah VARCHAR, dilewati.
async function migrate() {
  try {
    await sequelize.authenticate();

    const [cols] = await sequelize.query(
      `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'dokumen_pendaftaran'
         AND COLUMN_NAME = 'jenis_dokumen'`
    );

    if (!cols.length) {
      console.log('Tabel/kolom dokumen_pendaftaran.jenis_dokumen tidak ditemukan.');
      process.exit(0);
    }

    const colType = String(cols[0].COLUMN_TYPE).toLowerCase();
    if (!colType.startsWith('enum')) {
      console.log(`jenis_dokumen sudah bertipe ${cols[0].COLUMN_TYPE} — tidak perlu migrasi.`);
      process.exit(0);
    }

    await sequelize.query(
      `ALTER TABLE dokumen_pendaftaran
         MODIFY COLUMN jenis_dokumen VARCHAR(100) NOT NULL`
    );
    console.log('OK: jenis_dokumen diubah dari ENUM ke VARCHAR(100).');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Migrasi gagal:', error);
    process.exit(1);
  }
}

migrate();
