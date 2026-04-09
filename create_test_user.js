const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = `
      INSERT INTO users (id, email, full_name, password, account_type, role, email_verified, preferred_language)
      VALUES (
        gen_random_uuid(),
        'test.dev@altus.com',
        'Test Developer',
        $1,
        'individual',
        'user',
        true,
        'fr'
      )
      RETURNING id, email;
    `;
    
    const result = await pool.query(query, [hashedPassword]);
    console.log('✅ User created:', result.rows[0]);
    console.log('Email: test.dev@altus.com');
    console.log('Password: Password123!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

main();
