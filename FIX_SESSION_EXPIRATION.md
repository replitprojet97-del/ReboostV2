# 🔐 Solution au Problème "Session Expirée"

## 🎯 Le Problème

Après connexion, quand vous initiez un transfert, vous voyez :
> **"Votre session a expiré. Vous allez être redirigé vers le login"**

Et vous êtes effectivement déconnecté immédiatement.

## 🔍 Diagnostic

Le problème est que les **cookies de session** ne sont **pas envoyés** dans les requêtes entre votre frontend et votre backend.

**Pourquoi ?**
- Frontend : `altusfinancesgroup.com`
- Backend : `api.altusfinancesgroup.com`
- Ce sont des **origines différentes** (cross-origin)

Les cookies avec `sameSite: 'lax'` **ne sont PAS envoyés** dans les requêtes cross-origin.

## ✅ Solution : Configuration Backend (Render)

### 1. Variables d'Environnement Requises

Dans **Render** → Votre service backend → **Environment** :

#### Variables Actuelles (✓ Déjà configurées) :
```bash
COOKIE_DOMAIN=.altusfinancesgroup.com  # ✓ Correct
FRONTEND_URL=https://altusfinancesgroup.com  # ✓ Correct
NODE_ENV=production  # ✓ Obligatoire
```

#### Variable Manquante (si pas déjà configurée) :
```bash
SESSION_SECRET=<un_secret_aléatoire_très_long>
DATABASE_URL=<votre_url_postgres>  # Normalement auto-configuré par Render
```

**Aucune nouvelle variable n'est requise** - vos variables actuelles sont correctes !

### 2. Déployez le Nouveau Code

Le problème était dans le code backend. J'ai corrigé la configuration des cookies pour utiliser `sameSite: 'none'` en production (obligatoire pour cross-domain).

**Actions :**

```bash
# Committez les changements que j'ai faits
git add server/index.ts
git commit -m "fix: Use sameSite='none' for cross-domain cookies in production"
git push
```

**Render redéploiera automatiquement** (2-3 minutes).

### 3. Vérifiez les Logs de Déploiement

Une fois le déploiement terminé, dans **Render** → Logs, vous devriez voir :

```
============================================================
[CONFIG] Environment: production
[CONFIG] Cookie Domain: .altusfinancesgroup.com
[CONFIG] Cookie SameSite: none  ← DOIT être 'none', pas 'lax'
[CONFIG] Cookie Secure: true
[CONFIG] CORS Allowed Origins: production domains
[CONFIG] Frontend URL: https://altusfinancesgroup.com
[CONFIG] Trust Proxy: enabled
============================================================
```

**Vérification importante :** `Cookie SameSite` doit afficher **`none`**, pas `lax`.

---

## ✅ Solution : Configuration Frontend (Vercel)

### Variables Requises dans Vercel

**Vercel** → Votre projet → **Settings** → **Environment Variables** :

```bash
# OBLIGATOIRE - Pour que les requêtes aillent au bon backend
VITE_API_URL=https://api.altusfinancesgroup.com

# RECOMMANDÉ - Pour les redirections et URLs absolues
VITE_SITE_URL=https://altusfinancesgroup.com
```

**Cochez les 3 cases** : Production ✓, Preview ✓, Development ✓

### Déployez le Frontend

```bash
git push  # Vercel redéploiera automatiquement
```

Ou **forcez un redéploiement** dans Vercel (voir `SOLUTION_PROBLEME_VERCEL.md`).

---

## 🧪 Test de Validation

### Étape 1 : Vérifiez les Cookies

1. **Connectez-vous** à votre compte sur `altusfinancesgroup.com`
2. **Ouvrez les DevTools** (F12) → Onglet **Application** (Chrome) ou **Storage** (Firefox)
3. **Sélectionnez** : Cookies → `https://altusfinancesgroup.com`

**Vous devriez voir :**
```
Nom : sessionId
Valeur : s%3A...
Domain : .altusfinancesgroup.com  ← Point au début
Path : /
Secure : ✓ (cochée)
HttpOnly : ✓ (cochée)
SameSite : None  ← DOIT être 'None', pas 'Lax'
```

**❌ Si vous voyez `SameSite: Lax` :**
Le backend n'a pas encore été redéployé avec le nouveau code. Attendez 2-3 minutes.

### Étape 2 : Test de Transfert

1. **Allez dans** : Transferts → Nouveau transfert
2. **Remplissez** le formulaire
3. **Cliquez** sur "Continuer" ou "Initier le transfert"

**✅ Résultat attendu :**
- Aucun message "Session expirée"
- Le transfert s'initie correctement
- Vous restez connecté

**❌ Si vous voyez encore "Session expirée" :**
- Vérifiez que `SameSite: None` dans les cookies
- Vérifiez que `COOKIE_DOMAIN=.altusfinancesgroup.com` sur Render
- Regardez les logs de la console du navigateur (F12)

### Étape 3 : Vérifiez les Requêtes Réseau

Ouvrez **DevTools** (F12) → Onglet **Network** :

1. **Filtrez** sur `/api/`
2. **Initier** un transfert
3. **Sélectionnez** la requête `/api/transfers/initiate`
4. **Regardez** l'onglet **Headers**

**Dans "Request Headers", vous devriez voir :**
```
Cookie: sessionId=s%3A...
```

**❌ Si le header `Cookie` est absent :**
Les cookies ne sont pas envoyés. Causes possibles :
- `SameSite` n'est pas `None`
- `COOKIE_DOMAIN` n'est pas `.altusfinancesgroup.com`
- Le backend n'a pas été redéployé

---

## 📋 Checklist Finale

- [ ] Backend redéployé avec le nouveau code (`sameSite: 'none'`)
- [ ] Variables Render configurées :
  - [ ] `COOKIE_DOMAIN=.altusfinancesgroup.com`
  - [ ] `FRONTEND_URL=https://altusfinancesgroup.com`
  - [ ] `NODE_ENV=production`
- [ ] Logs backend affichent `Cookie SameSite: none`
- [ ] Variables Vercel configurées :
  - [ ] `VITE_API_URL=https://api.altusfinancesgroup.com`
  - [ ] `VITE_SITE_URL=https://altusfinancesgroup.com` (recommandé)
- [ ] Frontend redéployé
- [ ] Cookies dans le navigateur montrent `SameSite: None`
- [ ] Cookies dans le navigateur ont `Domain: .altusfinancesgroup.com`
- [ ] Test de transfert réussit sans déconnexion
- [ ] Header `Cookie` présent dans les requêtes `/api/*`

---

## 🔧 Qu'est-ce que J'ai Changé ?

### Dans `server/index.ts` :

**Avant :**
```typescript
sameSite: IS_PRODUCTION ? 'lax' : 'lax',
```

**Après :**
```typescript
const SAME_SITE_POLICY = IS_PRODUCTION ? 'none' : 'lax';
// ...
sameSite: SAME_SITE_POLICY,
```

**Pourquoi ?**
- `sameSite: 'lax'` = Les cookies ne sont envoyés que pour les requêtes **same-origin**
- `sameSite: 'none'` = Les cookies sont envoyés même pour les requêtes **cross-origin**

**Avec `sameSite: 'none'` :**
- ✅ `altusfinancesgroup.com` → `api.altusfinancesgroup.com` envoie le cookie
- ⚠️ Requiert `secure: true` (HTTPS uniquement)
- ⚠️ Requiert `domain: .altusfinancesgroup.com`

---

## 🎓 Pourquoi Ce Problème Arrive ?

### Architecture Cross-Domain

Votre setup :
```
Frontend : https://altusfinancesgroup.com (Vercel)
Backend  : https://api.altusfinancesgroup.com (Render)
```

Ce sont **deux origines différentes** (différents sous-domaines).

### Politique SameSite

Les navigateurs modernes (Chrome, Firefox, Safari) ont une politique de sécurité stricte :

| `sameSite` | Same-Origin | Cross-Origin |
|------------|-------------|--------------|
| `'strict'` | ✅ Envoyé   | ❌ Bloqué    |
| `'lax'`    | ✅ Envoyé   | ⚠️ GET uniquement (navigation) |
| `'none'`   | ✅ Envoyé   | ✅ Envoyé (requiert HTTPS) |

**Avec `sameSite: 'lax'` :**
```
Requête : POST https://api.altusfinancesgroup.com/api/transfers/initiate
Origine : https://altusfinancesgroup.com
Cookie  : ❌ NON ENVOYÉ (cross-origin POST)
Résultat: Backend ne voit pas de session → 401 Unauthorized
```

**Avec `sameSite: 'none'` :**
```
Requête : POST https://api.altusfinancesgroup.com/api/transfers/initiate
Origine : https://altusfinancesgroup.com
Cookie  : ✅ ENVOYÉ (domain=.altusfinancesgroup.com)
Résultat: Backend voit la session → ✅ Succès
```

### Pourquoi `domain: .altusfinancesgroup.com` ?

Le **point au début** (`.`) est crucial :

```bash
# Sans le point
domain: altusfinancesgroup.com
→ Cookie uniquement pour altusfinancesgroup.com (pas les sous-domaines)

# Avec le point
domain: .altusfinancesgroup.com
→ Cookie partagé entre :
  - altusfinancesgroup.com
  - www.altusfinancesgroup.com
  - api.altusfinancesgroup.com
  - etc.
```

---

## 🆘 Dépannage

### Problème : Cookie avec `SameSite: Lax` dans le navigateur

**Cause :** Le backend n'a pas été redéployé avec le nouveau code.

**Solution :**
1. Vérifiez que vous avez pushez le code modifié
2. Attendez que Render redéploie (2-3 minutes)
3. Vérifiez les logs : `Cookie SameSite: none`
4. Rafraîchissez la page et reconnectez-vous

---

### Problème : Cookie avec `Domain: altusfinancesgroup.com` (sans point)

**Cause :** `COOKIE_DOMAIN` n'est pas configuré correctement sur Render.

**Solution :**
1. Allez dans Render → Environment
2. Vérifiez `COOKIE_DOMAIN=.altusfinancesgroup.com`
3. **Assurez-vous qu'il y a un point au début** : `.altusfinancesgroup.com`
4. Sauvegardez et redéployez

---

### Problème : Aucun cookie `sessionId` dans le navigateur

**Cause :** La connexion a échoué ou les cookies sont bloqués.

**Solution :**
1. **Déconnectez-vous** complètement
2. **Videz les cookies** : DevTools → Application → Cookies → Clear
3. **Reconnectez-vous**
4. Vérifiez que le cookie `sessionId` apparaît

---

### Problème : Header `Cookie` absent dans les requêtes

**Cause :** Les cookies ne sont pas envoyés malgré `sameSite: 'none'`.

**Vérifications :**
1. Cookie a `SameSite: None` ✓
2. Cookie a `Secure: ✓` (HTTPS) ✓
3. Cookie a `Domain: .altusfinancesgroup.com` ✓
4. Requête utilise `credentials: 'include'` ✓ (déjà dans le code)

Si tout est ✓ mais ça ne fonctionne pas, vérifiez :
- Extensions de navigateur bloquant les cookies (Privacy Badger, etc.)
- Mode incognito avec paramètres de cookies restrictifs
- Essayez un autre navigateur

---

## 📞 Support

Si le problème persiste après avoir suivi toutes ces étapes :

### Informations à Partager

1. **Capture d'écran des cookies** (DevTools → Application → Cookies)
2. **Logs du backend** (Render → Logs, section `[CONFIG]`)
3. **Onglet Network** montrant la requête `/api/transfers/initiate` avec headers
4. **Variables d'environnement** (Render + Vercel) - masquez les secrets

### Workaround Temporaire (PAS RECOMMANDÉ)

Si vous avez absolument besoin de faire fonctionner l'app MAINTENANT en attendant de résoudre le problème :

Déployez le **frontend ET le backend sur le même domaine** :

- Frontend : `https://altusfinancesgroup.com`
- Backend : `https://altusfinancesgroup.com/api` (avec reverse proxy)

Cela élimine le besoin de `sameSite: 'none'` car tout est same-origin.

Mais ce n'est **PAS recommandé** car :
- Complexifie le déploiement
- Perd les avantages de la séparation frontend/backend
- Requiert une configuration de reverse proxy

---

## ✨ Résumé

**Problème :** Cookies `sameSite: 'lax'` ne fonctionnent pas en cross-domain

**Solution :** Utiliser `sameSite: 'none'` en production

**Prérequis :**
- `COOKIE_DOMAIN=.altusfinancesgroup.com` (avec point) ✓
- `secure: true` (HTTPS uniquement) ✓
- CORS `credentials: true` ✓

**Durée :** 5 minutes (commit + redéploiement)

Bonne chance ! 🚀
