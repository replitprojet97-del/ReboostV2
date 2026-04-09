# 🔧 Solution au Problème "Unexpected token '<'"

## 🎯 Diagnostic du Problème

Malgré votre configuration correcte de `VITE_API_URL` dans Vercel (avec les 3 cases cochées), **la variable n'est PAS injectée dans le build**.

Cela signifie que le code compilé ressemble à :
```javascript
const API_BASE_URL = '' || '';  // VITE_API_URL est vide au build
```

Au lieu de :
```javascript
const API_BASE_URL = 'https://api.altusfinancesgroup.com' || '';
```

## 📊 Vérification Rapide

**IMPORTANT**: J'ai créé une page de diagnostic pour vérifier si la variable est injectée.

### 1. Commitez et Poussez les Changements

D'abord, committez les fichiers que j'ai modifiés :

```bash
git add vercel.json client/src/App.tsx client/src/pages/DiagnosticPage.tsx
git commit -m "fix: Add diagnostic page and improve vercel.json"
git push
```

### 2. Attendez que Vercel Redéploie

Vercel détectera automatiquement le push et redéploiera. Attendez 2-3 minutes.

### 3. Ouvrez la Page de Diagnostic

Une fois le déploiement terminé, ouvrez :
```
https://altusfinancesgroup.com/diagnostic
```

Cette page vous dira **immédiatement** si `VITE_API_URL` est injectée ou non.

## ✅ Solutions par Ordre de Priorité

### Solution 1: Forcer un Rebuild Propre (RECOMMANDÉ)

Le problème est souvent lié au cache de build de Vercel.

**Étapes:**

1. **Allez dans Vercel** → Votre projet → **Deployments**

2. **Sélectionnez** le dernier déploiement (cliquez dessus)

3. **Cliquez** sur les **trois points** (⋮) en haut à droite

4. **Sélectionnez**: **"Redeploy"**

5. **CRITIQUE**: Dans la popup qui apparaît:
   - ❌ **NE COCHEZ PAS** "Use existing Build Cache"
   - ✅ **DÉCOCHEZ** cette option pour forcer un build complet depuis zéro

6. **Cliquez** sur **"Redeploy"**

7. **Attendez** 2-3 minutes que le build se termine

8. **Allez sur**: `https://altusfinancesgroup.com/diagnostic`

**Résultat attendu**: VITE_API_URL devrait maintenant afficher `https://api.altusfinancesgroup.com`

---

### Solution 2: Vérifier les Logs de Build

Si Solution 1 ne fonctionne pas, vérifiez les logs de build.

**Étapes:**

1. **Allez dans Vercel** → Deployments → Dernier déploiement

2. **Cliquez** sur **"View Function Logs"** ou l'onglet **"Build Logs"**

3. **Cherchez** (Ctrl+F) : `VITE_API_URL`

**Ce que vous devriez voir:**
```
✓ Building for production...
  Environment: VITE_API_URL=https://api.altusfinancesgroup.com
```

**❌ Si vous ne voyez RIEN:**
La variable n'est pas disponible pendant le build. Passez à Solution 3.

---

### Solution 3: Reconfigurer la Variable

Si la variable n'apparaît pas dans les logs, supprimez-la et recréez-la.

**Étapes:**

1. **Allez dans Vercel** → Settings → **Environment Variables**

2. **Trouvez** `VITE_API_URL`

3. **Supprimez-la** (cliquez sur les 3 points → Delete)

4. **Créez une nouvelle variable:**
   - Name: `VITE_API_URL`
   - Value: `https://api.altusfinancesgroup.com`
   - ✅ **COCHEZ les 3 cases**: Production + Preview + Development

5. **Sauvegardez**

6. **Forcez un nouveau déploiement** (voir Solution 1)

---

### Solution 4: Utiliser une Variable Système Alternative

Si rien d'autre ne fonctionne, Vercel pourrait avoir un problème avec les variables Vite.

**Option A**: Ajouter au `package.json`

Modifiez le script de build dans `package.json`:

```json
{
  "scripts": {
    "build:frontend": "VITE_API_URL=https://api.altusfinancesgroup.com vite build"
  }
}
```

**Option B**: Créer un fichier `.env.production`

Créez un fichier `.env.production` à la racine du projet:

```bash
VITE_API_URL=https://api.altusfinancesgroup.com
VITE_SITE_URL=https://altusfinancesgroup.com
```

Committez ce fichier :

```bash
git add .env.production
git commit -m "Add .env.production for Vercel"
git push
```

⚠️ **Attention**: N'incluez jamais de secrets dans `.env.production`, uniquement des URLs publiques.

---

## 🔍 Vérifications Post-Solution

### 1. Page de Diagnostic

Ouvrez : `https://altusfinancesgroup.com/diagnostic`

**Vous devriez voir:**
- ✅ **Configuration correcte**
- `VITE_API_URL: https://api.altusfinancesgroup.com`

### 2. Test dans la Console

Ouvrez la console du navigateur (F12) et tapez:

```javascript
console.log(import.meta.env.VITE_API_URL);
```

**Résultat attendu:** `https://api.altusfinancesgroup.com`

### 3. Test de Transfert

1. Connectez-vous à votre compte
2. Allez dans **Transferts** → **Nouveau transfert**
3. Remplissez le formulaire
4. Vérifiez l'onglet **Network** (F12)
5. Confirmez que les requêtes vont vers `api.altusfinancesgroup.com`

**❌ Si vous voyez des requêtes vers `altusfinancesgroup.com/api/...`:**
La variable n'est toujours pas injectée. Retour à Solution 1.

---

## 🛠️ Changements que J'ai Apportés

### 1. Amélioration de `vercel.json`

**Avant:**
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

**Après:**
```json
"rewrites": [
  {
    "source": "/((?!api).*)",
    "destination": "/index.html"
  }
]
```

**Pourquoi?**
- Si une requête accidentelle va vers `/api/*` sur le frontend, elle retournera maintenant une **404** au lieu de **index.html**
- Cela rend les erreurs de configuration plus évidentes

### 2. Page de Diagnostic

Nouvelle route: `https://altusfinancesgroup.com/diagnostic`

**Fonctionnalités:**
- ✅ Affiche toutes les variables d'environnement Vite
- ✅ Vérifie si `VITE_API_URL` est correctement injectée
- ✅ Donne des instructions claires si la variable est manquante
- ✅ Permet de copier les infos de diagnostic

---

## 🎓 Pourquoi Ce Problème Arrive

### Vite et les Variables d'Environnement

Vite remplace les variables `import.meta.env.VITE_*` **pendant la compilation**, pas à l'exécution.

**Au moment du build:**
```javascript
// Code source
const API_URL = import.meta.env.VITE_API_URL || '';

// Code compilé (si la variable est disponible)
const API_URL = 'https://api.altusfinancesgroup.com' || '';

// Code compilé (si la variable est ABSENTE)
const API_URL = '' || '';  // ❌ Problème !
```

**Quand VITE_API_URL est vide:**
```javascript
// Au lieu de:
fetch('https://api.altusfinancesgroup.com/api/transfers/initiate')

// Le code fait:
fetch('/api/transfers/initiate')  // Requête relative !

// Vercel rewrite:
'/(.*)'  →  '/index.html'

// Résultat:
<!DOCTYPE html>...  // ❌ HTML au lieu de JSON
```

### Pourquoi le Rewrite Captait les Requêtes API

L'ancien `vercel.json` avait:
```json
"source": "/(.*)"  // Capture TOUTES les routes
```

Cela signifie que même `/api/transfers` était redirigé vers `index.html`.

Maintenant avec:
```json
"source": "/((?!api).*)"  // Capture tout SAUF /api/*
```

Les requêtes `/api/*` retournent une 404 propre au lieu d'HTML.

---

## 📋 Checklist Finale

- [ ] J'ai committé et poussé les changements (vercel.json, DiagnosticPage.tsx, App.tsx)
- [ ] J'ai forcé un rebuild propre dans Vercel (SANS cache)
- [ ] J'ai attendu que le déploiement se termine (2-3 min)
- [ ] J'ai ouvert https://altusfinancesgroup.com/diagnostic
- [ ] La page affiche "✅ Configuration correcte"
- [ ] `VITE_API_URL` montre `https://api.altusfinancesgroup.com`
- [ ] J'ai testé un transfert et ça fonctionne
- [ ] Aucune erreur "Unexpected token '<'" dans la console

---

## 🆘 Si Rien ne Fonctionne

Si après avoir essayé toutes les solutions le problème persiste:

### 1. Partagez les Informations Suivantes

**A. Capture d'écran de la page de diagnostic:**
```
https://altusfinancesgroup.com/diagnostic
```

**B. Logs de build Vercel:**
- Deployments → Dernier déploiement → Build Logs
- Cherchez "VITE_API_URL" et partagez cette section

**C. Console du navigateur:**
```javascript
console.log(import.meta.env);
```

**D. Onglet Network (F12):**
- Faites un transfert
- Capturez les requêtes vers `/api/transfers/initiate`
- Montrez l'URL exacte appelée

### 2. Workaround Temporaire

En attendant de résoudre le problème Vercel, vous pouvez hardcoder l'URL temporairement:

**Dans `client/src/lib/queryClient.ts`:**

```typescript
// Temporaire - hardcodé pour production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'altusfinancesgroup.com' 
    ? 'https://api.altusfinancesgroup.com' 
    : '');
```

⚠️ **Ceci est un workaround**, pas une solution permanente !

---

## 📞 Support

Si le problème persiste après avoir suivi toutes ces étapes, il pourrait s'agir d'un bug Vercel. Dans ce cas:

1. **Contactez le support Vercel** avec:
   - Les logs de build
   - La configuration de vos variables d'environnement
   - Les infos de la page de diagnostic

2. **Alternativement**, déployez sur une autre plateforme:
   - Netlify
   - Cloudflare Pages
   - AWS Amplify

---

## ✨ Résumé

**Problème**: VITE_API_URL configurée dans Vercel mais pas injectée dans le build

**Solution**: Forcer un rebuild propre sans cache + améliorer vercel.json

**Vérification**: https://altusfinancesgroup.com/diagnostic

**Durée totale**: 5-10 minutes

Bonne chance ! 🚀
