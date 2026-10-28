import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, ChevronRight, ArrowLeft, Award, Trophy, School } from 'lucide-react';

const PACE_TYPES = [
  { id: 'slb', label: 'SLB', fullLabel: 'Sekolah Luar Biasa', desc: 'Program untuk Sekolah Luar Biasa di seluruh wilayah Papua.', icon: School, color: 'bg-blue-500' },
  { id: 'snk', label: 'SNK', fullLabel: 'Sekolah Kekhususan', desc: 'Program untuk Sekolah Khusus dan Kekhususan di Papua.', icon: Building2, color: 'bg-emerald-500' },
  { id: 'atlit', label: 'Siswa Atlit Berprestasi', fullLabel: 'Siswa Atlit Berprestasi', desc: 'Program untuk siswa atlit berprestasi di Papua.', icon: Trophy, color: 'bg-amber-500' },
  { id: 'kedinasan', label: 'Sekolah Kedinasan', fullLabel: 'Program Persiapan Sekolah Kedinasan', desc: 'Program persiapan bagi siswa yang ingin melanjutkan ke sekolah kedinasan.', icon: Award, color: 'bg-purple-500' },
];

const PacePortal = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('main'); // main, school_list
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 'school_list' && selectedType) {
      setLoading(true);
      const fetchSchools = async () => {
        try {
          const response = await fetch('/api/pace/sekolah');
          const data = await response.json();
          if (response.ok) {
            const typeMap = { slb: 'SLB', snk: 'SNK', atlit: 'Siswa Atlit Berprestasi', kedinasan: 'Kedinasan' };
            const filtered = data.filter(s => s.jenis_sekolah === typeMap[selectedType]);
            setSchools(filtered.map(s => ({
              id: s.id,
              name: s.nama_sekolah,
              type: s.jenis_sekolah
            })));
          }
        } catch (err) {
          console.error('Failed to fetch schools', err);
        } finally {
          setLoading(false);
        }
      };
      fetchSchools();
    }
  }, [step, selectedType]);

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    if (typeId === 'atlit') {
      // Atlit berprestasi goes directly to login
      navigate(`/login?role=pace_atlit`);
    } else {
      setStep('school_list');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="gradient-gold text-white pt-12 pb-24 px-6 rounded-b-[3rem] premium-shadow">
        <div className="container mx-auto max-w-5xl">
          <button onClick={() => step === 'main' ? navigate('/') : setStep('main')} className="mb-8 text-white/80 hover:text-white flex items-center gap-2 font-medium transition-colors">
            <ArrowLeft size={18} />
            {step === 'main' ? 'Kembali ke Beranda' : 'Kembali ke Pilihan'}
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-gold premium-shadow">
              <span className="font-bold text-2xl">P</span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Beasiswa PACE</h1>
              <p className="text-xl text-white/90">Program Pelajar Cerdas Papua</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 -mt-16">
        <div className="bg-white rounded-[2rem] premium-shadow border border-slate-100 overflow-hidden mb-12">
          
          {/* === STEP: MAIN - Choose SLB, SNK, or Atlit === */}
          {step === 'main' && (
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Pilih Jenis Program</h2>
                <p className="text-slate-500">Pilih salah satu program PACE yang sesuai.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {PACE_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleSelectType(type.id)}
                    className="group text-left border-2 border-slate-200 hover:border-brand-gold/50 rounded-[2rem] p-8 transition-all hover:shadow-xl"
                  >
                    <div className={`w-16 h-16 rounded-2xl ${type.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform premium-shadow`}>
                      <type.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{type.fullLabel}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{type.desc}</p>
                    <div className="flex items-center gap-2 text-brand-gold font-bold text-sm">
                      <span>Pilih</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* === STEP: SCHOOL LIST === */}
          {step === 'school_list' && (
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-block bg-brand-gold/10 text-brand-gold text-sm font-bold px-4 py-1.5 rounded-full mb-3">
                  {PACE_TYPES.find(t => t.id === selectedType)?.label}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Pilih Sekolah</h2>
                <p className="text-slate-500">Pilih sekolah Anda untuk login dan mendaftarkan siswa.</p>
              </div>

              <div className="relative mb-8 max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari nama sekolah..."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-gold rounded-2xl py-3 pl-12 pr-4 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="text-center py-12 text-slate-500">Memuat daftar sekolah...</div>
              ) : filteredSchools.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <School className="mx-auto mb-3 text-slate-300" size={48} />
                  <p>Belum ada sekolah terdaftar untuk kategori ini.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredSchools.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => navigate(`/login?role=sekolah_pace&school=${encodeURIComponent(school.name)}`)}
                      className="group p-6 rounded-2xl border border-slate-200 hover:border-brand-gold/30 hover:bg-brand-gold/5 transition-all text-left flex flex-col justify-between h-full"
                    >
                      <div>
                        <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-2 py-1 rounded-md mb-3 inline-block">
                          {school.type}
                        </span>
                        <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-brand-gold transition-colors">
                          {school.name}
                        </h3>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-slate-400 group-hover:text-brand-gold">
                        <span className="text-sm font-medium">Klik untuk login</span>
                        <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacePortal;
