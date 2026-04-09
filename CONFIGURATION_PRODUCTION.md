# ⚙️ Configuration Production - Architecture Sous-domaines

## 🏗️ Votre Architecture
```
Frontend: www.altusfinancesgroup.com
API:      api.altusfinancesgroup.com (ou altusfinancesgroup.com/api)
```

## ✅ Variables d'Environnement à Configurer

Dans **Replit Deployment → Secrets**, ajoutez cette variable :

### Variable CRITIQUE à ajouter :
```
COOKIE_DOMAIN=.altusfinancesgroup.com
```
⚠️ **IMPORTANT** : Le point au début (`.altusfinancesgroup.com`) est essentiel !

### Variables existantes (à vérifier) :
```
NODE_ENV=production
SESSION_SECRET=<déjà configuré ✓>
DATABASE_URL=<déjà configuré ✓>
SENDGRID_API_KEY=<déjà configuré ✓>
FRONTEND_URL=https://www.altusfinancesgroup.com
```

---

## 🚀 Étapes de Déploiement

### 1. Ajouter la variable COOKIE_DOMAIN

Dans Replit :
1. Allez dans votre déploiement
2. Cliquez sur "Secrets" ou "Environment Variables"
3. Ajoutez :
   - **Key** : `COOKIE_DOMAIN`
   - **Value** : `.altusfinancesgroup.com`
4. Sauvegardez

### 2. Déployer le nouveau code

```bash
git add .
git commit -m "fix: cookies pour architecture sous-domaines"
git push
```

Dans Replit :
1. Allez dans "Deployments"
2. Cliquez sur "Deploy"
3. Attendez la fin du déploiement (~2-3 minutes)

### 3. Vider complètement le cache navigateur

**Chrome/Edge :**
1. Appuyez sur `Ctrl+Shift+Delete`
2. Sélectionnez "Toutes les périodes"
3. Cochez uniquement "Cookies et autres données de site"
4. Cliquez sur "Effacer les données"

**Firefox :**
1. Appuyez sur `Ctrl+Shift+Delete`
2. Sélectionnez "Tout"
3. Cochez "Cookies"
4. Cliquez sur "Effacer maintenant"

### 4. Tester en navigation privée

**Premier test (Navigation privée) :**
1. Ouvrez une fenêtre de navigation privée
   - Chrome/Edge : `Ctrl+Shift+N`
   - Firefox : `Ctrl+Shift+P`
2. Allez sur `https://www.altusfinancesgroup.com/login`
3. Connectez-vous
4. ✅ Vérifiez que vous restez connecté après refresh

**Deuxième test (Navigation normale) :**
1. Fermez tous les onglets du site
2. Rouvrez votre navigateur normal
3. Allez sur le site
4. Connectez-vous
5. ✅ Naviguez, rafraîchissez → Vous devriez rester connecté !

---

## 🔍 Vérification que ça Fonctionne

### Vérifier le cookie dans le navigateur

1. Connectez-vous au site
2. Appuyez sur `F12` (outils de développement)
3. Allez dans l'onglet **Application** (Chrome) ou **Stockage** (Firefox)
4. Cliquez sur **Cookies** → `https://www.altusfinancesgroup.com`
5. Cherchez le cookie `sessionId`

**Vous devriez voir :**
```
Nom:       sessionId
Valeur:    s%3A... (une longue chaîne cryptée)
Domaine:   .altusfinancesgroup.com  ← IMPORTANT !
Chemin:    /
Expires:   (7 jours dans le futur)
HttpOnly:  ✓ (coché)
Secure:    ✓ (coché)
SameSite:  Lax
```

### Si le domaine n'est pas correct :

❌ **Mauvais** : `Domaine: www.altusfinancesgroup.com` (sans le point)
- Le cookie ne sera PAS partagé entre les sous-domaines
- Solution : Vérifiez que `COOKIE_DOMAIN=.altusfinancesgroup.com` (avec le point)

✅ **Correct** : `Domaine: .altusfinancesgroup.com` (avec le point)
- Le cookie sera partagé entre www, api, etc.

---

## 📊 Vérifier les Logs de Production

Au démarrage de l'application, vous devriez voir :

```
============================================================
[CONFIG] Environment: production
[CONFIG] Cookie Domain: .altusfinancesgroup.com  ← Vérifiez cette ligne !
[CONFIG] Cookie SameSite: lax
[CONFIG] Cookie Secure: true
[CONFIG] CORS Allowed Origins: production domains
[CONFIG] Frontend URL: https://www.altusfinancesgroup.com
[CONFIG] Trust Proxy: enabled
============================================================
```

Si vous voyez `Cookie Domain: undefined`, la variable `COOKIE_DOMAIN` n'est pas définie !

---

## ⚠️ Problèmes Courants et Solutions

### Problème 1 : "Déconnexion après 2-3 secondes"
**Cause** : `COOKIE_DOMAIN` pas défini ou mal configuré  
**Solution** :
1. Vérifiez dans Secrets : `COOKIE_DOMAIN=.altusfinancesgroup.com`
2. Redéployez
3. Videz le cache navigateur

### Problème 2 : "Erreur CORS"
**Cause** : Les domaines ne sont pas dans la liste autorisée  
**Solution** : Les domaines autorisés sont :
- `https://altusfinancesgroup.com`
- `https://www.altusfinancesgroup.com`
- La valeur de `FRONTEND_URL`

### Problème 3 : "Session invalide - token CSRF manquant"
**Cause** : Le cookie n'est pas envoyé dans les requêtes API  
**Solution** :
1. Vérifiez que `COOKIE_DOMAIN=.altusfinancesgroup.com` (avec le point)
2. Vérifiez que HTTPS est activé partout
3. Videz le cache navigateur

### Problème 4 : Le cookie n'apparaît pas du tout
**Cause** : HTTPS non configuré  
**Solution** : Les cookies `secure: true` nécessitent HTTPS obligatoirement

---

## ✅ Checklist Finale

Avant de tester :

- [ ] `COOKIE_DOMAIN=.altusfinancesgroup.com` ajouté dans Secrets
- [ ] Code déployé (git push + Deploy dans Replit)
- [ ] Cache navigateur complètement vidé
- [ ] Test en navigation privée d'abord
- [ ] Vérification du cookie dans les outils de développement

Après test réussi :

- [ ] Connexion fonctionne
- [ ] Reste connecté après refresh
- [ ] Reste connecté après navigation entre pages
- [ ] Reste connecté après fermeture/réouverture du navigateur
- [ ] Les transferts fonctionnent

---

## 🎯 Résumé Ultra-Simple

1. **Ajoutez** : `COOKIE_DOMAIN=.altusfinancesgroup.com` dans Secrets
2. **Déployez** : git push + Deploy
3. **Videz** : Cache navigateur
4. **Testez** : Connexion en navigation privée
5. **✅ Ça marche !**

---

**Architecture** : Sous-domaines (www + api)  
**Domaine** : altusfinancesgroup.com  
**Date** : 18 Novembre 2025
