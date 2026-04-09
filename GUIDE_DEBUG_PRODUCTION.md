# 🚨 Guide de Débogage - Production (Vercel + Render)

## 📸 Problèmes Identifiés dans les Captures d'Écran

### Erreur 1 : WebSocket Connection Failed
```
WebSocket connection to 'wss://altusfinancesgroup.com/socket.io/?EIO=4&transport=websocket' failed
```
**Cause**: `VITE_SOCKET_URL` n'est pas configuré dans Vercel
**Solution**: Le frontend essaie de se connecter au même domaine au lieu de `api.altusfinancesgroup.com`

### Erreur 2 : 404 sur les endpoints API
```
Failed to load resource: the server responded with a status of 404 ()
- api/chat/conversations:1
- api/chat/unread/1b9a...925e-1ae551ef7e81:1
```
**Cause**: `VITE_API_URL` n'est pas configuré ou mal configuré dans Vercel

### Erreur 3 : 500 sur l'authentification
```
Failed to load resource: the server responded with a status of 500 ()
- api.altusfinancesgroup.com/api/auth/login:1
```
**Cause**: Problème côté backend Render (base de données, configuration, etc.)

---

## ✅ Solution Complète pour Vercel

### Étape 1 : Configurer TOUTES les Variables d'Environnement

Allez sur **Vercel Dashboard** → **Votre Projet** → **Settings** → **Environment Variables**

Ajoutez ces **3 variables** :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `VITE_API_URL` | `https://api.altusfinancesgroup.com` | ✅ Production ✅ Preview ✅ Development |
| `VITE_SOCKET_URL` | `https://api.altusfinancesgroup.com` | ✅ Production ✅ Preview ✅ Development |
| `VITE_SITE_URL` | `https://altusfinancesgroup.com` | ✅ Production ✅ Preview ✅ Development |

⚠️ **IMPORTANT**: Cochez les trois environnements pour chaque variable!

### Étape 2 : Redéployer sur Vercel

Après avoir ajouté les variables:

**Option A - Via Vercel Dashboard:**
1. Allez dans **Deployments**
2. Cliquez sur **⋯** (trois points) du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. ✅ Cochez **"Use existing Build Cache"** pour aller plus vite
5. Cliquez sur **"Redeploy"**

**Option B - Via Git:**
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

### Étape 3 : Vérifier que les Variables Sont Bien Injectées

Une fois le déploiement terminé:

1. **Ouvrez** https://altusfinancesgroup.com
2. **Appuyez sur F12** pour ouvrir la console développeur
3. **Collez ce code** dans la console:

```javascript
// Vérifier toutes les variables d'environnement
console.log('=== VARIABLES VITE ===');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);
console.log('VITE_SITE_URL:', import.meta.env.VITE_SITE_URL);
console.log('MODE:', import.meta.env.MODE);

// Attendu:
// VITE_API_URL: https://api.altusfinancesgroup.com
// VITE_SOCKET_URL: https://api.altusfinancesgroup.com
// VITE_SITE_URL: https://altusfinancesgroup.com
// MODE: production
```

**Si les variables sont `undefined`** → Le build n'a pas pris en compte les variables. Redéployez sans cache:
- Vercel Dashboard → Deployments → ⋯ → Redeploy
- ❌ Décochez **"Use existing Build Cache"**

---

## 🔍 Débogage Côté Backend (Render)

### Vérifier l'Erreur 500 sur `/api/auth/login`

1. **Allez sur Render Dashboard** → **Votre Service Backend**
2. **Cliquez sur "Logs"** dans le menu de gauche
3. **Cherchez les erreurs** autour du timestamp de l'erreur 500

### Erreurs Courantes Backend

#### Erreur: Database Connection Failed
```
⚠️ PostgreSQL database not connected
```
**Solution**: Vérifiez que les variables d'environnement de la base de données sont configurées:
- `DATABASE_URL`
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

#### Erreur: CORS Configuration
```
Access to fetch at 'https://api.altusfinancesgroup.com/api/auth/login' 
from origin 'https://altusfinancesgroup.com' has been blocked by CORS policy
```
**Solution**: Sur Render, vérifiez que la variable d'environnement suivante est définie:
```
CORS_ORIGIN=https://altusfinancesgroup.com
```

#### Erreur: Session/Cookie Issues
```
Session expired / Cookie not set
```
**Solution**: Vérifiez ces variables sur Render:
```
COOKIE_DOMAIN=altusfinancesgroup.com
COOKIE_SECURE=true
COOKIE_SAMESITE=none
SESSION_SECRET=<votre-secret-fort>
```

---

## 🧪 Tests de Validation

### Test 1 : Appels API
1. **Ouvrez** https://altusfinancesgroup.com
2. **F12** → **Network** → Filtrez par **"Fetch/XHR"**
3. **Rechargez la page**
4. **Vérifiez** que les appels pointent vers:
   - ✅ `https://api.altusfinancesgroup.com/api/detect-language`
   - ✅ `https://api.altusfinancesgroup.com/api/csrf-token`

### Test 2 : WebSocket
1. **F12** → **Network** → Filtrez par **"WS"** (WebSocket)
2. **Vérifiez** la connexion:
   - ✅ `wss://api.altusfinancesgroup.com/socket.io/?EIO=4&transport=websocket`
   - ✅ Status: **101 Switching Protocols** (succès)

### Test 3 : Authentification
1. **Essayez de vous connecter** avec un compte de test
2. **F12** → **Console**
3. **Vérifiez** qu'il n'y a pas d'erreurs 401/403/500

---

## 📊 Page de Diagnostic Intégrée

Votre application inclut une page de diagnostic ! Allez sur:
```
https://altusfinancesgroup.com/diagnostic
```

Cette page vous montre:
- ✅ Toutes les variables d'environnement injectées
- ✅ L'état de la connexion API
- ✅ L'état de la connexion WebSocket
- ✅ Les erreurs détaillées

---

## 🆘 Si Ça Ne Marche Toujours Pas

### Vérifier le Build Log Vercel
1. **Vercel Dashboard** → **Deployments**
2. **Cliquez sur le dernier déploiement**
3. **Cherchez** "VITE_API_URL" dans les logs de build
4. **Vous devriez voir**:
   ```
   VITE_API_URL=https://api.altusfinancesgroup.com
   VITE_SOCKET_URL=https://api.altusfinancesgroup.com
   VITE_SITE_URL=https://altusfinancesgroup.com
   ```

### Vérifier le Backend Render
1. **Testez directement** l'API backend:
   ```bash
   curl https://api.altusfinancesgroup.com/api/csrf-token
   ```
   Devrait retourner:
   ```json
   {"csrfToken":"..."}
   ```

2. **Si ça ne marche pas**, le problème est côté Render, pas Vercel

---

## 📝 Checklist Complète

### Vercel (Frontend)
- [ ] `VITE_API_URL` défini
- [ ] `VITE_SOCKET_URL` défini
- [ ] `VITE_SITE_URL` défini
- [ ] Redéploiement effectué
- [ ] Variables visibles dans la console (F12)
- [ ] Appels API pointent vers `api.altusfinancesgroup.com`
- [ ] WebSocket pointe vers `wss://api.altusfinancesgroup.com`

### Render (Backend)
- [ ] `DATABASE_URL` configuré
- [ ] `CORS_ORIGIN=https://altusfinancesgroup.com` défini
- [ ] `COOKIE_DOMAIN=altusfinancesgroup.com` défini
- [ ] `COOKIE_SECURE=true` défini
- [ ] `SESSION_SECRET` défini (long et aléatoire)
- [ ] Service démarré sans erreur
- [ ] Logs montrent "Database: Connected"

### Tests Finaux
- [ ] Page d'accueil charge sans erreur
- [ ] Connexion utilisateur fonctionne
- [ ] Chat en temps réel fonctionne
- [ ] Transferts fonctionnent
- [ ] Aucune erreur 404/500 dans la console

---

## 🎯 Actions Prioritaires (Dans l'Ordre)

1. **Ajouter les 3 variables sur Vercel** (5 min)
2. **Redéployer Vercel** (3 min)
3. **Tester la console F12** (2 min)
4. **Vérifier les logs Render** (5 min)
5. **Tester l'authentification** (2 min)

**Temps total estimé**: ~20 minutes pour tout résoudre ✅
