import React, { useState } from 'react';
import { BookOpen, ChevronDown, GraduationCap, School } from 'lucide-react';
import { ABSTRAKSI_MACE, ABSTRAKSI_PACE } from '../lib/abstraksi';

// Bagian abstraksi program beasiswa (sumber: dokumen abstraksi resmi PACE & MACE).
// Dipasang di beranda; pilih program lalu buka seksi accordion-nya.
const AbstraksiProgram = () => {
  const [program, setProgram] = useState('mace');
  const [seksiAktif, setSeksiAktif] = useState(null);
  const isMace = program === 'mace';
  const sections = isMace ? ABSTRAKSI_MACE : ABSTRAKSI_PACE;

  const renderIsi = (s) => (
    <div className="space-y-3 text-sm text-slate-600">
      {s.teks && <p className="leading-relaxed">{s.teks}</p>}
      {s.poin && (
        <ul className="space-y-1.5 list-disc pl-5">
          {s.poin.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      )}
      {s.sub?.map((sub) => (
        <div key={sub.nama}>
          <p className="font-bold text-slate-800 mb-1">{sub.nama}</p>
          <ul className="space-y-1.5 list-disc pl-5">
            {sub.poin.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      ))}
      {s.tabel && (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                {s.tabel.headers.map((h) => <th key={h} className="px-4 py-2.5 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {s.tabel.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j} className={`px-4 py-2.5 ${j === 0 ? 'font-medium text-slate-800' : 'text-slate-500 whitespace-nowrap'}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {s.catatan && <p className="text-xs text-slate-400 italic">{s.catatan}</p>}
    </div>
  );

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-blue/5 text-brand-blue px-5 py-2 rounded-full mb-4">
            <BookOpen size={18} />
            <span className="font-bold text-sm">Kenali Programnya</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Abstraksi Beasiswa PACE &amp; MACE</h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Pengertian, sasaran, ruang lingkup, komponen dana, persyaratan, tahapan seleksi, hingga dokumen yang harus diunggah.
          </p>
        </div>

        {/* Pilih program */}
        <div className="flex justify-center gap-3 mb-8">
          <button onClick={() => { setProgram('mace'); setSeksiAktif(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${isMace ? 'bg-brand-blue text-white premium-shadow' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
            <GraduationCap size={16} /> MACE — Mahasiswa Papua Cerdas
          </button>
          <button onClick={() => { setProgram('pace'); setSeksiAktif(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${!isMace ? 'bg-brand-gold text-white premium-shadow' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
            <School size={16} /> PACE — Pelajar Papua Cerdas
          </button>
        </div>

        {/* Accordion seksi */}
        <div className="max-w-3xl mx-auto space-y-2">
          {sections.map((s, idx) => (
            <div key={s.judul} className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
              <button onClick={() => setSeksiAktif(seksiAktif === idx ? null : idx)}
                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${seksiAktif === idx ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/60'}`}>
                <span className="text-sm md:text-base font-bold text-slate-800">{s.judul}</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform flex-shrink-0 ${seksiAktif === idx ? 'rotate-180' : ''}`} />
              </button>
              {seksiAktif === idx && <div className="px-6 py-5 border-t border-slate-100">{renderIsi(s)}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AbstraksiProgram;
