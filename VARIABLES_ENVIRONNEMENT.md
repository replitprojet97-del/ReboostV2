# 📋 Variables d'Environnement - Guide Complet

## 🎯 Vue d'Ensemble

Votre application a **deux déploiements séparés** :

1. **Frontend** (Vercel) → `https://altusfinancesgroup.com`
2. **Backend** (Render) → `https://api.altusfinancesgroup.com`

Chaque plateforme nécessite ses propres variables d'environnement.

---

## 🟢 Backend (Render) - Variables Requises

### Variables de Base

| Variable | Valeur | Obligatoire | Description |
|----------|--------|-------------|-------------|
| `NODE_ENV` | `production` | ✅ OUI | Active les optimisations de production |
| `SESSION_SECRET` | `<secret_aléatoire>` | ✅ OUI | Clé pour signer les cookies de session (min 32 caractères) |
| `DATABASE_URL` | `postgres://...` | ✅ OUI | URL de connexion PostgreSQL (auto-configuré par Render) |

### Variables de Cookies (Cross-Domain)

| Variable | Valeur | Obligatoire | Description |
|----------|--------|-------------|-------------|
| `COOKIE_DOMAIN` | `.altusfinancesgroup.com` | ✅ OUI | Permet le partage de cookies entre sous-domaines (⚠️ **avec le point**) |
| `FRONTEND_URL` | `https://altusfinancesgroup.com` | ✅ OUI | URL du frontend pour CORS |

### Variables de Services Externes

| Variable | Valeur | Obligatoire | Description |
|----------|--------|-------------|-------------|
| `SENDGRID_API_KEY` | `SG.xxx...` | ⚠️ Recommandé | Clé API SendGrid pour emails de vérification |
| `SENDGRID_FROM_EMAIL` | `noreply@altusfinancesgroup.com` | ⚠️ Recommandé | Email expéditeur pour les notifications |
| `CLOUDINARY_CLOUD_NAME` | `<votre_nom>` | ❌ Optionnel | Service de stockage d'images |
| `CLOUDINARY_API_KEY` | `<votre_clé>` | ❌ Optionnel | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | `<votre_secret>` | ❌ Optionnel | Secret API Cloudinary |

### Configuration Render

**Comment ajouter :**
1. Allez dans **Render** → Votre service → **Environment**
2. Cliquez sur **"Add Environment Variable"**
3. Ajoutez chaque variable avec sa valeur
4. **Sauvegardez** (Render redéploiera automatiquement)

---

## 🔵 Frontend (Vercel) - Variables Requises

### Variables de Base

| Variable | Valeur | Obligatoire | Description |
|----------|--------|-------------|-------------|
| `VITE_API_URL` | `https://api.altusfinancesgroup.com` | ✅ OUI | URL du backend API |
| `VITE_SITE_URL` | `https://altusfinancesgroup.com` | ⚠️ Recommandé | URL du frontend (pour redirections) |

### Configuration Vercel

**Comment ajouter :**
1. Allez dans **Vercel** → Votre projet → **Settings** → **Environment Variables**
2. Ajoutez chaque variable
3. **COCHEZ LES 3 CASES** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. **Sauvegardez**
5. **Forcez un redéploiement** (Deployments → dernier déploiement → ⋮ → Redeploy)

---

## 🛠️ Développement Local

Pour travailler en local, créez un fichier `.env` à la racine du projet :

```bash
# Backend
NODE_ENV=development
SESSION_SECRET=dev-secret-key-change-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/altus_dev

# Optionnel - Services externes
SENDGRID_API_KEY=SG.xxx...
SENDGRID_FROM_EMAIL=noreply@altusfinancesgroup.com
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Frontend (Vite) - PAS besoin en local, le proxy Vite gère l'API
# VITE_API_URL=http://localhost:5000
```

**Note :** En développement, pas besoin de `VITE_API_URL` car le serveur Vite proxy automatiquement `/api/*` vers le backend.

---

## 🔐 Génération de Secrets

### SESSION_SECRET

Générez un secret aléatoire sécurisé :

**Option 1 - Node.js :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2 - OpenSSL :**
```bash
openssl rand -hex 32
```

**Option 3 - Online :**
```bash
# Utilisez un générateur de mot de passe aléatoire
# Min 32 caractères, lettres + chiffres + symboles
```

**Exemple de résultat :**
```
a7f3d8e9c2b1f4a6d5e8c9b2a7f3d8e9c2b1f4a6d5e8c9b2a7f3d8e9c2b1
```

---

## ✅ Checklist de Configuration

### Backend (Render)

- [ ] `NODE_ENV=production`
- [ ] `SESSION_SECRET=<secret_aléatoire_32+_caractères>`
- [ ] `DATABASE_URL=<auto_configuré_par_render>`
- [ ] `COOKIE_DOMAIN=.altusfinancesgroup.com` (⚠️ **avec le point**)
- [ ] `FRONTEND_URL=https://altusfinancesgroup.com`
- [ ] `SENDGRID_API_KEY=SG.xxx...` (optionnel mais recommandé)
- [ ] `SENDGRID_FROM_EMAIL=noreply@altusfinancesgroup.com` (si SendGrid configuré)

### Frontend (Vercel)

- [ ] `VITE_API_URL=https://api.altusfinancesgroup.com`
- [ ] `VITE_SITE_URL=https://altusfinancesgroup.com` (recommandé)
- [ ] Les 3 cases cochées (Production + Preview + Development)
- [ ] Redéploiement forcé après ajout des variables

---

## 🧪 Vérification

### Backend (Render)

Allez dans **Render** → Logs, vous devriez voir :

```
============================================================
[CONFIG] Environment: production
[CONFIG] Cookie Domain: .altusfinancesgroup.com
[CONFIG] Cookie SameSite: none
[CONFIG] Cookie Secure: true
[CONFIG] CORS Allowed Origins: production domains
[CONFIG] Frontend URL: https://altusfinancesgroup.com
[CONFIG] Trust Proxy: enabled
============================================================
✅ Backend API server listening on port XXXXX
🌍 Environment: production
🗄️ Database: Connected
```

**Vérifications importantes :**
- ✅ `Cookie Domain: .altusfinancesgroup.com` (avec le point)
- ✅ `Cookie SameSite: none` (PAS 'lax' en production)
- ✅ `Cookie Secure: true`
- ✅ `Frontend URL: https://altusfinancesgroup.com`

### Frontend (Vercel)

Ouvrez : `https://altusfinancesgroup.com/diagnostic`

**Vous devriez voir :**
- ✅ **Configuration correcte**
- `VITE_API_URL: https://api.altusfinancesgroup.com`
- `VITE_SITE_URL: https://altusfinancesgroup.com`

---

## 🆘 Dépannage

### "Session expirée" après connexion

**Cause :** Les cookies ne sont pas envoyés entre domaines.

**Solution :**
1. Vérifiez `COOKIE_DOMAIN=.altusfinancesgroup.com` sur Render (avec point)
2. Vérifiez que le code backend utilise `sameSite: 'none'` en production
3. Redéployez le backend après avoir modifié le code
4. Voir `FIX_SESSION_EXPIRATION.md` pour plus de détails

---

### "Unexpected token '<'" dans le navigateur

**Cause :** `VITE_API_URL` n'est pas injectée dans le build Vercel.

**Solution :**
1. Vérifiez que `VITE_API_URL` est configurée dans Vercel
2. Les 3 cases doivent être cochées (Production, Preview, Development)
3. Forcez un redéploiement SANS cache
4. Voir `SOLUTION_PROBLEME_VERCEL.md` pour plus de détails

---

### Emails de vérification ne sont pas envoyés

**Cause :** `SENDGRID_API_KEY` non configuré ou invalide.

**Solution :**
1. Inscrivez-vous sur [SendGrid](https://sendgrid.com)
2. Créez une clé API (Settings → API Keys)
3. Ajoutez `SENDGRID_API_KEY=SG.xxx...` sur Render
4. Ajoutez `SENDGRID_FROM_EMAIL=noreply@altusfinancesgroup.com`
5. Vérifiez l'email expéditeur dans SendGrid
6. Redéployez le backend

---

### Upload d'images ne fonctionne pas

**Cause :** Cloudinary non configuré.

**Solution :**
1. Inscrivez-vous sur [Cloudinary](https://cloudinary.com)
2. Récupérez vos credentials (Dashboard)
3. Ajoutez sur Render :
   - `CLOUDINARY_CLOUD_NAME=xxx`
   - `CLOUDINARY_API_KEY=xxx`
   - `CLOUDINARY_API_SECRET=xxx`
4. Redéployez le backend

---

## 📊 Tableau Récapitulatif

| Variable | Backend (Render) | Frontend (Vercel) |
|----------|------------------|-------------------|
| `NODE_ENV` | ✅ `production` | ❌ (N/A) |
| `SESSION_SECRET` | ✅ Obligatoire | ❌ (N/A) |
| `DATABASE_URL` | ✅ Auto-configuré | ❌ (N/A) |
| `COOKIE_DOMAIN` | ✅ `.altusfinancesgroup.com` | ❌ (N/A) |
| `FRONTEND_URL` | ✅ `https://altusfinancesgroup.com` | ❌ (N/A) |
| `SENDGRID_API_KEY` | ⚠️ Recommandé | ❌ (N/A) |
| `SENDGRID_FROM_EMAIL` | ⚠️ Recommandé | ❌ (N/A) |
| `CLOUDINARY_*` | ❌ Optionnel | ❌ (N/A) |
| `VITE_API_URL` | ❌ (N/A) | ✅ Obligatoire |
| `VITE_SITE_URL` | ❌ (N/A) | ⚠️ Recommandé |

---

## 📞 Support

Si vous avez besoin d'aide pour configurer ces variables :

1. **Render** : https://render.com/docs/environment-variables
2. **Vercel** : https://vercel.com/docs/projects/environment-variables
3. **SendGrid** : https://docs.sendgrid.com/ui/account-and-settings/api-keys
4. **Cloudinary** : https://cloudinary.com/documentation

---

## ✨ Notes Importantes

### ⚠️ Le Point dans COOKIE_DOMAIN

```bash
# ❌ INCORRECT - Sans point
COOKIE_DOMAIN=altusfinancesgroup.com
→ Cookie uniquement pour altusfinancesgroup.com

# ✅ CORRECT - Avec point
COOKIE_DOMAIN=.altusfinancesgroup.com
→ Cookie partagé entre tous les sous-domaines :
  - altusfinancesgroup.com
  - www.altusfinancesgroup.com
  - api.altusfinancesgroup.com
```

### ⚠️ Les 3 Cases dans Vercel

Quand vous ajoutez `VITE_API_URL` dans Vercel, vous DEVEZ cocher :
- ✅ Production
- ✅ Preview (pour tester avant mise en prod)
- ✅ Development (pour développement local avec Vercel CLI)

Si vous ne cochez que Production, la variable ne sera pas disponible dans les autres environnements.

### ⚠️ Redéploiement Obligatoire

**Après avoir ajouté/modifié des variables d'environnement** :

**Render** : Redéploiement automatique (2-3 minutes)

**Vercel** : Vous DEVEZ forcer un redéploiement :
1. Deployments → Dernier déploiement
2. ⋮ (trois points) → **Redeploy**
3. ❌ **DÉCOCHEZ** "Use existing Build Cache"
4. Cliquez sur **Redeploy**

Sans redéploiement, les nouvelles variables ne seront PAS prises en compte.

---

Bonne chance ! 🚀
