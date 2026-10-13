import sequelize from '../lib/db.js';

async function updateEnum() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const newRoles = ['sekolah_pace', 'siswa_pace', 'admin_pace'];

    for (const role of newRoles) {
      try {
        await sequelize.query(`ALTER TYPE "enum_users_role" ADD VALUE '${role}';`);
        console.log(`Added ${role} to enum_users_role`);
      } catch (e) {
        console.log(`${role} might already exist or enum name is different:`, e.message);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database or alter type:', error);
    process.exit(1);
  }
}

updateEnum();
