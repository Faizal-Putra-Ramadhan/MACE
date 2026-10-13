import sequelize from '../lib/db.js';
import Pendaftaran from '../models/Pendaftaran.js';
import Mahasiswa from '../models/Mahasiswa.js';
import User from '../models/User.js';

async function test() {
  try {
    const maceList = await Pendaftaran.findAll({
      where: sequelize.literal("status IN ('lolos_berkas', 'selesai')"),
      include: [{
        model: Mahasiswa,
        include: [{ model: User, attributes: ['mace_type'] }]
      }],
      order: [['created_at', 'ASC']]
    });
    console.log('Found', maceList.length, 'pendaftaran records');
    maceList.forEach(p => {
      console.log(`  - ${p.mahasiswa?.nama_lengkap}: status=${p.status}, mace_type=${p.mahasiswa?.user?.mace_type}`);
    });
    await sequelize.close();
  } catch (err) {
    console.error('Error:', err.message);
    await sequelize.close();
  }
}

test();
