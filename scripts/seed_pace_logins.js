// ============================================================
//  Seed akun login PACE — satu akun per program di PacePortal
//  Jalankan: node scripts/seed_pace_logins.js
//
//  Semua password: password123
//  Script ini idempotent (bisa dijalankan berulang kali).
// ============================================================
import bcrypt from 'bcryptjs';
import sequelize from '../lib/db.js';

const PASSWORD = 'password123';

// role = 'sekolah_pace' (role login) + pace_type penentu program
const AKUN = [
  {
    program: 'Sekolah Luar Biasa (SLB)',
    email: 'slb@pace.go.id',
    pace_type: 'SLB',
    nama_display: 'Operator SLB',
    nama_sekolah: 'SLB N 1 JAYAPURA',
    jenis_sekolah: 'SLB',
  },
  {
    program: 'Sekolah Kekhususan (SNK)',
    email: 'snk@pace.go.id',
    pace_type: 'SNK',
    nama_display: 'Operator SNK',
    nama_sekolah: 'SNK SAINS DAN BAHASA',
    jenis_sekolah: 'SNK',
  },
  {
    program: 'Siswa Atlit Berprestasi',
    email: 'atlit@pace.go.id',
    pace_type: 'Siswa Atlit Berprestasi',
    nama_display: 'Operator Atlit',
    nama_sekolah: 'SEKOLAH ATLET PAPUA',
    jenis_sekolah: 'Siswa Atlit Berprestasi',
  },
  {
    program: 'Program Persiapan Sekolah Kedinasan',
    email: 'kedinasan@pace.go.id',
    pace_type: 'Kedinasan',
    nama_display: 'Operator Kedinasan',
    nama_sekolah: 'BIMBEL KEDINASAN PAPUA',
    jenis_sekolah: 'Kedinasan',
  },
];

async function ensureEnums() {
  // Tambah nilai 'Kedinasan' pada enum jika belum ada (MySQL)
  const [cols] = await sequelize.query(`
    SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND ((TABLE_NAME = 'users' AND COLUMN_NAME = 'pace_type')
        OR (TABLE_NAME = 'pace_sekolah' AND COLUMN_NAME = 'jenis_sekolah'))
  `);

  for (const col of cols) {
    if (!col.COLUMN_TYPE.includes("'Kedinasan'")) {
      const newType = col.COLUMN_TYPE.replace(/\)$/, ",'Kedinasan')");
      const definition = col.COLUMN_NAME === 'pace_type'
        ? `${newType} NULL`
        : `${newType} NOT NULL`;
      await sequelize.query(
        `ALTER TABLE \`${col.TABLE_NAME}\` MODIFY COLUMN \`${col.COLUMN_NAME}\` ${definition}`
      );
      console.log(`✓ Enum ${col.TABLE_NAME}.${col.COLUMN_NAME} += 'Kedinasan'`);
    }
  }
}

async function seed() {
  try {
    await sequelize.authenticate();
    await ensureEnums();

    const hash = await bcrypt.hash(PASSWORD, 10);

    for (const akun of AKUN) {
      // 1. Buat / reset user
      const [existing] = await sequelize.query(
        `SELECT id FROM users WHERE email = :vEmail`,
        { replacements: { vEmail: akun.email } }
      );

      let userId;
      if (existing.length === 0) {
        await sequelize.query(
          `INSERT INTO users (email, password, role, is_approved, pace_type, nama_display)
           VALUES (:vEmail, :vPassword, 'sekolah_pace', 1, :vPaceType, :vNamaDisplay)`,
          {
            replacements: {
              vEmail: akun.email,
              vPassword: hash,
              vPaceType: akun.pace_type,
              vNamaDisplay: akun.nama_display,
            },
          }
        );
        const [rows] = await sequelize.query(
          `SELECT id FROM users WHERE email = :vEmail`,
          { replacements: { vEmail: akun.email } }
        );
        userId = rows[0].id;
        console.log(`✓ User dibuat: ${akun.email}`);
      } else {
        userId = existing[0].id;
        await sequelize.query(
          `UPDATE users SET password = :vPassword, role = 'sekolah_pace', is_approved = 1,
             pace_type = :vPaceType, nama_display = :vNamaDisplay
           WHERE id = :vId`,
          {
            replacements: {
              vPassword: hash,
              vPaceType: akun.pace_type,
              vNamaDisplay: akun.nama_display,
              vId: userId,
            },
          }
        );
        console.log(`✓ User diperbarui: ${akun.email}`);
      }

      // 2. Pastikan ada baris pace_sekolah agar muncul di daftar sekolah portal
      const [sekolah] = await sequelize.query(
        `SELECT id FROM pace_sekolah WHERE user_id = :vUserId`,
        { replacements: { vUserId: userId } }
      );

      if (sekolah.length === 0) {
        await sequelize.query(
          `INSERT INTO pace_sekolah (user_id, nama_sekolah, jenis_sekolah, status_approval)
           VALUES (:vUserId, :vNamaSekolah, :vJenisSekolah, 'approved')`,
          {
            replacements: {
              vUserId: userId,
              vNamaSekolah: akun.nama_sekolah,
              vJenisSekolah: akun.jenis_sekolah,
            },
          }
        );
        console.log(`  ✓ pace_sekolah dibuat: ${akun.nama_sekolah}`);
      } else {
        await sequelize.query(
          `UPDATE pace_sekolah SET nama_sekolah = :vNamaSekolah, jenis_sekolah = :vJenisSekolah,
             status_approval = 'approved'
           WHERE user_id = :vUserId`,
          {
            replacements: {
              vNamaSekolah: akun.nama_sekolah,
              vJenisSekolah: akun.jenis_sekolah,
              vUserId: userId,
            },
          }
        );
        console.log(`  ✓ pace_sekolah diperbarui: ${akun.nama_sekolah}`);
      }
    }

    console.log('\n=== Akun login PACE siap (password: password123) ===');
    for (const akun of AKUN) {
      console.log(`${akun.program.padEnd(40)} ${akun.email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seed akun PACE:', error);
    process.exit(1);
  }
}

seed();
