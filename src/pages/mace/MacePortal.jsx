import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

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

          {/* Single registration entry for all regions */}
          <div className="p-8 md:p-12 bg-slate-50/50">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Pendaftaran Beasiswa MACE</h2>
              <p className="text-slate-500 mb-8">
                Terbuka untuk seluruh mahasiswa Orang Asli Papua dari daerah manapun.
                Klik tombol di bawah untuk memulai pendaftaran.
              </p>
              <button
                onClick={() => navigate('/mace/daftar', { state: { jalur: 'provinsi' } })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 gradient-blue text-white text-lg font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all"
              >
                Daftar Sekarang
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MacePortal;
