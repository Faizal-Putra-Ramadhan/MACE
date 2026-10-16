import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import {
  CheckCircle2, AlertCircle, Loader2, Upload, Search, ArrowLeft, ArrowRight,
  User, FileText, GraduationCap, Download, Home,
} from 'lucide-react';
import {
  PROGRAM_OPTIONS_KABKOTA, PROGRAM_OPTIONS_PROVINSI, PROGRAM_FORMS, KABUPATEN_LIST,
  DATA_DIRI_FIELDS, buildSuratHtml, buildInitialDataDiri,
} from '../../lib/pendaftaranConfig';

const inputClass = (extra = '') =>
  `w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-2xl py-3.5 px-4 outline-none transition-all text-sm ${extra}`;

const PendaftaranForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Konteks jalur dari MacePortal. Default: Beasiswa Reguler Kabupaten/Kota.
  const jalur = location.state?.jalur || 'kabupaten_kota';
  const wilayah = location.state?.wilayah || '';
  const wilayahName = location.state?.wilayahName || '';

  const [stepIdx, setStepIdx] = useState(0);

  // Field validasi NIK/NIM (non-blocking).
  const [isNimValid, setIsNimValid] = useState(null);
  const [isNikValid, setIsNikValid] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMsg, setValidationMsg] = useState({ nim: '', nik: '' });

  const [dataDiri, setDataDiri] = useState(() =>
    buildInitialDataDiri(wilayahName && KABUPATEN_LIST.some(k => k.name === wilayahName) ? wilayahName : '')
  );
  const [program, setProgram] = useState('');
  const [programWarning, setProgramWarning] = useState('');

  const [files, setFiles] = useState({});          // dokumen
  const [suratFiles, setSuratFiles] = useState({}); // surat (hanya program dengan template)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const programOptions = jalur === 'provinsi' ? PROGRAM_OPTIONS_PROVINSI : PROGRAM_OPTIONS_KABKOTA;
  const programForm = PROGRAM_FORMS[program];
  const detailSteps = programForm?.detailSteps || [];
  const dokumenList = programForm?.dokumenList || [];
  const suratList = programForm?.suratList || [];
  const wajibDokumen = programForm?.wajibDokumen || [];

  // Susun urutan stage secara dinamis bergantung program terpilih.
  const stages = ['identity', 'program', ...detailSteps.map(s => s.key), 'documents', ...(suratList.length ? ['surat'] : []), 'done'];
  const stageLabels = ['Data Diri', 'Program', ...detailSteps.map(s => s.shortTitle), 'Dokumen', ...(suratList.length ? ['Surat'] : []), 'Selesai'];
  const currentStage = stages[stepIdx] || 'identity';
  const isLastFormStage = currentStage === 'surat' || (currentStage === 'documents' && suratList.length === 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataDiri(prev => ({ ...prev, [name]: value }));
  };

  // ---- Validasi NIM (PDDikti) — auto-fill + status, tidak memblokir --------
  const handleValidateNim = async () => {
    if (!dataDiri.nim) return;
    setIsValidating(true);
    try {
      const res = await api.get(`/validate/nim/${dataDiri.nim}`);
      const d = res.data.data;
      setIsNimValid(true);
      setDataDiri(prev => ({
        ...prev,
        nim_terdaftar: true,
        nama: prev.nama || d.nama || '',
        nama_pt: prev.nama_pt || d.pt || '',
        program_studi: prev.program_studi || d.prodi || '',
        ipk: prev.ipk || d.ipk || '',
      }));
      setValidationMsg(prev => ({ ...prev, nim: `Data ditemukan: ${d.nama} (${d.pt}) - Prodi: ${d.prodi}, IPK: ${d.ipk}` }));
    } catch {
      setIsNimValid(false);
      setDataDiri(prev => ({ ...prev, nim_terdaftar: false }));
      setValidationMsg(prev => ({ ...prev, nim: 'NIM tidak ditemukan di PDDikti. Anda tetap bisa melanjutkan; poin akan diverifikasi manual oleh panitia.' }));
    } finally {
      setIsValidating(false);
    }
  };

  // ---- Validasi NIK (DUKCAPIL) — tidak memblokir --------------------------
  const handleValidateNik = async () => {
    if (!dataDiri.nik) return;
    setIsValidating(true);
    try {
      const res = await api.get(`/validate/nik/${dataDiri.nik}`);
      setIsNikValid(true);
      setDataDiri(prev => ({ ...prev, nik_terdaftar: true, ktp_papua: true, is_oap: true }));
      setValidationMsg(prev => ({ ...prev, nik: `NIK valid: ${res.data.data.wilayah || 'Wilayah Papua'} (OAP)` }));
    } catch {
      setIsNikValid(false);
      setDataDiri(prev => ({ ...prev, nik_terdaftar: false, ktp_papua: false }));
      setValidationMsg(prev => ({ ...prev, nik: 'NIK tidak dapat diverifikasi / bukan Papua. Anda tetap bisa melanjutkan; poin OAP dapat ditetapkan manual oleh panitia.' }));
    } finally {
      setIsValidating(false);
    }
  };

  // ---- Validasi per stage --------------------------------------------------
  const validateFields = (fields) => {
    const missing = fields.filter(f => f.required && !String(dataDiri[f.name] || '').trim());
    if (missing.length) {
      alert(`Harap lengkapi field wajib: ${missing.map(m => m.label).join(', ')}`);
      return false;
    }
    return true;
  };

  const validateCurrentStage = () => {
    if (currentStage === 'identity') return validateFields(DATA_DIRI_FIELDS);
    if (currentStage === 'program') {
      if (!program) { alert('Silakan pilih program terlebih dahulu.'); return false; }
      return true;
    }
    const detail = detailSteps.find(s => s.key === currentStage);
    if (detail) return validateFields(detail.fields);
    if (currentStage === 'documents') {
      const missing = wajibDokumen.filter(name => !files[name]);
      if (missing.length) {
        alert(`Dokumen wajib belum diunggah: ${missing.map(n => dokumenList.find(d => d.name === n)?.label || n).join(', ')}`);
        return false;
      }
      return true;
    }
    if (currentStage === 'surat') {
      const missing = suratList.filter(s => !suratFiles[s.name]);
      if (missing.length) { alert(`Surat wajib diunggah: ${missing.map(s => s.title).join(', ')}`); return false; }
      return true;
    }
    return true;
  };

  const handleFileChange = (setter) => (e) => {
    const { name, files: uploaded } = e.target;
    const file = uploaded[0];
    if (file) {
      const meta = [...dokumenList, ...suratList].find(d => d.name === name);
      const maxMb = meta?.desc ? (parseInt(/Maks\s+(\d+)\s*MB/i.exec(meta.desc)?.[1], 10) || 2) : 2;
      if (file.size > maxMb * 1024 * 1024) {
        alert(`Ukuran file terlalu besar. Maksimal ${maxMb}MB untuk ${meta?.label || meta?.title || name}.`);
        e.target.value = '';
        return;
      }
    }
    setter(prev => ({ ...prev, [name]: file }));
  };

  const handleSelectProgram = (id) => {
    setProgram(id);
    setProgramWarning('');
    const prodi = (dataDiri.program_studi || dataDiri.prodi_doktor || dataDiri.jurusan || '').toLowerCase();
    if ((id === 'C' || id === 'D') && !prodi.includes('kedokteran') && !prodi.includes('dokter') && !prodi.includes('profesi')) {
      setProgramWarning('Catatan: program ini umumnya untuk jurusan Kedokteran. Anda tetap dapat melanjutkan, keputusan akhir ada pada verifikator.');
    }
    if (id === 'E') {
      setProgramWarning('Catatan: program ini umumnya untuk jenjang S3/Doktoral. Anda tetap dapat melanjutkan.');
    }
  };

  const downloadTemplate = (surat) => {
    const html = buildSuratHtml(surat, dataDiri);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${surat.name.replace(/_/g, '-')}.doc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const doSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { uploadDokumen } = await import('../../lib/upload');
      const uploadedDocs = [];
      const failedUploads = [];
      const allFiles = { ...files, ...suratFiles };
      for (const key of Object.keys(allFiles)) {
        if (!allFiles[key]) continue;
        try {
          const url = await uploadDokumen(allFiles[key], 'dokumen-pendaftaran');
          uploadedDocs.push({ jenis: key, url });
        } catch (upErr) {
          const meta = [...dokumenList, ...suratList].find(d => d.name === key);
          failedUploads.push(meta?.label || meta?.title || key);
          console.error('Upload gagal untuk', key, upErr);
        }
      }

      const payloadDataDiri = { ...dataDiri, jalur, wilayah, wilayah_name: wilayahName };
      await api.post('/pendaftaran/daftar', { program, documents: uploadedDocs, data_diri: payloadDataDiri });

      if (failedUploads.length) {
        alert(`Pendaftaran tersimpan, namun beberapa berkas gagal diunggah: ${failedUploads.join(', ')}. Silakan hubungi panitia untuk melengkapi berkas tersebut.`);
      }
      setStepIdx(stages.length - 1); // -> stage 'done'
    } catch (err) {
      alert('Gagal submit pendaftaran: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrimary = async () => {
    if (!validateCurrentStage()) return;
    if (isLastFormStage) { await doSubmit(); return; }
    setStepIdx(i => i + 1);
  };

  // ---- Renderer field generik ---------------------------------------------
  const renderField = (field) => {
    const value = dataDiri[field.name] || '';
    const spanClass = field.full ? 'md:col-span-2' : '';
    const num = field.no ? `${field.no}. ` : '';

    if (field.special === 'nik' || field.special === 'nim') {
      const isNik = field.special === 'nik';
      const state = isNik ? isNikValid : isNimValid;
      const msg = validationMsg[isNik ? 'nik' : 'nim'];
      const onValidate = isNik ? handleValidateNik : handleValidateNim;
      return (
        <div key={field.name} className={`space-y-2 ${spanClass}`}>
          <label className="block text-sm font-bold text-slate-700">{num}{field.label}{field.required && ' *'}</label>
          <div className="relative">
            <input type="text" name={field.name} value={value} onChange={handleChange} placeholder={field.placeholder}
              className={inputClass(state === true ? 'border-emerald-500' : state === false ? 'border-amber-400' : '')} />
            <button type="button" onClick={onValidate} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-colors">
              {isValidating ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
          {msg && <p className={`text-xs font-medium ${state ? 'text-emerald-600' : 'text-amber-600'}`}>{msg}</p>}
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div key={field.name} className={`space-y-2 ${spanClass}`}>
          <label className="block text-sm font-bold text-slate-700">{num}{field.label}{field.required && ' *'}</label>
          <select name={field.name} value={value} onChange={handleChange} className={inputClass('appearance-none')}>
            <option value="">Pilih {field.label.toLowerCase()}</option>
            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className={`space-y-2 ${spanClass}`}>
          <label className="block text-sm font-bold text-slate-700">{num}{field.label}{field.required && ' *'}</label>
          <textarea name={field.name} value={value} onChange={handleChange} rows={2} className={inputClass('resize-none')} />
        </div>
      );
    }

    return (
      <div key={field.name} className={`space-y-2 ${spanClass}`}>
        <label className="block text-sm font-bold text-slate-700">{num}{field.label}{field.required && ' *'}</label>
        <div className="relative">
          {field.prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">{field.prefix}</span>}
          <input type={field.type === 'number' ? 'number' : 'text'} name={field.name} value={value} onChange={handleChange}
            placeholder={field.placeholder} className={inputClass(field.prefix ? 'pl-10' : '')} />
          {field.suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">{field.suffix}</span>}
        </div>
      </div>
    );
  };

  const InfoBanner = ({ icon: Icon, children }) => (
    <div className="bg-brand-blue/5 p-6 rounded-2xl border border-brand-blue/10">
      <p className="text-brand-blue font-medium flex items-center"><Icon size={18} className="mr-2 shrink-0" />{children}</p>
    </div>
  );

  const primaryLabel = isLastFormStage ? 'Kirim Pendaftaran' : `Lanjut: ${stageLabels[stepIdx + 1] || ''}`;

  // Render konten stage form data (identity / program / detail / documents / surat).
  const renderStageContent = () => {
    if (currentStage === 'identity') {
      return (
        <>
          <InfoBanner icon={User}>Isi data diri Anda. Verifikasi NIK bersifat opsional dan tidak memblokir pendaftaran.</InfoBanner>
          <div className="grid md:grid-cols-2 gap-6">{DATA_DIRI_FIELDS.map(renderField)}</div>
        </>
      );
    }

    if (currentStage === 'program') {
      return (
        <>
          <InfoBanner icon={GraduationCap}>Pilih program bantuan yang Anda tuju.</InfoBanner>
          <div className="grid md:grid-cols-2 gap-6">
            {programOptions.map((prog) => (
              <button key={prog.id} type="button" onClick={() => handleSelectProgram(prog.id)}
                className={`text-left rounded-3xl border-2 p-6 transition-all ${program === prog.id ? 'border-brand-blue bg-brand-blue/5 shadow-lg' : 'border-slate-100 hover:border-brand-blue/40 bg-white'}`}>
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
              <AlertCircle size={18} className="mr-2 mt-0.5 shrink-0" />{programWarning}
            </div>
          )}
        </>
      );
    }

    const detail = detailSteps.find(s => s.key === currentStage);
    if (detail) {
      return (
        <>
          <InfoBanner icon={GraduationCap}>{detail.banner}</InfoBanner>
          <div className="grid md:grid-cols-2 gap-6">{detail.fields.map(renderField)}</div>
        </>
      );
    }

    if (currentStage === 'documents') {
      return (
        <>
          <InfoBanner icon={FileText}>Unggah dokumen pendukung. Dokumen bertanda "(jika relevan)" hanya diunggah bila sesuai kondisi Anda.</InfoBanner>
          <div className="grid md:grid-cols-2 gap-6">
            {dokumenList.map((doc) => {
              const wajib = wajibDokumen.includes(doc.name);
              return (
                <div key={doc.name} className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    {doc.label}{' '}
                    {wajib ? <span className="text-red-500">*</span>
                      : <span className="text-slate-400 font-medium">{doc.conditional ? '(jika relevan)' : '(opsional)'}</span>}
                  </label>
                  <div className="relative group">
                    <input type="file" name={doc.name} onChange={handleFileChange(setFiles)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className={`border-2 border-dashed rounded-2xl p-5 transition-all flex flex-col items-center ${files[doc.name] ? 'border-emerald-300 bg-emerald-50' : 'bg-slate-50 border-slate-200 group-hover:border-brand-blue'}`}>
                      <Upload className={`mb-2 ${files[doc.name] ? 'text-emerald-500' : 'text-slate-400 group-hover:text-brand-blue'}`} size={28} />
                      <span className="text-sm font-bold text-slate-600 truncate max-w-full">{files[doc.name]?.name || 'Pilih File'}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{doc.desc}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }

    if (currentStage === 'surat') {
      return (
        <>
          <InfoBanner icon={Download}>Unduh template surat, isi dan tanda tangani (bermaterai), lalu unggah kembali ke sistem.</InfoBanner>
          <div className="space-y-6">
            {suratList.map((surat) => (
              <div key={surat.name} className="border border-slate-100 rounded-2xl p-6 space-y-4 bg-slate-50/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-bold text-slate-900">{surat.title}</h4>
                  <button type="button" onClick={() => downloadTemplate(surat)}
                    className="flex items-center gap-2 bg-white border border-brand-blue/30 text-brand-blue px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-blue hover:text-white transition-colors">
                    <Download size={16} /> Unduh Template
                  </button>
                </div>
                <p className="text-xs text-slate-500">{surat.desc}</p>
                <div className="relative group">
                  <input type="file" name={surat.name} onChange={handleFileChange(setSuratFiles)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`border-2 border-dashed rounded-2xl p-5 transition-all flex items-center justify-center gap-2 ${suratFiles[surat.name] ? 'border-emerald-300 bg-emerald-50 text-emerald-600' : 'bg-white border-slate-200 text-slate-500 group-hover:border-brand-blue'}`}>
                    <Upload size={18} />
                    <span className="text-sm font-bold truncate max-w-[70%]">{suratFiles[surat.name]?.name || 'Klik untuk unggah surat yang sudah diisi'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {jalur === 'provinsi' ? 'Pendaftaran Beasiswa MACE (Provinsi)' : 'Pendaftaran Beasiswa Reguler Kabupaten/Kota'}
          </h2>
          <p className="text-slate-500 mb-8">
            {wilayahName ? `Wilayah: ${wilayahName}. ` : ''}Lengkapi data diri, pilih program, isi detail, lalu unggah berkas.
          </p>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-brand-blue -translate-y-1/2 transition-all duration-500"
              style={{ width: `${(stepIdx / (stages.length - 1)) * 100}%` }}></div>
            {stages.map((_, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-300 ${
                  stepIdx >= i ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                  {stepIdx > i ? <CheckCircle2 size={22} /> : i + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] md:text-sm font-bold text-slate-500">
            {stageLabels.map((label, i) => (
              <span key={i} className={`flex-1 text-center ${stepIdx === i ? 'text-brand-blue' : ''}`}>{label}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 premium-shadow border border-slate-100">
          {currentStage === 'done' ? (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Pendaftaran Berhasil Terkirim!</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
                Berkas pendaftaran Anda sedang dalam proses verifikasi oleh Admin. Simpan bukti pendaftaran ini dan pantau pengumuman secara berkala.
              </p>
              <button onClick={() => navigate('/mace')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold inline-flex items-center gap-2">
                <Home size={18} /> Kembali ke Portal MACE
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {renderStageContent()}
              <div className="flex justify-between pt-4">
                {stepIdx === 0 ? (
                  <button onClick={() => navigate('/mace')} type="button" className="text-slate-400 font-bold px-6 py-4 flex items-center space-x-2 hover:text-slate-600">
                    <ArrowLeft size={18} /><span>Portal</span>
                  </button>
                ) : (
                  <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} type="button" className="text-slate-500 font-bold px-8 py-4 flex items-center space-x-2">
                    <ArrowLeft size={20} /><span>Kembali</span>
                  </button>
                )}
                <button onClick={handlePrimary} disabled={isSubmitting}
                  className="gradient-blue text-white px-10 py-4 rounded-2xl font-bold premium-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (
                    isLastFormStage
                      ? <><span>{primaryLabel}</span><CheckCircle2 size={20} /></>
                      : <><span>{primaryLabel}</span><ArrowRight size={20} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendaftaranForm;
