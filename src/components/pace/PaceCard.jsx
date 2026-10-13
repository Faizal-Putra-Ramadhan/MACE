import React, { forwardRef } from 'react';

const PaceCard = forwardRef(({ student, school }, ref) => {
  // If no data provided, use placeholders
  const s = student || {
    nama: 'ASEP RUMBIAK',
    nisn: '0123456789',
    foto_profil: '/placeholder-student.png' // fallback
  };
  
  const sch = school || {
    nama_sekolah: 'SMP NEGERI 1 BIAK',
    kota: 'KABUPATEN BIAK NUMFOR'
  };

  return (
    <div 
      ref={ref} 
      className="relative w-[600px] h-[380px] bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white box-border font-sans"
      style={{
        backgroundImage: 'linear-gradient(to bottom right, #f0f4ff, #e0e7ff, #ffffff)',
      }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-gold/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

      {/* Header section */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b-2 border-brand-gold/30 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-blue rounded-xl flex flex-col items-center justify-center text-white font-bold premium-shadow">
            <span className="text-2xl leading-none">P</span>
            <span className="text-[10px] tracking-wider text-brand-gold">PACE</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">KARTU PESERTA PACE</h1>
            <p className="text-sm font-bold text-brand-gold">(PELAJAR CERDAS)</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PEMERINTAH PROVINSI PAPUA</p>
          <div className="flex justify-end gap-2 mt-2">
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </div>

      {/* Body section */}
      <div className="relative z-10 flex p-6 gap-6 h-[calc(100%-100px)]">
        {/* Left Side: Details */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Smart Card Chip Placeholder */}
          <div className="w-12 h-10 bg-gradient-to-br from-amber-200 to-yellow-500 rounded-lg mb-6 shadow-inner border border-amber-400 relative overflow-hidden">
            <div className="absolute inset-0 border-[0.5px] border-amber-600/30 grid grid-cols-2 grid-rows-2">
              <div className="border-b-[0.5px] border-r-[0.5px] border-amber-600/30"></div>
              <div className="border-b-[0.5px] border-amber-600/30"></div>
              <div className="border-r-[0.5px] border-amber-600/30"></div>
              <div></div>
            </div>
          </div>

          <table className="w-full text-sm font-bold text-slate-800">
            <tbody>
              <tr>
                <td className="py-1 w-24 tracking-wide uppercase">NAMA</td>
                <td className="py-1 w-4">:</td>
                <td className="py-1 uppercase text-slate-900 text-base">{s.nama}</td>
              </tr>
              <tr>
                <td className="py-1 tracking-wide uppercase">NISN</td>
                <td className="py-1">:</td>
                <td className="py-1 uppercase text-slate-900">{s.nisn}</td>
              </tr>
              <tr>
                <td className="py-1 tracking-wide uppercase">SEKOLAH</td>
                <td className="py-1">:</td>
                <td className="py-1 uppercase text-slate-900">{sch.nama_sekolah}</td>
              </tr>
              <tr>
                <td className="py-1 tracking-wide uppercase">KOTA/KAB</td>
                <td className="py-1">:</td>
                <td className="py-1 uppercase text-slate-900">{sch.kota || 'JAYAPURA'}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-auto pt-4">
             <p className="text-xs font-bold text-slate-500">Tgl. Terbit : <span className="text-slate-900">12 Nov 2023</span></p>
          </div>
        </div>

        {/* Right Side: Photo */}
        <div className="w-[140px] flex-shrink-0 flex flex-col justify-center">
          <div className="w-full aspect-[3/4] bg-blue-600 rounded-lg shadow-lg border-[3px] border-brand-gold overflow-hidden relative">
            {/* If we have a real photo, it goes here. Else fallback */}
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
            </div>
            {s.foto_profil && s.foto_profil !== '/placeholder-student.png' && (
              <img src={s.foto_profil} alt="Student" className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative Border */}
      <div className="absolute inset-1 border-[1px] border-brand-gold/30 rounded-xl pointer-events-none"></div>
      <div className="absolute inset-2 border-[0.5px] border-brand-gold/20 rounded-lg pointer-events-none"></div>
    </div>
  );
});

PaceCard.displayName = 'PaceCard';

export default PaceCard;
