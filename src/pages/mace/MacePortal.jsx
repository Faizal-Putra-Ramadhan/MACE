import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ChevronRight, MapPin, Building2, ArrowLeft, Stethoscope, Users2 } from 'lucide-react';

const KABUPATEN_LIST = [
  { id: 'kota_jayapura', name: 'Kota Jayapura', prefix: '9171' },
  { id: 'kab_jayapura', name: 'Kabupaten Jayapura', prefix: '9103' },
  { id: 'kab_yapen', name: 'Kabupaten Kepulauan Yapen', prefix: '9105' },
  { id: 'kab_biak', name: 'Kabupaten Biak Numfor', prefix: '9106' },
  { id: 'kab_sarmi', name: 'Kabupaten Sarmi', prefix: '9110' },
  { id: 'kab_keerom', name: 'Kabupaten Keerom', prefix: '9111' },
  { id: 'kab_supiori', name: 'Kabupaten Supiori', prefix: '9120' },
  { id: 'kab_mamberamo', name: 'Kabupaten Mamberamo Raya', prefix: '9128' },
  { id: 'kab_waropen', name: 'Kabupaten Waropen', prefix: '9115' },
];

const MacePortal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="gradient-blue text-white pt-12 pb-24 px-6 rounded-b-[3rem] premium-shadow">
        <div className="container mx-auto max-w-5xl">
          <button onClick={() => navigate('/')} className="mb-8 text-white/80 hover:text-white flex items-center gap-2 font-medium transition-colors">
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-blue premium-shadow">
              <span className="font-bold text-2xl">M</span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Beasiswa MACE</h1>
              <p className="text-xl text-white/90">Program Mahasiswa Cerdas Papua</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 -mt-16">
        <div className="bg-white rounded-[2rem] premium-shadow border border-slate-100 overflow-hidden mb-12">
          
          <div className="p-8 md:p-12 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Apa itu Beasiswa Pendidikan MACE?</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Beasiswa MACE (Mahasiswa Cerdas Papua) adalah program bantuan biaya pendidikan yang ditujukan untuk mendukung mahasiswa asli Papua dalam menyelesaikan pendidikannya. Program ini merupakan komitmen pemerintah daerah untuk meningkatkan kualitas sumber daya manusia Papua yang unggul dan berdaya saing.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Persyaratan Umum</h2>
            <ul className="list-disc pl-5 text-slate-600 leading-relaxed mb-4 space-y-2">
              <li>Merupakan Orang Asli Papua (OAP) yang dibuktikan dengan KTP/Kartu Keluarga Provinsi Papua.</li>
              <li>Terdaftar sebagai mahasiswa aktif pada perguruan tinggi negeri atau swasta yang diakui.</li>
              <li>Memiliki prestasi akademik yang baik (IPK memenuhi standar minimal yang ditentukan).</li>
              <li>Tidak sedang menerima beasiswa dari pihak lain.</li>
              <li>Lolos seleksi administrasi dan berkas pendukung lainnya.</li>
            </ul>
          </div>

          {/* Choose Kab/Kota or Provinsi */}
          <div className="p-8 md:p-12 bg-slate-50/50">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Pilihan Wilayah Pendaftaran</h2>
              <p className="text-slate-500">Pilih jalur pendaftaran sesuai wilayah Anda.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Kab/Kota */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MapPin size={20} className="text-brand-blue" /> Kabupaten / Kota
                </h3>
                <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-xl p-4 mb-4">
                  <h4 className="font-bold text-brand-blue mb-1">Beasiswa Reguler 900 Mahasiswa</h4>
                  <p className="text-sm text-slate-600">Alokasi untuk mahasiswa S1/D4 reguler melalui kabupaten/kota.</p>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {KABUPATEN_LIST.map(kab => (
                    <button
                      key={kab.id}
                      onClick={() => navigate('/mace/daftar', { state: { jalur: 'kabupaten_kota', wilayah: kab.id, wilayahName: kab.name } })}
                      className="group w-full text-left p-4 rounded-xl border border-slate-200 hover:border-brand-blue/40 hover:bg-white transition-all flex items-center justify-between shadow-sm hover:shadow-md bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                          <Building2 size={18} />
                        </div>
                        <span className="font-medium text-slate-700 group-hover:text-brand-blue">{kab.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Provinsi */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Building2 size={20} className="text-brand-gold" /> Tingkat Provinsi Papua
                </h3>
                
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-brand-gold/60 transition-all shadow-sm mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center text-white">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Beasiswa</h4>
                    </div>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-2 mb-4">
                    <li className="flex items-start gap-2"><ChevronRight size={14} className="text-brand-gold mt-0.5 shrink-0" /> Beasiswa reguler 100 mahasiswa</li>
                    <li className="flex items-start gap-2"><ChevronRight size={14} className="text-brand-gold mt-0.5 shrink-0" /> Beasiswa Program Magister bagi Dosen</li>
                    <li className="flex items-start gap-2"><ChevronRight size={14} className="text-brand-gold mt-0.5 shrink-0" /> Beasiswa Program Spesialis bagi Dokter</li>
                    <li className="flex items-start gap-2"><ChevronRight size={14} className="text-brand-gold mt-0.5 shrink-0" /> Beasiswa Program Split Site Magister Amerika</li>
                  </ul>
                  <button onClick={() => navigate('/mace/daftar', { state: { jalur: 'provinsi' } })} className="w-full py-2 bg-brand-gold text-white font-bold rounded-xl hover:bg-amber-500 transition-colors">Daftar Beasiswa</button>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-brand-blue/60 transition-all shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center text-white">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Bantuan Pendidikan</h4>
                    </div>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-2 mb-4">
                    <li className="flex items-start gap-2"><ChevronRight size={14} className="text-brand-blue mt-0.5 shrink-0" /> Bantuan Pembiayaan Studi Akhir bagi Mahasiswa</li>
                    <li className="flex items-start gap-2"><ChevronRight size={14} className="text-brand-blue mt-0.5 shrink-0" /> Bantuan Pembiayaan Pendidikan Profesi Kedokteran (KOAS)</li>
                    <li className="flex items-start gap-2"><ChevronRight size={14} className="text-brand-blue mt-0.5 shrink-0" /> Bantuan Pembiayaan Pendidikan Profesi Guru (PPG)</li>
                  </ul>
                  <button onClick={() => navigate('/mace/daftar', { state: { jalur: 'provinsi' } })} className="w-full py-2 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">Daftar Bantuan</button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MacePortal;
