import React, { useState, useEffect, useRef } from 'react';
import { Award, Printer, School, Loader2 } from 'lucide-react';
import api from '../../../api/axios';

const PACE_TYPES = [
  { id: 'SLB', label: 'SLB' },
  { id: 'SNK', label: 'SNK' },
  { id: 'Siswa Atlit Berprestasi', label: 'Atlit Berprestasi' },
];

const formatRupiah = (num) => {
  if (!num) return 'Rp 0';
  return 'Rp ' + Number(num).toLocaleString('id-ID');
};

const AdminPaceDaftarLolos = () => {
  const [activeType, setActiveType] = useState('SLB');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pace/sekolah?jenis_sekolah=${activeType}`);
      setSchools(res.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeType]);

  const getStudents = (school) => (school.pace_siswas || school.PaceSiswas || []).filter(s => s.status_approval === 'approved' && s.nominal_pendanaan > 0);

  const allApproved = schools.flatMap(s => getStudents(s).map(st => ({ ...st, nama_sekolah: s.nama_sekolah, jenis_sekolah: s.jenis_sekolah })));
  const grandTotal = allApproved.reduce((sum, s) => sum + Number(s.nominal_pendanaan || 0), 0);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const win = window.open('', '', 'width=900,height=700');
    win.document.write(`
      <html><head><title>Daftar Lolos PACE - ${activeType}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { font-size: 18px; margin-bottom: 5px; text-align: center; }
        h2 { font-size: 14px; color: #666; margin-bottom: 20px; text-align: center; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
        .right { text-align: right; }
        .school-header { background: #f0f9ff; font-weight: bold; }
        .total-row { background: #fffbeb; font-weight: bold; font-size: 12px; }
        .grand-total { background: #fef3c7; font-weight: bold; font-size: 14px; }
      </style></head><body>
      ${printContent.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Award className="text-brand-gold" />
            PACE Daftar Lolos & Pendanaan
          </h2>
          <p className="text-slate-500 mt-1">Daftar siswa PACE yang lolos seleksi beserta nominal pendanaan per sekolah.</p>
        </div>
        {allApproved.length > 0 && (
          <button onClick={handlePrint} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold flex items-center gap-2 premium-shadow transition-colors">
            <Printer size={18} /> Cetak PDF
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {PACE_TYPES.map(type => (
          <button key={type.id} onClick={() => setActiveType(type.id)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              activeType === type.id ? 'bg-brand-gold text-white premium-shadow' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-gold'
            }`}>{type.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Memuat data...</div>
      ) : (
        <>
          <div ref={printRef}>
            <div className="hidden print:block">
              <h1>DAFTAR SISWA LOLOS SELEKSI PROGRAM PACE</h1>
              <h2>Kategori: {activeType}</h2>
            </div>
            {schools.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 premium-shadow border border-slate-100 text-center">
                <School className="mx-auto mb-4 text-slate-300" size={48} />
                <p className="text-slate-500">Belum ada data sekolah untuk kategori {activeType}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schools.map((school) => {
                  const approved = getStudents(school);
                  const schoolTotal = approved.reduce((sum, s) => sum + Number(s.nominal_pendanaan || 0), 0);
                  if (approved.length === 0) return null;
                  return (
                    <div key={school.id} className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
                      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <School className="text-brand-gold" size={20} />
                          <h3 className="font-bold text-slate-900">{school.nama_sekolah}</h3>
                          <span className="text-xs text-slate-500">({approved.length} siswa lolos)</span>
                        </div>
                        <span className="font-bold text-brand-gold text-sm">{formatRupiah(schoolTotal)}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="text-slate-500 border-b border-slate-100">
                              <th className="px-6 py-3 font-bold">No</th>
                              <th className="px-6 py-3 font-bold">NISN</th>
                              <th className="px-6 py-3 font-bold">NAMA</th>
                              <th className="px-6 py-3 font-bold">KELAS</th>
                              <th className="px-6 py-3 font-bold text-right">NOMINAL PENDANAAN</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {approved.map((s, idx) => (
                              <tr key={s.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-3 text-slate-500">{idx + 1}</td>
                                <td className="px-6 py-3 font-medium text-slate-900">{s.nisn}</td>
                                <td className="px-6 py-3 font-bold text-slate-900">{s.nama}</td>
                                <td className="px-6 py-3 text-slate-500">{s.kelas}</td>
                                <td className="px-6 py-3 text-right font-bold text-brand-gold">{formatRupiah(s.nominal_pendanaan)}</td>
                              </tr>
                            ))}
                            <tr className="bg-amber-50">
                              <td colSpan="4" className="px-6 py-3 text-right font-bold text-slate-900">Subtotal {school.nama_sekolah}</td>
                              <td className="px-6 py-3 text-right font-bold text-brand-gold">{formatRupiah(schoolTotal)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}

                {allApproved.length > 0 && (
                  <div className="bg-brand-gold/10 rounded-3xl p-6 border border-brand-gold/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-600">TOTAL KESELURUHAN PENDANAAN - {activeType}</p>
                        <p className="text-sm text-slate-500">{allApproved.length} siswa dari {schools.filter(s => getStudents(s).length > 0).length} sekolah</p>
                      </div>
                      <p className="text-3xl font-extrabold text-brand-gold">{formatRupiah(grandTotal)}</p>
                    </div>
                  </div>
                )}

                {allApproved.length === 0 && (
                  <div className="bg-white rounded-3xl p-12 premium-shadow border border-slate-100 text-center">
                    <Award className="mx-auto mb-4 text-slate-300" size={48} />
                    <p className="text-slate-500">Belum ada siswa yang lolos untuk kategori {activeType}.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPaceDaftarLolos;
