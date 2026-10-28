import sequelize from '../lib/db.js';

async function updateSchema() {
  try {
    await sequelize.authenticate();
    console.log('Connection established successfully.');

    // Users table: add pace_type, mace_type, nama_display
    await sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='pace_type') THEN
          ALTER TABLE users ADD COLUMN pace_type VARCHAR(50);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='mace_type') THEN
          ALTER TABLE users ADD COLUMN mace_type VARCHAR(50);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='nama_display') THEN
          ALTER TABLE users ADD COLUMN nama_display VARCHAR(255);
        END IF;
      END $$;
    `);
    console.log('Users table updated (pace_type, mace_type, nama_display).');

    // PengaturanAkses: add scope column
    await sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pengaturan_akses' AND column_name='scope') THEN
          ALTER TABLE pengaturan_akses ADD COLUMN scope VARCHAR(50) NOT NULL DEFAULT 'pace_slb';
        END IF;
      END $$;
    `);
    console.log('PengaturanAkses table updated (scope).');

    // PaceSiswa: add nominal_pendanaan, file_prestasi_akademik, file_prestasi_non_akademik
    await sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pace_siswa' AND column_name='nominal_pendanaan') THEN
          ALTER TABLE pace_siswa ADD COLUMN nominal_pendanaan INTEGER;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pace_siswa' AND column_name='file_prestasi_akademik') THEN
          ALTER TABLE pace_siswa ADD COLUMN file_prestasi_akademik VARCHAR(255);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pace_siswa' AND column_name='file_prestasi_non_akademik') THEN
          ALTER TABLE pace_siswa ADD COLUMN file_prestasi_non_akademik VARCHAR(255);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pace_siswa' AND column_name='usulan_anggaran') THEN
          ALTER TABLE pace_siswa ADD COLUMN usulan_anggaran JSONB;
        END IF;
      END $$;
    `);
    console.log('PaceSiswa table updated (nominal_pendanaan, file_prestasi_akademik, file_prestasi_non_akademik, usulan_anggaran).');

    // Seed default pengaturan_akses for all scopes if not exist
    const scopes = ['mace_kabkota', 'mace_provinsi', 'pace_slb', 'pace_snk', 'pace_atlit', 'pace_kedinasan'];
    for (const scope of scopes) {
      await sequelize.query(`
        INSERT INTO pengaturan_akses (scope, edit_surat_permohonan, edit_data_sekolah, edit_siswa, created_at, updated_at)
        SELECT '${scope}', true, true, true, NOW(), NOW()
        WHERE NOT EXISTS (SELECT 1 FROM pengaturan_akses WHERE scope = '${scope}');
      `);
    }
    console.log('Default pengaturan_akses seeded for all scopes.');

    process.exit(0);
  } catch (error) {
    console.error('Unable to update schema:', error);
    process.exit(1);
  }
}

updateSchema();
