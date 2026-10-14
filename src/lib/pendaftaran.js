// Helper untuk membaca identitas pendaftar MACE.
// Sumber kebenaran baru: pendaftaran.data_diri (JSON) untuk pendaftaran tanpa login.
// Fallback ke relasi mahasiswa untuk data lama.

export const getPendaftarNama = (p) => p?.data_diri?.nama || p?.mahasiswa?.nama_lengkap || '-';
export const getPendaftarNim = (p) => p?.data_diri?.nim || p?.mahasiswa?.nim || '-';
export const getPendaftarNik = (p) => p?.data_diri?.nik || p?.mahasiswa?.nik || '-';
export const getPendaftarPt = (p) => p?.data_diri?.nama_pt || p?.data_diri?.pt || p?.mahasiswa?.perguruan_tinggi || p?.mahasiswa?.pt || '-';
export const getPendaftarProdi = (p) => p?.data_diri?.program_studi || p?.data_diri?.jurusan || p?.mahasiswa?.program_studi || p?.mahasiswa?.prodi || '-';
export const getPendaftarSemester = (p) => p?.data_diri?.semester || p?.mahasiswa?.semester || '-';
export const getPendaftarStase = (p) => p?.data_diri?.stase || p?.mahasiswa?.stase || '-';
export const getPendaftarOrangTua = (p) => p?.data_diri?.nama_orang_tua || p?.mahasiswa?.nama_orang_tua || '-';
export const getPendaftarAlamat = (p) => p?.data_diri?.alamat || p?.mahasiswa?.alamat_domisili || p?.mahasiswa?.alamat_ktp || '-';
