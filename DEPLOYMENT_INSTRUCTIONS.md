# 🚀 Instructions de Déploiement Production

## ⚠️ PROBLÈME ACTUEL IDENTIFIÉ

Votre frontend reçoit l'erreur: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**Cause:** La variable `VITE_API_URL` n'est pas injectée dans le build Vercel.

---

## 📋 Configuration Vercel (Frontend)

### Variables d'environnement OBLIGATOIRES

1. **Connectez-vous à Vercel**: https://vercel.com/dashboard
2. **Sélectionnez votre projet**: altusfinancesgroup.com
3. **Allez dans**: Settings → Environment Variables
4. **Ajoutez/Modifiez ces variables:**

#### Variable 1: VITE_API_URL
```
Name: VITE_API_URL
Value: https://api.altusfinancesgroup.com
```
**✅ IMPORTANT**: Cochez les 3 cases:
- ✅ Production
- ✅ Preview
- ✅ Development

#### Variable 2: VITE_SITE_URL (optionnelle mais recommandée)
```
Name: VITE_SITE_URL
Value: https://altusfinancesgroup.com
```
**✅ IMPORTANT**: Cochez les 3 cases:
- ✅ Production
- ✅ Preview
- ✅ Development

### ⚡ Redéploiement

Après avoir configuré les variables:

1. **Allez dans**: Deployments
2. **Sélectionnez** le dernier déploiement
3. **Cliquez sur** les trois points (⋮)
4. **Sélectionnez**: "Redeploy"
5. **Attendez** que le build se termine (2-3 minutes)

---

## 🔧 Configuration Backend (Render ou similaire)

### Variables d'environnement OBLIGATOIRES

```bash
# Session sécurisée (générer avec: openssl rand -base64 32)
SESSION_SECRET=votre-secret-de-32-caracteres-minimum

# Base de données PostgreSQL
DATABASE_URL=postgresql://user:password@host:port/database

# URL du frontend pour CORS
FRONTEND_URL=https://altusfinancesgroup.com

# Domaine pour les cookies cross-domain (noter le point au début)
COOKIE_DOMAIN=.altusfinancesgroup.com

# Environnement
NODE_ENV=production
```

### Variables OPTIONNELLES (pour fonctionnalités complètes)

```bash
# Cloudinary - Upload d'images
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# SendGrid - Envoi d'emails
SENDGRID_API_KEY=votre-sendgrid-key
FROM_EMAIL=noreply@altusfinancesgroup.com
```

---

## 🌐 Configuration DNS

### Frontend: altusfinancesgroup.com
```
Type: A ou CNAME
Nom: @ (ou altusfinancesgroup.com)
Valeur: [Fournie par Vercel]
```

### Backend: api.altusfinancesgroup.com
```
Type: CNAME
Nom: api
Valeur: [Fournie par votre hébergeur backend]
```

**⚠️ Les deux domaines DOIVENT utiliser HTTPS** (obligatoire pour les cookies sécurisés)

---

## 🧪 Tests après Déploiement

### 1. Tester le Backend
```bash
curl https://api.altusfinancesgroup.com/api/health
# Devrait retourner: {"status":"ok"}
```

### 2. Tester le Frontend

1. Ouvrez: https://altusfinancesgroup.com
2. Ouvrez la Console du navigateur (F12)
3. Allez dans l'onglet "Console"
4. Vérifiez qu'il n'y a **AUCUNE erreur** de type:
   - `Unexpected token '<'` ❌ (indique que VITE_API_URL n'est pas définie)
   - `CORS error` ❌ (indique un problème de configuration backend)
   - `Failed to fetch` ❌ (indique que l'API n'est pas accessible)

### 3. Vérifier les Variables d'Environnement

Dans la console du frontend, tapez:
```javascript
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
```

**Résultat attendu:**
```
VITE_API_URL: https://api.altusfinancesgroup.com
```

**❌ SI VIDE OU UNDEFINED:**
- La variable n'a pas été injectée dans le build
- Retournez dans Vercel et assurez-vous que les 3 cases sont cochées
- Redéployez le projet

### 4. Tester une Connexion

1. Allez sur: https://altusfinancesgroup.com/login
2. Connectez-vous avec vos identifiants
3. Vérifiez dans l'onglet **Network** (F12) que:
   - Les requêtes vont bien vers `https://api.altusfinancesgroup.com`
   - Les réponses sont en JSON (pas en HTML)
   - Le statut HTTP est 200 (pas 404 ou 500)

### 5. Vérifier les Cookies

1. Ouvrez: https://altusfinancesgroup.com
2. Connectez-vous
3. Allez dans: F12 → Application → Cookies
4. Vérifiez qu'un cookie `sessionId` existe avec:
   - Domain: `.altusfinancesgroup.com`
   - Secure: ✅
   - HttpOnly: ✅
   - SameSite: `Lax`

---

## 🆘 Dépannage

### Problème: "Unexpected token '<'"

**Cause:** `VITE_API_URL` n'est pas injectée dans le build

**Solution:**
1. Vérifiez que la variable est définie dans Vercel
2. **COCHEZ LES 3 CASES** (Production, Preview, Development)
3. Redéployez le projet
4. Videz le cache du navigateur (Ctrl + Shift + R)

### Problème: "CORS error"

**Cause:** Le backend ne permet pas les requêtes depuis le frontend

**Solution:**
1. Vérifiez que `FRONTEND_URL=https://altusfinancesgroup.com` est définie dans le backend
2. Vérifiez que `COOKIE_DOMAIN=.altusfinancesgroup.com` est définie dans le backend
3. Redémarrez le service backend

### Problème: "Failed to fetch"

**Cause:** L'API n'est pas accessible

**Solution:**
1. Vérifiez que l'API est en ligne: `curl https://api.altusfinancesgroup.com/api/health`
2. Vérifiez le DNS: `nslookup api.altusfinancesgroup.com`
3. Vérifiez que HTTPS est activé sur l'API

### Problème: Les cookies ne sont pas sauvegardés

**Cause:** Configuration des cookies incorrecte

**Solution:**
1. Vérifiez que `COOKIE_DOMAIN=.altusfinancesgroup.com` dans le backend
2. Vérifiez que les deux domaines utilisent HTTPS
3. Vérifiez que `sameSite: 'lax'` dans le backend
4. Si vous utilisez des domaines différents (pas de sous-domaines), utilisez `sameSite: 'none'`

---

## 📝 Checklist de Déploiement

### Frontend (Vercel)
- [ ] `VITE_API_URL` définie avec les 3 cases cochées
- [ ] `VITE_SITE_URL` définie (optionnel)
- [ ] Projet redéployé après modification des variables
- [ ] Test console: `import.meta.env.VITE_API_URL` retourne l'URL correcte

### Backend (Render/autre)
- [ ] `SESSION_SECRET` définie (32+ caractères aléatoires)
- [ ] `DATABASE_URL` définie (PostgreSQL)
- [ ] `FRONTEND_URL=https://altusfinancesgroup.com`
- [ ] `COOKIE_DOMAIN=.altusfinancesgroup.com`
- [ ] `NODE_ENV=production`
- [ ] Service redémarré après modification des variables

### DNS
- [ ] `altusfinancesgroup.com` pointe vers Vercel
- [ ] `api.altusfinancesgroup.com` pointe vers le backend
- [ ] Les deux utilisent HTTPS

### Tests
- [ ] `curl https://api.altusfinancesgroup.com/api/health` fonctionne
- [ ] Frontend accessible sur https://altusfinancesgroup.com
- [ ] Aucune erreur dans la console
- [ ] Connexion fonctionne
- [ ] Cookies sont sauvegardés
- [ ] Transferts fonctionnent sans erreur JSON

---

## 🎯 Résumé de la Solution Actuelle

**Problème identifié:** `VITE_API_URL` non injectée dans le build Vercel

**Actions immédiates:**

1. **Dans Vercel** → Settings → Environment Variables → VITE_API_URL
2. **Cocher** Production + Preview + Development
3. **Redéployer** le projet
4. **Tester** dans la console: `import.meta.env.VITE_API_URL`

Si après cela l'erreur persiste, partagez une capture d'écran de:
- Les variables d'environnement Vercel (avec les cases cochées)
- La console du navigateur montrant `import.meta.env.VITE_API_URL`
- L'onglet Network montrant les requêtes API
