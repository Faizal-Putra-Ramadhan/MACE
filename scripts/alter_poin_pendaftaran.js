import sequelize from '../lib/db.js';
import { hitungPoinFinal } from '../lib/points.js';

// Migrasi sistem poin/perangkingan: kolom poin di tabel pendaftaran.
// Idempotent — bisa dijalankan berulang saat aturan poin berubah.
async function migrate() {
  try {
    const [cols] = await sequelize.query(`SHOW COLUMNS FROM pendaftaran`);
    const existing = new Set(cols.map(c => c.Field));

    const toAdd = [
      ['poin_otomatis', "INT NOT NULL DEFAULT 0 AFTER data_diri"],
      ['poin_nim_manual', "INT NULL AFTER poin_otomatis"],
      ['poin_nik_manual', "INT NULL AFTER poin_nim_manual"],
      ['poin_dokumen', "INT NULL AFTER poin_nik_manual"],
      ['poin_total', "INT NOT NULL DEFAULT 0 AFTER poin_dokumen"],
    ].filter(([name]) => !existing.has(name));

    if (toAdd.length) {
      await sequelize.query(`ALTER TABLE pendaftaran ${toAdd.map(([name, def]) => `ADD COLUMN ${name} ${def}`).join(', ')}`);
      console.log(`Kolom poin ditambahkan: ${toAdd.map(([n]) => n).join(', ')}`);
    } else {
      console.log('Semua kolom poin sudah ada.');
    }

    if (!existing.has('poin_total')) {
      await sequelize.query(`ALTER TABLE pendaftaran ADD INDEX pendaftaran_poin_total_index (poin_total)`);
    }

    // Poin per berkas pada dokumen_pendaftaran (penilaian manual admin per dokumen).
    const [docCols] = await sequelize.query(`SHOW COLUMNS FROM dokumen_pendaftaran LIKE 'poin'`);
    if (!docCols.length) {
      await sequelize.query(`ALTER TABLE dokumen_pendaftaran ADD COLUMN poin INT NULL AFTER file_path`);
      console.log('Kolom poin per berkas ditambahkan ke dokumen_pendaftaran.');
    }

    // Sinkronkan poin_dokumen = total poin seluruh berkas yang dinilai.
    await sequelize.query(`
      UPDATE pendaftaran p
      SET p.poin_dokumen = (
        SELECT COALESCE(SUM(d.poin), 0) FROM dokumen_pendaftaran d WHERE d.pendaftaran_id = p.id
      )
      WHERE EXISTS (SELECT 1 FROM dokumen_pendaftaran d2 WHERE d2.pendaftaran_id = p.id AND d2.poin IS NOT NULL)
    `);

    // Hitung ulang poin otomatis + total seluruh pendaftaran dari data_diri.
    const [rows] = await sequelize.query(`SELECT * FROM pendaftaran WHERE data_diri IS NOT NULL`);
    let updated = 0;
    for (const row of rows) {
      const dd = typeof row.data_diri === 'string' ? JSON.parse(row.data_diri) : row.data_diri;
      const final = hitungPoinFinal(dd, row);
      await sequelize.query(
        `UPDATE pendaftaran SET poin_otomatis = :auto, poin_total = :total WHERE id = :id`,
        { replacements: { auto: final.auto.poin_otomatis, total: final.poin_total, id: row.id } }
      );
      updated++;
    }
    console.log(`Recalculate poin selesai: ${updated} pendaftaran diperbarui.`);

    await sequelize.close();
    console.log('Done!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
