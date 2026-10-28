import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { uploadDokumen } from '../../lib/upload';
import {
  initialFormSnk, buildPernyataanSnkHtml, LAMPIRAN_DOKUMEN_SNK,
  JENIS_KELAMIN, AGAMA, STATUS_TINGGAL_SNK, JENJANG_SNK, STATUS_PESERTA_SNK,
  STATUS_OAP, DASAR_OAP_SNK, PEKERJAAN_ORTU_SNK, PENGHASILAN, STATUS_RUMAH,
  DOKUMEN_EKONOMI, KEBUTUHAN_BEASISWA, JENIS_REKENING,
  VERIF_IDENTITAS, VERIF_STATUS_AKTIF, VERIF_KETUASAN, VERIF_OAP, VERIF_KELENGKAPAN,
} from '../../lib/paceSiswaFormSnk';
import {
  inputCls, Label, Text, Select, Area, SectionTitle, UploadBox,
} from './PaceFormInputs';

/* ---------- Komponen utama form SNK ---------- */
const PaceSiswaFormSnk = ({ onCancel, onSubmit, initialValue = null, submitLabel = 'Kirim Pendaftaran' }) => {
  // Gabungkan data tersimpan (edit) di atas default (create)
  const seed = () => {
    const base = initialFormSnk();
    if (!initialValue) return base;
    const iv = initialValue;
    return {
      ...base,
      ...iv,
      identitas: { ...base.identitas, ...(iv.identitas || {}) },
      satuan_pendidikan: { ...base.satuan_pendidikan, ...(iv.satuan_pendidikan || {}) },
      oap: { ...base.oap, ...(iv.oap || {}) },
      orang_tua: {
        ...base.orang_tua, ...(iv.orang_tua || {}),
        ayah: { ...base.orang_tua.ayah, ...(iv.orang_tua?.ayah || {}) },
        ibu: { ...base.orang_tua.ibu, ...(iv.orang_tua?.ibu || {}) },
        wali: { ...base.orang_tua.wali, ...(iv.orang_tua?.wali || {}) },
      },
      sosial_ekonomi: { ...base.sosial_ekonomi, ...(iv.sosial_ekonomi || {}) },
      rencana_beasiswa: { ...base.rencana_beasiswa, ...(iv.rencana_beasiswa || {}) },
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
    identitas: A, satuan_pendidikan: B, oap: C, orang_tua: D, sosial_ekonomi: E,
    rencana_beasiswa: F, rekening: G, pernyataan: H, verifikasi: I,
  } = form;

  const downloadTemplate = () => {
    const html = buildPernyataanSnkHtml(form);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Surat-Pernyataan-Peserta-Didik-dan-Orang-Tua-Wali-SNK.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!A.nama?.trim()) { setMessage('Nama lengkap peserta didik wajib diisi.'); return; }
    if (!A.tempat_lahir || !A.tanggal_lahir) { setMessage('Tempat dan tanggal lahir wajib diisi.'); return; }
    if (!B.nama_sekolah?.trim()) { setMessage('Nama Sekolah Negeri Khusus (SNK) wajib diisi.'); return; }
    if (!files.surat_pernyataan && !form.dokumen?.surat_pernyataan) { setMessage('Surat pernyataan peserta didik dan orang tua/wali (bagian H) wajib diunggah setelah ditandatangani.'); return; }

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
        // field legasi untuk tabel & kartu
        _legacy: {
          nama: A.nama, nisn: A.nisn || null, nik: A.nik || null,
          tempat_lahir: A.tempat_lahir, tanggal_lahir: A.tanggal_lahir,
          kelas: B.kelas || '-', alamat: A.alamat || '-',
          nama_orang_tua: D.ayah.nama || D.wali.nama || '-',
          no_hp_orang_tua: A.no_hp_ortu || D.ayah.telepon || D.wali.telepon || '-',
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

        {/* ===== A. IDENTITAS PESERTA DIDIK ===== */}
        <section>
          <SectionTitle code="A" title="Identitas Peserta Didik" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Nama lengkap sesuai dokumen kependudukan" req value={A.nama} onChange={v => upd('identitas', 'nama', v)} colSpan="md:col-span-2" />
            <Text label="NISN" value={A.nisn} onChange={v => upd('identitas', 'nisn', v)} />
            <Text label="NIK (jika tersedia)" value={A.nik} onChange={v => upd('identitas', 'nik', v)} />
            <Text label="Tempat lahir" req value={A.tempat_lahir} onChange={v => upd('identitas', 'tempat_lahir', v)} />
            <Text label="Tanggal lahir" req type="date" value={A.tanggal_lahir} onChange={v => upd('identitas', 'tanggal_lahir', v)} />
            <Select label="Jenis kelamin" req value={A.jenis_kelamin} onChange={v => upd('identitas', 'jenis_kelamin', v)} options={JENIS_KELAMIN} />
            <Select label="Agama" value={A.agama} onChange={v => upd('identitas', 'agama', v)} options={AGAMA} />
            <Area label="Alamat tempat tinggal lengkap" value={A.alamat} onChange={v => upd('identitas', 'alamat', v)} />
            <Text label="Kampung/Kelurahan" value={A.kampung_kelurahan} onChange={v => upd('identitas', 'kampung_kelurahan', v)} />
            <Text label="Distrik/Kecamatan" value={A.distrik_kecamatan} onChange={v => upd('identitas', 'distrik_kecamatan', v)} />
            <Text label="Kabupaten/Kota" value={A.kabupaten_kota} onChange={v => upd('identitas', 'kabupaten_kota', v)} />
            <Text label="Nomor telepon peserta didik (jika ada)" value={A.no_hp_siswa} onChange={v => upd('identitas', 'no_hp_siswa', v)} />
            <Text label="Nomor telepon orang tua/wali" value={A.no_hp_ortu} onChange={v => upd('identitas', 'no_hp_ortu', v)} />
            <Select label="Status tempat tinggal saat ini" value={A.status_tinggal} onChange={v => upd('identitas', 'status_tinggal', v)} options={STATUS_TINGGAL_SNK} />
            {A.status_tinggal === 'Lainnya' && (
              <Text label="Lainnya" value={A.status_tinggal_lain} onChange={v => upd('identitas', 'status_tinggal_lain', v)} />
            )}
          </div>
        </section>

        {/* ===== B. DATA SATUAN PENDIDIKAN ===== */}
        <section>
          <SectionTitle code="B" title="Data Satuan Pendidikan" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Nama Sekolah Negeri Khusus (SNK)" req value={B.nama_sekolah} onChange={v => upd('satuan_pendidikan', 'nama_sekolah', v)} colSpan="md:col-span-2" />
            <Text label="Nomor Pokok Sekolah Nasional (NPSN)" value={B.npsn} onChange={v => upd('satuan_pendidikan', 'npsn', v)} />
            <Text label="Kabupaten/Kota sekolah" value={B.kabupaten_kota} onChange={v => upd('satuan_pendidikan', 'kabupaten_kota', v)} />
            <Area label="Alamat sekolah" value={B.alamat} onChange={v => upd('satuan_pendidikan', 'alamat', v)} />
            <Select label="Jenjang pendidikan" value={B.jenjang} onChange={v => upd('satuan_pendidikan', 'jenjang', v)} options={JENJANG_SNK} />
            {B.jenjang?.includes('lainnya') && (
              <Text label="Jenjang/bentuk pendidikan lainnya" value={B.jenjang_lain} onChange={v => upd('satuan_pendidikan', 'jenjang_lain', v)} />
            )}
            <Text label="Program keahlian/konsentrasi keahlian" value={B.program_keahlian} onChange={v => upd('satuan_pendidikan', 'program_keahlian', v)} colSpan="md:col-span-2" />
            <Text label="Kelas saat ini" value={B.kelas} onChange={v => upd('satuan_pendidikan', 'kelas', v)} />
            <Text label="Tahun masuk sekolah" type="number" value={B.tahun_masuk} onChange={v => upd('satuan_pendidikan', 'tahun_masuk', v)} placeholder="Contoh: 2023" />
            <Select label="Status peserta didik" value={B.status_didik} onChange={v => upd('satuan_pendidikan', 'status_didik', v)} options={STATUS_PESERTA_SNK} />
            <Text label="Rata-rata nilai rapor terakhir (jika dipersyaratkan)" value={B.rata_rapor} onChange={v => upd('satuan_pendidikan', 'rata_rapor', v)} />
            <Area label="Prestasi akademik/nonakademik yang pernah diraih" value={B.prestasi} onChange={v => upd('satuan_pendidikan', 'prestasi', v)} rows={3} />
            <Select label="Sedang menerima bantuan pendidikan lain?" value={B.menerima_bantuan} onChange={v => upd('satuan_pendidikan', 'menerima_bantuan', v)} options={['Tidak', 'Ya']} colSpan="md:col-span-2" />
            {B.menerima_bantuan === 'Ya' && (
              <>
                <Text label="Nama program bantuan" value={B.nama_bantuan} onChange={v => upd('satuan_pendidikan', 'nama_bantuan', v)} />
                <Text label="Sumber bantuan" value={B.sumber_bantuan} onChange={v => upd('satuan_pendidikan', 'sumber_bantuan', v)} />
                <Text label="Periode bantuan" value={B.periode_bantuan} onChange={v => upd('satuan_pendidikan', 'periode_bantuan', v)} colSpan="md:col-span-2" />
              </>
            )}
          </div>
        </section>

        {/* ===== C. STATUS OAP ===== */}
        <section>
          <SectionTitle code="C" title="Data Status Orang Asli Papua (OAP)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Status peserta didik" value={C.status} onChange={v => upd('oap', 'status', v)} options={STATUS_OAP} />
            <Text label="Nama suku/keret (jika diketahui)" value={C.asal_suku} onChange={v => upd('oap', 'asal_suku', v)} />
            <Text label="Asal kampung atau wilayah adat keluarga" value={C.asal_kampung} onChange={v => upd('oap', 'asal_kampung', v)} colSpan="md:col-span-2" />
            <div className="md:col-span-2">
              <Label>Dokumen pendukung status OAP yang tersedia</Label>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                {DASAR_OAP_SNK.map(opt => (
                  <label key={opt} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-brand-blue" checked={C.dasar_dokumen.includes(opt)} onChange={() => toggleArr('oap', 'dasar_dokumen', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {C.dasar_dokumen.some(h => /lain yang sah/i.test(h)) && (
                <input type="text" value={C.dasar_dokumen_lain} onChange={e => upd('oap', 'dasar_dokumen_lain', e.target.value)} placeholder="Sebutkan dokumen pendukung lain yang sah..." className={inputCls + ' mt-3'} />
              )}
            </div>
            <Area label="Keterangan tambahan" value={C.keterangan} onChange={v => upd('oap', 'keterangan', v)} />
            <p className="md:col-span-2 text-xs text-slate-400 italic">
              Status OAP diverifikasi oleh petugas berdasarkan dokumen dan ketentuan yang berlaku. Prioritas afirmasi OAP dilaksanakan sesuai petunjuk teknis program.
            </p>
          </div>
        </section>

        {/* ===== D. ORANG TUA / WALI ===== */}
        <section>
          <SectionTitle code="D" title="Identitas Orang Tua/Wali" />
          <div className="space-y-6">
            {['ayah', 'ibu'].map(role => (
              <div key={role}>
                <p className="text-sm font-bold text-brand-blue capitalize mb-3">Data {role}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Text label="Nama lengkap" value={D[role].nama} onChange={v => updParent('orang_tua', role, 'nama', v)} />
                  <Text label="NIK (jika tersedia)" value={D[role].nik} onChange={v => updParent('orang_tua', role, 'nik', v)} />
                  <Text label="Pekerjaan" value={D[role].pekerjaan} onChange={v => updParent('orang_tua', role, 'pekerjaan', v)} />
                  <Text label="Pendidikan terakhir" value={D[role].pendidikan} onChange={v => updParent('orang_tua', role, 'pendidikan', v)} />
                  <Text label="Nomor telepon" value={D[role].telepon} onChange={v => updParent('orang_tua', role, 'telepon', v)} />
                </div>
              </div>
            ))}
            <div>
              <p className="text-sm font-bold text-brand-blue mb-3">Data Wali (jika ada)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Text label="Nama lengkap" value={D.wali.nama} onChange={v => updParent('orang_tua', 'wali', 'nama', v)} />
                <Text label="Hubungan dengan peserta didik" value={D.wali.hubungan} onChange={v => updParent('orang_tua', 'wali', 'hubungan', v)} />
                <Text label="NIK (jika tersedia)" value={D.wali.nik} onChange={v => updParent('orang_tua', 'wali', 'nik', v)} />
                <Text label="Pekerjaan" value={D.wali.pekerjaan} onChange={v => updParent('orang_tua', 'wali', 'pekerjaan', v)} />
                <Text label="Nomor telepon" value={D.wali.telepon} onChange={v => updParent('orang_tua', 'wali', 'telepon', v)} />
                <Text label="Alamat" value={D.wali.alamat} onChange={v => updParent('orang_tua', 'wali', 'alamat', v)} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== E. KONDISI SOSIAL EKONOMI ===== */}
        <section>
          <SectionTitle code="E" title="Kondisi Sosial Ekonomi Keluarga" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Pekerjaan utama orang tua/wali" value={E.pekerjaan_ortu} onChange={v => upd('sosial_ekonomi', 'pekerjaan_ortu', v)} options={PEKERJAAN_ORTU_SNK} />
            {E.pekerjaan_ortu?.includes('lainnya') && (
              <Text label="Pekerjaan lainnya" value={E.pekerjaan_ortu_lain} onChange={v => upd('sosial_ekonomi', 'pekerjaan_ortu_lain', v)} />
            )}
            <Select label="Perkiraan penghasilan gabungan orang tua/wali per bulan" value={E.penghasilan} onChange={v => upd('sosial_ekonomi', 'penghasilan', v)} options={PENGHASILAN} colSpan="md:col-span-2" />
            <Text label="Jumlah anggota keluarga yang menjadi tanggungan (orang)" type="number" value={E.jml_tanggungan} onChange={v => upd('sosial_ekonomi', 'jml_tanggungan', v)} />
            <Text label="Jumlah anak yang masih bersekolah (orang)" type="number" value={E.jml_anak_sekolah} onChange={v => upd('sosial_ekonomi', 'jml_anak_sekolah', v)} />
            <Select label="Status tempat tinggal keluarga" value={E.status_tinggal} onChange={v => upd('sosial_ekonomi', 'status_tinggal', v)} options={STATUS_RUMAH} />
            {E.status_tinggal === 'Lainnya' && (
              <Text label="Lainnya" value={E.status_tinggal_lain} onChange={v => upd('sosial_ekonomi', 'status_tinggal_lain', v)} />
            )}
            <Select label="Apakah keluarga termasuk keluarga kurang mampu?" value={E.kurang_mampu} onChange={v => upd('sosial_ekonomi', 'kurang_mampu', v)} options={['Ya', 'Tidak', 'Dalam proses verifikasi']} />
            <div className="md:col-span-2">
              <Label>Dokumen pendukung kondisi ekonomi (jika dipersyaratkan)</Label>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                {DOKUMEN_EKONOMI.map(opt => (
                  <label key={opt} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-brand-blue" checked={E.dokumen_ekonomi.includes(opt)} onChange={() => toggleArr('sosial_ekonomi', 'dokumen_ekonomi', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {E.dokumen_ekonomi.some(h => /lain yang sah/i.test(h)) && (
                <input type="text" value={E.dokumen_ekonomi_lain} onChange={e => upd('sosial_ekonomi', 'dokumen_ekonomi_lain', e.target.value)} placeholder="Sebutkan dokumen pendukung lain yang sah..." className={inputCls + ' mt-3'} />
              )}
            </div>
            <Area label="Penjelasan tambahan mengenai kondisi ekonomi keluarga" value={E.penjelasan} onChange={v => upd('sosial_ekonomi', 'penjelasan', v)} rows={3} />
          </div>
        </section>

        {/* ===== F. RENCANA PENGGUNAAN BEASISWA ===== */}
        <section>
          <SectionTitle code="F" title="Rencana Penggunaan Beasiswa" />
          <p className="text-sm text-slate-500 mb-4">
            Apabila ditetapkan sebagai penerima Beasiswa PACE, bantuan akan dimanfaatkan untuk mendukung kebutuhan pendidikan sesuai komponen bantuan yang ditetapkan dalam petunjuk teknis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Kebutuhan pendidikan yang dihadapi peserta didik</Label>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                {KEBUTUHAN_BEASISWA.map(opt => (
                  <label key={opt} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-brand-blue" checked={F.kebutuhan.includes(opt)} onChange={() => toggleArr('rencana_beasiswa', 'kebutuhan', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {F.kebutuhan.some(h => /lainnya/i.test(h)) && (
                <input type="text" value={F.kebutuhan_lain} onChange={e => upd('rencana_beasiswa', 'kebutuhan_lain', e.target.value)} placeholder="Sebutkan kebutuhan pendidikan lainnya..." className={inputCls + ' mt-3'} />
              )}
            </div>
            <Area label="Uraian singkat kebutuhan prioritas" value={F.uraian} onChange={v => upd('rencana_beasiswa', 'uraian', v)} rows={3} />
          </div>
        </section>

        {/* ===== G. DATA REKENING ===== */}
        <section>
          <SectionTitle code="G" title="Data Rekening Penerima (Jika Dipersyaratkan)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Nama pemilik rekening" value={G.pemilik} onChange={v => upd('rekening', 'pemilik', v)} />
            <Text label="Nama bank" value={G.nama_bank} onChange={v => upd('rekening', 'nama_bank', v)} />
            <Text label="Nomor rekening" value={G.nomor_rekening} onChange={v => upd('rekening', 'nomor_rekening', v)} />
            <Text label="Hubungan pemilik rekening dengan peserta didik" value={G.hubungan} onChange={v => upd('rekening', 'hubungan', v)} />
            <Select label="Jenis rekening" value={G.jenis} onChange={v => upd('rekening', 'jenis', v)} options={JENIS_REKENING} colSpan="md:col-span-2" />
            <p className="md:col-span-2 text-xs text-slate-400 italic">
              Pengisian dan penetapan rekening mengikuti mekanisme penyaluran bantuan yang ditetapkan oleh Dinas Pendidikan Provinsi Papua. Jangan mencantumkan PIN, kata sandi, atau kode OTP.
            </p>
          </div>
        </section>

        {/* ===== H. PERNYATAAN ===== */}
        <section>
          <SectionTitle code="H" title="Pernyataan Peserta Didik dan Orang Tua/Wali" />
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-2xl p-5">
            <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
              <AlertCircle size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
              <p>Unduh template surat pernyataan, isi dan mintakan tanda tangan peserta didik serta orang tua/wali (bermaterai bila dipersyaratkan), lalu unggah kembali surat yang sudah ditandatangani.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Text label="Nama peserta didik" req value={H.nama_siswa} onChange={v => upd('pernyataan', 'nama_siswa', v)} />
              <Text label="Nama orang tua/wali" value={H.nama_ortu} onChange={v => upd('pernyataan', 'nama_ortu', v)} />
              <Text label="Hubungan dengan peserta didik" value={H.hubungan} onChange={v => upd('pernyataan', 'hubungan', v)} placeholder="Ayah / Ibu / Wali" />
              <Text label="Tempat" value={H.tempat} onChange={v => upd('pernyataan', 'tempat', v)} placeholder="Kota penerbitan" />
              <Text label="Tanggal" type="date" value={H.tanggal} onChange={v => upd('pernyataan', 'tanggal', v)} />
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

        {/* ===== I. VERIFIKASI OPERATOR DINAS ===== */}
        <section>
          <SectionTitle code="I" title="Verifikasi Operator Dinas" />
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start gap-2 text-sm text-slate-500 mb-4">
              <ShieldCheck size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <p>Bagian ini diisi oleh operator dinas/sekolah pada saat verifikasi. Dapat dibiarkan kosong pada saat pendaftaran.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Text label="Nama sekolah" value={I.nama_sekolah} onChange={v => upd('verifikasi', 'nama_sekolah', v)} />
              <Text label="Nama operator" value={I.nama_operator} onChange={v => upd('verifikasi', 'nama_operator', v)} />
              <Text label="NIP/NIK atau identitas petugas" value={I.nip} onChange={v => upd('verifikasi', 'nip', v)} />
              <Text label="Jabatan" value={I.jabatan} onChange={v => upd('verifikasi', 'jabatan', v)} />
            </div>
            <p className="text-sm font-bold text-slate-700 mt-5 mb-2">Hasil verifikasi</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="1. Kesesuaian identitas peserta didik" value={I.identitas_sesuai} onChange={v => upd('verifikasi', 'identitas_sesuai', v)} options={VERIF_IDENTITAS} />
              <Select label="2. Status peserta didik aktif" value={I.status_aktif} onChange={v => upd('verifikasi', 'status_aktif', v)} options={VERIF_STATUS_AKTIF} />
              <Select label="3. Kesesuaian data sekolah & program keahlian" value={I.kesesuaian_sekolah} onChange={v => upd('verifikasi', 'kesesuaian_sekolah', v)} options={VERIF_KETUASAN} />
              <Select label="4. Status OAP" value={I.status_oap} onChange={v => upd('verifikasi', 'status_oap', v)} options={VERIF_OAP} />
              <Select label="5. Kelengkapan dokumen" value={I.kelengkapan_dokumen} onChange={v => upd('verifikasi', 'kelengkapan_dokumen', v)} options={VERIF_KELENGKAPAN} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Area label="Catatan hasil verifikasi" value={I.catatan} onChange={v => upd('verifikasi', 'catatan', v)} rows={3} />
              <Text label="Tempat" value={I.tempat} onChange={v => upd('verifikasi', 'tempat', v)} />
              <Text label="Tanggal" type="date" value={I.tanggal} onChange={v => upd('verifikasi', 'tanggal', v)} />
              <Text label="Nama operator (penanda tangan)" value={I.nama_operator_ttd} onChange={v => upd('verifikasi', 'nama_operator_ttd', v)} />
              <Text label="Mengetahui, Nama kepala sekolah" value={I.nama_kepala_sekolah} onChange={v => upd('verifikasi', 'nama_kepala_sekolah', v)} />
            </div>
          </div>
        </section>

        {/* ===== LAMPIRAN ===== */}
        <section>
          <SectionTitle code="📎" title="Lampiran: Daftar Periksa Dokumen" />
          <p className="text-sm text-slate-500 mb-4">Beri unggahan pada dokumen yang diserahkan.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LAMPIRAN_DOKUMEN_SNK.map(doc => (
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

export default PaceSiswaFormSnk;
