import React, { useState } from 'react';
import { Search, FileText, Check, X, Eye, ChevronDown, ChevronUp, Building2 } from 'lucide-react';

const AdminPaceApproval = () => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  // Dummy data
  const [schools, setSchools] = useState([
    { 
      id: 1, nama: 'SLB N 1 JAYAPURA', jenis: 'SLB', npsn: '10600123', 
      alamat: 'Jl. Raya Abepura No. 12, Jayapura', no_rekening: 'BRI - 0123456789 - SLB N 1 JAYAPURA',
      status_surat: 'pending', surat_permohonan: 'surat_permohonan_slbn1.pdf',
      jumlah_siswa: 15, siswa_disetujui: 0, siswa_ditolak: 0,
      siswa: [
        { id: 1, nama: 'ASEP RUMBIAK', nisn: '0123456789', kelas: 'X', status: 'pending', file_rapor: 'rapor_asep.pdf', file_sktm: 'sktm_asep.pdf' },
        { id: 2, nama: 'MARIA WENDA', nisn: '0123456791', kelas: 'XI', status: 'pending', file_rapor: 'rapor_maria.pdf', file_sktm: 'sktm_maria.pdf' },
        { id: 3, nama: 'YOHANES YOMAN', nisn: '0123456792', kelas: 'X', status: 'pending', file_rapor: 'rapor_yohanes.pdf', file_sktm: null },
      ]
    },
    { 
      id: 2, nama: 'SNK SAINS DAN BAHASA', jenis: 'SNK', npsn: '10600124', 
      alamat: 'Jl. Pendidikan No. 5, Jayapura', no_rekening: 'BNI - 9876543210 - SNK SAINS',
      status_surat: 'approved', surat_permohonan: 'surat_resmi_snk.pdf',
      jumlah_siswa: 22, siswa_disetujui: 22, siswa_ditolak: 0,
      siswa: [
        { id: 4, nama: 'YOHANA WEA', nisn: '0123456790', kelas: 'XI', status: 'approved', file_rapor: 'rapor_yohana.pdf', file_sktm: 'sktm_yohana.pdf' },
      ]
    },
  ]);

  const handleApproveSurat = (schoolId) => {
    setSchools(schools.map(s => s.id === schoolId ? { ...s, status_surat: 'approved' } : s));
  };

  const handleRejectSurat = (schoolId) => {
    setSchools(schools.map(s => s.id === schoolId ? { ...s, status_surat: 'rejected' } : s));
  };

  const handleApproveSiswa = (schoolId, siswaId) => {
    setSchools(schools.map(s => {
      if (s.id === schoolId) {
        return {
          ...s,
          siswa: s.siswa.map(st => st.id === siswaId ? { ...st, status: 'approved' } : st),
          siswa_disetujui: s.siswa_disetujui + 1,
        };
      }
      return s;
    }));
  };

  const handleRejectSiswa = (schoolId, siswaId) => {
    setSchools(schools.map(s => {
      if (s.id === schoolId) {
        return {
          ...s,
          siswa: s.siswa.map(st => st.id === siswaId ? { ...st, status: 'rejected' } : st),
          siswa_ditolak: s.siswa_ditolak + 1,
        };
      }
      return s;
    }));
  };

  const handleApproveAllSiswa = (schoolId) => {
    setSchools(schools.map(s => {
      if (s.id === schoolId) {
        const pendingCount = s.siswa.filter(st => st.status === 'pending').length;
        return {
          ...s,
          siswa: s.siswa.map(st => st.status === 'pending' ? { ...st, status: 'approved' } : st),
          siswa_disetujui: s.siswa_disetujui + pendingCount,
        };
      }
      return s;
    }));
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Disetujui</span>;
    if (status === 'rejected') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Ditolak</span>;
    return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu</span>;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Approval Sekolah & Siswa</h2>
        <p className="text-slate-500 mt-1">Tinjau surat permohonan, berkas siswa, dan setujui/tolak pendaftaran.</p>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari sekolah..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 focus:border-brand-gold rounded-xl py-2.5 pl-10 pr-4 outline-none text-sm transition-colors premium-shadow"
        />
      </div>

      {/* School Cards */}
      <div className="space-y-4">
        {schools.filter(s => s.nama.toLowerCase().includes(search.toLowerCase())).map((school) => (
          <div key={school.id} className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
            {/* School Header */}
            <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="text-brand-blue" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{school.nama}</h3>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold">{school.jenis}</span>
                  </div>
                  <p className="text-sm text-slate-500">{school.alamat}</p>
                  <p className="text-xs text-slate-400 mt-1">NPSN: {school.npsn} • Rekening: {school.no_rekening}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Surat Permohonan Status & Actions */}
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2">
                  <FileText size={16} className="text-brand-blue" />
                  <span className="text-sm font-medium text-slate-600">Surat:</span>
                  {getStatusBadge(school.status_surat)}
                  {school.surat_permohonan && (
                    <button className="text-brand-blue hover:underline text-xs font-bold ml-2 flex items-center gap-1">
                      <Eye size={14} /> Lihat
                    </button>
                  )}
                  {school.status_surat === 'pending' && (
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => handleApproveSurat(school.id)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Setujui Surat">
                        <Check size={14} />
                      </button>
                      <button onClick={() => handleRejectSurat(school.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Tolak Surat">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setExpandedId(expandedId === school.id ? null : school.id)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  {expandedId === school.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* Expandable Siswa Section */}
            {expandedId === school.id && (
              <div className="border-t border-slate-100">
                <div className="p-4 bg-slate-50 flex items-center justify-between">
                  <h4 className="font-bold text-slate-700 text-sm">Daftar Siswa ({school.siswa.length} siswa)</h4>
                  {school.siswa.some(s => s.status === 'pending') && (
                    <button 
                      onClick={() => handleApproveAllSiswa(school.id)}
                      className="text-xs font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Setujui Semua Siswa Pending
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <th className="px-6 py-3 font-bold">NISN</th>
                        <th className="px-6 py-3 font-bold">NAMA SISWA</th>
                        <th className="px-6 py-3 font-bold">KELAS</th>
                        <th className="px-6 py-3 font-bold">BERKAS</th>
                        <th className="px-6 py-3 font-bold">STATUS</th>
                        <th className="px-6 py-3 font-bold text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {school.siswa.map((siswa) => (
                        <tr key={siswa.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3 font-medium text-slate-900">{siswa.nisn}</td>
                          <td className="px-6 py-3 font-bold text-slate-900">{siswa.nama}</td>
                          <td className="px-6 py-3 text-slate-500">{siswa.kelas}</td>
                          <td className="px-6 py-3">
                            <div className="flex gap-3">
                              {siswa.file_rapor ? (
                                <button className="flex items-center gap-1 text-brand-blue hover:underline text-xs font-bold">
                                  <FileText size={14} /> Rapor
                                </button>
                              ) : (
                                <span className="text-red-400 text-xs flex items-center gap-1"><X size={14} /> Rapor</span>
                              )}
                              {siswa.file_sktm ? (
                                <button className="flex items-center gap-1 text-brand-blue hover:underline text-xs font-bold">
                                  <FileText size={14} /> SKTM
                                </button>
                              ) : (
                                <span className="text-red-400 text-xs flex items-center gap-1"><X size={14} /> SKTM</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-3">{getStatusBadge(siswa.status)}</td>
                          <td className="px-6 py-3 text-right">
                            {siswa.status === 'pending' && (
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleApproveSiswa(school.id, siswa.id)} 
                                  className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" 
                                  title="Setujui Siswa"
                                >
                                  <Check size={16} />
                                </button>
                                <button 
                                  onClick={() => handleRejectSiswa(school.id, siswa.id)} 
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                                  title="Tolak Siswa"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPaceApproval;
