import sequelize from '../lib/db.js';

// Migrasi form pendaftaran Siswa PACE (SLB):
//  1. Tambah kolom `data_pendaftaran` JSON (menyimpan seluruh isi formulir A-G + lampiran).
//  2. Longgarkan kolom legasi pace_siswa menjadi NULLABLE (NISN/NIK "jika ada", dll).
// Idempotent: aman dijalankan berulang kali.
async function migrate() {
  try {
    await sequelize.authenticate();

    // 1. Kolom data_pendaftaran
    const [col] = await sequelize.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'pace_siswa'
         AND COLUMN_NAME = 'data_pendaftaran'`
    );
    if (!col.length) {
      await sequelize.query(`ALTER TABLE pace_siswa ADD COLUMN data_pendaftaran JSON NULL`);
      console.log('OK: kolom pace_siswa.data_pendaftaran (JSON) ditambahkan.');
    } else {
      console.log('Lewati: pace_siswa.data_pendaftaran sudah ada.');
    }

    // 2. Relaksasi NOT NULL -> NULL untuk kolom legasi
    const nullable = [
      ['nisn', 'VARCHAR(255)'],
      ['nik', 'VARCHAR(255)'],
      ['tempat_lahir', 'VARCHAR(255)'],
      ['tanggal_lahir', 'DATE'],
      ['kelas', 'VARCHAR(255)'],
      ['alamat', 'TEXT'],
      ['nama_orang_tua', 'VARCHAR(255)'],
      ['no_hp_orang_tua', 'VARCHAR(255)'],
    ];
    for (const [name, type] of nullable) {
      const [info] = await sequelize.query(
        `SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'pace_siswa'
           AND COLUMN_NAME = :c`,
        { replacements: { c: name } }
      );
      if (!info.length) continue;
      if (info[0].IS_NULLABLE === 'NO') {
        await sequelize.query(`ALTER TABLE pace_siswa MODIFY COLUMN \`${name}\` ${type} NULL`);
        console.log(`OK: pace_siswa.${name} diubah menjadi NULLABLE.`);
      } else {
        console.log(`Lewati: pace_siswa.${name} sudah NULLABLE.`);
      }
    }

    await sequelize.close();
    console.log('Selesai!');
    process.exit(0);
  } catch (error) {
    console.error('Migrasi gagal:', error);
    process.exit(1);
  }
}

migrate();
