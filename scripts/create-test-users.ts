import { db } from "../server/db.js";
import { users, chatConversations, chatMessages, chatPresence } from "../shared/schema.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

async function createTestUsers() {
  console.log("🔧 Creating test users for chat system...");

  // Hasher les mots de passe
  const userPassword = await bcrypt.hash("TestUser123!", 10);
  const adminPassword = await bcrypt.hash("TestAdmin123!", 10);

  // Créer un utilisateur normal
  const [user] = await db.insert(users).values({
    id: nanoid(),
    username: "testuser",
    email: "testuser@altusfinances.test",
    password: userPassword,
    fullName: "Test User",
    role: "user",
    accountType: "particulier",
    status: "active",
    kycStatus: "pending",
    emailVerified: true,
    preferredLanguage: "fr",
    externalTransfersBlocked: false,
    hasSeenWelcomeMessage: true,
    twoFactorEnabled: false,
    notificationEmailAlerts: true,
    notificationTransferUpdates: true,
    notificationLoanReminders: true,
    notificationMarketingEmails: false,
  }).returning();

  console.log(`✅ User created: ${user.email} (ID: ${user.id})`);
  console.log(`   📧 Email: testuser@altusfinances.test`);
  console.log(`   🔑 Password: TestUser123!`);

  // Créer un administrateur
  const [admin] = await db.insert(users).values({
    id: nanoid(),
    username: "testadmin",
    email: "testadmin@altusfinances.test",
    password: adminPassword,
    fullName: "Test Admin",
    role: "admin",
    accountType: "particulier",
    status: "active",
    kycStatus: "approved",
    emailVerified: true,
    preferredLanguage: "fr",
    externalTransfersBlocked: false,
    hasSeenWelcomeMessage: true,
    twoFactorEnabled: false,
    notificationEmailAlerts: true,
    notificationTransferUpdates: true,
    notificationLoanReminders: true,
    notificationMarketingEmails: false,
  }).returning();

  console.log(`✅ Admin created: ${admin.email} (ID: ${admin.id})`);
  console.log(`   📧 Email: testadmin@altusfinances.test`);
  console.log(`   🔑 Password: TestAdmin123!`);

  // Créer une conversation de test
  const [conversation] = await db.insert(chatConversations).values({
    id: nanoid(),
    userId: user.id,
    assignedAdminId: admin.id,
    subject: "Test de conversation pour le chat natif",
    status: "open",
    lastMessageAt: new Date(),
  }).returning();

  console.log(`✅ Conversation created (ID: ${conversation.id})`);

  // Créer quelques messages de test
  const message1 = await db.insert(chatMessages).values({
    id: nanoid(),
    conversationId: conversation.id,
    senderId: user.id,
    senderType: "user",
    content: "Bonjour ! J'ai une question concernant mes prêts.",
    messageType: "text",
    isRead: true,
    readAt: new Date(),
  }).returning();

  console.log(`✅ Message 1 created: User message (read)`);

  const message2 = await db.insert(chatMessages).values({
    id: nanoid(),
    conversationId: conversation.id,
    senderId: admin.id,
    senderType: "admin",
    content: "Bonjour ! Je suis là pour vous aider. Quelle est votre question ?",
    messageType: "text",
    isRead: true,
    readAt: new Date(),
  }).returning();

  console.log(`✅ Message 2 created: Admin message (read)`);

  const message3 = await db.insert(chatMessages).values({
    id: nanoid(),
    conversationId: conversation.id,
    senderId: user.id,
    senderType: "user",
    content: "Je voudrais savoir comment faire une demande de prêt.",
    messageType: "text",
    isRead: false,
  }).returning();

  console.log(`✅ Message 3 created: User message (UNREAD)`);

  // Initialiser la présence des utilisateurs
  await db.insert(chatPresence).values([
    {
      userId: user.id,
      status: "offline",
    },
    {
      userId: admin.id,
      status: "offline",
    },
  ]);

  console.log(`✅ Presence initialized for both users`);

  console.log("\n" + "=".repeat(60));
  console.log("✅ Test data created successfully!");
  console.log("=".repeat(60));
  console.log("\n📝 Test Credentials:\n");
  console.log("👤 USER:");
  console.log(`   Email: testuser@altusfinances.test`);
  console.log(`   Password: TestUser123!`);
  console.log(`   ID: ${user.id}\n`);
  console.log("👨‍💼 ADMIN:");
  console.log(`   Email: testadmin@altusfinances.test`);
  console.log(`   Password: TestAdmin123!`);
  console.log(`   ID: ${admin.id}\n`);
  console.log("💬 CONVERSATION:");
  console.log(`   ID: ${conversation.id}`);
  console.log(`   Messages: 3 (1 unread from user)\n`);
  console.log("=".repeat(60));

  process.exit(0);
}

createTestUsers().catch((error) => {
  console.error("❌ Error creating test users:", error);
  process.exit(1);
});
