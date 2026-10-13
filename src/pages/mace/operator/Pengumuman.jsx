import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Megaphone, Calendar } from 'lucide-react';

const Pengumuman = () => {
  const { isApproved } = useOutletContext();

  if (!isApproved) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Megaphone className="mx-auto mb-4 text-slate-300" size={48} />
        <p className="font-medium">Menu ini belum dapat diakses.</p>
        <p className="text-sm">Silakan upload dan tunggu persetujuan Surat Permohonan terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pengumuman</h2>
        <p className="text-slate-500 mt-1">Informasi dan pengumuman terkait program bantuan pendidikan.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100">
        <div className="text-center py-12 text-slate-400">
          <Megaphone className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="font-medium text-slate-500">Belum ada pengumuman saat ini.</p>
          <p className="text-sm text-slate-400 mt-1">Pengumuman dari admin akan muncul di sini.</p>
        </div>
      </div>
    </div>
  );
};

export default Pengumuman;
