import sequelize from '../lib/db.js';

async function fixPasswords() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // The correct hash for 'Pace123!'
    const correctHash = '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS';

    const [results, metadata] = await sequelize.query(
      `UPDATE users SET password = '${correctHash}' WHERE role = 'sekolah_pace';`
    );
    
    console.log(`Updated passwords for ${metadata.rowCount} school accounts.`);

    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database or update:', error);
    process.exit(1);
  }
}

fixPasswords();
