import { storage } from "./storage";
import bcrypt from "bcrypt";

async function createAccounts() {
  const password = "Password123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create Admin
  const adminEmail = "admin@test.com";
  const existingAdmin = await storage.getUserByEmail(adminEmail);
  if (!existingAdmin) {
    await storage.createUser({
      username: "admin_test",
      email: adminEmail,
      password: hashedPassword,
      fullName: "Admin Test",
      role: "admin",
      status: "active",
      emailVerified: true,
      accountType: "personal",
    });
    console.log("Admin account created: " + adminEmail);
  } else {
    console.log("Admin account already exists: " + adminEmail);
  }

  // Create User
  const userEmail = "user@test.com";
  const existingUser = await storage.getUserByEmail(userEmail);
  if (!existingUser) {
    await storage.createUser({
      username: "user_test",
      email: userEmail,
      password: hashedPassword,
      fullName: "User Test",
      role: "user",
      status: "active",
      emailVerified: true,
      accountType: "personal",
    });
    console.log("User account created: " + userEmail);
  } else {
    console.log("User account already exists: " + userEmail);
  }

  console.log("Test accounts password: " + password);
}

createAccounts().catch(console.error);
