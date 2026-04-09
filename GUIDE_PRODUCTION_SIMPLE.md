# 🚀 Guide Production : Résoudre la Déconnexion Automatique

## 🎯 Votre Situation

- Domaine : **altusfinancesgroup.com** (avec 's')
- Problème : **Déconnexion automatique après connexion**
- Cause : Configuration des cookies incompatible

## ✅ Solution en 3 Étapes

### Étape 1 : Configurer les Variables d'Environnement

Dans Replit Deployment → Secrets, vérifiez ces variables :

#### Variables Obligatoires (✅ Vous les avez déjà)
```
NODE_ENV=production
SESSION_SECRET=<votre-secret>
DATABASE_URL=<votre-url-postgresql>
SENDGRID_API_KEY=<votre-clé>
FRONTEND_URL=<votre-url>
```

#### Variable à AJOUTER (Important !)

**Option 1 : Si votre frontend et API sont sur le même domaine**
```
# Ne PAS ajouter COOKIE_DOMAIN
# Laissez undefined (plus sécurisé)
```

**Option 2 : Si vous utilisez des sous-domaines différents**
Exemple : 
- Frontend : `www.altusfinancesgroup.com`
- API : `api.altusfinancesgroup.com`

Alors ajoutez :
```
COOKIE_DOMAIN=.altusfinancesgroup.com
```
(Notez le point au début !)

---

### Étape 2 : Déployer les Modifications

```bash
# Sur votre machine locale ou dans Replit
git add .
git commit -m "fix: configuration cookies pour altusfinancesgroup.com"
git push
```

Puis dans Replit :
1. Allez dans l'onglet "Deployments"
2. Cliquez sur "Deploy"
3. Attendez la fin du déploiement

---

### Étape 3 : Tester

1. **Videz complètement le cache** de votre navigateur
   - Chrome/Edge : `Ctrl+Shift+Delete` → Cochez "Cookies" → "Supprimer"
   - Firefox : `Ctrl+Shift+Delete` → Cochez "Cookies" → "Effacer maintenant"

2. **Testez en navigation privée** (recommandé pour le premier test)
   - Chrome/Edge : `Ctrl+Shift+N`
   - Firefox : `Ctrl+Shift+P`

3. **Connectez-vous**
   - Allez sur `https://altusfinancesgroup.com/login`
   - Entrez vos identifiants
   - Cliquez sur "Se connecter"

4. **Vérifiez que vous restez connecté**
   - Rafraîchissez la page (`F5`)
   - Naviguez vers une autre page
   - Attendez 1-2 minutes
   - ✅ Vous devriez rester connecté !

---

## 🔍 Diagnostic si ça ne marche pas

### Vérifier les cookies dans le navigateur

1. Ouvrez les **Outils de développement** (`F12`)
2. Allez dans l'onglet **Application** (Chrome) ou **Stockage** (Firefox)
3. Cliquez sur **Cookies** → `https://altusfinancesgroup.com`
4. Cherchez un cookie nommé **`sessionId`**

**Ce que vous devriez voir :**
```
Nom: sessionId
Valeur: s%3A... (une longue chaîne)
Domaine: altusfinancesgroup.com OU .altusfinancesgroup.com
Chemin: /
Expires: (7 jours dans le futur)
HttpOnly: ✓
Secure: ✓
SameSite: Lax
```

### Si le cookie n'apparaît pas :

**Problème 1 : HTTPS non configuré**
- Solution : Vérifiez que votre site est bien en HTTPS
- Les cookies `secure: true` nécessitent HTTPS

**Problème 2 : CORS mal configuré**
- Solution : Vérifiez les logs de production pour voir des erreurs CORS
- Le domaine doit correspondre exactement

**Problème 3 : Trust Proxy mal configuré**
- Solution : Assurez-vous que Replit est configuré avec un reverse proxy

---

## 📊 Vérifier les Logs en Production

Pour voir ce qui se passe exactement :

1. Allez dans Replit → Votre déploiement
2. Cliquez sur "Logs"
3. Cherchez ces lignes au démarrage :

```
============================================================
[CONFIG] Environment: production
[CONFIG] Cookie Domain: undefined (same domain only)
[CONFIG] Cookie SameSite: lax
[CONFIG] Cookie Secure: true
[CONFIG] CORS Allowed Origins: production domains
============================================================
```

4. Lors de la connexion, cherchez :

```
POST /api/login 200 in XXms
```

5. Si vous voyez des erreurs CSRF :

```
[CSRF-ERROR] Session invalide ou token manquant
```

Cela signifie que le cookie n'est pas envoyé → Vérifiez l'étape 1 (COOKIE_DOMAIN)

---

## 🎯 Cas d'Usage Courants

### Cas 1 : Tout est sur le même domaine
```
Frontend: altusfinancesgroup.com
API: altusfinancesgroup.com/api
```
**Solution** : Ne PAS définir COOKIE_DOMAIN

### Cas 2 : Sous-domaines différents
```
Frontend: www.altusfinancesgroup.com
API: api.altusfinancesgroup.com
```
**Solution** : Définir `COOKIE_DOMAIN=.altusfinancesgroup.com`

### Cas 3 : Replit Deployment (probablement votre cas)
```
URL: altusfinancesgroup.com (fournie par Replit)
Frontend et API: même domaine
```
**Solution** : Ne PAS définir COOKIE_DOMAIN

---

## ✅ Checklist Finale

Avant de déployer, vérifiez :

- [ ] `NODE_ENV=production` est défini
- [ ] `SESSION_SECRET` est défini (32+ caractères aléatoires)
- [ ] `DATABASE_URL` est défini (PostgreSQL Neon)
- [ ] `COOKIE_DOMAIN` est soit :
  - [ ] Non défini (si même domaine)
  - [ ] `.altusfinancesgroup.com` (si sous-domaines)
- [ ] Code mis à jour (`git push`)
- [ ] Déployé dans Replit
- [ ] Cache navigateur vidé
- [ ] Test de connexion réussi

---

## 🆘 Si le Problème Persiste

Contactez-moi avec ces informations :

1. La configuration de vos variables d'environnement (sans les valeurs secrètes)
2. Les logs de production lors de la connexion
3. Une capture d'écran des cookies dans les outils de développement
4. L'architecture exacte (même domaine ou sous-domaines ?)

---

**Dernière mise à jour** : 18 Novembre 2025  
**Domaine supporté** : altusfinancesgroup.com (avec 's')
