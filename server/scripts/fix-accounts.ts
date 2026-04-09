import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function run() {
  console.log("Fixing accounts with bcrypt hashing...");
  
  // Delete existing to be sure
  await db.delete(users).where(eq(users.username, "admin"));
  await db.delete(users).where(eq(users.username, "testuser"));
  
  const adminPassword = await bcrypt.hash("Admin123!@#456", 12);
  const userPassword = await bcrypt.hash("User123!@#456", 12);

  await db.insert(users).values({
    username: "admin",
    password: adminPassword,
    email: "admin@kreditpass.org",
    fullName: "Administrateur Système",
    role: "admin",
    status: "active",
    preferredLanguage: "fr",
    accountType: "business",
    emailVerified: true,
    kycStatus: "approved",
    kycApprovedAt: new Date()
  });
  console.log("Admin account RECREATED with bcrypt: admin / Admin123!@#456");

  await db.insert(users).values({
    username: "testuser",
    password: userPassword,
    email: "user@kreditpass.org",
    fullName: "Utilisateur Test",
    role: "user",
    status: "active",
    preferredLanguage: "fr",
    accountType: "personal",
    emailVerified: true,
    kycStatus: "approved",
    kycApprovedAt: new Date()
  });
  console.log("User account RECREATED with bcrypt: testuser / User123!@#456");
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
