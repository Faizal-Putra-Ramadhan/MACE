import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Award, DollarSign, User } from 'lucide-react';

const DaftarLolos = () => {
  const { isApproved } = useOutletContext();

  if (!isApproved) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Award className="mx-auto mb-4 text-slate-300" size={48} />
        <p className="font-medium">Menu ini belum dapat diakses.</p>
        <p className="text-sm">Silakan upload dan tunggu persetujuan Surat Permohonan terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daftar Mahasiswa Lolos</h2>
        <p className="text-slate-500 mt-1">Daftar mahasiswa yang lolos seleksi dan nominal pendanaan.</p>
      </div>

      <div className="bg-white rounded-3xl premium-shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">No</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Nama Mahasiswa</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">NIM</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Perguruan Tinggi</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Program Studi</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Status</th>
                <th className="text-right px-6 py-4 text-sm font-bold text-slate-600">Pendanaan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="text-center py-12 text-slate-400">
                  <Award className="mx-auto mb-3 text-slate-300" size={40} />
                  <p className="font-medium">Belum ada data mahasiswa yang lolos.</p>
                  <p className="text-sm">Data akan muncul setelah admin menyetujui pendaftaran.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DaftarLolos;
