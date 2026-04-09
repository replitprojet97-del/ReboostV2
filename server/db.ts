import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use DATABASE_URL (Neon PostgreSQL)
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const isProduction = process.env.NODE_ENV === 'production';
console.log('[DB] Using Neon PostgreSQL database');

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 5,
  min: 1,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000,
  allowExitOnIdle: false,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[DB Pool] Unexpected error on idle client:', err.message);
});

pool.on('connect', () => {
  if (!isProduction) {
    console.log('[DB Pool] New client connected');
  }
});

export const db = drizzle(pool, { schema });

export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('[DB] Connection test successful');
    return true;
  } catch (error) {
    console.error('[DB] Connection test failed:', error);
    return false;
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 2000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`[DB] Operation failed (attempt ${attempt}/${retries}):`, lastError.message);
      
      if (attempt < retries) {
        const waitTime = delay * attempt;
        console.log(`[DB] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
}

export async function initializeDatabase(): Promise<void> {
  console.log('[DB] Initializing database connection...');
  
  for (let attempt = 1; attempt <= 5; attempt++) {
    const success = await testConnection();
    if (success) {
      return;
    }
    
    if (attempt < 5) {
      const waitTime = 3000 * attempt;
      console.log(`[DB] Connection attempt ${attempt} failed, retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  console.error('[DB] Failed to establish database connection after 5 attempts');
}
