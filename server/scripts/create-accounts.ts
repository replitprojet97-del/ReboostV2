import { storage } from "../storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function run() {
  console.log("Creating admin and user accounts...");
  
  const adminPassword = await hashPassword("Admin123!@#456");
  const userPassword = await hashPassword("User123!@#456");

  try {
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
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
      console.log("Admin account created: admin / Admin123!@#456");
    } else {
      console.log("Admin account already exists");
    }

    const existingUser = await storage.getUserByUsername("testuser");
    if (!existingUser) {
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
      console.log("User account created: testuser / User123!@#456");
    } else {
      console.log("User account already exists");
    }
  } catch (error) {
    console.error("Error creating accounts:", error);
  }
}

run().then(() => process.exit(0));
