import bcrypt from 'bcrypt';
import { sql } from '@neondatabase/serverless';

const password = 'Password123!';
const hashedPassword = await bcrypt.hash(password, 10);

const db = sql(process.env.DATABASE_URL!);

const result = await db`
  INSERT INTO users (
    username, password, email, email_verified,
    full_name, phone, account_type, role, status, kyc_status
  ) VALUES (
    'jean.dupont',
    ${hashedPassword},
    'jean.dupont@entreprise.fr',
    true,
    'Jean Dupont',
    '+33612345678',
    'business',
    'user',
    'active',
    'approved'
  )
  ON CONFLICT (email) DO UPDATE
  SET email_verified = true, password = ${hashedPassword}
  RETURNING id, email, full_name;
`;

console.log('✓ Test user ready:', result[0].email);
process.exit(0);
