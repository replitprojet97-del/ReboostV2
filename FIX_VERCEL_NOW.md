# 🚨 SOLUTION IMMÉDIATE - Erreur "Unexpected token '<'"

## ✅ CE QUI MANQUE

Votre variable `VITE_API_URL` n'est **PAS** injectée dans le build Vercel parce que vous n'avez coché qu'une seule case au lieu de trois.

---

## 🎯 SOLUTION EN 5 MINUTES

### Étape 1: Ouvrez Vercel
```
https://vercel.com/dashboard
```

### Étape 2: Sélectionnez votre projet
Cliquez sur: **altusfinancesgroup.com** (ou le nom de votre projet)

### Étape 3: Allez dans les variables d'environnement
```
Settings (en haut) → Environment Variables (à gauche)
```

### Étape 4: Trouvez VITE_API_URL

Vous devriez voir quelque chose comme ça:
```
Name: VITE_API_URL
Value: https://api.altusfinancesgroup.com (masqué avec •••)
```

### Étape 5: MODIFIEZ la variable (cliquez sur les 3 points)

**⚠️ CRITIQUE:** Vous devez cocher **LES 3 CASES** :

```
✅ Production       <- DOIT être coché
✅ Preview          <- DOIT être coché  
✅ Development      <- DOIT être coché
```

**ACTUELLEMENT VOUS AVEZ SEULEMENT:**
```
✅ Production
❌ Preview         <- PAS coché = PROBLÈME
❌ Development     <- PAS coché = PROBLÈME
```

### Étape 6: Sauvegardez
Cliquez sur **"Save"**

### Étape 7: Redéployez

1. Allez dans: **Deployments** (en haut)
2. Cliquez sur le dernier déploiement
3. Cliquez sur les **trois points** (**⋮**) en haut à droite
4. Cliquez sur **"Redeploy"**
5. Attendez 2-3 minutes que le build se termine

---

## 🧪 TEST RAPIDE

Une fois le redéploiement terminé:

1. Ouvrez: https://altusfinancesgroup.com
2. Ouvrez la **Console** (F12)
3. Tapez:
```javascript
console.log(import.meta.env.VITE_API_URL);
```

**Résultat attendu:**
```
https://api.altusfinancesgroup.com
```

**❌ SI C'EST `undefined`:**
- Les 3 cases n'étaient pas toutes cochées
- Recommencez l'Étape 5 ci-dessus

---

## 🔍 POURQUOI ÇA NE MARCHAIT PAS ?

### Vite = Variables au BUILD TIME

Les variables d'environnement Vite (VITE_*) sont **injectées dans le code pendant la compilation**, pas à l'exécution.

**Quand Vercel build votre frontend:**
```javascript
// Code source (avant build)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Code compilé (après build) - SI LA VARIABLE N'EST PAS DISPONIBLE
const API_BASE_URL = '' || '';  // = ''

// Code compilé (après build) - SI LA VARIABLE EST DISPONIBLE
const API_BASE_URL = 'https://api.altusfinancesgroup.com' || '';
```

**Si VITE_API_URL est vide au build:**
```javascript
// Vos appels API deviennent:
fetch('/api/transfers/initiate')  
// ❌ Appelle: altusfinancesgroup.com/api/transfers/initiate
// ❌ Cette route n'existe pas sur le frontend
// ❌ Retourne: index.html (<!DOCTYPE html...>)
// ❌ JSON.parse(html) = "Unexpected token '<'"
```

**Si VITE_API_URL est définie au build:**
```javascript
// Vos appels API deviennent:
fetch('https://api.altusfinancesgroup.com/api/transfers/initiate')
// ✅ Appelle: api.altusfinancesgroup.com/api/transfers/initiate
// ✅ Retourne: JSON valide
// ✅ Tout fonctionne !
```

---

## 📋 CHECKLIST RAPIDE

- [ ] J'ai ouvert Vercel
- [ ] J'ai trouvé VITE_API_URL dans Settings → Environment Variables
- [ ] J'ai cliqué sur "Edit" (les 3 points)
- [ ] J'ai coché **LES 3 CASES** (Production + Preview + Development)
- [ ] J'ai cliqué "Save"
- [ ] J'ai redéployé le projet (Deployments → Dernier déploiement → ⋮ → Redeploy)
- [ ] J'ai attendu que le build se termine
- [ ] J'ai testé dans la console: `console.log(import.meta.env.VITE_API_URL)`
- [ ] Le résultat est: `https://api.altusfinancesgroup.com`
- [ ] Le site fonctionne maintenant !

---

## 🆘 SI ÇA NE MARCHE TOUJOURS PAS

### Test de diagnostic:

Ouvrez: https://altusfinancesgroup.com/dashboard

Si vous voyez un message d'erreur en rouge avec "Diagnostic Info", cliquez dessus et vérifiez:

```
VITE_API_URL: https://api.altusfinancesgroup.com  ← Devrait afficher ceci
```

**Si c'est `(non défini)`:**
- La variable n'est pas injectée
- Retournez à l'Étape 5 ci-dessus
- Assurez-vous que les 3 cases sont bien cochées
- Redéployez

### Autres vérifications:

1. **Backend en ligne ?**
```bash
curl https://api.altusfinancesgroup.com/api/health
```
Devrait retourner: `{"status":"ok"}`

2. **CORS configuré ?**
Vérifiez que le backend a:
```
FRONTEND_URL=https://altusfinancesgroup.com
COOKIE_DOMAIN=.altusfinancesgroup.com
```

3. **DNS correct ?**
```bash
nslookup api.altusfinancesgroup.com
```
Devrait retourner une adresse IP valide

---

## 📞 BESOIN D'AIDE ?

Si après avoir suivi toutes ces étapes le problème persiste, partagez:

1. **Capture d'écran** de la page Vercel "Environment Variables" montrant VITE_API_URL avec les 3 cases cochées
2. **Capture d'écran** de la console du navigateur montrant le résultat de `console.log(import.meta.env.VITE_API_URL)`
3. **Capture d'écran** de l'onglet Network (F12) montrant l'erreur exacte

---

## ✨ RÉSUMÉ

**Problème:** Variables Vite non disponibles au build = appels API vers le mauvais domaine

**Solution:** Cocher les 3 cases pour que Vercel passe la variable pendant la compilation

**Temps:** 5 minutes + 2-3 minutes de build

**Résultat:** Tous les transferts fonctionnent sans erreur JSON !
