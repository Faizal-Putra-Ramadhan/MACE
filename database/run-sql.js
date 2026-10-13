import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const {
    DB_HOST = 'localhost',
    DB_PORT = '3306',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_NAME = 'mace',
} = process.env;

const target = process.argv[2] === 'seed' ? 'seed.sql' : 'schema.sql';
const file = path.join(__dirname, target);

async function run() {
    let conn;
    try {
        console.log(`> Menjalankan ${target} ...`);
        const sql = fs.readFileSync(file, 'utf8');

        // multipleStatements: true agar bisa menjalankan banyak perintah sekaligus
        conn = await mysql.createConnection({
            host: DB_HOST,
            port: Number(DB_PORT),
            user: DB_USER,
            password: DB_PASSWORD,
            multipleStatements: true,
        });

        await conn.query(sql);
        console.log(`> OK: ${target} berhasil dijalankan (database: ${DB_NAME}).`);
    } catch (error) {
        console.error(`> GAGAL menjalankan ${target}:`, error.message);
        process.exitCode = 1;
    } finally {
        if (conn) await conn.end();
    }
}

run();
