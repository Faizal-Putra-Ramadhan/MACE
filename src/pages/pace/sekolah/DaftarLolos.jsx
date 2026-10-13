import React, { useState, useEffect, useRef } from 'react';
import { Award, Printer } from 'lucide-react';
import api from '../../../api/axios';

const formatRupiah = (num) => {
  if (!num) return 'Rp 0';
  return 'Rp ' + Number(num).toLocaleString('id-ID');
};

const PaceDaftarLolos = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/pace/siswa');
        setStudents(res.data.filter(s => s.status_approval === 'approved' && s.nominal_pendanaan > 0));
      } catch (err) {
        console.error('Failed to fetch students', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const totalPendanaan = students.reduce((sum, s) => sum + Number(s.nominal_pendanaan || 0), 0);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(`
      <html><head><title>Daftar Siswa Lolos PACE</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { font-size: 18px; margin-bottom: 5px; }
        h2 { font-size: 14px; color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
        .total-row { background: #f0f9ff; font-weight: bold; }
        .right { text-align: right; }
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
            Daftar Siswa Lolos & Pendanaan
          </h2>
          <p className="text-slate-500 mt-1">Daftar siswa yang lolos seleksi beserta nominal pendanaan.</p>
        </div>
        {students.length > 0 && (
          <button onClick={handlePrint} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold flex items-center gap-2 premium-shadow transition-colors">
            <Printer size={18} />
            Cetak PDF
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Memuat data...</div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 premium-shadow border border-slate-100 text-center">
          <Award className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-slate-500 font-medium">Belum ada siswa yang lolos seleksi.</p>
          <p className="text-slate-400 text-sm mt-1">Data akan muncul setelah admin menyetujui pendaftaran siswa.</p>
        </div>
      ) : (
        <>
          {/* Printable content */}
          <div ref={printRef}>
            <div className="hidden print:block">
              <h1>DAFTAR SISWA LOLOS SELEKSI PROGRAM PACE</h1>
              <h2>Data Siswa Penerima Pendanaan</h2>
            </div>
            <div className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                      <th className="px-6 py-4 font-bold">No</th>
                      <th className="px-6 py-4 font-bold">NISN</th>
                      <th className="px-6 py-4 font-bold">NAMA LENGKAP</th>
                      <th className="px-6 py-4 font-bold">KELAS</th>
                      <th className="px-6 py-4 font-bold">STATUS</th>
                      <th className="px-6 py-4 font-bold text-right">NOMINAL PENDANAAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-slate-500">{idx + 1}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{student.nisn}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{student.nama}</td>
                        <td className="px-6 py-4 text-slate-500">{student.kelas}</td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Disetujui</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-brand-gold">
                          {formatRupiah(student.nominal_pendanaan)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-brand-gold/5 border-t-2 border-brand-gold">
                      <td colSpan="5" className="px-6 py-4 text-right font-extrabold text-slate-900">TOTAL PENDANAAN</td>
                      <td className="px-6 py-4 text-right font-extrabold text-brand-gold text-lg">
                        {formatRupiah(totalPendanaan)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
              <p className="text-emerald-700 font-bold text-sm mb-1">Total Siswa Lolos</p>
              <p className="text-4xl font-extrabold text-emerald-900">{students.length}</p>
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

export default PaceDaftarLolos;
