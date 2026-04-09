import bcrypt from "bcrypt";
import { storage } from "../server/storage";
import { randomUUID } from "crypto";

async function createTestAccounts() {
  const password = "Password123!";
  const hashedPassword = await bcrypt.hash(password, 12);

  const testUsers = [
    {
      username: "admin_test",
      email: "admin@test.com",
      password: hashedPassword,
      fullName: "Admin Test",
      role: "admin",
      accountType: "professional",
      status: "active",
      emailVerified: true,
      kycStatus: "verified",
    },
    {
      username: "user_test",
      email: "user@test.com",
      password: hashedPassword,
      fullName: "User Test",
      role: "user",
      accountType: "personal",
      status: "active",
      emailVerified: true,
      kycStatus: "verified",
    },
  ];

  for (const userData of testUsers) {
    const existing = await storage.getUserByEmail(userData.email);
    if (!existing) {
      console.log(`Creating account: ${userData.email}`);
      await storage.createUser(userData);
    } else {
      console.log(`Account already exists: ${userData.email}`);
      // Update role/status to ensure it's usable for testing
      await storage.updateUser(existing.id, { 
        role: userData.role, 
        status: "active", 
        emailVerified: true,
        kycStatus: "verified" 
      });
    }
  }
  process.exit(0);
}

createTestAccounts().catch(err => {
  console.error(err);
  process.exit(1);
});
