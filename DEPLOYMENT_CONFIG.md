# 🚀 Configuration de Déploiement - Altus Finances Group

## ✅ État de la Configuration

### 1. ✅ CORS - DÉJÀ CORRECT
**Fichier**: `server/index.ts`

Le CORS autorise déjà les deux domaines avec `credentials: true` :
```javascript
allowedOrigins: [
  'https://altusfinancesgroup.com',
  'https://www.altusfinancesgroup.com',
  process.env.FRONTEND_URL
]
credentials: true
```

### 2. ✅ Session Cookies - DÉJÀ CORRECT
**Fichier**: `server/index.ts`

Les cookies sont configurés pour cross-domain avec :
- `sameSite: 'none'` en production (requis pour cross-domain)
- `secure: true` en production (requis pour SameSite=None)
- `domain` configurable via variable `COOKIE_DOMAIN`

### 3. ✅ CSRF Token - DÉJÀ CORRECT
**Fichier**: `server/routes.ts`

L'endpoint `/api/csrf-token` fonctionne correctement avec les cookies de session

### 4. ✅ Frontend API Calls - DÉJÀ CORRECT
**Fichier**: `client/src/lib/queryClient.ts`

Le frontend utilise `VITE_API_URL` pour pointer vers le backend

### 5. ✅ CSP (Content Security Policy) - CORRIGÉ ✨

**PROBLÈME IDENTIFIÉ ET RÉSOLU !**

Le backend Helmet envoyait un CSP avec `connect-src 'self'` qui **bloquait les requêtes cross-domain** !

**Comment ça bloquait :**
1. Helmet envoie `connect-src 'self'` dans les réponses API
2. Le navigateur met ce header en cache
3. Quand le frontend Vercel essaie d'appeler `api.altusfinancesgroup.com`, **le navigateur bloque la requête AVANT qu'elle n'atteigne le serveur**
4. Résultat : Sessions/cookies jamais établis, CSRF échoue

**Solution appliquée (server/index.ts, ligne 115-117) :**
```javascript
connectSrc: process.env.NODE_ENV === 'production'
  ? ["'self'", ...allowedOrigins.filter((origin): origin is string => origin !== undefined)]
  : ["'self'"]
```

Maintenant, en production, le CSP autorise :
- `'self'` (le backend lui-même)
- `https://altusfinancesgroup.com` (le frontend Vercel)
- `https://www.altusfinancesgroup.com` (variante www)
- `process.env.FRONTEND_URL` (si défini)

✅ **Le navigateur peut maintenant faire des requêtes cross-domain !**

---

## 🔧 Variables d'Environnement à Configurer

### 📦 BACKEND (Render) - Variables OBLIGATOIRES

Connectez-vous à [Render Dashboard](https://dashboard.render.com) → Votre service → Environment

```bash
# OBLIGATOIRE - Secret de session
SESSION_SECRET=<générez avec: openssl rand -base64 32>

# OBLIGATOIRE - URL du frontend pour CORS
FRONTEND_URL=https://altusfinancesgroup.com

# OBLIGATOIRE - Domaine des cookies (noter le point au début)
COOKIE_DOMAIN=.altusfinancesgroup.com

# OBLIGATOIRE - Environnement
NODE_ENV=production

# AUTOMATIQUE si PostgreSQL attaché
DATABASE_URL=<fourni par Render>

# OPTIONNELLES - Pour fonctionnalités complètes
CLOUDINARY_CLOUD_NAME=<votre cloud name>
CLOUDINARY_API_KEY=<votre API key>
CLOUDINARY_API_SECRET=<votre API secret>
SENDGRID_API_KEY=<votre SendGrid key>
FROM_EMAIL=noreply@altusfinancesgroup.com
```

### 🌐 FRONTEND (Vercel) - Variables OBLIGATOIRES

Connectez-vous à [Vercel Dashboard](https://vercel.com) → Votre projet → Settings → Environment Variables

**⚠️ IMPORTANT**: Ajoutez ces variables pour **Production, Preview, et Development**

```bash
# OBLIGATOIRE - URL du backend API (sans slash final)
VITE_API_URL=https://api.altusfinancesgroup.com

# OBLIGATOIRE - URL du site pour SEO (sans slash final)
VITE_SITE_URL=https://altusfinancesgroup.com
```

**Après avoir ajouté les variables, cliquez sur "Redeploy" pour appliquer les changements.**

---

## 🔍 Vérification de la Configuration

### Test 1: Backend Health Check
```bash
curl https://api.altusfinancesgroup.com/health
```
Devrait retourner un JSON avec le statut du serveur

### Test 2: CSRF Token
```bash
curl -i https://api.altusfinancesgroup.com/api/csrf-token
```
Devrait retourner :
- Status: `200 OK`
- Header: `Set-Cookie: sessionId=...` avec `SameSite=None; Secure`
- Body: `{"csrfToken":"..."}`

### Test 3: Frontend → Backend
1. Ouvrez https://altusfinancesgroup.com
2. Ouvrez la console développeur (F12)
3. Allez dans l'onglet "Network"
4. Connectez-vous
5. Vérifiez que :
   - ✅ Les requêtes vont vers `https://api.altusfinancesgroup.com`
   - ✅ Les cookies `sessionId` sont présents
   - ✅ Pas d'erreurs CORS
   - ✅ Header `X-CSRF-Token` est envoyé avec les POST

### Test 4: Cookies
1. Ouvrez https://altusfinancesgroup.com
2. Ouvrez DevTools → Application → Cookies
3. Connectez-vous
4. Vérifiez le cookie `sessionId` :
   - ✅ Domain: `.altusfinancesgroup.com`
   - ✅ Secure: `true`
   - ✅ SameSite: `None`
   - ✅ HttpOnly: `true`

---

## 🐛 Problèmes Courants et Solutions

### Erreur: "Votre session a expiré"
**Cause**: Le cookie de session n'est pas envoyé ou pas reconnu

**Solutions**:
1. Vérifiez que `COOKIE_DOMAIN=.altusfinancesgroup.com` sur Render (avec le point)
2. Vérifiez que `VITE_API_URL=https://api.altusfinancesgroup.com` sur Vercel
3. Videz les cookies du navigateur et reconnectez-vous
4. Vérifiez que les deux domaines utilisent HTTPS (obligatoire pour `SameSite=None`)

### Erreur CORS
**Cause**: L'origin n'est pas autorisé

**Solutions**:
1. Vérifiez que `FRONTEND_URL=https://altusfinancesgroup.com` sur Render
2. Vérifiez les logs Render pour voir l'origin reçu
3. Le code autorise déjà `altusfinancesgroup.com` et `www.altusfinancesgroup.com`

### Cookie non reçu
**Cause**: Configuration `SameSite=None` sans HTTPS

**Solutions**:
1. Les deux domaines DOIVENT utiliser HTTPS
2. Vérifiez que `NODE_ENV=production` sur Render
3. Les cookies `SameSite=None` requièrent `Secure=true` (HTTPS uniquement)

### Requêtes vers mauvais domaine
**Cause**: `VITE_API_URL` non configuré sur Vercel

**Solutions**:
1. Ajoutez `VITE_API_URL=https://api.altusfinancesgroup.com` sur Vercel
2. Redéployez le frontend après avoir ajouté la variable
3. Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

---

## 📋 Checklist de Déploiement

### Backend (Render)
- [ ] Service déployé et actif
- [ ] PostgreSQL attaché et connecté
- [ ] Variables d'environnement configurées :
  - [ ] `SESSION_SECRET`
  - [ ] `FRONTEND_URL=https://altusfinancesgroup.com`
  - [ ] `COOKIE_DOMAIN=.altusfinancesgroup.com`
  - [ ] `NODE_ENV=production`
- [ ] DNS configuré : `api.altusfinancesgroup.com` → Render
- [ ] HTTPS actif sur `api.altusfinancesgroup.com`
- [ ] Test: `curl https://api.altusfinancesgroup.com/health` fonctionne

### Frontend (Vercel)
- [ ] Projet déployé et actif
- [ ] Variables d'environnement configurées :
  - [ ] `VITE_API_URL=https://api.altusfinancesgroup.com`
  - [ ] `VITE_SITE_URL=https://altusfinancesgroup.com`
- [ ] DNS configuré : `altusfinancesgroup.com` → Vercel
- [ ] HTTPS actif sur `altusfinancesgroup.com`
- [ ] Code déployé avec les corrections CSP

### Tests Finaux
- [ ] Connexion/inscription fonctionne
- [ ] Les transferts peuvent être initiés
- [ ] Les demandes de prêt fonctionnent
- [ ] L'upload de fichiers fonctionne
- [ ] La session persiste entre les pages
- [ ] Pas d'erreurs dans la console navigateur
- [ ] Cookies visibles dans DevTools → Application → Cookies

---

## 📞 Support

Si vous rencontrez toujours des problèmes après avoir suivi ce guide :

1. Vérifiez les logs Render : Dashboard → Votre service → Logs
2. Vérifiez les logs Vercel : Dashboard → Votre projet → Deployments → Logs
3. Testez avec l'endpoint `/health` pour voir la configuration actuelle
4. Utilisez la console navigateur (F12) → Network pour voir les requêtes exactes

---

## 🎉 Résumé de la Configuration

### ✅ Code Backend - CORRIGÉ LE 20 NOVEMBRE 2025

**Problème identifié :** Le CSP Helmet bloquait les requêtes cross-domain avec `connect-src 'self'`

**Solution appliquée :**
- ✅ **CSP connectSrc** : Maintenant autorise le frontend en production
- ✅ **CORS** : Autorise `altusfinancesgroup.com` avec `credentials: true`
- ✅ **Session cookies** : Configuré avec `sameSite: 'none'` et `secure: true` en production
- ✅ **CSRF** : Fonctionne via cookies de session

### ✅ Code Frontend - AUCUNE MODIFICATION NÉCESSAIRE

Le frontend utilise déjà `VITE_API_URL` pour pointer vers le backend.

### ⚠️ PROCHAINES ÉTAPES : Redéployer le Backend

**1. Sur Render (Backend) - REDÉPLOIEMENT REQUIS :**

Les variables sont déjà configurées ✅ mais vous devez **redéployer** pour appliquer le correctif CSP :

```bash
# Variables déjà configurées (confirmé par captures d'écran)
SESSION_SECRET=<configuré> ✅
FRONTEND_URL=https://altusfinancesgroup.com ✅
COOKIE_DOMAIN=.altusfinancesgroup.com ✅
NODE_ENV=production ✅
```

👉 **Action requise :** Redéployez manuellement ou poussez un commit pour déclencher le redéploiement

**2. Sur Vercel (Frontend) - DÉJÀ CONFIGURÉ :**

```bash
VITE_API_URL=https://api.altusfinancesgroup.com ✅
VITE_SITE_URL=https://altusfinancesgroup.com ✅
```

✅ Aucune action requise sur Vercel

**3. Après le redéploiement :**

⚠️ **IMPORTANT** : Videz le cache du navigateur (Ctrl+Shift+Delete) pour supprimer l'ancien CSP mis en cache !

**C'est tout !** Le problème CSP est résolu dans le code, il suffit de redéployer le backend.
