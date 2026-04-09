import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';

async function createAdmin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Vérifier que DATABASE_URL est défini
    if (!process.env.DATABASE_URL) {
      console.error('❌ Erreur: DATABASE_URL n\'est pas défini dans les variables d\'environnement');
      process.exit(1);
    }

    const email = process.env.ADMIN_EMAIL || 'admin@solventisgroup.org';
    const password = process.env.ADMIN_PASSWORD || 'Admin123!@#Solventis';
    const fullName = 'Administrator';
    const username = 'admin';

    console.log('\n🔧 Création d\'un compte administrateur Solventis\n');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password ? '***hidden***' : 'undefined'}\n`);

    // Hacher le mot de passe
    console.log('🔐 Hachage du mot de passe...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connexion à la base de données
    console.log('📡 Connexion à la base de données...');
    const client = await pool.connect();

    // Vérifier si l'admin existe déjà
    const existingAdmin = await client.query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Un compte administrateur avec cet email existe déjà!');
      client.release();
      await pool.end();
      process.exit(0);
    }

    // Créer l'admin directement via SQL
    console.log('👤 Création du compte administrateur...');
    await client.query(
      `INSERT INTO users (
        username, password, email, email_verified, full_name, 
        account_type, role, status, kyc_status, preferred_language
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [username, hashedPassword, email, true, fullName, 'business', 'admin', 'active', 'approved', 'fr']
    );
    
    client.release();

    console.log('\n✅ Compte administrateur créé avec succès!');
    console.log('\n📋 Détails du compte:');
    console.log(`   Nom d'utilisateur: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Nom complet: ${fullName}`);
    console.log(`   Rôle: admin`);
    console.log(`   Statut: actif`);
    console.log('\n🔑 Identifiants de connexion:');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
    console.log('\n⚠️  Changez le mot de passe par défaut immédiatement après la connexion!');

    await pool.end();
  } catch (error: any) {
    console.error('\n❌ Erreur lors de la création de l\'admin:', error.message);
    if (error.code === '23505') {
      console.error('   → L\'email ou le nom d\'utilisateur existe déjà.');
    }
    await pool.end();
    process.exit(1);
  }
}

createAdmin();
