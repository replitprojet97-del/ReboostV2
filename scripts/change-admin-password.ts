import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';

async function changePassword() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ Erreur: DATABASE_URL n\'est pas défini');
      process.exit(1);
    }

    const newPassword = process.argv[2];
    const adminEmail = process.argv[3] || 'admin@solventisgroup.org';

    if (!newPassword) {
      console.log('\n🔐 Modification du mot de passe administrateur');
      console.log('\nUsage: npx tsx scripts/change-admin-password.ts <nouveau_mot_de_passe> [email]\n');
      console.log('Exemples:');
      console.log('  npx tsx scripts/change-admin-password.ts MaSuperPasse123!');
      console.log('  npx tsx scripts/change-admin-password.ts MaSuperPasse123! autre@email.com\n');
      process.exit(0);
    }

    if (newPassword.length < 8) {
      console.error('❌ Le mot de passe doit contenir au moins 8 caractères');
      process.exit(1);
    }

    console.log('\n🔐 Modification du mot de passe administrateur\n');
    console.log(`📧 Email: ${adminEmail}`);

    // Hash password
    console.log('🔒 Chiffrement du mot de passe...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Connect and update
    const client = await pool.connect();

    const result = await client.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING email, username',
      [hashedPassword, adminEmail]
    );

    client.release();

    if (result.rows.length === 0) {
      console.error(`❌ Aucun administrateur trouvé avec l'email: ${adminEmail}`);
      await pool.end();
      process.exit(1);
    }

    const user = result.rows[0];
    console.log('\n✅ Mot de passe modifié avec succès!');
    console.log(`\n📋 Détails:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`\n🔑 Nouveau mot de passe: ${newPassword}`);

    await pool.end();
  } catch (error: any) {
    console.error('\n❌ Erreur:', error.message);
    await pool.end();
    process.exit(1);
  }
}

changePassword();
