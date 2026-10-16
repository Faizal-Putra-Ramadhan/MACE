import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Download, GraduationCap, Award, School, Users, Loader2, ArrowLeft, FileText } from 'lucide-react';
import api from '../api/axios';
import { PROGRAM_OPTIONS_PROVINSI } from '../lib/pendaftaranConfig';

// Kategori MACE dipisah per program (A-F), mengikuti approval per program.
const MACE_CATEGORIES = PROGRAM_OPTIONS_PROVINSI.map(p => ({
  id: `mace_${p.id}`,
  label: `MACE ${p.id}`,
  desc: p.title,
  icon: GraduationCap,
  color: 'blue',
}));

const CATEGORIES = [
  ...MACE_CATEGORIES,
  { id: 'pace_slb', label: 'PACE SLB', desc: 'Pelajar Cerdas - Sekolah Luar Biasa', icon: School, color: 'gold' },
  { id: 'pace_snk', label: 'PACE SNK', desc: 'Pelajar Cerdas - Sekolah Kekhususan', icon: School, color: 'gold' },
  { id: 'pace_atlit', label: 'PACE Atlit Berprestasi', desc: 'Pelajar Cerdas - Siswa Atlit Berprestasi', icon: Award, color: 'gold' },
];

const PengumumanPenerima = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(MACE_CATEGORIES[0]?.id || 'mace_A');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/pengumuman/penerima');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch pengumuman', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentCategory = CATEGORIES.find(c => c.id === activeTab);
  const currentList = data ? data[activeTab] || [] : [];
  const isMace = activeTab.startsWith('mace');
  const skUrl = isMace
    ? (data?.sk_gubernur?.mace || data?.sk_gubernur?.mace_kabkota || data?.sk_gubernur?.mace_provinsi)
    : data?.sk_gubernur?.[activeTab];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue to-blue-700 text-white">
        <div className="container mx-auto px-6 py-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Megaphone size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Pengumuman Penerima</h1>
              <p className="text-white/80 mt-1">Daftar Penerima Bantuan Pendidikan Provinsi Papua</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" /> Memuat data...
          </div>
        ) : (
          <>
            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap mb-8">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const count = data?.[cat.id]?.length || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeTab === cat.id
                        ? cat.color === 'gold'
                          ? 'bg-brand-gold text-white premium-shadow'
                          : 'bg-brand-blue text-white premium-shadow'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={16} />
                    {cat.label}
                    {count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                        activeTab === cat.id ? 'bg-white/20' : 'bg-slate-100'
                      }`}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Category Content */}
            <div className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
              {/* Category Header */}
              <div className={`px-8 py-6 border-b border-slate-100 ${isMace ? 'bg-brand-blue/5' : 'bg-brand-gold/5'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className={`text-xl font-extrabold ${isMace ? 'text-brand-blue' : 'text-brand-gold'}`}>
                      {currentCategory.label}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">{currentCategory.desc}</p>
                    <p className="text-slate-400 text-xs mt-1">{currentList.length} penerima</p>
                  </div>
                  {skUrl && (skUrl.startsWith('http') || skUrl.startsWith('/')) && (
                    <a
                      href={skUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        isMace
                          ? 'bg-brand-blue text-white hover:opacity-90 premium-shadow'
                          : 'bg-brand-gold text-white hover:opacity-90 premium-shadow'
                      }`}
                    >
                      <Download size={16} />
                      Download SK Gubernur
                    </a>
                  )}
                </div>
              </div>

              {/* Data Table */}
              {currentList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <th className="px-6 py-4 font-bold w-16 text-center">NO</th>
                        <th className="px-6 py-4 font-bold">NAMA</th>
                        <th className="px-6 py-4 font-bold">{isMace ? 'NIM' : 'NISN'}</th>
                        <th className="px-6 py-4 font-bold">{isMace ? 'PERGURUAN TINGGI' : 'SEKOLAH'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentList.map((item) => (
                        <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3 text-center font-bold text-slate-400">{item.no}</td>
                          <td className="px-6 py-3 font-bold text-slate-900">{item.nama}</td>
                          <td className="px-6 py-3 text-slate-600 font-medium">{isMace ? item.nim : item.nisn}</td>
                          <td className="px-6 py-3 text-slate-500">{isMace ? item.kampus : item.sekolah}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-8 py-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Belum ada data penerima untuk kategori ini.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PengumumanPenerima;
