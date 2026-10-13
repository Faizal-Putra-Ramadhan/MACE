import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Award, ChevronRight, MapPin, Building2, Users, Megaphone, ClipboardCheck, Star } from 'lucide-react';
import AbstraksiProgram from '../components/AbstraksiProgram';

const LandingPageProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section with Bridge Background */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/bg_papua_sunrise.png" 
            alt="Matahari dan anak-anak Papua" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-32 bg-brand-gold/20 backdrop-blur-md border border-brand-gold/50 rounded-b-full flex items-end justify-center pb-4 premium-shadow">
              <img 
                src="/logo_papua.png" 
                alt="Logo Papua" 
                className="w-16 h-16 object-contain drop-shadow-md"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Beasiswa Pendidikan <br />
            <span className="text-brand-gold">Pace Mace</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto font-light">
            Mewujudkan Generasi Papua Cerdas, Unggul, dan Berdaya Saing melalui Program Bantuan Pendidikan Terintegrasi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/pace')}
              className="group relative flex items-center justify-between w-full sm:w-auto min-w-[280px] gradient-gold text-white hover:opacity-90 rounded-2xl p-4 transition-all duration-300 premium-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Award size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Beasiswa PACE</div>
                  <div className="text-sm opacity-90">Pelajar Cerdas (Sekolah)</div>
                </div>
              </div>
              <ChevronRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => navigate('/mace')}
              className="group relative flex items-center justify-between w-full sm:w-auto min-w-[280px] bg-white text-brand-blue hover:bg-brand-blue hover:text-white rounded-2xl p-4 transition-all duration-300 premium-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 group-hover:bg-white/20 flex items-center justify-center text-brand-blue group-hover:text-white transition-colors">
                  <GraduationCap size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Beasiswa MACE</div>
                  <div className="text-sm opacity-80">Mahasiswa Cerdas (Kuliah)</div>
                </div>
              </div>
              <ChevronRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Pengumuman Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/pengumuman-penerima')}
              className="group relative flex items-center justify-between w-full sm:w-auto min-w-[280px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-4 transition-all duration-300 premium-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Megaphone size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Pengumuman Penerima</div>
                  <div className="text-sm opacity-90">Daftar Penerima Bantuan</div>
                </div>
              </div>
              <ChevronRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Profile Section (Visi Misi, Gubernur) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Leadership Profiles */}
            <div className="lg:w-1/2 flex justify-center gap-6">
              <div className="flex flex-col items-center group">
                <div className="w-48 h-64 bg-slate-200 rounded-[2rem] overflow-hidden premium-shadow relative mb-6">
                  <img 
                    src="/foto_gub.png" 
                    alt="Gubernur Papua" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 text-center">Gubernur Papua</h3>
                <p className="text-brand-gold font-medium text-center text-sm">Komjen Pol. (Purn.) Dr. Drs. Mathius Derek Fakhiri, S.I.K., M.H</p>
              </div>
              <div className="flex flex-col items-center group mt-12">
                <div className="w-48 h-64 bg-slate-200 rounded-[2rem] overflow-hidden premium-shadow relative mb-6">
                  <img 
                    src="/foto_wakil.png" 
                    alt="Wakil Gubernur Papua" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 text-center">Wakil Gubernur</h3>
                <p className="text-brand-gold font-medium text-center text-sm">Dr. Aryoko Alberto Ferdinand Rumaropen, S.P., M.Eng</p>
              </div>
            </div>

            {/* Visi Misi */}
            <div className="lg:w-1/2">
              <div className="inline-block bg-brand-gold/10 text-brand-gold font-bold px-4 py-2 rounded-full mb-4">
                Visi & Misi
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
                Mewujudkan Papua Cerah <br/>(Cerdas, sejahtera, <br/>dan harmonis)
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex-shrink-0 flex items-center justify-center text-brand-blue">
                    <span className="font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Pendidikan Berkualitas</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Memastikan akses pendidikan Khusus, Pendidikan Kekhususan dan Pendidikan Tinggi Vokasi bagi anak-anak Orang Asli Papua (OAP) melalui program PACE dan MACE.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex-shrink-0 flex items-center justify-center text-brand-blue">
                    <span className="font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Pemberdayaan Ekonomi</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Meningkatkan kemandirian ekonomi masyarakat melalui pengembangan sektor unggulan daerah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kriteria dan Persyaratan Penerima */}
      <section className="py-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-brand-gold/20 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-4">
              <ClipboardCheck size={18} />
              <span className="font-bold text-sm">Syarat Pengajuan Beasiswa</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Kriteria dan Persyaratan Penerima</h2>
            <p className="text-white/70 mt-3 max-w-xl mx-auto">Ketentuan umum untuk mengajukan beasiswa PACE dan MACE Provinsi Papua.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Kriteria Umum */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center">
                  <ClipboardCheck size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-extrabold">A. Kriteria Umum</h3>
              </div>
              <p className="text-white/80 text-sm mb-4">Penerima Program PACE-MACE Papua harus memenuhi kriteria:</p>
              <ol className="space-y-3">
                {[
                  'Warga Negara Indonesia',
                  'Berdomisili di Papua atau memiliki keterkaitan administratif dengan Papua',
                  'Terdaftar pada satuan pendidikan atau perguruan tinggi yang sah',
                  'Tidak sedang menerima bantuan sejenis untuk komponen pembiayaan yang sama',
                  'Memenuhi ketentuan program yang ditetapkan',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-gold/30 text-brand-gold flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-white/90 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Prioritas Penerima */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Star size={20} className="text-brand-gold" />
                </div>
                <h3 className="text-xl font-extrabold">B. Prioritas Penerima</h3>
              </div>
              <p className="text-white/80 text-sm mb-4">Prioritas diberikan kepada:</p>
              <ol className="space-y-3">
                {[
                  'Orang Asli Papua (OAP)',
                  'Keluarga kurang mampu',
                  'Peserta didik dan mahasiswa berprestasi',
                  'Wilayah 3T',
                  'Kelompok rentan',
                  'Penyandang disabilitas',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-white/90 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Abstraksi Beasiswa PACE & MACE */}
      <AbstraksiProgram />

      {/* Info Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl premium-shadow flex items-start gap-4">
              <Building2 className="text-brand-blue flex-shrink-0" size={32} />
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Kantor Gubernur</h4>
                <p className="text-slate-500">Jl. Soa Sio Dok II, Jayapura, Papua</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl premium-shadow flex items-start gap-4">
              <MapPin className="text-brand-blue flex-shrink-0" size={32} />
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Pusat Layanan</h4>
                <p className="text-slate-500">Dinas Pendidikan Provinsi Papua</p>
              </div>
            </div>
            <div className="bg-brand-blue p-8 rounded-3xl premium-shadow flex flex-col justify-center text-white">
              <h4 className="font-bold text-xl mb-2">Butuh Bantuan?</h4>
              <p className="text-white/80 mb-4">Hubungi tim support kami.</p>
              <button className="bg-white text-brand-blue font-bold px-6 py-2 rounded-xl w-fit">Hubungi Kami</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageProfile;
