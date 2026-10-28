import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDokumen } from '../../lib/upload';
import {
  initialForm, buildPernyataanHtml, LAMPIRAN_DOKUMEN,
  JENIS_KELAMIN, AGAMA, JENJANG, STATUS_PESERTA, HAMBATAN, DOKUMEN_KEBUTUHAN,
  STATUS_TEMPAT_TINGGAL_DIDIK, STATUS_OAP, DASAR_OAP, PEKERJAAN_ORTU,
  PENGHASILAN, STATUS_RUMAH, YA_TIDAK_VERIFIKASI, JENIS_REKENING,
} from '../../lib/paceSiswaForm';
import {
  inputCls, Label, Text, Select, Area, SectionTitle, UploadBox,
} from './PaceFormInputs';

/* ---------- Komponen utama form ---------- */
const PaceSiswaForm = ({ onCancel, onSubmit, initialValue = null, submitLabel = 'Kirim Pendaftaran' }) => {
  // Gabungkan data tersimpan (edit) di atas default (create)
  const seed = () => {
    const base = initialForm();
    if (!initialValue) return base;
    const iv = initialValue;
    return {
      ...base,
      ...iv,
      identitas: { ...base.identitas, ...(iv.identitas || {}) },
      kebutuhan_khusus: { ...base.kebutuhan_khusus, ...(iv.kebutuhan_khusus || {}) },
      orang_tua: {
        ...base.orang_tua, ...(iv.orang_tua || {}),
        ayah: { ...base.orang_tua.ayah, ...(iv.orang_tua?.ayah || {}) },
        ibu: { ...base.orang_tua.ibu, ...(iv.orang_tua?.ibu || {}) },
        wali: { ...base.orang_tua.wali, ...(iv.orang_tua?.wali || {}) },
      },
      oap: { ...base.oap, ...(iv.oap || {}) },
      sosial_ekonomi: { ...base.sosial_ekonomi, ...(iv.sosial_ekonomi || {}) },
      rekening: { ...base.rekening, ...(iv.rekening || {}) },
      pernyataan: { ...base.pernyataan, ...(iv.pernyataan || {}) },
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

  const { identitas: A, kebutuhan_khusus: B, orang_tua: C, oap: D, sosial_ekonomi: E, rekening: F, pernyataan: G } = form;

  const downloadTemplate = () => {
    const html = buildPernyataanHtml(form);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Surat-Pernyataan-Orang-Tua-Wali-PACE.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!A.nama?.trim()) { setMessage('Nama lengkap peserta didik wajib diisi.'); return; }
    if (!A.tempat_lahir || !A.tanggal_lahir) { setMessage('Tempat dan tanggal lahir wajib diisi.'); return; }
    if (!files.surat_pernyataan && !form.dokumen?.surat_pernyataan) { setMessage('Surat pernyataan orang tua/wali (bagian G) wajib diunggah setelah ditandatangani.'); return; }

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
          kelas: A.kelas || '-', alamat: A.alamat || '-',
          nama_orang_tua: C.ayah.nama || C.wali.nama || '-',
          no_hp_orang_tua: A.no_hp_ortu || C.ayah.telepon || C.wali.telepon || '-',
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
            <Text label="Nama lengkap" req value={A.nama} onChange={v => upd('identitas', 'nama', v)} colSpan="md:col-span-2" />
            <Text label="NISN (jika ada)" value={A.nisn} onChange={v => upd('identitas', 'nisn', v)} />
            <Text label="NIK (jika ada)" value={A.nik} onChange={v => upd('identitas', 'nik', v)} />
            <Text label="Tempat lahir" req value={A.tempat_lahir} onChange={v => upd('identitas', 'tempat_lahir', v)} />
            <Text label="Tanggal lahir" req type="date" value={A.tanggal_lahir} onChange={v => upd('identitas', 'tanggal_lahir', v)} />
            <Select label="Jenis kelamin" req value={A.jenis_kelamin} onChange={v => upd('identitas', 'jenis_kelamin', v)} options={JENIS_KELAMIN} />
            <Select label="Agama" value={A.agama} onChange={v => upd('identitas', 'agama', v)} options={AGAMA} />
            <Area label="Alamat tempat tinggal" value={A.alamat} onChange={v => upd('identitas', 'alamat', v)} />
            <Text label="Kampung/Kelurahan" value={A.kampung_kelurahan} onChange={v => upd('identitas', 'kampung_kelurahan', v)} />
            <Text label="Distrik/Kecamatan" value={A.distrik_kecamatan} onChange={v => upd('identitas', 'distrik_kecamatan', v)} />
            <Text label="Kabupaten/Kota" value={A.kabupaten_kota} onChange={v => upd('identitas', 'kabupaten_kota', v)} />
            <Text label="Nomor telepon orang tua/wali" value={A.no_hp_ortu} onChange={v => upd('identitas', 'no_hp_ortu', v)} />
            <Select label="Jenjang pendidikan saat ini" value={A.jenjang} onChange={v => upd('identitas', 'jenjang', v)} options={JENJANG} />
            {A.jenjang?.includes('lainnya') && (
              <Text label="Bentuk layanan pendidikan khusus lainnya" value={A.jenjang_lain} onChange={v => upd('identitas', 'jenjang_lain', v)} />
            )}
            <Text label="Kelas saat ini" value={A.kelas} onChange={v => upd('identitas', 'kelas', v)} />
            <Select label="Status peserta didik" value={A.status_didik} onChange={v => upd('identitas', 'status_didik', v)} options={STATUS_PESERTA} />
            {A.status_didik === 'Lainnya' && (
              <Text label="Status lainnya" value={A.status_didik_lain} onChange={v => upd('identitas', 'status_didik_lain', v)} />
            )}
            <Text label="Tahun masuk SLB" type="number" value={A.tahun_masuk} onChange={v => upd('identitas', 'tahun_masuk', v)} placeholder="Contoh: 2023" />
          </div>
        </section>

        {/* ===== B. KEBUTUHAN KHUSUS ===== */}
        <section>
          <SectionTitle code="B" title="Identitas dan Kondisi Kebutuhan Khusus Peserta Didik" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Jenis hambatan/kebutuhan khusus berdasarkan keterangan atau asesmen</Label>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                {HAMBATAN.map(opt => (
                  <label key={opt} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-brand-blue" checked={B.hambatan.includes(opt)} onChange={() => toggleArr('kebutuhan_khusus', 'hambatan', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {B.hambatan.some(h => /lainnya/i.test(h)) && (
                <input type="text" value={B.hambatan_lain} onChange={e => upd('kebutuhan_khusus', 'hambatan_lain', e.target.value)} placeholder="Sebutkan hambatan/kebutuhan khusus lainnya..." className={inputCls + ' mt-3'} />
              )}
            </div>
            <Area label="Keterangan pendukung atau kebutuhan layanan pendidikan khusus" value={B.keterangan_layanan} onChange={v => upd('kebutuhan_khusus', 'keterangan_layanan', v)} rows={3} />
            <div className="md:col-span-2">
              <Label>Dokumen pendukung kondisi/kebutuhan khusus yang tersedia</Label>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                {DOKUMEN_KEBUTUHAN.map(opt => (
                  <label key={opt} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-brand-blue" checked={B.dokumen_pendukung.includes(opt)} onChange={() => toggleArr('kebutuhan_khusus', 'dokumen_pendukung', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {B.dokumen_pendukung.some(h => /lainnya/i.test(h)) && (
                <input type="text" value={B.dokumen_pendukung_lain} onChange={e => upd('kebutuhan_khusus', 'dokumen_pendukung_lain', e.target.value)} placeholder="Sebutkan dokumen pendukung lainnya..." className={inputCls + ' mt-3'} />
              )}
            </div>
          </div>
        </section>

        {/* ===== C. ORANG TUA / WALI ===== */}
        <section>
          <SectionTitle code="C" title="Identitas Orang Tua/Wali" />
          <div className="space-y-6">
            {['ayah', 'ibu'].map(role => (
              <div key={role}>
                <p className="text-sm font-bold text-brand-blue capitalize mb-3">{role}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Text label="Nama lengkap" value={C[role].nama} onChange={v => updParent('orang_tua', role, 'nama', v)} />
                  <Text label="NIK (jika ada)" value={C[role].nik} onChange={v => updParent('orang_tua', role, 'nik', v)} />
                  <Text label="Pekerjaan" value={C[role].pekerjaan} onChange={v => updParent('orang_tua', role, 'pekerjaan', v)} />
                  <Text label="Pendidikan terakhir" value={C[role].pendidikan} onChange={v => updParent('orang_tua', role, 'pendidikan', v)} />
                  <Text label="Nomor telepon" value={C[role].telepon} onChange={v => updParent('orang_tua', role, 'telepon', v)} />
                </div>
              </div>
            ))}
            <div>
              <p className="text-sm font-bold text-brand-blue mb-3">Wali (jika ada)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Text label="Nama lengkap" value={C.wali.nama} onChange={v => updParent('orang_tua', 'wali', 'nama', v)} />
                <Text label="Hubungan dengan peserta didik" value={C.wali.hubungan} onChange={v => updParent('orang_tua', 'wali', 'hubungan', v)} />
                <Text label="NIK (jika ada)" value={C.wali.nik} onChange={v => updParent('orang_tua', 'wali', 'nik', v)} />
                <Text label="Pekerjaan" value={C.wali.pekerjaan} onChange={v => updParent('orang_tua', 'wali', 'pekerjaan', v)} />
                <Text label="Nomor telepon" value={C.wali.telepon} onChange={v => updParent('orang_tua', 'wali', 'telepon', v)} />
                <Text label="Alamat" value={C.wali.alamat} onChange={v => updParent('orang_tua', 'wali', 'alamat', v)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Status tempat tinggal peserta didik" value={C.status_tempat_tinggal} onChange={v => upd('orang_tua', 'status_tempat_tinggal', v)} options={STATUS_TEMPAT_TINGGAL_DIDIK} />
              {C.status_tempat_tinggal === 'Lainnya' && (
                <Text label="Lainnya" value={C.status_tempat_tinggal_lain} onChange={v => upd('orang_tua', 'status_tempat_tinggal_lain', v)} />
              )}
            </div>
          </div>
        </section>

        {/* ===== D. OAP ===== */}
        <section>
          <SectionTitle code="D" title="Identitas dan Status Orang Asli Papua (OAP)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Status OAP peserta didik" value={D.status} onChange={v => upd('oap', 'status', v)} options={STATUS_OAP} />
            <Text label="Asal suku/keret peserta didik (jika diketahui)" value={D.asal_suku} onChange={v => upd('oap', 'asal_suku', v)} />
            <Text label="Asal kampung atau wilayah adat keluarga" value={D.asal_kampung} onChange={v => upd('oap', 'asal_kampung', v)} colSpan="md:col-span-2" />
            <div className="md:col-span-2">
              <Label>Dasar atau dokumen pendukung status OAP</Label>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                {DASAR_OAP.map(opt => (
                  <label key={opt} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-brand-blue" checked={D.dasar_dokumen.includes(opt)} onChange={() => toggleArr('oap', 'dasar_dokumen', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {D.dasar_dokumen.some(h => /lain yang sah/i.test(h)) && (
                <input type="text" value={D.dasar_dokumen_lain} onChange={e => upd('oap', 'dasar_dokumen_lain', e.target.value)} placeholder="Sebutkan dokumen pendukung lain yang sah..." className={inputCls + ' mt-3'} />
              )}
            </div>
            <Area label="Keterangan tambahan" value={D.keterangan} onChange={v => upd('oap', 'keterangan', v)} />
          </div>
        </section>

        {/* ===== E. SOSIAL EKONOMI ===== */}
        <section>
          <SectionTitle code="E" title="Informasi Kondisi Sosial Ekonomi Keluarga" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Pekerjaan utama orang tua/wali" value={E.pekerjaan_ortu} onChange={v => upd('sosial_ekonomi', 'pekerjaan_ortu', v)} options={PEKERJAAN_ORTU} />
            {E.pekerjaan_ortu?.includes('lainnya') && (
              <Text label="Pekerjaan lainnya" value={E.pekerjaan_ortu_lain} onChange={v => upd('sosial_ekonomi', 'pekerjaan_ortu_lain', v)} />
            )}
            <Select label="Perkiraan penghasilan orang tua/wali per bulan" value={E.penghasilan} onChange={v => upd('sosial_ekonomi', 'penghasilan', v)} options={PENGHASILAN} colSpan="md:col-span-2" />
            <Select label="Status tempat tinggal keluarga" value={E.status_tinggal} onChange={v => upd('sosial_ekonomi', 'status_tinggal', v)} options={STATUS_RUMAH} />
            {E.status_tinggal === 'Lainnya' && (
              <Text label="Lainnya" value={E.status_tinggal_lain} onChange={v => upd('sosial_ekonomi', 'status_tinggal_lain', v)} />
            )}
            <Text label="Jumlah anggota keluarga (orang)" type="number" value={E.jml_anggota} onChange={v => upd('sosial_ekonomi', 'jml_anggota', v)} />
            <Text label="Jumlah anak yang masih bersekolah (orang)" type="number" value={E.jml_anak_sekolah} onChange={v => upd('sosial_ekonomi', 'jml_anak_sekolah', v)} />
            <Text label="Anggota keluarga yang butuh dukungan khusus (orang)" type="number" value={E.jml_dukungan_khusus} onChange={v => upd('sosial_ekonomi', 'jml_dukungan_khusus', v)} />
            <Select label="Peserta didik dari keluarga kurang mampu?" value={E.kurang_mampu} onChange={v => upd('sosial_ekonomi', 'kurang_mampu', v)} options={YA_TIDAK_VERIFIKASI} />
            <Select label="Menerima bantuan pendidikan lain?" value={E.menerima_bantuan} onChange={v => upd('sosial_ekonomi', 'menerima_bantuan', v)} options={['Tidak', 'Ya']} />
            {E.menerima_bantuan === 'Ya' && (
              <>
                <Text label="Jenis bantuan" value={E.jenis_bantuan} onChange={v => upd('sosial_ekonomi', 'jenis_bantuan', v)} />
                <Text label="Nama program/sumber bantuan" value={E.sumber_bantuan} onChange={v => upd('sosial_ekonomi', 'sumber_bantuan', v)} />
                <Text label="Besaran/periode bantuan (jika diketahui)" value={E.besaran_bantuan} onChange={v => upd('sosial_ekonomi', 'besaran_bantuan', v)} />
              </>
            )}
          </div>
        </section>

        {/* ===== F. REKENING ===== */}
        <section>
          <SectionTitle code="F" title="Informasi Rekening Penerima (Jika Dipersyaratkan)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Nama pemilik rekening" value={F.pemilik} onChange={v => upd('rekening', 'pemilik', v)} />
            <Text label="Nama bank" value={F.nama_bank} onChange={v => upd('rekening', 'nama_bank', v)} />
            <Text label="Nomor rekening" value={F.nomor_rekening} onChange={v => upd('rekening', 'nomor_rekening', v)} />
            <Text label="Hubungan pemilik rekening dengan peserta didik" value={F.hubungan} onChange={v => upd('rekening', 'hubungan', v)} />
            <Select label="Jenis rekening" value={F.jenis} onChange={v => upd('rekening', 'jenis', v)} options={JENIS_REKENING} colSpan="md:col-span-2" />
            <p className="md:col-span-2 text-xs text-slate-400 italic">
              Pengisian dan penetapan rekening mengikuti mekanisme penyaluran bantuan yang ditetapkan oleh Dinas Pendidikan Provinsi Papua. Jangan mencantumkan PIN, kata sandi, atau kode OTP.
            </p>
          </div>
        </section>

        {/* ===== G. PERNYATAAN ===== */}
        <section>
          <SectionTitle code="G" title="Pernyataan Orang Tua/Wali" />
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-2xl p-5">
            <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
              <AlertCircle size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
              <p>Unduh template surat pernyataan, isi dan mintakan tanda tangan (bermaterai bila dipersyaratkan) dari orang tua/wali, lalu unggah kembali surat yang sudah ditandatangani.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Text label="Nama penanda tangan" req value={G.nama} onChange={v => upd('pernyataan', 'nama', v)} />
              <Text label="NIK penanda tangan (jika ada)" value={G.nik} onChange={v => upd('pernyataan', 'nik', v)} />
              <Text label="Hubungan dengan peserta didik" value={G.hubungan} onChange={v => upd('pernyataan', 'hubungan', v)} placeholder="Ayah / Ibu / Wali" />
              <Text label="Tempat" value={G.tempat} onChange={v => upd('pernyataan', 'tempat', v)} placeholder="Kota penerbitan" />
              <Text label="Tanggal" type="date" value={G.tanggal} onChange={v => upd('pernyataan', 'tanggal', v)} />
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
            {LAMPIRAN_DOKUMEN.map(doc => (
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

export default PaceSiswaForm;
