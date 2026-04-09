# 🧪 Guide de Test du Chat Natif - Altus Finances Group

## ✅ Statut de l'environnement

- ✅ Base de données PostgreSQL créée et connectée
- ✅ Tables de chat créées (chat_conversations, chat_messages, chat_presence)
- ✅ Utilisateurs de test créés
- ✅ Conversation de test avec 3 messages (dont 1 non lu)
- ✅ Serveur démarré sur le port 5000

---

## 📝 Identifiants de Test

### 👤 Utilisateur Normal
- **Email:** `testuser@altusfinances.test`
- **Mot de passe:** `TestUser123!`
- **ID:** `iHan9QCdCYMGK-9pXvGeF`
- **Rôle:** user

### 👨‍💼 Administrateur
- **Email:** `testadmin@altusfinances.test`
- **Mot de passe:** `TestAdmin123!`
- **ID:** `UsGxTtysL1kCEvVlCPtPF`
- **Rôle:** admin

### 💬 Conversation de Test
- **ID:** `Gd_ijP9j4goqIJ7NUgLsd`
- **Messages:** 3 messages (1 message non lu de l'utilisateur)

---

## 🔍 Tests à Effectuer

### Test 1: Connexion et Routes API ✅

**Commandes à exécuter:**
```bash
# Tester la route de connexion utilisateur
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@altusfinances.test", "password": "TestUser123!"}'

# Tester la route des conversations (après connexion)
curl -X GET http://localhost:5000/api/chat/conversations \
  -H "Cookie: connect.sid=<SESSION_ID>" \
  --cookie-jar cookies.txt
```

### Test 2: Connexion Socket.IO 🔌

**Dans la console du navigateur:**
1. Connectez-vous avec l'utilisateur de test
2. Ouvrez la console du navigateur (F12)
3. Recherchez: `✅ Socket connected:`
4. Vous devriez voir l'ID de socket

**Ce que vous devriez voir:**
- `✅ Socket connected: <socket-id>`
- Pas d'erreurs `🔴 Socket connection error`

### Test 3: Interface Utilisateur 🖥️

**Côté Utilisateur:**
1. Connectez-vous avec `testuser@altusfinances.test`
2. Cherchez le bouton de chat (généralement en bas à droite)
3. Cliquez pour ouvrir le widget de chat
4. Vous devriez voir:
   - La conversation existante
   - Les 3 messages de la conversation de test
   - Le compteur de messages non lus (1)

**Côté Admin:**
1. Déconnectez-vous et connectez-vous avec `testadmin@altusfinances.test`
2. Naviguez vers la page Admin Chat (`/admin/chat`)
3. Vous devriez voir:
   - La liste des conversations
   - La conversation avec le badge "1 non lu"
   - Les détails de la conversation quand vous cliquez dessus

### Test 4: Envoi de Messages en Temps Réel 📨

**Test avec 2 onglets:**
1. **Onglet 1:** Connecté comme utilisateur (`testuser@altusfinances.test`)
2. **Onglet 2:** Connecté comme admin (`testadmin@altusfinances.test`)

**Actions:**
1. Dans l'onglet utilisateur, envoyez un message
2. Vérifiez que le message apparaît IMMÉDIATEMENT dans l'onglet admin
3. Dans l'onglet admin, répondez au message
4. Vérifiez que la réponse apparaît IMMÉDIATEMENT dans l'onglet utilisateur

**Ce qui confirme le succès:**
- ✅ Messages apparaissent sans rafraîchir la page
- ✅ Indicateur "en train d'écrire" fonctionne
- ✅ Compteur de messages non lus se met à jour automatiquement

### Test 5: Compteurs de Messages Non Lus 🔔

**Actions:**
1. Connectez-vous comme admin
2. Vérifiez le badge de notification sur la page admin
3. Ouvrez une conversation avec des messages non lus
4. Vérifiez que le badge diminue automatiquement

**API à tester:**
```bash
# Obtenir le nombre total de messages non lus pour un utilisateur
curl -X GET http://localhost:5000/api/chat/unread/<USER_ID> \
  -H "Cookie: connect.sid=<SESSION_ID>"

# Obtenir le nombre de messages non lus dans une conversation
curl -X GET http://localhost:5000/api/chat/conversations/<CONVERSATION_ID>/unread \
  -H "Cookie: connect.sid=<SESSION_ID>"
```

### Test 6: Indicateur de Présence 👤

**Actions:**
1. Vérifiez que le statut "en ligne" / "hors ligne" est affiché
2. Déconnectez un utilisateur et vérifiez que son statut change

**API à tester:**
```bash
# Vérifier la présence d'un utilisateur
curl -X GET http://localhost:5000/api/chat/presence/<USER_ID> \
  -H "Cookie: connect.sid=<SESSION_ID>"

# Obtenir tous les utilisateurs en ligne
curl -X GET http://localhost:5000/api/chat/presence/online \
  -H "Cookie: connect.sid=<SESSION_ID>"
```

---

## 🐛 Résolution des Problèmes

### Erreur 404 sur les routes `/api/chat/*`

**Cause:** Routes de chat non chargées ou base de données non connectée

**Solution:**
1. Vérifiez que le serveur est démarré: `npm run dev`
2. Vérifiez la connexion à la base de données dans les logs
3. Vérifiez que les migrations ont été exécutées: `npm run db:push`

### Socket ne se connecte pas

**Vérifications:**
1. Ouvrez la console du navigateur et recherchez les erreurs Socket.IO
2. Vérifiez que CORS est configuré correctement
3. Vérifiez que vous êtes connecté (session valide)

**Logs à rechercher:**
- `[CHAT WS] Utilisateur connecté: <user-id>`
- Si vous voyez `Non authentifié`, votre session n'est pas valide

### Messages n'apparaissent pas en temps réel

**Vérifications:**
1. Socket.IO est-il connecté? (console du navigateur)
2. Les événements sont-ils émis? (vérifiez les logs du serveur)
3. Les queryKeys React Query sont-ils corrects?

---

## 🎯 Critères de Succès

Le système de chat natif fonctionne correctement si:

- ✅ Vous pouvez vous connecter avec les utilisateurs de test
- ✅ Les routes `/api/chat/*` retournent 200 (pas 404)
- ✅ Socket.IO se connecte sans erreur
- ✅ Les messages apparaissent en temps réel (sans rafraîchir)
- ✅ Les compteurs de messages non lus se mettent à jour automatiquement
- ✅ L'indicateur "en train d'écrire" fonctionne
- ✅ Le statut de présence (en ligne/hors ligne) est affiché

---

## 📊 Endpoints API Disponibles

### Conversations
- `GET /api/chat/conversations` - Liste des conversations de l'utilisateur
- `GET /api/chat/conversations/admin` - Liste des conversations pour admin
- `GET /api/chat/conversations/:id` - Détails d'une conversation
- `POST /api/chat/conversations` - Créer une nouvelle conversation
- `PATCH /api/chat/conversations/:id` - Mettre à jour une conversation
- `PATCH /api/chat/conversations/:id/assign` - Assigner à un admin
- `PATCH /api/chat/conversations/:id/status` - Changer le statut

### Messages
- `GET /api/chat/conversations/:id/messages` - Messages d'une conversation
- `POST /api/chat/conversations/:id/messages` - Envoyer un message
- `POST /api/chat/conversations/:conversationId/messages/mark-read` - Marquer comme lu

### Non Lus
- `GET /api/chat/unread/:userId` - Total des non lus pour un utilisateur
- `GET /api/chat/conversations/:id/unread` - Non lus dans une conversation

### Présence
- `GET /api/chat/presence/:userId` - Présence d'un utilisateur
- `GET /api/chat/presence/online` - Tous les utilisateurs en ligne

---

## 🔧 Commandes Utiles

```bash
# Redémarrer le serveur
npm run dev

# Vérifier la base de données
npm run db:studio

# Réappliquer les migrations
npm run db:push

# Créer de nouveaux utilisateurs de test
tsx scripts/create-test-users.ts

# Voir les logs en temps réel
# (Les logs apparaissent automatiquement dans la console Replit)
```

---

## 📚 Documentation Complète

Pour plus de détails sur l'architecture et l'implémentation:
- Voir `CHAT_SYSTEM_PRODUCTION.md`
- Voir `replit.md` section "Native Real-Time Chat System"
