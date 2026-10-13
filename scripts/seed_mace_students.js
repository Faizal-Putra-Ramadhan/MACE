import bcrypt from 'bcryptjs';
import sequelize from '../lib/db.js';
import User from '../models/User.js';
import Mahasiswa from '../models/Mahasiswa.js';
import Pendaftaran from '../models/Pendaftaran.js';
import DokumenPendaftaran from '../models/DokumenPendaftaran.js';
import Laporan from '../models/Laporan.js';

const hash = await bcrypt.hash('mahasiswa123', 10);

// Selected students from Excel (2-3 per kabupaten/kota)
const STUDENTS = [
  // === Kota Jayapura (3) ===
  { nama: 'MARGARITHA D. I. SAROGE', nik: '9114014112990002', nim: '2019010001', alamat: 'Jl. Kayu Putih No. 12 Bhayangkara', pt: 'Universitas Cenderawasih', prodi: 'Akuntansi', fakultas: 'Ekonomi dan Bisnis', nominal: 9350000, kabkota: 'Kota Jayapura' },
  { nama: 'ARDILLA D.S. BINSYOWI ABNIR', nik: '9171036303970000', nim: '2019010002', alamat: 'Perum Bucen A 1 Kotaraja', pt: '', prodi: '', fakultas: '', nominal: 9300000, kabkota: 'Kota Jayapura' },
  { nama: 'APRIL SURY ROASANA DIAS WAROMI', nik: '9171024304030001', nim: '2019010003', alamat: 'Hamadi Pantai', pt: 'Universitas Cenderawasih', prodi: 'Akuntansi', fakultas: 'Ekonomi dan Bisnis', nominal: 9350000, kabkota: 'Kota Jayapura' },

  // === Kab. Jayapura (3) ===
  { nama: 'ANDARIAS ABISAY', nik: '9171050911910001', nim: '2020010001', alamat: 'Kampung Yewena (Doyo Baru)', pt: 'Universitas Cenderawasih', prodi: 'Pascasarjana', fakultas: 'Pascasarjana', nominal: 9350000, kabkota: 'Kabupaten Jayapura' },
  { nama: 'IMANUELA MARYANI WAKUM', nik: '9103197001040001', nim: '2020010002', alamat: 'Senamai', pt: 'Universitas Cenderawasih', prodi: 'Hukum', fakultas: 'Hukum', nominal: 9300000, kabkota: 'Kabupaten Jayapura' },
  { nama: 'DIUS TABUNI', nik: '9102152907030001', nim: '2020010003', alamat: 'BTN Daime Daime', pt: 'STT Levinus Rumasep Papua', prodi: 'Teologi', fakultas: 'Teologi', nominal: 9300000, kabkota: 'Kabupaten Jayapura' },

  // === Kab. Supiori (2) ===
  { nama: 'YOSUA RUMERE', nik: '9106012711790000', nim: '2018010001', alamat: 'Kobari Jaya Supiori Utara', pt: 'STIE Bethel Indonesia', prodi: 'Manajemen', fakultas: 'Manajemen', nominal: 9350000, kabkota: 'Kabupaten Supiori' },
  { nama: 'DOLFINCE A. BARANSANO', nik: '9106170308040001', nim: '2018010002', alamat: 'Sabarmiokre Supiori Barat', pt: 'Universitas Cenderawasih', prodi: 'Kesehatan Masyarakat', fakultas: 'Kesehatan Masyarakat', nominal: 9350000, kabkota: 'Kabupaten Supiori' },

  // === Kab. Sarmi (2) ===
  { nama: 'SAMPARI RUMERE', nik: '9110051704050000', nim: '2019020001', alamat: 'Perumahan Organda Padang Bulan', pt: 'Universitas Cenderawasih', prodi: 'Farmasi', fakultas: 'MIPA', nominal: 9350000, kabkota: 'Kabupaten Sarmi' },
  { nama: 'YOSUA INHUAR', nik: '9110092903020001', nim: '2019020002', alamat: 'Tabrawar', pt: 'Universitas Sains dan Teknologi Jayapura', prodi: 'Teknik Sipil', fakultas: 'Teknik Sipil dan Perencanaan', nominal: 9300000, kabkota: 'Kabupaten Sarmi' },

  // === Kab. Mamberamo Raya (2) ===
  { nama: 'BOY AUSA', nik: '9120040107880020', nim: '2018020001', alamat: 'Biri Mamberamo Raya', pt: 'Universitas Sepuluh November', prodi: 'Hukum', fakultas: 'Hukum', nominal: 9300000, kabkota: 'Kabupaten Mamberamo Raya' },
  { nama: 'YAKOB ARIYERI', nik: '9120040702950000', nim: '2018020002', alamat: 'Kampung Biri Kecamatan Mamberamo Tengah Timur', pt: 'Universitas Cenderawasih', prodi: 'Akuntansi', fakultas: 'Ekonomi dan Bisnis', nominal: 9300000, kabkota: 'Kabupaten Mamberamo Raya' },

  // === Kab. Biak Numfor (2) ===
  { nama: 'SIPORA EPIUVANIA WAMBRAUW', nik: '9106016912040001', nim: '2020020001', alamat: 'Jl. Bulog Biak Kota', pt: 'Universitas Cenderawasih', prodi: 'Ekonomi Pembangunan', fakultas: 'Ekonomi dan Bisnis', nominal: 9350000, kabkota: 'Kabupaten Biak Numfor' },
  { nama: 'FENI RIBKA RUMBIN', nik: '9106024402010001', nim: '2020020002', alamat: 'Kampung Mambesak RT01/RW00', pt: 'Universitas Cenderawasih', prodi: 'Pendidikan Bahasa Inggris', fakultas: 'FKIP', nominal: 9350000, kabkota: 'Kabupaten Biak Numfor' },

  // === Kab. Kepulauan Yapen (2) ===
  { nama: 'SOPRANITA ARONGGEAR', nik: '9105024605020001', nim: '2019030001', alamat: 'Jln Moh Toha Serui', pt: 'Sekolah Tinggi Ilmu Ekonomi Ottow Geisler Serui', prodi: 'Manajemen', fakultas: 'Manajemen', nominal: 9350000, kabkota: 'Kabupaten Kepulauan Yapen' },
  { nama: 'BETTY UBERTINA PATAY', nik: '9105014110020003', nim: '2019030002', alamat: 'Jln Bobo Serui', pt: 'Universitas Cenderawasih', prodi: 'Hukum', fakultas: 'Hukum', nominal: 9300000, kabkota: 'Kabupaten Kepulauan Yapen' },

  // === Kab. Waropen (1 - only 1 in data) ===
  { nama: 'NEHEMIA RUMAYOMI JR', nik: '9115080905000001', nim: '2020030001', alamat: 'Pemda 4 Kotaraja', pt: '', prodi: '', fakultas: '', nominal: 9350000, kabkota: 'Kabupaten Waropen' },

  // === Kab. Keerom (2) ===
  { nama: 'INDERLIN JULISTIANA BISAY', nik: '9111025307980000', nim: '2019040001', alamat: 'Jl. Merpati No. 35 Arso II', pt: 'Institut Pertanian Bogor', prodi: 'Kehutanan dan Lingkungan', fakultas: 'Kehutanan dan Lingkungan', nominal: 9300000, kabkota: 'Kabupaten Keerom' },
  { nama: 'BERTH BEROTABUI', nik: '9111021308840000', nim: '2019040002', alamat: 'Jl. Merpati No. 35 Arso II', pt: 'Universitas Yapis Papua', prodi: 'Kebijakan Publik', fakultas: 'Kebijakan Publik', nominal: 9300000, kabkota: 'Kabupaten Keerom' },
];

// 2 NIM-only students (different kabupaten, for manual registration test)
const NIM_ONLY_STUDENTS = [
  { nim: '2300018199', nik: '9103012010040003', kabkota: 'Kabupaten Jayapura' },  // FAIZAL PUTRA RAMADAN - already in NIM mock
  { nim: '2604600364', nik: '917105092709970001', kabkota: 'Kota Jayapura' },     // STEFANUS MANGGE - already in NIM mock
];

async function seed() {
  await sequelize.sync();
  console.log('Connected to database.\n');

  // ===== STEP 1: Clear existing MACE data =====
  console.log('--- Clearing existing MACE data ---');
  
  // Delete laporan first (FK constraint)
  await Laporan.destroy({ where: {} });
  console.log('Deleted all laporan records');
  
  const existingPendaftaran = await Pendaftaran.findAll();
  for (const p of existingPendaftaran) {
    await DokumenPendaftaran.destroy({ where: { pendaftaran_id: p.id } });
  }
  await Pendaftaran.destroy({ where: {} });
  console.log(`Deleted ${existingPendaftaran.length} pendaftaran records`);

  const existingMahasiswa = await Mahasiswa.findAll();
  console.log(`Found ${existingMahasiswa.length} existing mahasiswa`);
  await Mahasiswa.destroy({ where: {} });
  console.log('All mahasiswa deleted');
  console.log('');

  // ===== STEP 2: Create full student records =====
  console.log('--- Creating full student records (2-3 per kabupaten) ---');
  let totalNominal = 0;

  for (const s of STUDENTS) {
    const email = s.nama.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '.').substring(0, 30) + '@mahasiswa.mace.go.id';

    // Create or find user
    let [user] = await User.findOrCreate({
      where: { email },
      defaults: { email, password: hash, role: 'mahasiswa', is_approved: true, created_at: new Date() }
    });

    // Create mahasiswa
    const mahasiswa = await Mahasiswa.create({
      user_id: user.id,
      nim: s.nim,
      nik: s.nik,
      nama_lengkap: s.nama,
      alamat_domisili: s.alamat,
      alamat_ktp: s.alamat,
      perguruan_tinggi: s.pt || null,
      program_studi: s.prodi || null,
      semester: '6',
      created_at: new Date()
    });

    // Create pendaftaran with lolos_berkas status
    await Pendaftaran.create({
      mahasiswa_id: mahasiswa.id,
      program: 'A',
      status: 'lolos_berkas',
      nominal_dana: s.nominal,
      saldo: s.nominal,
      created_at: new Date()
    });

    totalNominal += s.nominal;
    console.log(`  [${s.kabkota}] ${s.nama} - NIK: ${s.nik} - NIM: ${s.nim} - Rp ${s.nominal.toLocaleString('id-ID')}`);
  }

  console.log(`\nTotal full records: ${STUDENTS.length}`);
  console.log(`Total nominal: Rp ${totalNominal.toLocaleString('id-ID')}\n`);

  // ===== STEP 3: Create NIM-only mahasiswa (for manual registration test) =====
  console.log('--- Creating NIM-only mahasiswa (for NIK/NIM detection) ---');
  for (const n of NIM_ONLY_STUDENTS) {
    const email = `nim.${n.nim}@mahasiswa.mace.go.id`;

    let [user] = await User.findOrCreate({
      where: { email },
      defaults: { email, password: hash, role: 'mahasiswa', is_approved: true, created_at: new Date() }
    });

    // Only NIM and NIK - no other data
    await Mahasiswa.create({
      user_id: user.id,
      nim: n.nim,
      nik: n.nik,
      nama_lengkap: 'Belum Terdaftar',
      created_at: new Date()
    });

    console.log(`  [${n.kabkota}] NIM: ${n.nim} | NIK: ${n.nik} (manual registration needed)`);
  }

  console.log(`\nNIM-only records: ${NIM_ONLY_STUDENTS.length}`);

  // ===== Summary =====
  const kabkotaSet = new Set(STUDENTS.map(s => s.kabkota));
  console.log(`\n========== SUMMARY ==========`);
  console.log(`Total mahasiswa created: ${STUDENTS.length + NIM_ONLY_STUDENTS.length}`);
  console.log(`Kabupaten/Kota covered: ${kabkotaSet.size}`);
  kabkotaSet.forEach(k => {
    const count = STUDENTS.filter(s => s.kabkota === k).length;
    const nimCount = NIM_ONLY_STUDENTS.filter(s => s.kabkota === k).length;
    console.log(`  ${k}: ${count} full + ${nimCount} NIM-only`);
  });
  console.log(`All in MACE Approval with status: lolos_berkas`);
  console.log(`Password for all: mahasiswa123`);
  console.log(`=============================\n`);

  await sequelize.close();
  console.log('Done!');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
