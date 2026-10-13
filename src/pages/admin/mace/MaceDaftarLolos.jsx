import React, { useState, useEffect, useRef } from 'react';
import { Award, Printer, Loader2, GraduationCap } from 'lucide-react';
import api from '../../../api/axios';
import { getPendaftarNama, getPendaftarNim, getPendaftarPt, getPendaftarProdi } from '../../../lib/pendaftaran';

const formatRupiah = (num) => {
  if (!num) return 'Rp 0';
  return 'Rp ' + Number(num).toLocaleString('id-ID');
};

const AdminMaceDaftarLolos = () => {
  const [pendaftaranList, setPendaftaranList] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/pendaftaran');
        setPendaftaranList((res.data || []).filter(p => p.status === 'lolos_berkas' || p.status === 'selesai'));
      } catch (err) {
        console.error('Failed to fetch', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPendanaan = pendaftaranList.reduce((sum, p) => sum + Number(p.nominal_dana || 0), 0);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const win = window.open('', '', 'width=900,height=700');
    win.document.write(`
      <html><head><title>Daftar Lolos MACE</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { font-size: 18px; margin-bottom: 5px; text-align: center; }
        h2 { font-size: 14px; color: #666; margin-bottom: 20px; text-align: center; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
        .total-row { background: #fffbeb; font-weight: bold; }
      </style></head><body>${printContent.innerHTML}</body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <GraduationCap className="text-brand-blue" />
            MACE Daftar Lolos Pendanaan
          </h2>
          <p className="text-slate-500 mt-1">Daftar mahasiswa MACE yang lolos seleksi beserta nominal pendanaan.</p>
        </div>
        {pendaftaranList.length > 0 && (
          <button onClick={handlePrint} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold flex items-center gap-2 premium-shadow">
            <Printer size={18} /> Cetak PDF
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Memuat data...</div>
      ) : pendaftaranList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 premium-shadow border border-slate-100 text-center">
          <Award className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-slate-500">Belum ada mahasiswa yang lolos seleksi.</p>
        </div>
      ) : (
        <>
          <div ref={printRef}>
            <div className="hidden print:block">
              <h1>DAFTAR MAHASISWA LOLOS SELEKSI PROGRAM MACE</h1>
              <h2>Data Penerima Pendanaan</h2>
            </div>
            <div className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                      <th className="px-6 py-4 font-bold">No</th>
                      <th className="px-6 py-4 font-bold">NIM</th>
                      <th className="px-6 py-4 font-bold">NAMA</th>
                      <th className="px-6 py-4 font-bold">KAMPUS</th>
                      <th className="px-6 py-4 font-bold">PRODI</th>
                      <th className="px-6 py-4 font-bold">PROGRAM</th>
                      <th className="px-6 py-4 font-bold text-right">NOMINAL PENDANAAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendaftaranList.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 text-slate-500">{idx + 1}</td>
                        <td className="px-6 py-3 font-medium text-slate-900">{getPendaftarNim(p)}</td>
                        <td className="px-6 py-3 font-bold text-slate-900">{getPendaftarNama(p)}</td>
                        <td className="px-6 py-3 text-slate-500">{getPendaftarPt(p)}</td>
                        <td className="px-6 py-3 text-slate-500">{getPendaftarProdi(p)}</td>
                        <td className="px-6 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">Program {p.program}</span></td>
                        <td className="px-6 py-3 text-right font-bold text-brand-blue">{formatRupiah(p.nominal_dana)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50 border-t-2 border-brand-blue">
                      <td colSpan="6" className="px-6 py-4 text-right font-extrabold text-slate-900">TOTAL PENDANAAN</td>
                      <td className="px-6 py-4 text-right font-extrabold text-brand-blue text-lg">{formatRupiah(totalPendanaan)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
              <p className="text-blue-700 font-bold text-sm mb-1">Total Mahasiswa Lolos</p>
              <p className="text-4xl font-extrabold text-blue-900">{pendaftaranList.length}</p>
            </div>
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
              <p className="text-amber-700 font-bold text-sm mb-1">Total Pendanaan</p>
              <p className="text-4xl font-extrabold text-amber-900">{formatRupiah(totalPendanaan)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMaceDaftarLolos;
