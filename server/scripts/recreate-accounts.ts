import { storage } from "../storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function run() {
  console.log("Forcing recreation of accounts...");
  
  // Delete existing to be sure
  await db.delete(users).where(eq(users.username, "admin"));
  await db.delete(users).where(eq(users.username, "testuser"));
  
  const adminPassword = await hashPassword("Admin123!@#456");
  const userPassword = await hashPassword("User123!@#456");

  await storage.createUser({
    username: "admin",
    password: adminPassword,
    email: "admin@kreditpass.org",
    fullName: "Administrateur Système",
    role: "admin",
    status: "active",
    preferredLanguage: "fr",
    accountType: "business",
    emailVerified: true,
    kycStatus: "approved"
  });
  console.log("Admin account RECREATED: admin / Admin123!@#456");

  await storage.createUser({
    username: "testuser",
    password: userPassword,
    email: "user@kreditpass.org",
    fullName: "Utilisateur Test",
    role: "user",
    status: "active",
    preferredLanguage: "fr",
    accountType: "personal",
    emailVerified: true,
    kycStatus: "approved"
  });
  console.log("User account RECREATED: testuser / User123!@#456");
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
