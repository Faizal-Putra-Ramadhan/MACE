import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';

/* ============================================================
 *  Helper input bersama untuk formulir siswa PACE (SLB & SNK).
 *  Diekstrak dari PaceSiswaForm agar dapat dipakai ulang.
 * ============================================================ */

export const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-brand-blue text-sm";

export const Label = ({ children, req }) => (
  <label className="block text-sm font-bold text-slate-700 mb-1.5">
    {children} {req && <span className="text-red-500">*</span>}
  </label>
);

export const Field = ({ label, req, children }) => (
  <div>
    <Label req={req}>{label}</Label>
    {children}
  </div>
);

export const Text = ({ label, req, name, value, onChange, type = 'text', placeholder = '', colSpan = '' }) => (
  <div className={colSpan}>
    <Field label={label} req={req}>
      <input type={type} name={name} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </Field>
  </div>
);

export const Select = ({ label, req, value, onChange, options, placeholder = '-- Pilih --', colSpan = '' }) => (
  <div className={colSpan}>
    <Field label={label} req={req}>
      <select value={value} onChange={e => onChange(e.target.value)} className={inputCls + ' appearance-none'}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  </div>
);

export const Area = ({ label, req, value, onChange, rows = 2 }) => (
  <div className="md:col-span-2">
    <Field label={label} req={req}>
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className={inputCls + ' resize-none'} />
    </Field>
  </div>
);

export const CheckGroup = ({ label, options, values, onToggle, otherValue, onOtherChange, otherPlaceholder }) => (
  <div className="md:col-span-2">
    <Field label={label}>{label && null}</Field>
    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-1">
      {options.map(opt => (
        <label key={opt} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" className="mt-1 accent-brand-blue" checked={values.includes(opt)} onChange={() => onToggle(opt)} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
    {options.some(o => /lainnya/i.test(o)) && onOtherChange && (
      <input type="text" value={otherValue} onChange={e => onOtherChange(e.target.value)} placeholder={otherPlaceholder || 'Sebutkan lainnya...'} className={inputCls + ' mt-3'} />
    )}
  </div>
);

export const SectionTitle = ({ code, title }) => (
  <div className="flex items-center gap-3 mb-5 mt-2">
    <span className="w-8 h-8 flex-shrink-0 rounded-lg gradient-blue text-white font-bold flex items-center justify-center text-sm">{code}</span>
    <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">{title}</h4>
  </div>
);

export const UploadBox = ({ label, req, file, onFile, done }) => (
  <div>
    <Field label={label} req={req}>
      <div onClick={() => document.getElementById(`up-${label.replace(/\W/g, '')}-${done ? 1 : 0}`).click()}
        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${file ? 'border-emerald-300 bg-emerald-50' : done ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:border-brand-blue hover:bg-brand-blue/5'}`}>
        <input type="file" id={`up-${label.replace(/\W/g, '')}-${done ? 1 : 0}`} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => onFile(e.target.files[0])} />
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="text-emerald-500" size={16} />
            <span className="text-xs font-medium text-emerald-700 truncate max-w-[160px]">{file.name}</span>
          </div>
        ) : done ? (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium"><CheckCircle size={14} /> Terunggah</div>
        ) : (
          <div className="flex items-center justify-center gap-2"><Upload className="text-slate-400" size={16} /><span className="text-xs text-slate-500 font-medium">Klik untuk unggah</span></div>
        )}
      </div>
    </Field>
  </div>
);
