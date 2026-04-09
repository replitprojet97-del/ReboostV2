# 🚀 Guide de Déploiement Production - Système de Chat

Ce guide vous permet de déployer le nouveau système de chat sur votre environnement de production (Render + Vercel).

## ⚠️ IMPORTANT: Le système de chat n'est PAS encore déployé en production

Les routes du chat existent dans le code source mais ne sont **pas encore déployées** sur:
- Backend: `api.altusfinancesgroup.com` (Render)
- Frontend: `altusfinancesgroup.com` (Vercel)

C'est pourquoi vous obtenez des erreurs 404 sur les endpoints `/api/chat/*`.

---

## 📋 Prérequis

### 1. Backend (Render)
- Service déjà configuré sur Render
- Accès à la base de données PostgreSQL Render
- Variables d'environnement configurées

### 2. Frontend (Vercel)  
- Projet déjà déployé sur Vercel
- Configuration des variables d'environnement

---

## 🗄️ Étape 1: Mise à jour de la Base de Données (PostgreSQL Render)

### Option A: Via Drizzle (Recommandé)

1. **Se connecter à votre projet sur Render**

2. **Exécuter les migrations Drizzle**
   ```bash
   npm run db:push
   ```

   Cette commande va créer les tables suivantes:
   - `chat_conversations`: Stocke les conversations
   - `chat_messages`: Stocke les messages
   - `chat_presence`: Gère la présence en ligne des utilisateurs

### Option B: SQL Manuel (Si Drizzle échoue)

Si la méthode Drizzle ne fonctionne pas, exécutez ce SQL directement dans votre base de données PostgreSQL:

```sql
-- Table: chat_conversations
CREATE TABLE IF NOT EXISTS "chat_conversations" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" VARCHAR NOT NULL,
  "assigned_admin_id" VARCHAR,
  "subject" TEXT,
  "status" TEXT NOT NULL DEFAULT 'open',
  "last_message_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "chat_conversations_user_id_idx" ON "chat_conversations"("user_id");
CREATE INDEX IF NOT EXISTS "chat_conversations_admin_id_idx" ON "chat_conversations"("assigned_admin_id");
CREATE INDEX IF NOT EXISTS "chat_conversations_status_idx" ON "chat_conversations"("status");

-- Table: chat_messages
CREATE TABLE IF NOT EXISTS "chat_messages" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "conversation_id" VARCHAR NOT NULL,
  "sender_id" VARCHAR NOT NULL,
  "sender_type" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "message_type" TEXT NOT NULL DEFAULT 'text',
  "file_url" TEXT,
  "file_name" TEXT,
  "is_read" BOOLEAN NOT NULL DEFAULT FALSE,
  "read_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "chat_messages_conversation_id_idx" ON "chat_messages"("conversation_id");
CREATE INDEX IF NOT EXISTS "chat_messages_sender_id_idx" ON "chat_messages"("sender_id");
CREATE INDEX IF NOT EXISTS "chat_messages_created_at_idx" ON "chat_messages"("created_at");

-- Table: chat_presence
CREATE TABLE IF NOT EXISTS "chat_presence" (
  "user_id" VARCHAR PRIMARY KEY,
  "status" TEXT NOT NULL DEFAULT 'offline',
  "last_seen" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 🔧 Étape 2: Configuration Backend (Render)

### Variables d'environnement à vérifier/ajouter sur Render

1. **Accédez à votre service Render**
2. **Allez dans l'onglet "Environment"**
3. **Vérifiez que ces variables existent:**

```env
# Base de données (devrait déjà exister)
DATABASE_URL=postgresql://user:password@host:port/database

# Session (devrait déjà exister)
SESSION_SECRET=votre_secret_session_fort

# CORS - Frontend URL (CRITIQUE pour le chat)
FRONTEND_URL=https://altusfinancesgroup.com

# Domaine des cookies (CRITIQUE)
COOKIE_DOMAIN=.altusfinancesgroup.com

# Node environment
NODE_ENV=production

# Email (si non configuré)
ADMIN_EMAIL=admin@altusfinancesgroup.com
ADMIN_PASSWORD=VotreMotDePasseSecurise123!

# Cloudinary (optionnel, pour upload de fichiers dans le chat)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# SendGrid (pour les notifications email)
SENDGRID_API_KEY=votre_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@altusfinancesgroup.com
```

### ⚠️ Variables CRITIQUES pour le Chat

Ces variables sont **ESSENTIELLES** pour que le chat fonctionne:

1. **FRONTEND_URL**: Permet au backend de savoir d'où viennent les requêtes
2. **COOKIE_DOMAIN**: Permet aux cookies de fonctionner entre `altusfinancesgroup.com` et `api.altusfinancesgroup.com`

---

## 🚀 Étape 3: Déploiement Backend (Render)

### Méthode 1: Via Git (Recommandé)

1. **Pushez votre code sur GitHub**
   ```bash
   git add .
   git commit -m "feat: Add chat system with Socket.IO"
   git push origin main
   ```

2. **Render redéploiera automatiquement** (si auto-deploy est activé)

### Méthode 2: Déploiement Manuel

1. Allez sur votre dashboard Render
2. Sélectionnez votre service
3. Cliquez sur "Manual Deploy" → "Deploy latest commit"

### Vérification du déploiement

Une fois déployé, vérifiez que le serveur démarre sans erreur:

```bash
# Testez l'API
curl https://api.altusfinancesgroup.com/api/health

# Testez les routes du chat (nécessite authentification)
curl https://api.altusfinancesgroup.com/api/chat/conversations \
  -H "Cookie: sessionId=VOTRE_SESSION"
```

---

## 🌐 Étape 4: Configuration Frontend (Vercel)

### Variables d'environnement Vercel

1. **Accédez à votre projet Vercel**
2. **Settings → Environment Variables**
3. **Ajoutez/vérifiez:**

```env
# API Backend
VITE_API_URL=https://api.altusfinancesgroup.com

# Socket.IO (pour le chat en temps réel)
VITE_SOCKET_URL=https://api.altusfinancesgroup.com

# Autres variables existantes...
```

### Redéploiement Vercel

```bash
# Si vous utilisez Vercel CLI
vercel --prod

# Ou via le dashboard Vercel
# Deployments → Redeploy
```

---

## 🔌 Étape 5: Configuration Socket.IO pour la Production

Le chat utilise **Socket.IO** pour les messages en temps réel. Vérifiez que:

### 1. CORS est correctement configuré

Dans `server/chat-socket.ts`, vérifiez:

```typescript
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? [
          'https://altusfinancesgroup.com',
          'https://www.altusfinancesgroup.com',
        ]
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  path: '/socket.io',
  transports: ['websocket', 'polling'],
});
```

### 2. Le frontend se connecte correctement

Vérifiez dans votre code frontend que la connexion Socket.IO utilise:

```typescript
const socket = io(import.meta.env.VITE_SOCKET_URL || 'https://api.altusfinancesgroup.com', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});
```

---

## ✅ Étape 6: Tests Post-Déploiement

### Tests à effectuer:

1. **Test d'authentification**
   - Se connecter avec un compte utilisateur
   - Vérifier que la session persiste

2. **Test du widget de chat**
   - Ouvrir le widget de chat (icône en bas à droite)
   - Envoyer un message
   - Vérifier que le message apparaît et persiste

3. **Test Socket.IO**
   - Ouvrir la console du navigateur (F12)
   - Chercher `[vite] connected` et `✅ Socket connected`
   - Vérifier qu'il n'y a pas d'erreur de connexion

4. **Test multi-onglets**
   - Ouvrir deux onglets avec le même compte
   - Envoyer un message dans un onglet
   - Vérifier qu'il apparaît en temps réel dans l'autre

5. **Test admin**
   - Se connecter en tant qu'admin
   - Vérifier que les conversations des utilisateurs apparaissent
   - Répondre à un message utilisateur

---

## 🐛 Dépannage

### Erreur 404 sur `/api/chat/*`

**Cause**: Le code n'est pas déployé sur Render

**Solution**: 
1. Vérifiez que le dernier commit contient les fichiers du chat
2. Redéployez sur Render
3. Vérifiez les logs de déploiement

### Socket.IO ne se connecte pas

**Cause**: CORS mal configuré ou variables d'environnement manquantes

**Solution**:
1. Vérifiez `FRONTEND_URL` sur Render
2. Vérifiez les CORS dans `chat-socket.ts`
3. Vérifiez que `VITE_SOCKET_URL` est correct sur Vercel

### Messages disparaissent après envoi

**Cause**: Problème de session ou CSRF

**Solution**:
1. Vérifiez `COOKIE_DOMAIN=.altusfinancesgroup.com` sur Render
2. Vérifiez que `SESSION_SECRET` est défini
3. Vérifiez les cookies dans le navigateur (F12 → Application → Cookies)

### Erreur "Session invalide"

**Cause**: Cookies cross-domain ne fonctionnent pas

**Solution**:
```env
# Sur Render, ajoutez:
COOKIE_DOMAIN=.altusfinancesgroup.com
FRONTEND_URL=https://altusfinancesgroup.com
```

---

## 📊 Surveillance Production

### Logs à surveiller sur Render:

```bash
# Connexions Socket.IO
[CHAT WS] Utilisateur connecté: user-id (user)

# Erreurs potentielles
[CHAT] Erreur récupération conversations
[CHAT WS] Erreur join conversation
```

### Métriques importantes:

1. **Temps de réponse API**: `/api/chat/conversations` < 500ms
2. **Connexions Socket.IO actives**: visible dans les logs
3. **Erreurs 404**: devrait être 0 après déploiement

---

## 🔐 Sécurité Production

### Points à vérifier:

1. ✅ `SESSION_SECRET` est fort et unique
2. ✅ HTTPS activé sur Render et Vercel
3. ✅ CORS limité aux domaines autorisés
4. ✅ CSRF protection activée
5. ✅ Rate limiting configuré (déjà fait dans le code)

---

## 📝 Checklist Finale

Avant de considérer le déploiement terminé:

- [ ] Tables de base de données créées (chat_conversations, chat_messages, chat_presence)
- [ ] Variables d'environnement configurées sur Render
- [ ] Variables d'environnement configurées sur Vercel  
- [ ] Code pushé sur GitHub et déployé sur Render
- [ ] Frontend redéployé sur Vercel
- [ ] Test: Authentification fonctionne
- [ ] Test: Widget de chat s'ouvre
- [ ] Test: Messages s'envoient et persistent
- [ ] Test: Socket.IO se connecte (vérifier console navigateur)
- [ ] Test: Admin peut voir et répondre aux conversations
- [ ] Aucune erreur 404 sur `/api/chat/*`
- [ ] Logs Render ne montrent pas d'erreurs critiques

---

## 🆘 Support

Si vous rencontrez des problèmes:

1. **Vérifiez les logs Render** pour les erreurs backend
2. **Vérifiez la console navigateur** (F12) pour les erreurs frontend
3. **Vérifiez les variables d'environnement** sont toutes configurées
4. **Testez en local** d'abord sur Replit pour isoler le problème

---

## 📌 Fichiers Clés du Système de Chat

```
Backend:
- server/routes.ts (lignes 4640-5012) : Routes API du chat
- server/chat-socket.ts : Configuration Socket.IO
- server/storage.ts : Méthodes de base de données pour le chat
- shared/schema.ts (lignes 262-300) : Schémas de base de données

Frontend:
- client/src/components/chat/ChatWidget.tsx : Widget de chat utilisateur
- client/src/components/chat/ChatWindow.tsx : Fenêtre de conversation
- client/src/lib/chatQueries.ts : Requêtes API et cache
- client/src/hooks/useChatNotifications.ts : Notifications temps réel
```

---

**Bonne chance pour le déploiement! 🚀**
