import React, { useState, useCallback, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Search, AlertTriangle, CheckCircle, Upload, Send, Loader2 } from 'lucide-react';
import api from '../../../api/axios';

const InputMahasiswa = () => {
  const { isApproved } = useOutletContext();
  const [programType, setProgramType] = useState(''); // For Provinsi: koas, dosen_s3, spesialis, studi_akhir, split_side_double_master
  const [nimLoading, setNimLoading] = useState(false);
  const [nikLoading, setNikLoading] = useState(false);
  const [nimData, setNimData] = useState(null);
  const [nikData, setNikData] = useState(null);
  const [nikError, setNikError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const isMaceProvinsi = localStorage.getItem('mace_program') !== 'beasiswa' && !localStorage.getItem('mace_kabkota');
  const selectedKabKota = localStorage.getItem('mace_kabkota');

  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    nik: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    no_hp: '',
    nama_ortu: '',
    hp_ortu: '',
    kampus: '',
    prodi: '',
    ipk: '',
    fakultas: '',
    jurusan: '',
    semester: '',
    stase: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nimLoadingRef = useRef(false);

  // Auto-detect from NIM
  const handleNimBlur = async (e) => {
    const nimValue = e.target.value?.trim();
    if (!nimValue || nimValue.length < 4) return;
    nimLoadingRef.current = true;
    setNimLoading(true);
    try {
      const res = await api.get(`/validate/nim/${nimValue}`);
      if (res.data.valid) {
        const d = res.data.data;
        setNimData(d);
        setFormData(prev => ({
          ...prev,
          nim: nimValue,
          nama: d.nama || prev.nama,
          kampus: d.pt || '',
          prodi: d.prodi || '',
          ipk: d.ipk || '',
          fakultas: d.fakultas || d.prodi || '',
          jurusan: d.jurusan || d.prodi || '',
          semester: d.semester || '',
        }));
      } else {
        setNimData(null);
      }
    } catch {
      setNimData(null);
    } finally {
      nimLoadingRef.current = false;
      setNimLoading(false);
    }
  };

  // Auto-detect from NIK
  const handleNikBlur = useCallback(async () => {
    if (!formData.nik || formData.nik.length < 4) return;
    setNikLoading(true);
    setNikError('');
    try {
      const res = await api.get(`/validate/nik/${formData.nik}`);
      if (res.data.valid) {
        setNikData(res.data.data);
        // Check if NIK matches selected Kab/Kota
        if (selectedKabKota && res.data.data.kabKota !== selectedKabKota) {
          setNikError(`NIK terdaftar di "${res.data.data.kabKota}", bukan "${selectedKabKota}". Anda tidak dapat mendaftarkan mahasiswa ini di wilayah ini.`);
        }
      } else {
        setNikData(null);
        setNikError('NIK tidak valid atau bukan dari wilayah Papua.');
      }
    } catch {
      setNikData(null);
      setNikError('NIK tidak ditemukan.');
    } finally {
      setNikLoading(false);
    }
  }, [formData.nik, selectedKabKota]);

  const canSubmit = !nikError && formData.nama && formData.nim && formData.nik;

  // Peta programType (provinsi) ke kode program A-E
  const programMap = { studi_akhir: 'A', koas: 'B', spesialis: 'C', dosen_s3: 'D', split_side_double_master: 'A' };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setMessage('');
    try {
      const program = isMaceProvinsi ? (programMap[programType] || 'A') : 'A';
      const data_diri = {
        nama: formData.nama,
        nim: formData.nim,
        nik: formData.nik,
        ttl: [formData.tempat_lahir, formData.tanggal_lahir].filter(Boolean).join(', '),
        alamat: formData.alamat,
        no_hp: formData.no_hp,
        nama_orang_tua: formData.nama_ortu,
        no_hp_orang_tua: formData.hp_ortu,
        pt: formData.kampus,
        fakultas: formData.fakultas,
        jurusan: formData.prodi || formData.jurusan,
        ipk: formData.ipk,
        semester: formData.semester,
        stase: formData.stase,
        nim_terdaftar: !!nimData,
        nik_terdaftar: !!nikData,
        ktp_papua: !!nikData
      };
      await api.post('/pendaftaran/daftar', { program, documents: [], data_diri });
      setMessage('Data mahasiswa berhasil didaftarkan!');
    } catch (err) {
      setMessage('Gagal mendaftarkan: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isApproved) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Users className="mx-auto mb-4 text-slate-300" size={48} />
        <p className="font-medium">Menu ini belum dapat diakses.</p>
        <p className="text-sm">Silakan upload dan tunggu persetujuan Surat Permohonan terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Input Data Mahasiswa</h2>
        <p className="text-slate-500 mt-1">Daftarkan mahasiswa penerima bantuan pendidikan.</p>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl border border-emerald-100 font-medium">
          {message}
        </div>
      )}

      {/* Program Type Selector for Provinsi */}
      {isMaceProvinsi && (
        <div className="bg-white rounded-3xl p-6 premium-shadow border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Pilih Program</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { id: 'koas', label: 'Koas', desc: 'Mahasiswa Kedokteran', color: 'bg-rose-500' },
              { id: 'dosen_s3', label: 'Dosen S3', desc: 'Program Doktoral', color: 'bg-amber-500' },
              { id: 'spesialis', label: 'Dokter Spesialis', desc: 'Program Spesialisasi', color: 'bg-emerald-500' },
              { id: 'studi_akhir', label: 'Studi Akhir', desc: 'Bantuan Studi Akhir', color: 'bg-blue-500' },
              { id: 'split_side_double_master', label: 'SplitSideDoubleMaster', desc: 'Program Double Master', color: 'bg-purple-500' },
            ].map(prog => (
              <button
                key={prog.id}
                onClick={() => setProgramType(prog.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  programType === prog.id 
                    ? 'border-brand-blue bg-brand-blue/5' 
                    : 'border-slate-200 hover:border-brand-blue/30'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${prog.color} mb-2`}></div>
                <p className="font-bold text-slate-900">{prog.label}</p>
                <p className="text-xs text-slate-500">{prog.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100">
        <div className="space-y-6">
          {/* NIM Field with Auto-detect */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">NIM <span className="text-xs text-brand-blue">(Auto-detect)</span></label>
              <div className="relative">
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  onBlur={handleNimBlur}
                  placeholder="Masukkan NIM mahasiswa"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium"
                />
                {nimLoading && <Loader2 className="absolute right-3 top-3.5 text-brand-blue animate-spin" size={20} />}
                {nimData && <CheckCircle className="absolute right-3 top-3.5 text-emerald-500" size={20} />}
              </div>
              {nimData && (
                <p className="text-xs text-emerald-600 mt-1">✓ {nimData.nama} — {nimData.pt}</p>
              )}
            </div>

            {/* NIK Field with Auto-detect */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">NIK <span className="text-xs text-brand-blue">(Auto-detect Kab/Kota)</span></label>
              <div className="relative">
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  onBlur={handleNikBlur}
                  placeholder="Masukkan NIK 16 digit"
                  className={`w-full bg-slate-50 border-2 ${nikError ? 'border-red-300' : 'border-transparent'} focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium`}
                />
                {nikLoading && <Loader2 className="absolute right-3 top-3.5 text-brand-blue animate-spin" size={20} />}
              </div>
              {nikError && (
                <div className="flex items-start gap-2 mt-2 text-red-600 text-xs">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{nikError}</span>
                </div>
              )}
              {nikData && !nikError && (
                <p className="text-xs text-emerald-600 mt-1">✓ Wilayah: {nikData.kabKota}</p>
              )}
            </div>
          </div>

          {/* Personal Data */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-800 mb-4">Data Diri</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama lengkap" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tempat Lahir</label>
                <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} placeholder="Tempat lahir" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Lahir</label>
                <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">No HP</label>
                <input type="text" name="no_hp" value={formData.no_hp} onChange={handleChange} placeholder="08xxxxxxxxxx" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Alamat</label>
                <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="2" placeholder="Alamat lengkap" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium resize-none" />
              </div>
            </div>
          </div>

          {/* Parent Data */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-800 mb-4">Data Orang Tua / Wali</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Orang Tua / Wali</label>
                <input type="text" name="nama_ortu" value={formData.nama_ortu} onChange={handleChange} placeholder="Nama orang tua/wali" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">No HP Orang Tua / Wali</label>
                <input type="text" name="hp_ortu" value={formData.hp_ortu} onChange={handleChange} placeholder="08xxxxxxxxxx" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
              </div>
            </div>
          </div>

          {/* Academic Info (Auto-filled) */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-800 mb-4">Data Akademik <span className="text-xs text-brand-blue font-normal">(Otomatis dari NIM)</span></h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Perguruan Tinggi</label>
                <input type="text" name="kampus" value={formData.kampus} readOnly className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl py-3 px-4 outline-none font-medium text-emerald-700" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Program Studi</label>
                <input type="text" name="prodi" value={formData.prodi} readOnly className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl py-3 px-4 outline-none font-medium text-emerald-700" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">IPK</label>
                <input type="text" name="ipk" value={formData.ipk} readOnly className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl py-3 px-4 outline-none font-medium text-emerald-700" />
              </div>
            </div>
          </div>

          {/* Extra fields for Provinsi programs */}
          {isMaceProvinsi && programType === 'koas' && (
            <div className="border-t border-slate-100 pt-6">
              <h4 className="font-bold text-slate-800 mb-4">Data Khusus Koas</h4>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Stase</label>
                <input type="text" name="stase" value={formData.stase} onChange={handleChange} placeholder="Nama stase koas" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
              </div>
            </div>
          )}

          {isMaceProvinsi && (programType === 'dosen_s3' || programType === 'spesialis' || programType === 'studi_akhir' || programType === 'split_side_double_master') && (
            <div className="border-t border-slate-100 pt-6">
              <h4 className="font-bold text-slate-800 mb-4">Data Khusus {programType === 'dosen_s3' ? 'Dosen S3' : programType === 'spesialis' ? 'Dokter Spesialis' : programType === 'studi_akhir' ? 'Studi Akhir' : 'SplitSideDoubleMaster'}</h4>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Semester</label>
                <input type="text" name="semester" value={formData.semester} onChange={handleChange} placeholder="Semester saat ini" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-xl py-3 px-4 outline-none font-medium" />
              </div>
            </div>
          )}

          {/* Document Uploads */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-800 mb-4">Upload Dokumen Pendukung</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Common documents */}
              {['Upload KK', 'Upload SKTM', 'Upload KHS'].map(label => (
                <div key={label} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-brand-blue/30 cursor-pointer transition-colors">
                  <Upload size={20} className="text-brand-blue" />
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-brand-blue/30 cursor-pointer transition-colors">
                <Upload size={20} className="text-brand-blue" />
                <span className="text-sm font-medium text-slate-700">Upload Prestasi Non-Akademik (opsional)</span>
              </div>

              {/* Provinsi-specific documents */}
              {isMaceProvinsi && programType === 'koas' && (
                <>
                  {['Surat Permohonan', 'RAB', 'KTP', 'Kartu Mahasiswa', 'Surat Keterangan Stase Koas'].map(label => (
                    <div key={label} className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors">
                      <Upload size={20} className="text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">{label}</span>
                    </div>
                  ))}
                </>
              )}

              {isMaceProvinsi && programType === 'dosen_s3' && (
                <>
                  {['Surat Permohonan', 'RAB', 'KTP', 'Kartu Mahasiswa', 'Surat Rekomendasi Rektor', 'Abstraksi/Ringkasan Thesis', 'Surat Pernyataan Bermaterai'].map(label => (
                    <div key={label} className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors">
                      <Upload size={20} className="text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">{label}</span>
                    </div>
                  ))}
                </>
              )}

              {isMaceProvinsi && programType === 'spesialis' && (
                <>
                  {['Surat Permohonan', 'RAB', 'KTP', 'Kartu Mahasiswa', 'Surat Rekomendasi Pimpinan Unit Kerja', 'Surat Pernyataan Bermaterai'].map(label => (
                    <div key={label} className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors">
                      <Upload size={20} className="text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">{label}</span>
                    </div>
                  ))}
                </>
              )}

              {isMaceProvinsi && programType === 'studi_akhir' && (
                <>
                  {['Surat Permohonan', 'RAB', 'KTP', 'Kartu Mahasiswa', 'Surat Keterangan Aktif Kuliah', 'Surat Pernyataan Bermaterai'].map(label => (
                    <div key={label} className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors">
                      <Upload size={20} className="text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">{label}</span>
                    </div>
                  ))}
                </>
              )}

              {isMaceProvinsi && programType === 'split_side_double_master' && (
                <>
                  {['Surat Permohonan', 'RAB', 'KTP', 'Kartu Mahasiswa', 'Surat Rekomendasi Rektor', 'Letter of Acceptance', 'Surat Pernyataan Bermaterai'].map(label => (
                    <div key={label} className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors">
                      <Upload size={20} className="text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">{label}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-slate-100 pt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all premium-shadow ${
                canSubmit && !submitting
                  ? 'gradient-blue text-white hover:opacity-90'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <><Loader2 size={18} className="animate-spin" /> Mengirim...</>
              ) : (
                <><Send size={18} /> Kirim Pendaftaran</>
              )}
            </button>
          </div>

          {nikError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-red-700 text-sm">Tidak Dapat Mengirim Pendaftaran</p>
                <p className="text-red-600 text-xs mt-1">{nikError}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputMahasiswa;
