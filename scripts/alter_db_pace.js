import sequelize from '../lib/db.js';
import User from '../models/User.js';
import PaceSekolah from '../models/PaceSekolah.js';
import PaceSiswa from '../models/PaceSiswa.js';

async function syncPace() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await PaceSekolah.sync({ alter: true });
        console.log('PaceSekolah table created/altered');

        await PaceSiswa.sync({ alter: true });
        console.log('PaceSiswa table created/altered');

        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

syncPace();
