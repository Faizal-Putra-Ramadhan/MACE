import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDokumen } from '../../lib/upload';
import {
  initialFormKedinasan, buildPernyataanKedinasanHtml, LAMPIRAN_DOKUMEN_KEDINASAN,
  JENIS_KELAMIN, AGAMA, STATUS_TINGGAL_KEDINASAN, STATUS_OAP, DASAR_OAP_KEDINASAN,
  STATUS_PENDIDIKAN, PERSYARATAN_KHUSUS, MAPEL_DITINGKATKAN, PERNAH_TIDAK, YA_BELUM,
  KENDALA_PERSIAPAN, STATUS_BIMBEL, METODE_BIMBEL, MATERI_BIMBEL, BERSEDIA_JADWAL,
  PENGHASILAN, STATUS_RUMAH, YA_TIDAK_VERIFIKASI, DOKUMEN_EKONOMI_KEDINASAN, BIAYAI_BIMBEL,
} from '../../lib/paceSiswaFormKedinasan';
import {
  inputCls, Label, Text, Select, Area, SectionTitle, UploadBox,
} from './PaceFormInputs';

/* ---------- Checkbox group lokal (label + opsi) ---------- */
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

/* ---------- Komponen utama form Kedinasan ---------- */
const PaceSiswaFormKedinasan = ({ onCancel, onSubmit, initialValue = null, submitLabel = 'Kirim Pendaftaran' }) => {
  const seed = () => {
    const base = initialFormKedinasan();
    if (!initialValue) return base;
    const iv = initialValue;
    return {
      ...base,
      ...iv,
      identitas: { ...base.identitas, ...(iv.identitas || {}) },
      oap: { ...base.oap, ...(iv.oap || {}) },
      pendidikan: { ...base.pendidikan, ...(iv.pendidikan || {}) },
      rencana_kedinasan: { ...base.rencana_kedinasan, ...(iv.rencana_kedinasan || {}) },
      kesiapan: { ...base.kesiapan, ...(iv.kesiapan || {}) },
      bimbel: { ...base.bimbel, ...(iv.bimbel || {}) },
      sosial_ekonomi: { ...base.sosial_ekonomi, ...(iv.sosial_ekonomi || {}) },
      bantuan: { ...base.bantuan, ...(iv.bantuan || {}) },
      pernyataan: { ...base.pernyataan, ...(iv.pernyataan || {}) },
      dokumen: { ...(iv.dokumen || {}) },
    };
  };

  const [form, setForm] = useState(seed);
  const [files, setFiles] = useState({}); // key -> File
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const upd = (sec, key, val) => setForm(p => ({ ...p, [sec]: { ...p[sec], [key]: val } }));
  const toggleArr = (sec, key, val) => setForm(p => {
    const arr = p[sec][key] || [];
    return { ...p, [sec]: { ...p[sec], [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] } };
  });
  const setFile = (key, file) => setFiles(p => ({ ...p, [key]: file }));

  const {
    identitas: A, oap: B, pendidikan: C, rencana_kedinasan: D, kesiapan: E,
    bimbel: F, sosial_ekonomi: G, bantuan: H, pernyataan: I,
  } = form;

  const downloadTemplate = () => {
    const html = buildPernyataanKedinasanHtml(form);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Surat-Pernyataan-Kesanggupan-Peserta-Kedinasan.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!A.nama?.trim()) { setMessage('Nama lengkap calon peserta wajib diisi.'); return; }
    if (!A.tempat_lahir || !A.tanggal_lahir) { setMessage('Tempat dan tanggal lahir wajib diisi.'); return; }
    if (!files.surat_pernyataan && !form.dokumen?.surat_pernyataan) { setMessage('Surat pernyataan kesanggupan peserta (bagian I) wajib diunggah setelah ditandatangani.'); return; }

    setSubmitting(true);
    setMessage('Mengunggah berkas...');
    try {
      const dokumen = { ...form.dokumen };
      for (const [key, file] of Object.entries(files)) {
        if (file instanceof File) {
          dokumen[key] = await uploadDokumen(file, 'dokumen-pendaftaran');
        }
      }
      setMessage('Menyimpan data calon peserta...');
      const payload = {
        ...form,
        dokumen,
        _legacy: {
          nama: A.nama, nisn: A.nisn || null, nik: A.nik || null,
          tempat_lahir: A.tempat_lahir, tanggal_lahir: A.tanggal_lahir,
          kelas: C.status_pendidikan || '-', alamat: A.alamat || '-',
          nama_orang_tua: G.nama_ayah || G.nama_wali || '-',
          no_hp_orang_tua: A.no_hp || '-',
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

        {/* ===== A. IDENTITAS CALON PESERTA ===== */}
        <section>
          <SectionTitle code="A" title="Identitas Calon Peserta" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Nama lengkap sesuai dokumen kependudukan" req value={A.nama} onChange={v => upd('identitas', 'nama', v)} colSpan="md:col-span-2" />
            <Text label="NIK" value={A.nik} onChange={v => upd('identitas', 'nik', v)} />
            <Text label="NISN (jika tersedia)" value={A.nisn} onChange={v => upd('identitas', 'nisn', v)} />
            <Text label="Tempat lahir" req value={A.tempat_lahir} onChange={v => upd('identitas', 'tempat_lahir', v)} />
            <Text label="Tanggal lahir" req type="date" value={A.tanggal_lahir} onChange={v => upd('identitas', 'tanggal_lahir', v)} />
            <Select label="Jenis kelamin" req value={A.jenis_kelamin} onChange={v => upd('identitas', 'jenis_kelamin', v)} options={JENIS_KELAMIN} />
            <Select label="Agama" value={A.agama} onChange={v => upd('identitas', 'agama', v)} options={AGAMA} />
            <Area label="Alamat tempat tinggal lengkap" value={A.alamat} onChange={v => upd('identitas', 'alamat', v)} />
            <Text label="Kampung/Kelurahan" value={A.kampung_kelurahan} onChange={v => upd('identitas', 'kampung_kelurahan', v)} />
            <Text label="Distrik/Kecamatan" value={A.distrik_kecamatan} onChange={v => upd('identitas', 'distrik_kecamatan', v)} />
            <Text label="Kabupaten/Kota" value={A.kabupaten_kota} onChange={v => upd('identitas', 'kabupaten_kota', v)} />
            <Text label="Nomor telepon/WhatsApp calon peserta" value={A.no_hp} onChange={v => upd('identitas', 'no_hp', v)} />
            <Text label="Alamat email aktif (jika ada)" type="email" value={A.email} onChange={v => upd('identitas', 'email', v)} />
            <Select label="Status tempat tinggal saat ini" value={A.status_tinggal} onChange={v => upd('identitas', 'status_tinggal', v)} options={STATUS_TINGGAL_KEDINASAN} />
            {A.status_tinggal === 'Lainnya' && (
              <Text label="Lainnya" value={A.status_tinggal_lain} onChange={v => upd('identitas', 'status_tinggal_lain', v)} />
            )}
          </div>
        </section>

        {/* ===== B. STATUS OAP ===== */}
        <section>
          <SectionTitle code="B" title="Identitas dan Status Orang Asli Papua (OAP)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Status calon peserta" value={B.status} onChange={v => upd('oap', 'status', v)} options={STATUS_OAP} />
            <Text label="Nama suku/keret (jika diketahui)" value={B.asal_suku} onChange={v => upd('oap', 'asal_suku', v)} />
            <Text label="Asal kampung atau wilayah adat keluarga" value={B.asal_kampung} onChange={v => upd('oap', 'asal_kampung', v)} colSpan="md:col-span-2" />
            <Checkbox label="Dokumen pendukung status OAP" options={DASAR_OAP_KEDINASAN} values={B.dasar_dokumen} onToggle={opt => toggleArr('oap', 'dasar_dokumen', opt)} />
            {B.dasar_dokumen.some(h => /lain yang sah/i.test(h)) && (
              <div className="md:col-span-2">
                <input type="text" value={B.dasar_dokumen_lain} onChange={e => upd('oap', 'dasar_dokumen_lain', e.target.value)} placeholder="Sebutkan dokumen pendukung lain yang sah..." className={inputCls} />
              </div>
            )}
            <Area label="Keterangan tambahan" value={B.keterangan} onChange={v => upd('oap', 'keterangan', v)} />
          </div>
        </section>

        {/* ===== C. RIWAYAT PENDIDIKAN FORMAL ===== */}
        <section>
          <SectionTitle code="C" title="Riwayat Pendidikan Formal" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Status pendidikan saat mendaftar" value={C.status_pendidikan} onChange={v => upd('pendidikan', 'status_pendidikan', v)} options={STATUS_PENDIDIKAN} colSpan="md:col-span-2" />
            {C.status_pendidikan?.includes('Lainnya') && (
              <Text label="Lainnya sesuai persyaratan" value={C.status_pendidikan_lain} onChange={v => upd('pendidikan', 'status_pendidikan_lain', v)} colSpan="md:col-span-2" />
            )}
            <Text label="Nama sekolah asal" value={C.nama_sekolah} onChange={v => upd('pendidikan', 'nama_sekolah', v)} />
            <Text label="NPSN sekolah (jika tersedia)" value={C.npsn} onChange={v => upd('pendidikan', 'npsn', v)} />
            <Area label="Alamat sekolah" value={C.alamat} onChange={v => upd('pendidikan', 'alamat', v)} />
            <Text label="Kabupaten/Kota" value={C.kabupaten_kota} onChange={v => upd('pendidikan', 'kabupaten_kota', v)} />
            <Text label="Tahun masuk sekolah" type="number" value={C.tahun_masuk} onChange={v => upd('pendidikan', 'tahun_masuk', v)} placeholder="Contoh: 2022" />
            <Text label="Tahun lulus / perkiraan tahun kelulusan" type="number" value={C.tahun_lulus} onChange={v => upd('pendidikan', 'tahun_lulus', v)} placeholder="Contoh: 2025" />
            <Text label="Jurusan/program keahlian" value={C.jurusan} onChange={v => upd('pendidikan', 'jurusan', v)} />
            <Text label="Nilai rata-rata rapor terakhir" value={C.rata_rapor} onChange={v => upd('pendidikan', 'rata_rapor', v)} />
            <Text label="Nilai rata-rata ijazah (jika sudah lulus)" value={C.rata_ijazah} onChange={v => upd('pendidikan', 'rata_ijazah', v)} />
            <Area label="Prestasi akademik/nonakademik yang pernah diraih" value={C.prestasi} onChange={v => upd('pendidikan', 'prestasi', v)} rows={3} />
            <Select label="Sedang mengikuti pendidikan tinggi?" value={C.mengikuti_pt} onChange={v => upd('pendidikan', 'mengikuti_pt', v)} options={['Tidak', 'Ya']} />
            {C.mengikuti_pt === 'Ya' && (
              <Text label="Nama perguruan tinggi" value={C.nama_pt} onChange={v => upd('pendidikan', 'nama_pt', v)} />
            )}
          </div>
        </section>

        {/* ===== D. RENCANA PILIHAN SEKOLAH KEDINASAN ===== */}
        <section>
          <SectionTitle code="D" title="Rencana Pilihan Sekolah Kedinasan" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="1. Pilihan sekolah kedinasan pertama" value={D.pilihan_1} onChange={v => upd('rencana_kedinasan', 'pilihan_1', v)} />
            <Text label="2. Program studi/jurusan yang diminati" value={D.prodi_1} onChange={v => upd('rencana_kedinasan', 'prodi_1', v)} />
            <Text label="3. Pilihan sekolah kedinasan kedua (jika ada)" value={D.pilihan_2} onChange={v => upd('rencana_kedinasan', 'pilihan_2', v)} />
            <Text label="4. Program studi/jurusan yang diminati" value={D.prodi_2} onChange={v => upd('rencana_kedinasan', 'prodi_2', v)} />
            <Text label="5. Pilihan sekolah kedinasan ketiga (jika ada)" value={D.pilihan_3} onChange={v => upd('rencana_kedinasan', 'pilihan_3', v)} colSpan="md:col-span-2" />
            <Area label="6. Alasan memilih sekolah kedinasan" value={D.alasan} onChange={v => upd('rencana_kedinasan', 'alasan', v)} rows={3} />
            <Select label="7. Telah mempelajari persyaratan penerimaan yang dituju?" value={D.mempelajari_persyaratan} onChange={v => upd('rencana_kedinasan', 'mempelajari_persyaratan', v)} options={YA_BELUM} colSpan="md:col-span-2" />
            <Checkbox label="8. Persyaratan khusus yang perlu dipersiapkan (jika diketahui)" options={PERSYARATAN_KHUSUS} values={D.persyaratan_khusus} onToggle={opt => toggleArr('rencana_kedinasan', 'persyaratan_khusus', opt)} />
            {D.persyaratan_khusus.some(h => /lainnya/i.test(h)) && (
              <div className="md:col-span-2">
                <input type="text" value={D.persyaratan_lain} onChange={e => upd('rencana_kedinasan', 'persyaratan_lain', e.target.value)} placeholder="Sebutkan persyaratan lainnya..." className={inputCls} />
              </div>
            )}
          </div>
        </section>

        {/* ===== E. KESIAPAN AKADEMIK DAN SELEKSI ===== */}
        <section>
          <SectionTitle code="E" title="Data Kesiapan Akademik dan Seleksi" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox label="1. Mata pelajaran/kemampuan yang perlu ditingkatkan" options={MAPEL_DITINGKATKAN} values={E.mapel} onToggle={opt => toggleArr('kesiapan', 'mapel', opt)} />
            {E.mapel.some(h => /^Lainnya$/i.test(h)) && (
              <div className="md:col-span-2">
                <input type="text" value={E.mapel_lain} onChange={e => upd('kesiapan', 'mapel_lain', e.target.value)} placeholder="Sebutkan lainnya..." className={inputCls} />
              </div>
            )}
            <Select label="2. Pernah mengikuti tes simulasi/tryout seleksi?" value={E.pernah_tryout} onChange={v => upd('kesiapan', 'pernah_tryout', v)} options={PERNAH_TIDAK} colSpan="md:col-span-2" />
            {E.pernah_tryout === 'Pernah' && (
              <Area label="3. Nama penyelenggara dan hasilnya" value={E.tryout_hasil} onChange={v => upd('kesiapan', 'tryout_hasil', v)} />
            )}
            <Text label="4. Hasil tes awal/diagnostik — Nilai" value={E.diagnostik_nilai} onChange={v => upd('kesiapan', 'diagnostik_nilai', v)} />
            <Text label="Tanggal tes" type="date" value={E.diagnostik_tanggal} onChange={v => upd('kesiapan', 'diagnostik_tanggal', v)} />
            <Text label="Penyelenggara" value={E.diagnostik_penyelenggara} onChange={v => upd('kesiapan', 'diagnostik_penyelenggara', v)} colSpan="md:col-span-2" />
            <Select label="5. Pengalaman mengikuti seleksi sekolah kedinasan sebelumnya" value={E.pengalaman_seleksi} onChange={v => upd('kesiapan', 'pengalaman_seleksi', v)} options={PERNAH_TIDAK} />
            {E.pengalaman_seleksi === 'Pernah' && (
              <Text label="Nama sekolah kedinasan/tahun seleksi" value={E.pengalaman_detail} onChange={v => upd('kesiapan', 'pengalaman_detail', v)} />
            )}
            <Checkbox label="6. Kendala utama dalam persiapan seleksi" options={KENDALA_PERSIAPAN} values={E.kendala} onToggle={opt => toggleArr('kesiapan', 'kendala', opt)} />
            {E.kendala.some(h => /lainnya/i.test(h)) && (
              <div className="md:col-span-2">
                <input type="text" value={E.kendala_lain} onChange={e => upd('kesiapan', 'kendala_lain', e.target.value)} placeholder="Sebutkan kendala lainnya..." className={inputCls} />
              </div>
            )}
            <Area label="7. Uraian singkat kesiapan dan motivasi mengikuti program" value={E.uraian_motivasi} onChange={v => upd('kesiapan', 'uraian_motivasi', v)} rows={3} />
          </div>
        </section>

        {/* ===== F. DATA BIMBINGAN BELAJAR (BIMBEL) ===== */}
        <section>
          <SectionTitle code="F" title="Data Bimbingan Belajar (Bimbel)" />
          <p className="text-xs text-slate-400 italic mb-4 -mt-2">
            Diisi apabila calon peserta telah terdaftar pada lembaga bimbingan belajar. Jika pendaftaran dilakukan sebelum penempatan, bagian ini diisi oleh operator program.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="1. Status keikutsertaan" value={F.status} onChange={v => upd('bimbel', 'status', v)} options={STATUS_BIMBEL} colSpan="md:col-span-2" />
            <Text label="2. Nama lembaga bimbingan belajar (jika sudah ditentukan)" value={F.nama_lembaga} onChange={v => upd('bimbel', 'nama_lembaga', v)} />
            <Text label="4. Nama penanggung jawab/operator" value={F.penanggung_jawab} onChange={v => upd('bimbel', 'penanggung_jawab', v)} />
            <Area label="3. Alamat lembaga" value={F.alamat} onChange={v => upd('bimbel', 'alamat', v)} />
            <Text label="5. Periode mulai" type="date" value={F.periode_mulai} onChange={v => upd('bimbel', 'periode_mulai', v)} />
            <Text label="5. Periode selesai" type="date" value={F.periode_selesai} onChange={v => upd('bimbel', 'periode_selesai', v)} />
            <Checkbox label="6. Metode pembelajaran yang direncanakan" options={METODE_BIMBEL} values={F.metode} onToggle={opt => toggleArr('bimbel', 'metode', opt)} />
            <Checkbox label="7. Materi persiapan yang dibutuhkan" options={MATERI_BIMBEL} values={F.materi} onToggle={opt => toggleArr('bimbel', 'materi', opt)} />
            <Select label="8. Bersedia mengikuti seluruh jadwal bimbel?" value={F.bersedia_jadwal} onChange={v => upd('bimbel', 'bersedia_jadwal', v)} options={BERSEDIA_JADWAL} colSpan="md:col-span-2" />
            <Area label="9. Keterangan tambahan" value={F.keterangan} onChange={v => upd('bimbel', 'keterangan', v)} />
          </div>
        </section>

        {/* ===== G. KONDISI SOSIAL EKONOMI KELUARGA ===== */}
        <section>
          <SectionTitle code="G" title="Kondisi Sosial Ekonomi Keluarga" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="1. Nama ayah" value={G.nama_ayah} onChange={v => upd('sosial_ekonomi', 'nama_ayah', v)} />
            <Text label="Pekerjaan ayah" value={G.pekerjaan_ayah} onChange={v => upd('sosial_ekonomi', 'pekerjaan_ayah', v)} />
            <Text label="2. Nama ibu" value={G.nama_ibu} onChange={v => upd('sosial_ekonomi', 'nama_ibu', v)} />
            <Text label="Pekerjaan ibu" value={G.pekerjaan_ibu} onChange={v => upd('sosial_ekonomi', 'pekerjaan_ibu', v)} />
            <Text label="3. Nama wali (jika ada)" value={G.nama_wali} onChange={v => upd('sosial_ekonomi', 'nama_wali', v)} />
            <Text label="Hubungan dengan calon peserta" value={G.hubungan_wali} onChange={v => upd('sosial_ekonomi', 'hubungan_wali', v)} />
            <Select label="4. Perkiraan penghasilan gabungan orang tua/wali per bulan" value={G.penghasilan} onChange={v => upd('sosial_ekonomi', 'penghasilan', v)} options={PENGHASILAN} colSpan="md:col-span-2" />
            <Text label="5. Jumlah anggota keluarga yang menjadi tanggungan (orang)" type="number" value={G.jml_tanggungan} onChange={v => upd('sosial_ekonomi', 'jml_tanggungan', v)} />
            <Text label="6. Jumlah anggota keluarga yang masih bersekolah (orang)" type="number" value={G.jml_bersekolah} onChange={v => upd('sosial_ekonomi', 'jml_bersekolah', v)} />
            <Select label="7. Status tempat tinggal keluarga" value={G.status_tinggal} onChange={v => upd('sosial_ekonomi', 'status_tinggal', v)} options={STATUS_RUMAH} />
            {G.status_tinggal === 'Lainnya' && (
              <Text label="Lainnya" value={G.status_tinggal_lain} onChange={v => upd('sosial_ekonomi', 'status_tinggal_lain', v)} />
            )}
            <Select label="8. Apakah keluarga termasuk keluarga kurang mampu?" value={G.kurang_mampu} onChange={v => upd('sosial_ekonomi', 'kurang_mampu', v)} options={YA_TIDAK_VERIFIKASI} />
            <Checkbox label="9. Dokumen pendukung kondisi ekonomi (jika dipersyaratkan)" options={DOKUMEN_EKONOMI_KEDINASAN} values={G.dokumen_ekonomi} onToggle={opt => toggleArr('sosial_ekonomi', 'dokumen_ekonomi', opt)} />
            {G.dokumen_ekonomi.some(h => /lainnya/i.test(h)) && (
              <div className="md:col-span-2">
                <input type="text" value={G.dokumen_ekonomi_lain} onChange={e => upd('sosial_ekonomi', 'dokumen_ekonomi_lain', e.target.value)} placeholder="Sebutkan dokumen pendukung lainnya..." className={inputCls} />
              </div>
            )}
            <Area label="10. Uraian singkat kondisi yang memengaruhi kemampuan mengikuti bimbel" value={G.uraian_kondisi} onChange={v => upd('sosial_ekonomi', 'uraian_kondisi', v)} rows={3} />
          </div>
        </section>

        {/* ===== H. RIWAYAT BANTUAN PENDIDIKAN ===== */}
        <section>
          <SectionTitle code="H" title="Riwayat Bantuan Pendidikan" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="1. Sedang menerima bantuan pendidikan/persiapan seleksi lain?" value={H.menerima} onChange={v => upd('bantuan', 'menerima', v)} options={['Tidak', 'Ya']} colSpan="md:col-span-2" />
            {H.menerima === 'Ya' && (
              <>
                <Text label="2. Nama program bantuan" value={H.nama_program} onChange={v => upd('bantuan', 'nama_program', v)} />
                <Text label="3. Sumber bantuan" value={H.sumber} onChange={v => upd('bantuan', 'sumber', v)} />
                <Text label="4. Periode dan besaran bantuan (jika diketahui)" value={H.periode_besaran} onChange={v => upd('bantuan', 'periode_besaran', v)} colSpan="md:col-span-2" />
                <Select label="5. Apakah bantuan tersebut membiayai komponen bimbel yang sama?" value={H.biayai_bimbel} onChange={v => upd('bantuan', 'biayai_bimbel', v)} options={BIAYAI_BIMBEL} colSpan="md:col-span-2" />
              </>
            )}
            <Area label="Keterangan tambahan" value={H.keterangan} onChange={v => upd('bantuan', 'keterangan', v)} />
          </div>
        </section>

        {/* ===== I. PERNYATAAN KESANGGUPAN ===== */}
        <section>
          <SectionTitle code="I" title="Pernyataan Kesanggupan Peserta" />
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-2xl p-5">
            <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
              <AlertCircle size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
              <p>Unduh template surat pernyataan kesanggupan, isi dan mintakan tanda tangan peserta (serta orang tua/wali bila dipersyaratkan), lalu unggah kembali surat yang sudah ditandatangani.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Text label="Nama lengkap" req value={I.nama} onChange={v => upd('pernyataan', 'nama', v)} />
              <Text label="NIK" value={I.nik} onChange={v => upd('pernyataan', 'nik', v)} />
              <Text label="Alamat" value={I.alamat} onChange={v => upd('pernyataan', 'alamat', v)} colSpan="md:col-span-2" />
              <Text label="Tempat" value={I.tempat} onChange={v => upd('pernyataan', 'tempat', v)} placeholder="Kota penerbitan" />
              <Text label="Tanggal" type="date" value={I.tanggal} onChange={v => upd('pernyataan', 'tanggal', v)} />
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

        {/* ===== LAMPIRAN ===== */}
        <section>
          <SectionTitle code="📎" title="Lampiran: Daftar Periksa Dokumen" />
          <p className="text-sm text-slate-500 mb-4">Beri unggahan pada dokumen yang diserahkan.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LAMPIRAN_DOKUMEN_KEDINASAN.map(doc => (
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

export default PaceSiswaFormKedinasan;
