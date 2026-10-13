import React, { useState, useEffect } from 'react';
import { Search, FileText, Check, X, Eye, ChevronDown, ChevronUp, Building2, School, Loader2, XCircle, ExternalLink } from 'lucide-react';
import api from '../../../api/axios';

const PACE_TYPES = [
  { id: 'SLB', label: 'SLB' },
  { id: 'SNK', label: 'SNK' },
  { id: 'Siswa Atlit Berprestasi', label: 'Atlit Berprestasi' },
];

const AdminPaceApproval = () => {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('SLB');
  const [expandedId, setExpandedId] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nominalInputs, setNominalInputs] = useState({});
  const [selectedSiswa, setSelectedSiswa] = useState(null);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pace/sekolah?jenis_sekolah=${activeType}`);
      setSchools(res.data);
    } catch (err) {
      console.error('Failed to fetch schools', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchools(); }, [activeType]);

  const handleApproveSurat = async (schoolId) => {
    try {
      await api.put(`/pace/sekolah/${schoolId}/status`, { status: 'approved' });
      fetchSchools();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyetujui surat');
    }
  };

  const handleRejectSurat = async (schoolId) => {
    try {
      await api.put(`/pace/sekolah/${schoolId}/status`, { status: 'rejected' });
      fetchSchools();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menolak surat');
    }
  };

  const handleApproveSiswa = async (siswaId) => {
    const nominal = nominalInputs[siswaId] ? Number(nominalInputs[siswaId]) : 0;
    try {
      await api.put(`/pace/siswa/${siswaId}/status`, { status: 'approved', nominal_pendanaan: nominal });
      fetchSchools();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyetujui siswa');
    }
  };

  const handleRejectSiswa = async (siswaId) => {
    try {
      await api.put(`/pace/siswa/${siswaId}/status`, { status: 'rejected' });
      fetchSchools();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menolak siswa');
    }
  };

  const handleApproveAllSiswa = async (school) => {
    const pendingStudents = (school.pace_siswas || school.PaceSiswas || []).filter(s => s.status_approval === 'pending');
    for (const siswa of pendingStudents) {
      try {
        const nominal = nominalInputs[siswa.id] ? Number(nominalInputs[siswa.id]) : 0;
        await api.put(`/pace/siswa/${siswa.id}/status`, { status: 'approved', nominal_pendanaan: nominal });
      } catch (err) {
        console.error(`Failed to approve siswa ${siswa.id}`, err);
      }
    }
    fetchSchools();
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Disetujui</span>;
    if (status === 'rejected') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Ditolak</span>;
    return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu</span>;
  };

  const getStudents = (school) => school.pace_siswas || school.PaceSiswas || [];

    const isValidUrl = (url) => !!url && (url.startsWith('http') || url.startsWith('/'));

  const FILE_FIELDS = [
    { key: 'file_rapor', label: 'Rapor' },
    { key: 'file_sktm', label: 'SKTM' },
    { key: 'file_prestasi_akademik', label: 'Sertifikat Prestasi Akademik' },
    { key: 'file_prestasi_non_akademik', label: 'Sertifikat Prestasi Non-Akademik' },
    { key: 'foto_profil', label: 'Foto Profil' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">PACE Approval</h2>
        <p className="text-slate-500 mt-1">Tinjau surat permohonan sekolah dan data siswa PACE, lalu setujui/tolak dengan nominal pendanaan.</p>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {PACE_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeType === type.id ? 'bg-brand-gold text-white premium-shadow' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-gold'
              }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type="text" placeholder="Cari sekolah..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 focus:border-brand-gold rounded-xl py-2.5 pl-10 pr-4 outline-none text-sm transition-colors premium-shadow" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Memuat data...</div>
      ) : (
        <div className="space-y-4">
          {schools.filter(s => s.nama_sekolah.toLowerCase().includes(search.toLowerCase())).map((school) => {
            const students = getStudents(school);
            const pendingCount = students.filter(s => s.status_approval === 'pending').length;
            return (
              <div key={school.id} className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
                <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <School className="text-brand-gold" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{school.nama_sekolah}</h3>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold">{school.jenis_sekolah}</span>
                      </div>
                      <p className="text-sm text-slate-500">{school.alamat || 'Alamat belum diisi'}</p>
                      <p className="text-xs text-slate-400 mt-1">NPSN: {school.npsn || '-'} | Rekening: {school.no_rekening || '-'} | {students.length} siswa</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2">
                      <FileText size={16} className="text-brand-blue" />
                      <span className="text-sm font-medium text-slate-600">Surat:</span>
                      {getStatusBadge(school.status_approval)}
                      {school.surat_permohonan && (
                        <a href={school.surat_permohonan} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline text-xs font-bold ml-2 flex items-center gap-1">
                          <Eye size={14} /> Lihat
                        </a>
                      )}
                      {school.status_approval === 'pending' && (
                        <div className="flex gap-1 ml-2">
                          <button onClick={() => handleApproveSurat(school.id)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Setujui">
                            <Check size={14} />
                          </button>
                          <button onClick={() => handleRejectSurat(school.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Tolak">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setExpandedId(expandedId === school.id ? null : school.id)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                      {expandedId === school.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {expandedId === school.id && (
                  <div className="border-t border-slate-100">
                    <div className="p-4 bg-slate-50 flex items-center justify-between">
                      <h4 className="font-bold text-slate-700 text-sm">Daftar Siswa ({students.length} siswa, {pendingCount} pending)</h4>
                      {pendingCount > 0 && (
                        <button onClick={() => handleApproveAllSiswa(school)} className="text-xs font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors">
                          Setujui Semua Pending
                        </button>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <th className="px-6 py-3 font-bold">NISN</th>
                            <th className="px-6 py-3 font-bold">NAMA</th>
                            <th className="px-6 py-3 font-bold">KELAS</th>
                            <th className="px-6 py-3 font-bold">USULAN ANGGARAN</th>
                            <th className="px-6 py-3 font-bold">STATUS</th>
                            <th className="px-6 py-3 font-bold text-right">AKSI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {students.map((siswa) => (
                            <tr key={siswa.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-3 font-medium text-slate-900">{siswa.nisn}</td>
                              <td className="px-6 py-3 font-bold text-slate-900">{siswa.nama}</td>
                              <td className="px-6 py-3 text-slate-500">{siswa.kelas}</td>
                              <td className="px-6 py-3 text-xs text-slate-500">
                                {siswa.usulan_anggaran ? (
                                  <div>
                                    {siswa.usulan_anggaran.biaya_lain_lain && <div>Lain-lain: Rp {Number(siswa.usulan_anggaran.biaya_lain_lain).toLocaleString('id-ID')}</div>}
                                    {siswa.usulan_anggaran.spp_per_semester && <div>SPP: Rp {Number(siswa.usulan_anggaran.spp_per_semester).toLocaleString('id-ID')}</div>}
                                    {siswa.usulan_anggaran.komite_per_semester && <div>Komite: Rp {Number(siswa.usulan_anggaran.komite_per_semester).toLocaleString('id-ID')}</div>}
                                  </div>
                                ) : '-'}
                              </td>
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(siswa.status_approval)}
                                  {siswa.status_approval === 'approved' && siswa.nominal_pendanaan > 0 && (
                                    <span className="text-xs font-bold text-brand-gold">Rp {Number(siswa.nominal_pendanaan).toLocaleString('id-ID')}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-3 text-right">
                                <div className="flex justify-end items-center gap-2">
                                  <button onClick={() => setSelectedSiswa(siswa)} className="p-1.5 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 rounded-lg transition-colors" title="Detail">
                                    <Eye size={16} />
                                  </button>
                                  {siswa.status_approval === 'pending' && (
                                    <>
                                      <input
                                        type="number"
                                        placeholder="Nominal"
                                        value={nominalInputs[siswa.id] || ''}
                                        onChange={(e) => setNominalInputs(prev => ({ ...prev, [siswa.id]: e.target.value }))}
                                        className="w-28 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs outline-none focus:border-brand-gold"
                                      />
                                      <button onClick={() => handleApproveSiswa(siswa.id)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Setujui">
                                        <Check size={16} />
                                      </button>
                                      <button onClick={() => handleRejectSiswa(siswa.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Tolak">
                                        <X size={16} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                          {students.length === 0 && (
                            <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-400">Belum ada siswa terdaftar.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {schools.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <School className="mx-auto mb-3 text-slate-300" size={48} />
              <p>Belum ada sekolah terdaftar untuk kategori {activeType}.</p>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedSiswa(null)}>
          <div className="bg-white rounded-3xl premium-shadow max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-8 py-5 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Detail Siswa</h3>
                <p className="text-sm text-slate-500">{selectedSiswa.nama} - NISN: {selectedSiswa.nisn}</p>
              </div>
              <button onClick={() => setSelectedSiswa(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <XCircle size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Identity */}
              <div>
                <h4 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-4">Identitas Siswa</h4>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    ['Nama', selectedSiswa.nama],
                    ['NISN', selectedSiswa.nisn],
                    ['NIK', selectedSiswa.nik],
                    ['Kelas', selectedSiswa.kelas],
                    ['Tempat Lahir', selectedSiswa.tempat_lahir],
                    ['Tanggal Lahir', selectedSiswa.tanggal_lahir ? new Date(selectedSiswa.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : null],
                    ['Alamat', selectedSiswa.alamat],
                    ['Nama Orang Tua', selectedSiswa.nama_orang_tua],
                    ['No. HP Orang Tua', selectedSiswa.no_hp_orang_tua],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs font-bold text-slate-400">{label}</p>
                      <p className="text-sm font-medium text-slate-900">{value || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Anggaran */}
              <div>
                <h4 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-4">Status & Anggaran</h4>
                <div className="grid md:grid-cols-3 gap-x-8 gap-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400">Status Approval</p>
                    <div className="mt-1">{getStatusBadge(selectedSiswa.status_approval)}</div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">Nominal Pendanaan</p>
                    <p className="text-sm font-bold text-brand-gold">
                      {selectedSiswa.nominal_pendanaan ? `Rp ${Number(selectedSiswa.nominal_pendanaan).toLocaleString('id-ID')}` : '-'}
                    </p>
                  </div>
                </div>
                {selectedSiswa.usulan_anggaran && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 mb-2">Usulan Anggaran</p>
                    <div className="grid md:grid-cols-3 gap-2 text-sm">
                      {Object.entries(selectedSiswa.usulan_anggaran).filter(([, v]) => v).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-slate-400">{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                          <p className="font-bold text-slate-800">Rp {Number(value).toLocaleString('id-ID')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Uploaded Files */}
              <div>
                <h4 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-4">Berkas yang Diupload</h4>
                {(() => {
                  const files = FILE_FIELDS.filter(f => selectedSiswa[f.key]);
                  if (files.length === 0) return <p className="text-sm text-slate-400 italic">Belum ada berkas yang diupload.</p>;
                  return (
                    <div className="grid md:grid-cols-2 gap-3">
                      {files.map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-brand-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{label}</p>
                            {isValidUrl(selectedSiswa[key]) ? (
                              <a href={selectedSiswa[key]} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-brand-blue hover:underline flex items-center gap-1 mt-0.5">
                                <ExternalLink size={12} /> Lihat File
                              </a>
                            ) : (
                              <p className="text-xs text-red-400 italic">File tidak valid</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaceApproval;
