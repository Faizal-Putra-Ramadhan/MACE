import sequelize from '../lib/db.js';

// Migrasi: tambah nilai 'F' (Bantuan Pembiayaan Pendidikan Profesi) pada ENUM
// pendaftaran.program. Idempotent: jika 'F' sudah ada, dilewati.
const TARGET = ["'A'", "'B'", "'C'", "'D'", "'E'", "'F'"];

async function migrate() {
  try {
    await sequelize.authenticate();

    const [cols] = await sequelize.query(
      `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'pendaftaran'
         AND COLUMN_NAME = 'program'`
    );

    if (!cols.length) {
      console.log('Tabel/kolom pendaftaran.program tidak ditemukan.');
      process.exit(0);
    }

    const colType = String(cols[0].COLUMN_TYPE);
    if (colType.toLowerCase().includes("'f'")) {
      console.log(`program sudah mencakup 'F' (${colType}) — tidak perlu migrasi.`);
      process.exit(0);
    }

    await sequelize.query(
      `ALTER TABLE pendaftaran
         MODIFY COLUMN program ENUM(${TARGET.join(',')}) NOT NULL`
    );
    console.log("OK: ENUM pendaftaran.program diperluas menjadi A,B,C,D,E,F.");

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Migrasi gagal:', error);
    process.exit(1);
  }
}

migrate();
