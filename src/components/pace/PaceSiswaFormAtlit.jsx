import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, Loader2, ShieldCheck, Trophy } from 'lucide-react';
import { uploadDokumen } from '../../lib/upload';
import {
  initialFormAtlit, buildPernyataanAtlitHtml, LAMPIRAN_DOKUMEN_ATLIT,
  JENIS_KELAMIN, AGAMA, STATUS_TINGGAL_PPLP, STATUS_OAP, DASAR_OAP_ATLIT,
  JENJANG_ATLIT, STATUS_PESERTA_ATLIT, STATUS_KEANGGOTAAN_PPLP, STATUS_PEMBINAAN,
  ADA_BELUM, BUKTI_PRESTASI, KATEGORI_OLAH, TINGKAT_KOMPETISI, SELEKASI_PEMUSATAN,
  PEKERJAAN_ORTU_ATLIT, PENGHASILAN, STATUS_RUMAH, YA_TIDAK_VERIFIKASI, DOKUMEN_EKONOMI_ATLIT,
  KEBUTUHAN_ATLIT, BIAYAI_SAMA, JENIS_REKENING,
  PELATIH_PERNYATAAN, VERIF_IDENTITAS, VERIF_STATUS_PEMBINAAN, VERIF_PENDIDIKAN,
  VERIF_PRESTASI, VERIF_OAP, VERIF_KELENGKAPAN,
} from '../../lib/paceSiswaFormAtlit';
import {
  inputCls, Label, Text, Select, Area, SectionTitle, UploadBox,
} from './PaceFormInputs';

/* ---------- Checkbox group lokal ---------- */
const Checkbox = ({ label, options, values, onToggle }) => (
  <div className="md:col-span-2">
    <Label>{label}</Label>
    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-1">
      {options.map(opt => (
        <label key={opt} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" className="mt-1 accent-brand-blue" checked={values.includes(opt)} onChange={() => onToggle(opt)} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

/* ---------- Blok satu prestasi (F.5) ---------- */
const PrestasiBlock = ({ title, data, onChange }) => (
  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
    <p className="text-sm font-bold text-brand-blue mb-3 flex items-center gap-1.5"><Trophy size={15} /> {title}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Text label="Nama kejuaraan" value={data.nama_kejuaraan} onChange={v => onChange('nama_kejuaraan', v)} />
      <Text label="Tingkat kejuaraan" value={data.tingkat} onChange={v => onChange('tingkat', v)} />
      <Text label="Tahun pelaksanaan" type="number" value={data.tahun} onChange={v => onChange('tahun', v)} placeholder="Contoh: 2025" />
      <Text label="Nomor/cabang olahraga" value={data.nomor_cabang} onChange={v => onChange('nomor_cabang', v)} />
      <Text label="Hasil/peringkat" value={data.hasil} onChange={v => onChange('hasil', v)} />
      <Text label="Penyelenggara" value={data.penyelenggara} onChange={v => onChange('penyelenggara', v)} />
      <Select label="Bukti sertifikat/piagam" value={data.bukti} onChange={v => onChange('bukti', v)} options={BUKTI_PRESTASI} />
    </div>
  </div>
);

/* ---------- Komponen utama form Atlit ---------- */
const PaceSiswaFormAtlit = ({ onCancel, onSubmit, initialValue = null, submitLabel = 'Kirim Pendaftaran' }) => {
  const seed = () => {
    const base = initialFormAtlit();
    if (!initialValue) return base;
    const iv = initialValue;
    return {
      ...base,
      ...iv,
      identitas: { ...base.identitas, ...(iv.identitas || {}) },
      orang_tua: {
        ...base.orang_tua, ...(iv.orang_tua || {}),
        ayah: { ...base.orang_tua.ayah, ...(iv.orang_tua?.ayah || {}) },
        ibu: { ...base.orang_tua.ibu, ...(iv.orang_tua?.ibu || {}) },
        wali: { ...base.orang_tua.wali, ...(iv.orang_tua?.wali || {}) },
      },
      oap: { ...base.oap, ...(iv.oap || {}) },
      pendidikan: { ...base.pendidikan, ...(iv.pendidikan || {}) },
      pplp: { ...base.pplp, ...(iv.pplp || {}) },
      olahraga: {
        ...base.olahraga, ...(iv.olahraga || {}),
        prestasi_1: { ...base.olahraga.prestasi_1, ...(iv.olahraga?.prestasi_1 || {}) },
        prestasi_2: { ...base.olahraga.prestasi_2, ...(iv.olahraga?.prestasi_2 || {}) },
        prestasi_3: { ...base.olahraga.prestasi_3, ...(iv.olahraga?.prestasi_3 || {}) },
      },
      sosial_ekonomi: { ...base.sosial_ekonomi, ...(iv.sosial_ekonomi || {}) },
      rencana_beasiswa: { ...base.rencana_beasiswa, ...(iv.rencana_beasiswa || {}) },
      bantuan: { ...base.bantuan, ...(iv.bantuan || {}) },
      rekening: { ...base.rekening, ...(iv.rekening || {}) },
      pernyataan: { ...base.pernyataan, ...(iv.pernyataan || {}) },
      verifikasi: { ...base.verifikasi, ...(iv.verifikasi || {}) },
      dokumen: { ...(iv.dokumen || {}) },
    };
  };

  const [form, setForm] = useState(seed);
  const [files, setFiles] = useState({}); // key -> File
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const upd = (sec, key, val) => setForm(p => ({ ...p, [sec]: { ...p[sec], [key]: val } }));
  const updParent = (sec, sub, key, val) => setForm(p => ({ ...p, [sec]: { ...p[sec], [sub]: { ...p[sec][sub], [key]: val } } }));
  const toggleArr = (sec, key, val) => setForm(p => {
    const arr = p[sec][key] || [];
    return { ...p, [sec]: { ...p[sec], [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] } };
  });
  const setFile = (key, file) => setFiles(p => ({ ...p, [key]: file }));

  const {
    identitas: A, orang_tua: B, oap: C, pendidikan: D, pplp: E, olahraga: F,
    sosial_ekonomi: G, rencana_beasiswa: H, bantuan: I, rekening: J, pernyataan: K, verifikasi: L,
  } = form;

  const downloadTemplate = () => {
    const html = buildPernyataanAtlitHtml(form);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Surat-Pernyataan-Peserta-Didik-Atlet-dan-Orang-Tua-Wali-PPLP.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!A.nama?.trim()) { setMessage('Nama lengkap peserta didik/atlet wajib diisi.'); return; }
    if (!A.tempat_lahir || !A.tanggal_lahir) { setMessage('Tempat dan tanggal lahir wajib diisi.'); return; }
    if (!files.surat_pernyataan && !form.dokumen?.surat_pernyataan) { setMessage('Surat pernyataan peserta didik/atlet dan orang tua/wali (bagian K) wajib diunggah setelah ditandatangani.'); return; }

    setSubmitting(true);
    setMessage('Mengunggah berkas...');
    try {
      const dokumen = { ...form.dokumen };
      for (const [key, file] of Object.entries(files)) {
        if (file instanceof File) {
          dokumen[key] = await uploadDokumen(file, 'dokumen-pendaftaran');
        }
      }
      setMessage('Menyimpan data siswa...');
      const payload = {
        ...form,
        dokumen,
        _legacy: {
          nama: A.nama, nisn: A.nisn || null, nik: A.nik || null,
          tempat_lahir: A.tempat_lahir, tanggal_lahir: A.tanggal_lahir,
          kelas: D.kelas || '-', alamat: A.alamat || '-',
          nama_orang_tua: B.ayah.nama || B.wali.nama || '-',
          no_hp_orang_tua: A.no_hp_ortu || B.ayah.telepon || B.wali.telepon || '-',
        },
      };
      await onSubmit(payload);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Terjadi kesalahan.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">
        {message && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">{message}</div>
        )}

        {/* ===== A. IDENTITAS PESERTA DIDIK/ATLET ===== */}
        <section>
          <SectionTitle code="A" title="Identitas Peserta Didik/Atlet" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Nama lengkap sesuai dokumen kependudukan" req value={A.nama} onChange={v => upd('identitas', 'nama', v)} colSpan="md:col-span-2" />
            <Text label="NIK (jika tersedia)" value={A.nik} onChange={v => upd('identitas', 'nik', v)} />
            <Text label="NISN (jika tersedia)" value={A.nisn} onChange={v => upd('identitas', 'nisn', v)} />
            <Text label="Tempat lahir" req value={A.tempat_lahir} onChange={v => upd('identitas', 'tempat_lahir', v)} />
            <Text label="Tanggal lahir" req type="date" value={A.tanggal_lahir} onChange={v => upd('identitas', 'tanggal_lahir', v)} />
            <Select label="Jenis kelamin" req value={A.jenis_kelamin} onChange={v => upd('identitas', 'jenis_kelamin', v)} options={JENIS_KELAMIN} />
            <Select label="Agama" value={A.agama} onChange={v => upd('identitas', 'agama', v)} options={AGAMA} />
            <Area label="Alamat tempat tinggal" value={A.alamat} onChange={v => upd('identitas', 'alamat', v)} />
            <Text label="Kampung/Kelurahan" value={A.kampung_kelurahan} onChange={v => upd('identitas', 'kampung_kelurahan', v)} />
            <Text label="Distrik/Kecamatan" value={A.distrik_kecamatan} onChange={v => upd('identitas', 'distrik_kecamatan', v)} />
            <Text label="Kabupaten/Kota" value={A.kabupaten_kota} onChange={v => upd('identitas', 'kabupaten_kota', v)} />
            <Text label="Nomor telepon peserta didik/atlet (jika ada)" value={A.no_hp_siswa} onChange={v => upd('identitas', 'no_hp_siswa', v)} />
            <Text label="Nomor telepon orang tua/wali" value={A.no_hp_ortu} onChange={v => upd('identitas', 'no_hp_ortu', v)} />
            <Select label="Status tempat tinggal selama mengikuti pembinaan PPLP" value={A.status_tinggal} onChange={v => upd('identitas', 'status_tinggal', v)} options={STATUS_TINGGAL_PPLP} colSpan="md:col-span-2" />
            {A.status_tinggal === 'Lainnya' && (
              <Text label="Lainnya" value={A.status_tinggal_lain} onChange={v => upd('identitas', 'status_tinggal_lain', v)} colSpan="md:col-span-2" />
            )}
          </div>
        </section>

        {/* ===== B. ORANG TUA / WALI ===== */}
        <section>
          <SectionTitle code="B" title="Identitas Orang Tua/Wali" />
          <div className="space-y-6">
            {['ayah', 'ibu'].map(role => (
              <div key={role}>
                <p className="text-sm font-bold text-brand-blue capitalize mb-3">1. Data {role}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Text label="Nama lengkap" value={B[role].nama} onChange={v => updParent('orang_tua', role, 'nama', v)} />
                  <Text label="NIK (jika tersedia)" value={B[role].nik} onChange={v => updParent('orang_tua', role, 'nik', v)} />
                  <Text label="Pekerjaan" value={B[role].pekerjaan} onChange={v => updParent('orang_tua', role, 'pekerjaan', v)} />
                  <Text label="Pendidikan terakhir" value={B[role].pendidikan} onChange={v => updParent('orang_tua', role, 'pendidikan', v)} />
                  <Text label="Nomor telepon" value={B[role].telepon} onChange={v => updParent('orang_tua', role, 'telepon', v)} />
                </div>
              </div>
            ))}
            <div>
              <p className="text-sm font-bold text-brand-blue mb-3">3. Wali (jika ada)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Text label="Nama lengkap" value={B.wali.nama} onChange={v => updParent('orang_tua', 'wali', 'nama', v)} />
                <Text label="Hubungan dengan peserta didik/atlet" value={B.wali.hubungan} onChange={v => updParent('orang_tua', 'wali', 'hubungan', v)} />
                <Text label="NIK (jika tersedia)" value={B.wali.nik} onChange={v => updParent('orang_tua', 'wali', 'nik', v)} />
                <Text label="Pekerjaan" value={B.wali.pekerjaan} onChange={v => updParent('orang_tua', 'wali', 'pekerjaan', v)} />
                <Text label="Nomor telepon" value={B.wali.telepon} onChange={v => updParent('orang_tua', 'wali', 'telepon', v)} />
                <Text label="Alamat" value={B.wali.alamat} onChange={v => updParent('orang_tua', 'wali', 'alamat', v)} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== C. STATUS OAP ===== */}
        <section>
          <SectionTitle code="C" title="Data Status Orang Asli Papua (OAP)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Status peserta didik/atlet" value={C.status} onChange={v => upd('oap', 'status', v)} options={STATUS_OAP} />
            <Text label="Nama suku/keret (jika diketahui)" value={C.asal_suku} onChange={v => upd('oap', 'asal_suku', v)} />
            <Text label="Asal kampung atau wilayah adat keluarga" value={C.asal_kampung} onChange={v => upd('oap', 'asal_kampung', v)} colSpan="md:col-span-2" />
            <Checkbox label="Dokumen pendukung status OAP" options={DASAR_OAP_ATLIT} values={C.dasar_dokumen} onToggle={opt => toggleArr('oap', 'dasar_dokumen', opt)} />
            {C.dasar_dokumen.some(h => /lain yang sah/i.test(h)) && (
              <div className="md:col-span-2">
                <input type="text" value={C.dasar_dokumen_lain} onChange={e => upd('oap', 'dasar_dokumen_lain', e.target.value)} placeholder="Sebutkan dokumen pendukung lain yang sah..." className={inputCls} />
              </div>
            )}
            <Area label="Keterangan tambahan" value={C.keterangan} onChange={v => upd('oap', 'keterangan', v)} />
            <p className="md:col-span-2 text-xs text-slate-400 italic">
              Status OAP diverifikasi oleh petugas berwenang berdasarkan dokumen dan ketentuan yang berlaku. Prioritas afirmasi OAP dilaksanakan sesuai petunjuk teknis program.
            </p>
          </div>
        </section>

        {/* ===== D. DATA PENDIDIKAN FORMAL ===== */}
        <section>
          <SectionTitle code="D" title="Data Pendidikan Formal" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Nama sekolah" value={D.nama_sekolah} onChange={v => upd('pendidikan', 'nama_sekolah', v)} />
            <Text label="NPSN sekolah (jika tersedia)" value={D.npsn} onChange={v => upd('pendidikan', 'npsn', v)} />
            <Area label="Alamat sekolah" value={D.alamat} onChange={v => upd('pendidikan', 'alamat', v)} />
            <Text label="Kabupaten/Kota" value={D.kabupaten_kota} onChange={v => upd('pendidikan', 'kabupaten_kota', v)} />
            <Select label="Jenjang pendidikan" value={D.jenjang} onChange={v => upd('pendidikan', 'jenjang', v)} options={JENJANG_ATLIT} />
            {D.jenjang === 'Lainnya' && (
              <Text label="Jenjang lainnya" value={D.jenjang_lain} onChange={v => upd('pendidikan', 'jenjang_lain', v)} />
            )}
            <Text label="Kelas saat ini" value={D.kelas} onChange={v => upd('pendidikan', 'kelas', v)} />
            <Text label="Tahun masuk sekolah" type="number" value={D.tahun_masuk} onChange={v => upd('pendidikan', 'tahun_masuk', v)} placeholder="Contoh: 2023" />
            <Select label="Status peserta didik" value={D.status_didik} onChange={v => upd('pendidikan', 'status_didik', v)} options={STATUS_PESERTA_ATLIT} />
            <Text label="Rata-rata nilai rapor terakhir (jika dipersyaratkan)" value={D.rata_rapor} onChange={v => upd('pendidikan', 'rata_rapor', v)} />
            <Area label="Prestasi akademik/nonakademik di luar olahraga, jika ada" value={D.prestasi_nonakademik} onChange={v => upd('pendidikan', 'prestasi_nonakademik', v)} rows={3} />
            <Text label="Nama kepala sekolah" value={D.nama_kepala_sekolah} onChange={v => upd('pendidikan', 'nama_kepala_sekolah', v)} />
            <Text label="Nomor telepon sekolah/operator" value={D.telepon_sekolah} onChange={v => upd('pendidikan', 'telepon_sekolah', v)} />
          </div>
        </section>

        {/* ===== E. KEANGGOTAAN & PEMBINAAN PPLP ===== */}
        <section>
          <SectionTitle code="E" title="Data Keanggotaan dan Pembinaan PPLP" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="1. Status keanggotaan/pembinaan" value={E.status_keanggotaan} onChange={v => upd('pplp', 'status_keanggotaan', v)} options={STATUS_KEANGGOTAAN_PPLP} colSpan="md:col-span-2" />
            {E.status_keanggotaan?.includes('Lainnya') && (
              <Text label="Lainnya sesuai ketentuan program" value={E.status_lain} onChange={v => upd('pplp', 'status_lain', v)} colSpan="md:col-span-2" />
            )}
            <Text label="2. Nama lembaga/program pembinaan" value={E.nama_program} onChange={v => upd('pplp', 'nama_program', v)} colSpan="md:col-span-2" />
            <Text label="3. Tanggal mulai mengikuti pembinaan" type="date" value={E.tanggal_mulai} onChange={v => upd('pplp', 'tanggal_mulai', v)} />
            <Text label="4. Nama pelatih utama" value={E.pelatih_utama} onChange={v => upd('pplp', 'pelatih_utama', v)} />
            <Text label="5. Nomor telepon pelatih" value={E.telepon_pelatih} onChange={v => upd('pplp', 'telepon_pelatih', v)} />
            <Text label="6. Nama pelatih pendamping (jika ada)" value={E.pelatih_pendamping} onChange={v => upd('pplp', 'pelatih_pendamping', v)} />
            <Text label="7. Lokasi tempat latihan" value={E.lokasi_latihan} onChange={v => upd('pplp', 'lokasi_latihan', v)} />
            <Text label="8. Jadwal latihan rutin" value={E.jadwal_latihan} onChange={v => upd('pplp', 'jadwal_latihan', v)} />
            <Select label="9. Status pembinaan" value={E.status_pembinaan} onChange={v => upd('pplp', 'status_pembinaan', v)} options={STATUS_PEMBINAAN} />
            {E.status_pembinaan === 'Lainnya' && (
              <Text label="Lainnya" value={E.status_pembinaan_lain} onChange={v => upd('pplp', 'status_pembinaan_lain', v)} />
            )}
            <Select label="10. Surat keterangan atlet aktif dari pengelola PPLP" value={E.surat_atlet_aktif} onChange={v => upd('pplp', 'surat_atlet_aktif', v)} options={ADA_BELUM} colSpan="md:col-span-2" />
          </div>
        </section>

        {/* ===== F. CABANG OLAHRAGA & PRESTASI ===== */}
        <section>
          <SectionTitle code="F" title="Data Cabang Olahraga dan Prestasi" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="1. Cabang olahraga utama" value={F.cabang_utama} onChange={v => upd('olahraga', 'cabang_utama', v)} />
            <Text label="2. Nomor pertandingan/nomor lomba" value={F.nomor_lomba} onChange={v => upd('olahraga', 'nomor_lomba', v)} />
            <Select label="3. Kategori" value={F.kategori} onChange={v => upd('olahraga', 'kategori', v)} options={KATEGORI_OLAH} />
            {F.kategori === 'Lainnya' && (
              <Text label="Kategori lainnya" value={F.kategori_lain} onChange={v => upd('olahraga', 'kategori_lain', v)} />
            )}
            <Checkbox label="4. Tingkat kompetisi yang pernah diikuti" options={TINGKAT_KOMPETISI} values={F.tingkat_kompetisi} onToggle={opt => toggleArr('olahraga', 'tingkat_kompetisi', opt)} />
          </div>

          <p className="text-sm font-bold text-slate-700 mt-6 mb-3">5. Daftar prestasi olahraga yang pernah diraih</p>
          <div className="space-y-4">
            <PrestasiBlock title="Prestasi 1" data={F.prestasi_1} onChange={(k, v) => updParent('olahraga', 'prestasi_1', k, v)} />
            <PrestasiBlock title="Prestasi 2" data={F.prestasi_2} onChange={(k, v) => updParent('olahraga', 'prestasi_2', k, v)} />
            <PrestasiBlock title="Prestasi 3 (jika ada)" data={F.prestasi_3} onChange={(k, v) => updParent('olahraga', 'prestasi_3', k, v)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Checkbox label="6. Keikutsertaan dalam seleksi atau pemusatan latihan" options={SELEKASI_PEMUSATAN} values={F.seleksi_pemusatan} onToggle={opt => toggleArr('olahraga', 'seleksi_pemusatan', opt)} />
            {F.seleksi_pemusatan.some(h => /lainnya/i.test(h)) && (
              <div className="md:col-span-2">
                <input type="text" value={F.seleksi_pemusatan_lain} onChange={e => upd('olahraga', 'seleksi_pemusatan_lain', e.target.value)} placeholder="Sebutkan lainnya..." className={inputCls} />
              </div>
            )}
            <Area label="7. Target prestasi olahraga ke depan" value={F.target_prestasi} onChange={v => upd('olahraga', 'target_prestasi', v)} rows={2} />
            <Area label="8. Rekomendasi pelatih mengenai potensi dan perkembangan atlet" value={F.rekomendasi_pelatih} onChange={v => upd('olahraga', 'rekomendasi_pelatih', v)} rows={2} />
          </div>
        </section>

        {/* ===== G. KONDISI SOSIAL EKONOMI ===== */}
        <section>
          <SectionTitle code="G" title="Kondisi Sosial Ekonomi Keluarga" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="1. Pekerjaan utama orang tua/wali" value={G.pekerjaan_ortu} onChange={v => upd('sosial_ekonomi', 'pekerjaan_ortu', v)} options={PEKERJAAN_ORTU_ATLIT} />
            {G.pekerjaan_ortu === 'Lainnya' && (
              <Text label="Pekerjaan lainnya" value={G.pekerjaan_ortu_lain} onChange={v => upd('sosial_ekonomi', 'pekerjaan_ortu_lain', v)} />
            )}
            <Select label="2. Perkiraan penghasilan gabungan orang tua/wali per bulan" value={G.penghasilan} onChange={v => upd('sosial_ekonomi', 'penghasilan', v)} options={PENGHASILAN} colSpan="md:col-span-2" />
            <Text label="3. Jumlah anggota keluarga yang menjadi tanggungan (orang)" type="number" value={G.jml_tanggungan} onChange={v => upd('sosial_ekonomi', 'jml_tanggungan', v)} />
            <Text label="4. Jumlah anak yang masih bersekolah (orang)" type="number" value={G.jml_anak_sekolah} onChange={v => upd('sosial_ekonomi', 'jml_anak_sekolah', v)} />
            <Select label="5. Status tempat tinggal keluarga" value={G.status_tinggal} onChange={v => upd('sosial_ekonomi', 'status_tinggal', v)} options={STATUS_RUMAH} />
            {G.status_tinggal === 'Lainnya' && (
              <Text label="Lainnya" value={G.status_tinggal_lain} onChange={v => upd('sosial_ekonomi', 'status_tinggal_lain', v)} />
            )}
            <Select label="6. Apakah keluarga termasuk keluarga kurang mampu?" value={G.kurang_mampu} onChange={v => upd('sosial_ekonomi', 'kurang_mampu', v)} options={YA_TIDAK_VERIFIKASI} />
            <Checkbox label="7. Dokumen pendukung kondisi ekonomi (jika dipersyaratkan)" options={DOKUMEN_EKONOMI_ATLIT} values={G.dokumen_ekonomi} onToggle={opt => toggleArr('sosial_ekonomi', 'dokumen_ekonomi', opt)} />
            {G.dokumen_ekonomi.some(h => /lainnya/i.test(h)) && (
              <div className="md:col-span-2">
                <input type="text" value={G.dokumen_ekonomi_lain} onChange={e => upd('sosial_ekonomi', 'dokumen_ekonomi_lain', e.target.value)} placeholder="Sebutkan dokumen pendukung lainnya..." className={inputCls} />
              </div>
            )}
            <Area label="8. Keterangan tambahan" value={G.keterangan} onChange={v => upd('sosial_ekonomi', 'keterangan', v)} />
          </div>
        </section>

        {/* ===== H. RENCANA PEMANFAATAN BEASISWA ===== */}
        <section>
          <SectionTitle code="H" title="Rencana Pemanfaatan Beasiswa" />
          <p className="text-sm text-slate-500 mb-4">
            Uraikan kebutuhan pendidikan dan pembinaan olahraga yang memerlukan dukungan beasiswa, sesuai komponen bantuan yang ditetapkan dalam petunjuk teknis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox label="Kebutuhan yang relevan" options={KEBUTUHAN_ATLIT} values={H.kebutuhan} onToggle={opt => toggleArr('rencana_beasiswa', 'kebutuhan', opt)} />
            {H.kebutuhan.some(h2 => /lain sesuai/i.test(h2)) && (
              <div className="md:col-span-2">
                <input type="text" value={H.kebutuhan_lain} onChange={e => upd('rencana_beasiswa', 'kebutuhan_lain', e.target.value)} placeholder="Sebutkan kebutuhan lain sesuai ketentuan..." className={inputCls} />
              </div>
            )}
            <Area label="Uraian kebutuhan prioritas" value={H.uraian_prioritas} onChange={v => upd('rencana_beasiswa', 'uraian_prioritas', v)} rows={3} />
            <Area label="Target pendidikan dan olahraga selama menerima beasiswa" value={H.target_pendidikan} onChange={v => upd('rencana_beasiswa', 'target_pendidikan', v)} rows={3} />
          </div>
        </section>

        {/* ===== I. BANTUAN PENDIDIKAN LAIN ===== */}
        <section>
          <SectionTitle code="I" title="Informasi Bantuan Pendidikan Lain" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="1. Menerima bantuan pendidikan lain?" value={I.menerima} onChange={v => upd('bantuan', 'menerima', v)} options={['Tidak', 'Ya']} colSpan="md:col-span-2" />
            {I.menerima === 'Ya' && (
              <>
                <Text label="2. Nama program bantuan" value={I.nama_program} onChange={v => upd('bantuan', 'nama_program', v)} />
                <Text label="3. Sumber bantuan" value={I.sumber} onChange={v => upd('bantuan', 'sumber', v)} />
                <Text label="4. Periode dan besaran bantuan (jika diketahui)" value={I.periode_besaran} onChange={v => upd('bantuan', 'periode_besaran', v)} colSpan="md:col-span-2" />
                <Select label="5. Bantuan tersebut membiayai komponen yang sama dengan Beasiswa PACE?" value={I.biayai_sama} onChange={v => upd('bantuan', 'biayai_sama', v)} options={BIAYAI_SAMA} colSpan="md:col-span-2" />
              </>
            )}
            <Area label="Keterangan" value={I.keterangan} onChange={v => upd('bantuan', 'keterangan', v)} />
          </div>
        </section>

        {/* ===== J. DATA REKENING ===== */}
        <section>
          <SectionTitle code="J" title="Data Rekening Penerima (Jika Dipersyaratkan)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Nama pemilik rekening" value={J.pemilik} onChange={v => upd('rekening', 'pemilik', v)} />
            <Text label="Nama bank" value={J.nama_bank} onChange={v => upd('rekening', 'nama_bank', v)} />
            <Text label="Nomor rekening" value={J.nomor_rekening} onChange={v => upd('rekening', 'nomor_rekening', v)} />
            <Text label="Hubungan pemilik rekening dengan peserta didik/atlet" value={J.hubungan} onChange={v => upd('rekening', 'hubungan', v)} />
            <Select label="Jenis rekening" value={J.jenis} onChange={v => upd('rekening', 'jenis', v)} options={JENIS_REKENING} colSpan="md:col-span-2" />
            <p className="md:col-span-2 text-xs text-slate-400 italic">
              Pengisian dan penetapan rekening mengikuti mekanisme penyaluran bantuan yang ditetapkan oleh Dinas Pendidikan Provinsi Papua. Jangan mencantumkan PIN, kata sandi, atau kode OTP.
            </p>
          </div>
        </section>

        {/* ===== K. PERNYATAAN ===== */}
        <section>
          <SectionTitle code="K" title="Pernyataan Peserta Didik/Atlet dan Orang Tua/Wali" />
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-2xl p-5">
            <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
              <AlertCircle size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
              <p>Unduh template surat pernyataan, isi dan mintakan tanda tangan peserta didik/atlet serta orang tua/wali (bermaterai bila dipersyaratkan), lalu unggah kembali surat yang sudah ditandatangani.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Text label="Nama peserta didik/atlet" req value={K.nama_siswa} onChange={v => upd('pernyataan', 'nama_siswa', v)} />
              <Text label="Nama orang tua/wali" value={K.nama_ortu} onChange={v => upd('pernyataan', 'nama_ortu', v)} />
              <Text label="Hubungan dengan peserta didik/atlet" value={K.hubungan} onChange={v => upd('pernyataan', 'hubungan', v)} placeholder="Ayah / Ibu / Wali" />
              <Text label="Tempat" value={K.tempat} onChange={v => upd('pernyataan', 'tempat', v)} placeholder="Kota penerbitan" />
              <Text label="Tanggal" type="date" value={K.tanggal} onChange={v => upd('pernyataan', 'tanggal', v)} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={downloadTemplate} className="flex items-center gap-2 bg-white border border-brand-blue/30 text-brand-blue px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-blue hover:text-white transition-colors">
                <Download size={16} /> Unduh Template Surat
              </button>
              <div className="flex-1 min-w-[220px]">
                <UploadBox label="Unggah Surat Pernyataan (ttd)" req file={files.surat_pernyataan} onFile={f => setFile('surat_pernyataan', f)} done={!!form.dokumen?.surat_pernyataan} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== L. REKOMENDASI PELATIH & VERIFIKASI PPLP ===== */}
        <section>
          <SectionTitle code="L" title="Rekomendasi Pelatih dan Verifikasi Pengelola PPLP" />
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-6">
            <div className="flex items-start gap-2 text-sm text-slate-500">
              <ShieldCheck size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <p>Bagian ini diisi oleh pelatih dan/atau pengelola PPLP pada saat rekomendasi &amp; verifikasi. Dapat dibiarkan kosong pada saat pendaftaran.</p>
            </div>

            {/* L.1 Rekomendasi Pelatih */}
            <div>
              <p className="text-sm font-bold text-slate-800 mb-2">1. Rekomendasi Pelatih</p>
              <p className="text-sm text-slate-600 mb-1">Saya menyatakan bahwa peserta didik/atlet tersebut:</p>
              <Checkbox options={PELATIH_PERNYATAAN} values={L.pelatih_pernyataan} onToggle={opt => toggleArr('verifikasi', 'pelatih_pernyataan', opt)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Area label="Catatan/rekomendasi pelatih" value={L.catatan_pelatih} onChange={v => upd('verifikasi', 'catatan_pelatih', v)} rows={3} />
                <Text label="Nama pelatih" value={L.nama_pelatih} onChange={v => upd('verifikasi', 'nama_pelatih', v)} />
                <Text label="Cabang olahraga" value={L.cabang_olahraga} onChange={v => upd('verifikasi', 'cabang_olahraga', v)} />
                <Text label="Tanggal" type="date" value={L.tanggal_pelatih} onChange={v => upd('verifikasi', 'tanggal_pelatih', v)} />
              </div>
            </div>

            {/* L.2 Verifikasi Pengelola PPLP */}
            <div className="border-t border-slate-200 pt-5">
              <p className="text-sm font-bold text-slate-800 mb-3">2. Verifikasi Pengelola PPLP</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Text label="Nama pengelola/operator" value={L.nama_pengelola} onChange={v => upd('verifikasi', 'nama_pengelola', v)} />
                <Text label="Jabatan" value={L.jabatan} onChange={v => upd('verifikasi', 'jabatan', v)} />
              </div>
              <p className="text-sm font-bold text-slate-700 mt-4 mb-2">Hasil verifikasi</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="1. Identitas atlet" value={L.v_identitas} onChange={v => upd('verifikasi', 'v_identitas', v)} options={VERIF_IDENTITAS} />
                <Select label="2. Status pembinaan PPLP" value={L.v_status_pembinaan} onChange={v => upd('verifikasi', 'v_status_pembinaan', v)} options={VERIF_STATUS_PEMBINAAN} />
                <Select label="3. Data pendidikan" value={L.v_pendidikan} onChange={v => upd('verifikasi', 'v_pendidikan', v)} options={VERIF_PENDIDIKAN} />
                <Select label="4. Data prestasi" value={L.v_prestasi} onChange={v => upd('verifikasi', 'v_prestasi', v)} options={VERIF_PRESTASI} />
                <Select label="5. Status OAP" value={L.v_status_oap} onChange={v => upd('verifikasi', 'v_status_oap', v)} options={VERIF_OAP} />
                <Select label="6. Kelengkapan berkas" value={L.v_kelengkapan} onChange={v => upd('verifikasi', 'v_kelengkapan', v)} options={VERIF_KELENGKAPAN} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Area label="Catatan hasil verifikasi" value={L.catatan_verifikasi} onChange={v => upd('verifikasi', 'catatan_verifikasi', v)} rows={3} />
                <Text label="Tempat" value={L.tempat} onChange={v => upd('verifikasi', 'tempat', v)} />
                <Text label="Tanggal" type="date" value={L.tanggal} onChange={v => upd('verifikasi', 'tanggal', v)} />
                <Text label="Nama operator/pengelola PPLP" value={L.nama_operator} onChange={v => upd('verifikasi', 'nama_operator', v)} />
                <Text label="Mengetahui, nama pejabat berwenang" value={L.nama_pejabat} onChange={v => upd('verifikasi', 'nama_pejabat', v)} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== LAMPIRAN ===== */}
        <section>
          <SectionTitle code="📎" title="Lampiran: Daftar Periksa Dokumen" />
          <p className="text-sm text-slate-500 mb-4">Beri unggahan pada dokumen yang diserahkan.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LAMPIRAN_DOKUMEN_ATLIT.map(doc => (
              <UploadBox key={doc.key} label={doc.label} req={doc.req} file={files[doc.key]} onFile={f => setFile(doc.key, f)} done={!!form.dokumen?.[doc.key]} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer aksi */}
      <div className="p-6 border-t border-slate-100 flex flex-wrap justify-end gap-3 bg-slate-50/60">
        <button onClick={onCancel} className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
        <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 rounded-xl font-bold bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors disabled:opacity-70 flex items-center gap-2">
          {submitting ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><CheckCircle size={16} /> {submitLabel}</>}
        </button>
      </div>
    </div>
  );
};

export default PaceSiswaFormAtlit;
