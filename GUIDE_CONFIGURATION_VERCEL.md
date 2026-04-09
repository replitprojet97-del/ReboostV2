# Guide de Configuration - Vercel (Frontend)

## 🎯 Problème Résolu

Les appels API du frontend pointaient vers le mauvais domaine car la variable d'environnement `VITE_API_URL` n'était pas configurée sur Vercel.

**Symptômes avant correction :**
- ❌ `GET https://altusfinancesgroup.com/api/detect-language` → 404
- ❌ `GET https://altusfinancesgroup.com/api/csrf-token` → 404
- ❌ `POST https://altusfinancesgroup.com/api/transfers/initiate` → 404
- ❌ "Votre session a expiré" lors de l'initiation de transfert

**Après correction :**
- ✅ `GET https://api.altusfinancesgroup.com/api/detect-language` → 200
- ✅ `GET https://api.altusfinancesgroup.com/api/csrf-token` → 200
- ✅ `POST https://api.altusfinancesgroup.com/api/transfers/initiate` → 200
- ✅ Transferts fonctionnels

## 🔧 Corrections Apportées au Code

J'ai corrigé **tous les appels API** dans le frontend pour utiliser `getApiUrl()` au lieu d'URLs hardcodées :

### 1. **client/src/lib/i18n.ts**
```typescript
// ❌ AVANT
const response = await fetch('/api/detect-language');

// ✅ APRÈS
import { getApiUrl } from './queryClient';
const response = await fetch(getApiUrl('/api/detect-language'));
```

### 2. **client/src/pages/TransferFlow.tsx**
```typescript
// ❌ AVANT
const csrfRes = await fetch('/api/csrf-token', { credentials: 'include' });
const response = await fetch('/api/transfers/initiate', { ... });

// ✅ APRÈS
import { getApiUrl } from '@/lib/queryClient';
const csrfRes = await fetch(getApiUrl('/api/csrf-token'), { credentials: 'include' });
const response = await fetch(getApiUrl('/api/transfers/initiate'), { ... });
```

### 3. **client/src/pages/Contact.tsx**
```typescript
// ❌ AVANT
const response = await fetch('/api/contact', { ... });

// ✅ APRÈS
import { getApiUrl } from '@/lib/queryClient';
const response = await fetch(getApiUrl('/api/contact'), { ... });
```

## 📋 Configuration de Vercel

### Étape 1 : Ajouter la Variable d'Environnement

1. **Allez sur votre dashboard Vercel** : https://vercel.com/dashboard
2. **Sélectionnez votre projet** (frontend ALTUS)
3. **Cliquez sur "Settings"** (onglet du haut)
4. **Dans le menu latéral, cliquez sur "Environment Variables"**
5. **Cliquez sur "Add New"**

### Étape 2 : Configurer les Variables d'Environnement

**Ajoutez ces 3 variables d'environnement :**

| Champ | Valeur |
|-------|--------|
| **Name** | `VITE_API_URL` |
| **Value** | `https://api.altusfinancesgroup.com` |
| **Environment** | ✅ Production<br>✅ Preview<br>✅ Development |

| Champ | Valeur |
|-------|--------|
| **Name** | `VITE_SOCKET_URL` |
| **Value** | `https://api.altusfinancesgroup.com` |
| **Environment** | ✅ Production<br>✅ Preview<br>✅ Development |

| Champ | Valeur |
|-------|--------|
| **Name** | `VITE_SITE_URL` |
| **Value** | `https://altusfinancesgroup.com` |
| **Environment** | ✅ Production<br>✅ Preview<br>✅ Development |

⚠️ **IMPORTANT** : Cochez les trois environnements (Production, Preview, Development) pour chaque variable!

### Étape 3 : Redéployer

Après avoir ajouté la variable d'environnement :

1. **Allez dans "Deployments"** (onglet du haut)
2. **Trouvez le dernier déploiement**
3. **Cliquez sur les trois points (⋯)** à droite
4. **Sélectionnez "Redeploy"**
5. **Confirmez le redéploiement**

**OU utilisez Git pour déclencher un nouveau déploiement :**
```bash
git add .
git commit -m "Fix: Correction des appels API cross-domain"
git push origin main
```

Vercel détectera automatiquement le push et redéploiera.

## ✅ Vérification

### Test 1 : Vérifier que la Variable est Bien Configurée

Une fois le déploiement terminé :

1. **Ouvrez la console développeur** (F12) sur https://altusfinancesgroup.com
2. **Exécutez ce code dans la console** :

```javascript
// Vérifier que toutes les variables sont bien configurées
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);
console.log('VITE_SITE_URL:', import.meta.env.VITE_SITE_URL);

// Devrait afficher:
// VITE_API_URL: https://api.altusfinancesgroup.com
// VITE_SOCKET_URL: https://api.altusfinancesgroup.com
// VITE_SITE_URL: https://altusfinancesgroup.com
```

### Test 2 : Vérifier les Appels API

1. **Rechargez la page** avec la console développeur ouverte (F12)
2. **Allez dans l'onglet "Network"**
3. **Filtrez par "Fetch/XHR"**
4. **Vérifiez que les appels pointent vers le bon domaine** :
   - ✅ `https://api.altusfinancesgroup.com/api/detect-language`
   - ✅ `https://api.altusfinancesgroup.com/api/csrf-token`

### Test 3 : Tester l'Initiation de Transfert

1. **Connectez-vous** à votre compte
2. **Allez dans "Transferts"** ou "Initier un transfert"
3. **Remplissez le formulaire**
4. **Cliquez sur "Initier le transfert"**
5. **Vérifiez qu'il n'y a plus d'erreur "Session expirée"**

## 🔍 Diagnostic en Cas de Problème

### Problème : "Session expirée" persiste

**Vérifiez que :**
1. ✅ `VITE_API_URL=https://api.altusfinancesgroup.com` est bien configuré sur Vercel
2. ✅ Le redéploiement Vercel est terminé
3. ✅ Vous avez vidé le cache navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
4. ✅ La console développeur montre que les appels vont bien vers `api.altusfinancesgroup.com`

### Problème : Les appels API pointent toujours vers altusfinancesgroup.com

**Solutions :**
1. **Vérifiez dans Vercel Settings > Environment Variables** que `VITE_API_URL` est bien configurée
2. **Redéployez** le projet (Deployments > Redeploy)
3. **Videz le cache navigateur** complètement (Settings > Privacy > Clear browsing data)
4. **Testez en navigation privée** pour éliminer les problèmes de cache

### Problème : 404 sur /api/csrf-token

Cela signifie que :
- Soit `VITE_API_URL` n'est pas configurée
- Soit le build Vercel n'a pas encore pris en compte la nouvelle variable

**Solution :**
1. Vérifiez dans Vercel que la variable existe bien
2. Forcez un nouveau build (git push ou redeploy manuel)
3. Attendez que le déploiement soit 100% terminé

## 📊 Configuration Complète de Production

### Variables Vercel (Frontend)
```
VITE_API_URL=https://api.altusfinancesgroup.com
VITE_SITE_URL=https://altusfinancesgroup.com
```

### Variables Render (Backend)
```
NODE_ENV=production
COOKIE_DOMAIN=.altusfinancesgroup.com
FRONTEND_URL=https://altusfinancesgroup.com
SESSION_SECRET=[votre secret]
DATABASE_URL=[votre URL PostgreSQL]
SENDGRID_API_KEY=[votre clé]
```

## 🎉 Résultat Final

Après ces corrections :

1. ✅ **Tous les appels API** utilisent le bon domaine (`api.altusfinancesgroup.com`)
2. ✅ **La détection de langue** fonctionne dès le chargement de la page
3. ✅ **Les tokens CSRF** sont correctement récupérés
4. ✅ **L'initiation de transfert** fonctionne sans erreur de session
5. ✅ **Le formulaire de contact** envoie bien vers le backend
6. ✅ **Les sessions cross-domain** sont maintenues

---

**Créé le** : 20 novembre 2025  
**Objectif** : Corriger les appels API hardcodés et configurer VITE_API_URL sur Vercel
