# Guide de Déploiement - ALTUS

## 🚨 PROBLÈMES RÉSOLUS

### 1. Inscription ne fonctionnait pas en production

**Symptôme** : Impossible de créer un compte sur altusfinancesgroup.com

**Cause** : Le frontend sur Vercel faisait des requêtes **relatives** (`/api/...`) qui ne savaient pas où trouver le backend API sur Render

**Solution** : Configuration de la variable d'environnement `VITE_API_URL` sur Vercel pour pointer vers l'API backend

### 2. Liens de vérification pointaient vers localhost

**Symptôme** : Les emails de vérification contenaient des liens comme `http://localhost:5000/verify/...`

**Cause** : La fonction `getBaseUrl()` ne prenait pas en compte l'URL de production du frontend

**Solution** : Utilisation de la variable `FRONTEND_URL` dans les emails pour générer les bons liens

### 3. Erreur "Unexpected token '<', "<!DOCTYPE "..." lors de la vérification

**Symptôme** : Message d'erreur JSON lors du clic sur le lien de vérification

**Cause** : La page `Verify.tsx` utilisait un fetch relatif au lieu d'utiliser `getApiUrl()`, donc la requête allait au frontend Vercel (HTML) au lieu du backend Render (JSON)

**Solution** : Mise à jour de `Verify.tsx` pour utiliser `getApiUrl()` comme toutes les autres requêtes API

---

## Fonctionnalités Multilingues

### Détection Automatique de la Langue

Le site détecte automatiquement la langue du navigateur de l'utilisateur lors de sa première visite :

**Langues supportées** :
- 🇫🇷 Français (fr)
- 🇬🇧 English (en)
- 🇪🇸 Español (es)
- 🇵🇹 Português (pt)
- 🇮🇹 Italiano (it)
- 🇩🇪 Deutsch (de)
- 🇳🇱 Nederlands (nl)

**Fonctionnement** :
1. **Première visite** : Le site détecte la langue du navigateur via `navigator.language`
2. **Visites suivantes** : La préférence de l'utilisateur est stockée dans `localStorage`
3. **Changement manuel** : L'utilisateur peut changer de langue via le sélecteur en haut à droite

### Emails Multilingues

Tous les emails envoyés par l'application sont automatiquement dans la langue de l'utilisateur :

- ✉️ **Email de vérification** : Envoyé dans la langue choisie lors de l'inscription
- ✉️ **Email de bienvenue** : Envoyé après vérification du compte
- ✉️ **Email de contrat** : Pour les prêts approuvés
- ✉️ **Email de déblocage de fonds** : Pour confirmer les transferts

**Comment ça marche** :
1. Lors de l'inscription, la langue actuelle est envoyée au backend (`preferredLanguage`)
2. Cette langue est stockée dans le profil utilisateur
3. Tous les emails futurs utilisent cette langue préférée

**Templates disponibles** : `server/emailTemplates.ts` contient toutes les traductions

---

## Architecture de Déploiement

- **Frontend** : Déployé sur **Vercel** (altusfinancesgroup.com)
- **Backend** : Déployé sur **Render** (api.altusfinancesgroup.com)
- **Base de données** : PostgreSQL (Neon, Railway, Supabase, etc.)

## 📦 Backend (Render)

### Configuration Render

1. **Créer un nouveau Web Service** sur Render
2. **Connecter votre dépôt GitHub**
3. **Configuration** :

   ```
   Name: altus-backend
   Region: Frankfurt (Europe)
   Branch: main
   Root Directory: (laisser vide)
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Variables d'environnement** (Settings > Environment) :

   ```bash
   NODE_ENV=production
   PORT=5000
   SESSION_SECRET=<générer avec: openssl rand -base64 32>
   DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
   FRONTEND_URL=https://altusfinancesgroup.com
   SENDGRID_API_KEY=<votre clé SendGrid>
   SENDGRID_FROM_EMAIL=noreply@altusfinancesgroup.com
   ```

   ⚠️ **CRITIQUE** :
   - `FRONTEND_URL` doit correspondre exactement à l'URL de votre frontend Vercel
   - **PAS de slash `/` à la fin**
   - Cette variable est utilisée pour :
     - La configuration CORS (autoriser les requêtes du frontend)
     - Les liens dans les emails (vérification de compte, contrats, etc.)

5. **Health Check Path** : `/health`

### Obtenir l'URL du backend

Après le déploiement, Render vous donnera une URL comme :
```
https://altus-backend.onrender.com
```

Notez cette URL, vous en aurez besoin pour le frontend.

## 🎨 Frontend (Vercel)

### Configuration Vercel

1. **Créer un nouveau projet** sur Vercel
2. **Importer votre dépôt GitHub**
3. **Framework Preset** : `Vite`
4. **Build & Development Settings** :

   ```
   Build Command: npm run build
   Output Directory: dist/public
   Install Command: npm install
   ```

5. **Variables d'environnement** (Settings > Environment Variables) :

   ```bash
   VITE_API_URL=https://api.altusfinancesgroup.com
   ```

   ⚠️ **CRITIQUE** : 
   - Utilisez l'URL **complète** de votre backend (avec https://)
   - **PAS de slash `/` à la fin** de l'URL
   - Après l'ajout de cette variable, **REDÉPLOYEZ** le frontend pour que les changements prennent effet

### Fichier vercel.json

Le fichier `vercel.json` est déjà configuré :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": null,
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🗄️ Base de Données PostgreSQL

### Option 1 : Neon (Recommandé)

1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer un nouveau projet
3. Copier l'URL de connexion (DATABASE_URL)
4. Ajouter `?sslmode=require` à la fin de l'URL

### Option 2 : Railway

1. Créer un compte sur [railway.app](https://railway.app)
2. Créer un nouveau projet PostgreSQL
3. Copier la variable DATABASE_URL

### Option 3 : Supabase

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Aller dans Settings > Database
4. Copier l'URI de connexion PostgreSQL

## 👨‍💼 Créer le Compte Administrateur

Le système ne crée pas automatiquement de compte admin. Vous devez le créer manuellement.

### Méthode 1 : SQL Direct

Connectez-vous à votre base de données PostgreSQL et exécutez :

```sql
-- 1. Générer le hash du mot de passe (exemple avec bcrypt cost=10)
-- Utilisez un outil en ligne ou Node.js pour hasher votre mot de passe
-- Exemple: mot de passe "Admin123!@#" devient:
-- $2b$10$rK8Y/HZ8L.UZ9xQQhVRkH.mF6pJNYJxKdOXmY4YHhP5uGJKvHEJKS

-- 2. Insérer le compte admin
INSERT INTO users (
  id,
  username, 
  password,
  email,
  "fullName",
  "accountType",
  role,
  status,
  "kycStatus",
  "hasSeenWelcomeMessage",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin',
  '$2b$10$rK8Y/HZ8L.UZ9xQQhVRkH.mF6pJNYJxKdOXmY4YHhP5uGJKvHEJKS',
  'admin@altusgroup.com',
  'Administrateur Principal',
  'business',
  'admin',
  'active',
  'approved',
  true,
  NOW(),
  NOW()
);
```

### Méthode 2 : Générer le hash bcrypt

```bash
# Sur votre machine avec Node.js installé
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('VotreMotDePasse123!', 10, (err, hash) => console.log(hash));"
```

Remplacez le hash dans la requête SQL ci-dessus.

## 🔐 Se Connecter en Admin

1. Allez sur votre site Vercel
2. Cliquez sur "Mon espace"
3. Connectez-vous avec :
   - **Email** : `admin@altusgroup.com`
   - **Mot de passe** : Le mot de passe que vous avez hashé

## 🧪 Tester le Déploiement

### Backend (Render)

```bash
# Health check
curl https://altus-backend.onrender.com/health

# Devrait retourner:
# {"status":"ok","timestamp":"2025-11-05T19:48:00.000Z"}
```

### Frontend (Vercel)

1. Visitez votre URL Vercel
2. Vérifiez que le site charge correctement
3. Testez le changement de langue (en haut à droite)
4. Essayez de vous connecter

## 🔧 Dépannage

### Backend ne démarre pas

1. Vérifiez les logs Render
2. Assurez-vous que `SESSION_SECRET` et `DATABASE_URL` sont définis
3. Vérifiez que la base de données est accessible

### Frontend affiche "CHARGEMENT" en français

Si le bouton de chargement reste en français :
- Vérifiez que le build frontend s'est bien terminé
- Videz le cache du navigateur
- Attendez quelques minutes pour la propagation CDN

### Erreur de connexion API / Inscription ne fonctionne pas

**Vérification 1 : Variable d'environnement sur Vercel**
1. Allez dans Settings > Environment Variables de votre projet Vercel
2. Vérifiez que `VITE_API_URL` existe et pointe vers `https://api.altusfinancesgroup.com`
3. **IMPORTANT** : Après avoir ajouté/modifié la variable, vous DEVEZ redéployer le frontend

**Vérification 2 : Logs du Backend Render**
1. Ouvrez les logs Render de votre backend
2. Vous devriez voir des requêtes avec l'origin correct :
   ```
   [CORS DEBUG] Incoming request: POST /api/auth/signup
   [CORS DEBUG] Origin: https://altusfinancesgroup.com
   [CORS DEBUG] ✅ Origin allowed: https://altusfinancesgroup.com
   ```
3. Si vous voyez seulement `Origin: NO ORIGIN`, le frontend n'envoie pas de requêtes au backend

**Vérification 3 : Console du Navigateur**
1. Ouvrez les DevTools (F12) sur votre site
2. Allez dans l'onglet Network
3. Essayez de vous inscrire
4. Les requêtes doivent pointer vers `https://api.altusfinancesgroup.com/api/...`
5. Si vous voyez des erreurs CORS, vérifiez la variable `FRONTEND_URL` sur Render

### Base de données ne se connecte pas

1. Vérifiez que `DATABASE_URL` est correct
2. Assurez-vous que `?sslmode=require` est présent
3. Testez la connexion depuis un client PostgreSQL local

## 📝 Notes Importantes

- Le backend ne sert **QUE** l'API (pas le frontend)
- Le frontend ne contient **QUE** les fichiers statiques (HTML, CSS, JS)
- La communication se fait via l'URL définie dans `VITE_API_URL`
- Les sessions sont stockées dans PostgreSQL
- Les fichiers uploadés (KYC, contrats) sont stockés en base64 dans la BD

## 🚀 Commandes Utiles

```bash
# Build local du backend
npm run build

# Démarrer en production localement
npm start

# Développement local
npm run dev

# Vérifier les types TypeScript
npm run check
```
