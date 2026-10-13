import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiHandler from './api/index.js';

// Server produksi ringan untuk VPS:
// - /api/*  -> handler yang sama persis dengan versi Vercel (api/index.js)
// - /uploads/* -> file hasil upload (disimpan di public/uploads)
// - sisanya -> hasil build frontend (dist/) dengan fallback SPA
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3001);
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    console.warn('[WARNING] dist/index.html belum ada. Jalankan `npm run build` terlebih dahulu.');
}

const app = express();
app.disable('x-powered-by');

// Body parser — upload dokumen dikirim sebagai JSON base64, jadi butuh limit besar.
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// File uploadan tersedia langsung dari disk (tanpa perlu rebuild saat ada file baru).
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), { maxAge: '1h' }));

// Semua route /api ditangani router manual di api/index.js.
app.use((req, res, next) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) return apiHandler(req, res);
    next();
});

// Frontend hasil `vite build` + fallback SPA (react-router path bebas).
app.use(express.static(distDir, { index: false }));
app.use((req, res) => {
    if (req.method !== 'GET') return res.status(404).json({ message: 'Not Found' });
    res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`MACE server siap di http://localhost:${PORT}`);
});
