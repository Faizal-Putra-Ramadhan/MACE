import bcrypt from 'bcryptjs';
import sequelize from '../lib/db.js';

async function resetAdminPassword() {
  try {
    await sequelize.authenticate();

    const newPassword = 'Admin123!';
    const hash = await bcrypt.hash(newPassword, 10);

    // Check if admin exists
    const [rows] = await sequelize.query(`SELECT id, email FROM users WHERE email = 'admin@mace.go.id'`);
    
    if (rows.length > 0) {
      await sequelize.query(`UPDATE users SET password = :hash WHERE email = 'admin@mace.go.id'`, {
        replacements: { hash }
      });
      console.log(`Admin password updated successfully!`);
    } else {
      await sequelize.query(`
        INSERT INTO users (email, password, role, is_approved, created_at)
        VALUES ('admin@mace.go.id', :hash, 'admin', true, NOW())
      `, { replacements: { hash } });
      console.log(`Admin account created!`);
    }
    console.log(`  Email:    admin@mace.go.id`);
    console.log(`  Password: ${newPassword}`);

    // Also update mahasiswa accounts with same password
    const mahasiswaEmails = ['john@gmail.com', 'faizal@gmail.com', 'stefanus@gmail.com'];
    for (const email of mahasiswaEmails) {
      try {
        await sequelize.query(`UPDATE users SET password = :hash WHERE email = :email`, {
          replacements: { hash, email }
        });
        console.log(`  Updated password for: ${email}`);
      } catch (e) {
        console.log(`  Skipped ${email}: ${e.message}`);
      }
    }

    console.log('\n--- All Credentials ---');
    console.log('Admin:        admin@mace.go.id / Admin123!');
    console.log('Admin PACE:   superadmin@pace.go.id / AdminPace123!');
    console.log('PACE Schools: (all SLB/SNK emails) / Pace123!');
    console.log('Mahasiswa:    john@gmail.com / Admin123!');
    console.log('              faizal@gmail.com / Admin123!');
    console.log('              stefanus@gmail.com / Admin123!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
