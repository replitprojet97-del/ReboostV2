# 🔧 Diagnostic de Production - Altus Finance Group

## 📊 Problèmes Identifiés

### 1️⃣ Vérification d'Email qui Échoue ❌

**Symptôme** : Après inscription, les utilisateurs reçoivent une erreur lors de la vérification d'email.

**Cause** : L'URL de vérification générée dans les emails utilise `process.env.FRONTEND_URL` qui n'est probablement **PAS définie** sur Render.

**Code problématique** (`server/email.ts`):
```typescript
function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;  // ⚠️ Si pas définie, retourne localhost!
  }
  return process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
    : 'http://localhost:5000';  // ❌ Impossible en production
}
```

### 2️⃣ Site Tantôt Disponible, Tantôt Indisponible 🔄

**Symptôme** : Le site devient intermittent après le dernier commit.

**Causes possibles** :
1. **Spin-down** : Render met le service en veille après inactivité (plans gratuits/Starter)
2. **Problèmes de session** : Les sessions PostgreSQL peuvent expirer
3. **Erreurs CORS** : Mauvaise configuration des origines autorisées
4. **Timeout** : Les requêtes prennent trop de temps à répondre

---

## ✅ Solutions à Appliquer Immédiatement

### Solution 1 : Configurer FRONTEND_URL sur Render

**Sur Render Dashboard:**
1. Allez sur votre service backend (api.altusfinancesgroup.com)
2. Cliquez sur **"Environment"** dans le menu de gauche
3. Cliquez sur **"Add Environment Variable"**
4. Ajoutez :
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://altusfinancesgroup.com`
5. Cliquez sur **"Save Changes"**
6. **IMPORTANT** : Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"** pour redéployer

### Solution 2 : Vérifier Toutes les Variables d'Environnement Requises

**Variables OBLIGATOIRES sur Render:**

```env
# Base
NODE_ENV=production
PORT=10000

# Database (déjà configuré normalement)
DATABASE_URL=<votre-url-postgresql>

# Session
SESSION_SECRET=<votre-secret-complexe>
COOKIE_DOMAIN=.altusfinancesgroup.com

# Frontend
FRONTEND_URL=https://altusfinancesgroup.com

# SendGrid (email)
SENDGRID_API_KEY=<votre-clé-sendgrid>
SENDGRID_FROM_EMAIL=noreply@altusfinancesgroup.com

# Cloudinary (uploads)
CLOUDINARY_CLOUD_NAME=<votre-cloud-name>
CLOUDINARY_API_KEY=<votre-api-key>
CLOUDINARY_API_SECRET=<votre-api-secret>
```

### Solution 3 : Configuration CORS (Déjà en Place, à Vérifier)

Le code vérifie déjà les bonnes origines :
```typescript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://altusfinancesgroup.com',
      'https://www.altusfinancesgroup.com',
      process.env.FRONTEND_URL
    ].filter(Boolean)
  : ['http://localhost:5000', ...];
```

**Vérifier que :**
- Vercel est bien sur `https://altusfinancesgroup.com`
- Le domaine `www.altusfinancesgroup.com` redirige vers `altusfinancesgroup.com` (ou vice versa)

### Solution 4 : Vérifier la Configuration Vercel

**Sur Vercel Dashboard:**
1. Allez sur votre site (altusfinancesgroup.com)
2. Cliquez sur **"Site configuration"** → **"Environment variables"**
3. Vérifiez que `VITE_API_URL` est défini :
   - **Key**: `VITE_API_URL`
   - **Value**: `https://api.altusfinancesgroup.com`
4. Si modifié, redéployez : **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

---

## 🔍 Diagnostic Avancé

### Tester l'Endpoint de Vérification Directement

```bash
# Remplacer <TOKEN> par un vrai token de vérification
curl -I https://api.altusfinancesgroup.com/api/auth/verify/<TOKEN>
```

**Résultat attendu** :
- Code 200 ou 302 si le token est valide
- Code 400 si le token est invalide/expiré

### Vérifier les Logs Render

1. Sur Render Dashboard, allez sur votre service
2. Cliquez sur **"Logs"**
3. Cherchez :
   - `[CONFIG] Frontend URL: NOT SET` ❌ (problème!)
   - `[CONFIG] Frontend URL: https://altusfinancesgroup.com` ✅ (correct)
   - Erreurs de connexion database
   - Erreurs CORS

### Tester la Génération d'URL de Vérification

Ajoutez temporairement un log dans `server/email.ts` :
```typescript
const verificationUrl = `${getBaseUrl()}/verify/${token}`;
console.log('🔗 Verification URL generated:', verificationUrl);  // Debug
```

Ensuite, créez un nouveau compte et vérifiez les logs Render pour voir l'URL générée.

---

## 🚀 Plan d'Action Immédiat

### Étape 1 : Configurer FRONTEND_URL (5 min)
- [ ] Ajouter `FRONTEND_URL=https://altusfinancesgroup.com` sur Render
- [ ] Redéployer le service backend
- [ ] Attendre 2-3 minutes que le déploiement se termine

### Étape 2 : Vérifier les Logs (2 min)
- [ ] Vérifier dans les logs Render que `[CONFIG] Frontend URL: https://altusfinancesgroup.com` apparaît
- [ ] Vérifier qu'il n'y a pas d'erreurs au démarrage

### Étape 3 : Tester la Vérification d'Email (5 min)
- [ ] Créer un nouveau compte de test
- [ ] Vérifier l'email reçu
- [ ] Cliquer sur le lien de vérification
- [ ] Confirmer que ça fonctionne

### Étape 4 : Monitorer la Stabilité (24h)
- [ ] Surveiller que le site reste disponible
- [ ] Vérifier les logs Render pour des erreurs
- [ ] Si problème persiste, passer au plan Render payant (évite le spin-down)

---

## 🛡️ Prévention Future

### 1. Ajouter des Health Checks

Créer un endpoint de santé simple :
```typescript
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});
```

### 2. Configurer UptimeRobot ou Similar

- Monitorer `https://api.altusfinancesgroup.com/api/health`
- Alertes par email si down > 5 minutes
- Ping toutes les 5 minutes (évite le spin-down sur Render gratuit)

### 3. Ajouter des Logs de Débogage

Pour diagnostiquer les problèmes futurs, ajoutez :
```typescript
console.log('[STARTUP] Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL || 'NOT SET',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'NOT SET',
  HAS_DATABASE_URL: !!process.env.DATABASE_URL,
  HAS_SENDGRID_KEY: !!process.env.SENDGRID_API_KEY
});
```

---

## 📞 Support

Si les problèmes persistent après avoir appliqué les solutions :

1. **Vérifier les logs Render** pour les erreurs spécifiques
2. **Tester avec Postman** l'endpoint de vérification
3. **Vérifier la configuration DNS** (altusfinancesgroup.com → Vercel, api.altusfinancesgroup.com → Render)
4. **Considérer upgrade** vers Render Standard (élimine spin-down, meilleure performance)

---

## ✅ Checklist de Vérification Complète

### Backend (Render)
- [ ] `NODE_ENV=production` défini
- [ ] `FRONTEND_URL=https://altusfinancesgroup.com` défini
- [ ] `SESSION_SECRET` défini (complexe, > 32 caractères)
- [ ] `COOKIE_DOMAIN=.altusfinancesgroup.com` défini
- [ ] `DATABASE_URL` défini et valide
- [ ] `SENDGRID_API_KEY` et `SENDGRID_FROM_EMAIL` définis
- [ ] Service redéployé après changements
- [ ] Logs montrent démarrage réussi
- [ ] Pas d'erreurs CORS dans les logs

### Frontend (Vercel)
- [ ] `VITE_API_URL=https://api.altusfinancesgroup.com` défini
- [ ] Site redéployé après changements
- [ ] Build réussi sans erreurs
- [ ] DNS pointe correctement vers Vercel

### Tests E2E
- [ ] Page d'accueil charge correctement
- [ ] Formulaire d'inscription fonctionne
- [ ] Email de vérification reçu
- [ ] Lien de vérification dans email est `https://altusfinancesgroup.com/verify/...`
- [ ] Vérification réussit et redirige vers login
- [ ] Login fonctionne après vérification
- [ ] Site reste disponible après 10+ minutes

---

**Dernière mise à jour** : 12 novembre 2025
