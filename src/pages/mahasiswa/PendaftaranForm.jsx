import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { CheckCircle2, AlertCircle, Loader2, Upload, Search, ArrowLeft, ArrowRight, User, FileText, GraduationCap } from 'lucide-react';

// Daftar dokumen generik (union semua program) karena program dipilih di langkah akhir.
const DOCUMENT_FIELDS = [
  { label: 'Surat Permohonan / Proposal', name: 'surat_permohonan', desc: 'PDF, Maks 5MB' },
  { label: 'Rencana Anggaran Biaya (RAB)', name: 'rab', desc: 'PDF, Maks 5MB' },
  { label: 'KTP', name: 'ktp', desc: 'JPG/PDF, Maks 2MB' },
  { label: 'Kartu Keluarga', name: 'kartu_keluarga', desc: 'JPG/PDF, Maks 2MB' },
  { label: 'Kartu Mahasiswa', name: 'kartu_mahasiswa', desc: 'JPG/PDF, Maks 2MB' },
  { label: 'Surat Keterangan Aktif Kuliah', name: 'sk_aktif', desc: 'PDF, Maks 2MB' },
  { label: 'KHS / Transkrip Nilai', name: 'khs', desc: 'PDF, Maks 2MB' },
  { label: 'SKTM (opsional)', name: 'sktm', desc: 'PDF, Maks 2MB', optional: true },
];

const PROGRAM_OPTIONS = [
  { id: 'A', title: 'Studi Akhir / Tugas Akhir / Skripsi', desc: 'Untuk mahasiswa yang sedang menyelesaikan tugas akhir atau skripsi.', color: 'bg-blue-500' },
  { id: 'B', title: 'Koas (Khusus Kedokteran)', desc: 'Mahasiswa kedokteran yang sedang menjalani masa profesi dokter (Koas).', color: 'bg-rose-500' },
  { id: 'C', title: 'Spesialis (Dokter Spesialis)', desc: 'Program bantuan pendidikan spesialisasi bagi dokter Orang Asli Papua.', color: 'bg-emerald-500' },
  { id: 'D', title: 'Pendidikan S3 (Doktoral)', desc: 'Bantuan studi doktoral khusus untuk Orang Asli Papua.', color: 'bg-amber-500' },
];

const InputField = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-slate-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-2xl py-3.5 px-4 outline-none transition-all text-sm"
    />
  </div>
);

const PendaftaranForm = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const stepLabels = ['Data Diri', 'Unggah Berkas', 'Pilih Program', 'Selesai'];

  const [isNimValid, setIsNimValid] = useState(null);
  const [isNikValid, setIsNikValid] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMsg, setValidationMsg] = useState({ nim: '', nik: '' });
  const [programWarning, setProgramWarning] = useState('');

  const [files, setFiles] = useState({});

  const [dataDiri, setDataDiri] = useState({
    nama: '',
    nim: '',
    nik: '',
    ttl: '',
    alamat: '',
    no_hp: '',
    nama_orang_tua: '',
    no_hp_orang_tua: '',
    pt: '',
    fakultas: '',
    jurusan: '',
    ipk: '',
    semester: '',
    stase: '',
    nim_terdaftar: false,
    nik_terdaftar: false,
    ktp_papua: false
  });

  const [program, setProgram] = useState('');

  const handleDataDiriChange = (e) => {
    const { name, value } = e.target;
    setDataDiri(prev => ({ ...prev, [name]: value }));
  };

  // Validasi NIM (PDDikti) - TIDAK memblokir, hanya auto-fill + status untuk sistem poin
  const handleValidateNim = async () => {
    if (!dataDiri.nim) return;
    setIsValidating(true);
    try {
      const res = await api.get(`/validate/nim/${dataDiri.nim}`);
      const d = res.data.data;
      setIsNimValid(true);
      setDataDiri(prev => ({
        ...prev,
        nama: prev.nama || d.nama || '',
        pt: prev.pt || d.pt || '',
        jurusan: prev.jurusan || d.prodi || '',
        ipk: prev.ipk || d.ipk || '',
        nim_terdaftar: true
      }));
      setValidationMsg(prev => ({ ...prev, nim: `Data ditemukan: ${d.nama} (${d.pt}) - Prodi: ${d.prodi}, IPK: ${d.ipk}` }));
    } catch {
      setIsNimValid(false);
      setDataDiri(prev => ({ ...prev, nim_terdaftar: false }));
      setValidationMsg(prev => ({ ...prev, nim: 'NIM tidak ditemukan di PDDikti. Anda tetap bisa melanjutkan, namun poin IPK/semester tidak berlaku (verifikasi manual oleh panitia).' }));
    } finally {
      setIsValidating(false);
    }
  };

  // Validasi NIK (DUKCAPIL) - TIDAK memblokir
  const handleValidateNik = async () => {
    if (!dataDiri.nik) return;
    setIsValidating(true);
    try {
      const res = await api.get(`/validate/nik/${dataDiri.nik}`);
      setIsNikValid(true);
      setDataDiri(prev => ({ ...prev, nik_terdaftar: true, ktp_papua: true }));
      setValidationMsg(prev => ({ ...prev, nik: `NIK valid: ${res.data.data.wilayah || 'Wilayah Papua'} (OAP)` }));
    } catch {
      setIsNikValid(false);
      setDataDiri(prev => ({ ...prev, nik_terdaftar: false, ktp_papua: false }));
      setValidationMsg(prev => ({ ...prev, nik: 'NIK tidak dapat diverifikasi / bukan Papua. Anda tetap bisa melanjutkan; poin OAP dapat ditetapkan manual oleh panitia.' }));
    } finally {
      setIsValidating(false);
    }
  };

  const handleNextToUpload = () => {
    const requiredFields = ['nama', 'nim', 'nik', 'ttl', 'alamat', 'no_hp', 'pt', 'fakultas', 'jurusan'];
    for (const field of requiredFields) {
      if (!dataDiri[field] || String(dataDiri[field]).trim() === '') {
        alert('Harap lengkapi semua field wajib pada Data Diri.');
        return;
      }
    }
    setStep(2);
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    const file = uploadedFiles[0];
    if (file) {
      const field = DOCUMENT_FIELDS.find(f => f.name === name);
      const maxMb = field ? (parseInt(/Maks\s+(\d+)\s*MB/i.exec(field.desc)?.[1], 10) || 2) : 2;
      if (file.size > maxMb * 1024 * 1024) {
        alert(`Ukuran file terlalu besar. Maksimal ${maxMb}MB untuk ${field?.label || name}.`);
        e.target.value = '';
        return;
      }
    }
    setFiles(prev => ({ ...prev, [name]: file }));
  };

  const handleNextToProgram = () => {
    const wajib = DOCUMENT_FIELDS.filter(f => !f.optional).map(f => f.name);
    for (const name of wajib) {
      if (!files[name]) {
        alert(`Dokumen wajib belum diunggah: ${DOCUMENT_FIELDS.find(f => f.name === name).label}`);
        return;
      }
    }
    setStep(3);
  };

  const handleSelectProgram = (id) => {
    setProgram(id);
    setProgramWarning('');
    const prodi = (dataDiri.jurusan || '').toLowerCase();
    if ((id === 'B' || id === 'C') && !prodi.includes('kedokteran') && !prodi.includes('dokter') && !prodi.includes('profesi')) {
      setProgramWarning('Catatan: program ini umumnya untuk jurusan Kedokteran. Anda tetap dapat melanjutkan, keputusan akhir ada pada verifikator.');
    }
    if (id === 'D' && !prodi.includes('s3') && !prodi.includes('doktoral') && !prodi.includes('doktor')) {
      setProgramWarning('Catatan: program ini umumnya untuk jenjang S3/Doktoral. Anda tetap dapat melanjutkan.');
    }
  };

  const handleSubmit = async () => {
    if (!program) {
      alert('Silakan pilih program bantuan terlebih dahulu.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { uploadDokumen } = await import('../../lib/upload');
      const uploadedDocs = [];
      const failedUploads = [];
      for (const key of Object.keys(files)) {
        if (files[key]) {
          // Upload tiap berkas secara independen: kalau satu gagal/macet,
          // pendaftaran tetap lanjut disimpan (dokumen bisa dilampirkan menyusul).
          try {
            const url = await uploadDokumen(files[key], 'dokumen-pendaftaran');
            uploadedDocs.push({ jenis: key, url });
          } catch (upErr) {
            const label = DOCUMENT_FIELDS.find(f => f.name === key)?.label || key;
            failedUploads.push(label);
            console.error('Upload gagal untuk', label, upErr);
          }
        }
      }

      await api.post('/pendaftaran/daftar', {
        program,
        documents: uploadedDocs,
        data_diri: dataDiri
      });

      if (failedUploads.length) {
        alert(`Pendaftaran tersimpan, namun beberapa berkas gagal diunggah: ${failedUploads.join(', ')}. Silakan hubungi panitia untuk melengkapi berkas tersebut.`);
      }
      setStep(4);
    } catch (err) {
      alert('Gagal submit pendaftaran: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Pendaftaran Beasiswa MACE</h2>
          <p className="text-slate-500 mb-8">Lengkapi data diri, unggah berkas, lalu pilih program bantuan.</p>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-brand-blue -translate-y-1/2 transition-all duration-500"
              style={{ width: `${((step - 1) / (stepLabels.length - 1)) * 100}%` }}
            ></div>
            {stepLabels.map((label, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-300 ${
                  step >= i + 1 ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white border-slate-100 text-slate-400'
                }`}>
                  {step > i + 1 ? <CheckCircle2 size={24} /> : i + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm font-bold text-slate-500">
            {stepLabels.map((label, i) => (
              <span key={i} className={step === i + 1 ? 'text-brand-blue' : ''}>{label}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 premium-shadow border border-slate-100">
          {/* ========== STEP 1: Data Diri ========== */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-brand-blue/5 p-6 rounded-2xl border border-brand-blue/10">
                <p className="text-brand-blue font-medium flex items-center">
                  <User size={18} className="mr-2" />
                  Isi data diri Anda. Anda dapat memverifikasi NIM/NIK, namun tetap bisa melanjutkan walau belum terverifikasi.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputField label="Nama Lengkap" name="nama" value={dataDiri.nama} onChange={handleDataDiriChange} placeholder="Nama lengkap" />

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">NIM</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nim"
                      value={dataDiri.nim}
                      onChange={handleDataDiriChange}
                      placeholder="Nomor Induk Mahasiswa"
                      className={`w-full bg-slate-50 border-2 rounded-2xl py-3.5 px-4 pr-12 outline-none transition-all text-sm ${isNimValid === true ? 'border-emerald-500' : isNimValid === false ? 'border-amber-400' : 'border-transparent focus:border-brand-blue'}`}
                    />
                    <button type="button" onClick={handleValidateNim} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-colors">
                      {isValidating ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    </button>
                  </div>
                  {validationMsg.nim && (
                    <p className={`text-xs font-medium ${isNimValid ? 'text-emerald-600' : 'text-amber-600'}`}>{validationMsg.nim}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">NIK</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nik"
                      value={dataDiri.nik}
                      onChange={handleDataDiriChange}
                      placeholder="16 digit NIK"
                      className={`w-full bg-slate-50 border-2 rounded-2xl py-3.5 px-4 pr-12 outline-none transition-all text-sm ${isNikValid === true ? 'border-emerald-500' : isNikValid === false ? 'border-amber-400' : 'border-transparent focus:border-brand-blue'}`}
                    />
                    <button type="button" onClick={handleValidateNik} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-colors">
                      {isValidating ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    </button>
                  </div>
                  {validationMsg.nik && (
                    <p className={`text-xs font-medium ${isNikValid ? 'text-emerald-600' : 'text-amber-600'}`}>{validationMsg.nik}</p>
                  )}
                </div>

                <InputField label="Tempat, Tanggal Lahir" name="ttl" value={dataDiri.ttl} onChange={handleDataDiriChange} placeholder="Contoh: Jayapura, 01 Januari 2000" />
                <InputField label="No. HP" name="no_hp" value={dataDiri.no_hp} onChange={handleDataDiriChange} placeholder="08xxxxxxxxxx" />
                <div className="md:col-span-2">
                  <InputField label="Alamat" name="alamat" value={dataDiri.alamat} onChange={handleDataDiriChange} placeholder="Alamat lengkap saat ini" />
                </div>
                <InputField label="Perguruan Tinggi" name="pt" value={dataDiri.pt} onChange={handleDataDiriChange} placeholder="Nama perguruan tinggi" />
                <InputField label="Fakultas" name="fakultas" value={dataDiri.fakultas} onChange={handleDataDiriChange} placeholder="Contoh: Fakultas Kedokteran" />
                <InputField label="Jurusan / Program Studi" name="jurusan" value={dataDiri.jurusan} onChange={handleDataDiriChange} placeholder="Jurusan" />
                <InputField label="IPK (otomatis dari validasi NIM)" name="ipk" value={dataDiri.ipk} onChange={handleDataDiriChange} placeholder="Contoh: 3.75" />
                <InputField label="Semester (opsional)" name="semester" value={dataDiri.semester} onChange={handleDataDiriChange} placeholder="Contoh: 7" />
                <InputField label="Nama Orang Tua / Wali (opsional)" name="nama_orang_tua" value={dataDiri.nama_orang_tua} onChange={handleDataDiriChange} placeholder="Nama orang tua / wali" />
                <InputField label="No. HP Orang Tua / Wali (opsional)" name="no_hp_orang_tua" value={dataDiri.no_hp_orang_tua} onChange={handleDataDiriChange} placeholder="08xxxxxxxxxx" />
                <InputField label="Stase (khusus Koas, opsional)" name="stase" value={dataDiri.stase} onChange={handleDataDiriChange} placeholder="Contoh: Bedah" />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextToUpload}
                  className="gradient-blue text-white px-10 py-4 rounded-2xl font-bold premium-shadow flex items-center space-x-2"
                >
                  <span>Lanjutkan ke Unggah Berkas</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 2: Upload Berkas ========== */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-brand-blue/5 p-6 rounded-2xl border border-brand-blue/10">
                <p className="text-brand-blue font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Unggah berkas pendukung. Dokumen bertanda (opsional) boleh dilewati.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {DOCUMENT_FIELDS.map((field) => (
                  <div key={field.name} className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">
                      {field.label} {field.optional && <span className="text-slate-400 font-medium">(opsional)</span>}
                    </label>
                    <div className="relative group">
                      <input
                        type="file"
                        name={field.name}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center ${files[field.name] ? 'border-emerald-300 bg-emerald-50' : 'bg-slate-50 border-slate-200 group-hover:border-brand-blue'}`}>
                        <Upload className={`mb-2 ${files[field.name] ? 'text-emerald-500' : 'text-slate-400 group-hover:text-brand-blue'}`} size={32} />
                        <span className="text-sm font-bold text-slate-600 truncate max-w-full">{files[field.name]?.name || 'Pilih File'}</span>
                        <span className="text-[10px] text-slate-400 mt-1">{field.desc}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(1)} type="button" className="text-slate-500 font-bold px-10 py-4 flex items-center space-x-2">
                  <ArrowLeft size={20} />
                  <span>Kembali</span>
                </button>
                <button
                  onClick={handleNextToProgram}
                  className="gradient-blue text-white px-10 py-4 rounded-2xl font-bold premium-shadow flex items-center space-x-2"
                >
                  <span>Lanjutkan ke Pilih Program</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 3: Pilih Program ========== */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-brand-blue/5 p-6 rounded-2xl border border-brand-blue/10">
                <p className="text-brand-blue font-medium flex items-center">
                  <GraduationCap size={18} className="mr-2" />
                  Pilih program bantuan yang Anda tuju.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {PROGRAM_OPTIONS.map((prog) => (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => handleSelectProgram(prog.id)}
                    className={`text-left rounded-3xl border-2 p-6 transition-all ${
                      program === prog.id ? 'border-brand-blue bg-brand-blue/5 shadow-lg' : 'border-slate-100 hover:border-brand-blue/40 bg-white'
                    }`}
                  >
                    <div className={`${prog.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4`}>
                      <GraduationCap size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Program {prog.id}: {prog.title}</h4>
                    <p className="text-sm text-slate-500">{prog.desc}</p>
                  </button>
                ))}
              </div>

              {programWarning && (
                <div className="bg-amber-50 text-amber-700 px-6 py-4 rounded-xl border border-amber-100 font-medium text-sm flex items-start">
                  <AlertCircle size={18} className="mr-2 mt-0.5 shrink-0" />
                  {programWarning}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(2)} type="button" className="text-slate-500 font-bold px-10 py-4 flex items-center space-x-2">
                  <ArrowLeft size={20} />
                  <span>Kembali</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!program || isSubmitting}
                  className="gradient-blue text-white px-12 py-4 rounded-2xl font-bold premium-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (
                    <>
                      <span>Kirim Pendaftaran</span>
                      <CheckCircle2 size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 4: Selesai ========== */}
          {step === 4 && (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Pendaftaran Berhasil Terkirim!</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
                Berkas pendaftaran Anda sedang dalam proses verifikasi oleh Admin. Simpan bukti pendaftaran ini dan pantau pengumuman secara berkala.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold"
              >
                Kembali ke Beranda
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendaftaranForm;
