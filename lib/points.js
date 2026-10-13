// ============================================================
// Sistem Perangkingan Poin Pendaftaran MACE
// Digunakan oleh backend (controllers) dan frontend (React/Vite).
//
// Aturan:
// - Poin NIM (IPK + semester) hanya bekerja jika NIM terdaftar/
//   terdeteksi (divalidasi via PDDikti: universitas, IPK, dll).
//   Jika NIM tidak terdaftar => poin NIM otomatis = 0, dan admin
//   dapat memberi poin NIM secara manual (poin_nim_manual).
// - Poin NIK dihitung sendiri dan TIDAK bergantung pada NIM:
//     NIK OAP / KTP Papua (prefix 91/92 atau terverifikasi) -> 20
//     NIK terdaftar namun bukan OAP -> 5
//     Jika NIK tidak terdeteksi OAP, admin dapat memberi poin
//     NIK secara manual (poin_nik_manual).
// - Rincian poin NIM (otomatis saat terdaftar):
//     IPK >= 3.75 -> 15 | 3.50-3.74 -> 13 | 3.25-3.49 -> 11
//     3.00-3.24 -> 8 | 2.75-2.99 -> 5 | < 2.75 -> 2
//     Semester 6 ke atas -> 25
// - Poin dokumen selalu ditetapkan manual oleh admin.
// ============================================================

export const POIN_IPK = {
    GE_375: 15,
    GE_350: 13,
    GE_325: 11,
    GE_300: 8,
    GE_275: 5,
    LT_275: 2,
};

export const POIN_SEMESTER_6_ATAS = 25;
export const POIN_NIK_OAP = 20;
export const POIN_NIK_NON_OAP = 5;

/** Parse IPK dari berbagai format ("3.85", "3,85", 3.85) -> number | null */
export const parseIpk = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const num = parseFloat(String(value).replace(',', '.'));
    if (Number.isNaN(num) || num <= 0 || num > 4) return null;
    return num;
};

/** Parse semester dari berbagai format ("7", "Semester 7", "VII", 6) -> number | null */
export const parseSemester = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const direct = parseInt(String(value).match(/\d+/)?.[0], 10);
    if (!Number.isNaN(direct)) return direct;
    const roman = String(value).trim().toUpperCase();
    const romanMap = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 };
    return romanMap[roman] ?? null;
};

/** Hitung poin dari IPK (mengikuti batas kategori pada sistem poin) */
export const hitungPoinIpk = (ipk) => {
    const num = parseIpk(ipk);
    if (num === null) return 0;
    if (num >= 3.75) return POIN_IPK.GE_375;
    if (num >= 3.50) return POIN_IPK.GE_350;
    if (num >= 3.25) return POIN_IPK.GE_325;
    if (num >= 3.00) return POIN_IPK.GE_300;
    if (num >= 2.75) return POIN_IPK.GE_275;
    return POIN_IPK.LT_275;
};

/** Deteksi NIK Papua/OAP: prefix 91/92 (kode wilayah Papua) atau flag eksplisit */
export const isNikPapua = (nik, flags = {}) => {
    if (flags.isOap || flags.is_oap || flags.ktpPapua || flags.ktp_papua) return true;
    const digits = String(nik || '').replace(/\D/g, '');
    if (digits.length < 6) return false;
    return digits.startsWith('91') || digits.startsWith('92');
};

/** NIM dianggap terdaftar/terdeteksi jika hasil validasi tersimpan dan IPK diketahui */
const isNimTerdeteksi = (dd = {}, ipkNumber = null) =>
    dd.nim_terdaftar === true && ipkNumber !== null;

/**
// Hitung poin otomatis dari data_diri pendaftaran.
// - Poin NIM (IPK + semester) hanya jalan jika NIM terdaftar/terdeteksi.
// - Poin NIK selalu dihitung terpisah (tidak bergantung NIM).
// Return: { ipk_number, poin_ipk, poin_semester, poin_nik, poin_nim_otomatis, poin_otomatis }
*/
export const hitungPoinOtomatis = (dataDiri = {}) => {
    const dd = dataDiri || {};
    const ipk = parseIpk(dd.ipk);

    // Poin berbasis NIM (IPK & semester): hanya jika NIM terdaftar/terdeteksi
    let poinIpk = 0;
    let poinSemester = 0;
    if (isNimTerdeteksi(dd, ipk)) {
        poinIpk = hitungPoinIpk(ipk);
        const semester = parseSemester(dd.semester);
        poinSemester = semester !== null && semester >= 6 ? POIN_SEMESTER_6_ATAS : 0;
    }

    // Poin NIK: dihitung mandiri, terlepas dari status NIM
    const poinNik = isNikPapua(dd.nik, dd) ? POIN_NIK_OAP : POIN_NIK_NON_OAP;

    const poinNimOtomatis = poinIpk + poinSemester;
    return {
        ipk_number: ipk,
        poin_ipk: poinIpk,
        poin_semester: poinSemester,
        poin_nim_otomatis: poinNimOtomatis,
        poin_nik: poinNik,
        poin_otomatis: poinNimOtomatis + poinNik,
    };
};

/**
// Rincian poin final: manual admin menggantikan poin otomatis per sumber
// (NIM, NIK), lalu ditambah poin dokumen.
// Return: { poin_nim, poin_nik, poin_dokumen, poin_total, nim_manual, nik_manual }
*/
export const hitungPoinFinal = (dataDiri = {}, admin = {}) => {
    const auto = hitungPoinOtomatis(dataDiri);
    const nimManual = toNumOrNull(admin.poin_nim_manual);
    const nikManual = toNumOrNull(admin.poin_nik_manual);
    const dokumen = toNumOrNull(admin.poin_dokumen) ?? 0;

    const poinNim = nimManual !== null ? nimManual : auto.poin_nim_otomatis;
    const poinNik = nikManual !== null ? nikManual : auto.poin_nik;

    return {
        poin_nim: poinNim,
        poin_nik: poinNik,
        poin_dokumen: dokumen,
        poin_total: poinNim + poinNik + dokumen,
        nim_manual: nimManual !== null,
        nik_manual: nikManual !== null,
        auto,
    };
};

const toNumOrNull = (v) =>
    v === null || v === undefined || v === '' ? null : Number(v) || 0;
