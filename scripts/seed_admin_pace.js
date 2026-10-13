import sequelize from '../lib/db.js';

async function seedAdminPace() {
  try {
    await sequelize.authenticate();
    
    const hash = '$2b$10$nAN7MCxoRGeyyMMWU8jjs.ClOscSZc71qlQ2z6pex3Bf9rCbE/Rtu'; // AdminPace123!
    
    // Check if exists
    const [existing] = await sequelize.query(`SELECT * FROM users WHERE email = 'superadmin@pace.go.id'`);
    if (existing.length === 0) {
      await sequelize.query(`
        INSERT INTO users (email, password, role, is_approved, created_at) 
        VALUES ('superadmin@pace.go.id', '${hash}', 'admin_pace', true, NOW())
      `);
      console.log('Super Admin PACE account created: superadmin@pace.go.id');
    } else {
      console.log('Admin account already exists.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedAdminPace();
