# Guide de Déploiement - Altus Finance Group

Ce guide vous explique comment déployer votre application Altus Finance Group en production avec Vercel (frontend) et Render (backend).

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration DNS](#configuration-dns)
3. [Déploiement Backend (Render)](#déploiement-backend-render)
4. [Déploiement Frontend (Vercel)](#déploiement-frontend-vercel)
5. [Vérification et Tests](#vérification-et-tests)
6. [Dépannage](#dépannage)

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte GitHub avec votre code
- ✅ Un compte Render (https://render.com)
- ✅ Un compte Vercel (https://vercel.com)
- ✅ Accès à la configuration DNS de votre domaine `altusfinancesgroup.com`
- ✅ Une base de données PostgreSQL (sera créée automatiquement sur Render)

---

## 🌐 Configuration DNS

**IMPORTANT** : Cette étape doit être faite EN PREMIER pour que les cookies cross-domain fonctionnent.

### 1. Connectez-vous à votre fournisseur DNS

Exemple : Cloudflare, OVH, GoDaddy, etc.

### 2. Ajoutez ces enregistrements DNS :

```
Type    Nom                        Valeur                              TTL
----------------------------------------------------------------------
CNAME   altusfinancesgroup.com      [URL fournie par Vercel]          Auto
CNAME   api.altusfinancesgroup.com  [URL fournie par Render]           Auto
```

**Note** : Les URLs exactes seront fournies par Vercel et Render dans les étapes suivantes.

### 3. Vérification

- Les deux domaines doivent pointer vers HTTPS (obligatoire pour les cookies sécurisés)
- Attendez quelques minutes pour la propagation DNS

---

## 🖥️ Déploiement Backend (Render)

### Étape 1 : Créer un nouveau Web Service

1. Connectez-vous à https://dashboard.render.com
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Sélectionnez votre repository `altusfinancegroup`

### Étape 2 : Configuration du Service

Remplissez les champs suivants :

```
Name:           altus-backend
Region:         Frankfurt (EU Central) ou votre région préférée
Branch:         main (ou master)
Root Directory: (laisser vide)
Runtime:        Node
Build Command:  npm install && npm run build
Start Command:  npm run start
Plan:           Starter (ou supérieur selon vos besoins)
```

### Étape 3 : Ajouter une Base de Données PostgreSQL

1. Dans le menu de gauche, cliquez sur **"New +"** → **"PostgreSQL"**
2. Configurez :
   ```
   Name:     altus-database
   Database: altus_db
   User:     altus_user
   Region:   (même région que votre Web Service)
   Plan:     Starter
   ```
3. Cliquez sur **"Create Database"**
4. Une fois créée, allez dans **"Info"** et copiez l'**Internal Database URL**

### Étape 4 : Configuration des Variables d'Environnement

1. Retournez à votre Web Service
2. Allez dans l'onglet **"Environment"**
3. Ajoutez ces variables (cliquez **"Add Environment Variable"**) :

#### Variables OBLIGATOIRES :

```bash
# Session Secret (IMPORTANT : Générez une clé sécurisée)
SESSION_SECRET=VOTRE_CLE_SECRETE_GENEREE

# Frontend URL (IMPORTANT : Votre domaine Vercel)
FRONTEND_URL=https://altusfinancesgroup.com

# Cookie Domain (IMPORTANT : Noter le point au début)
COOKIE_DOMAIN=.altusfinancesgroup.com

# Database URL (Collez l'Internal Database URL de l'étape 3)
DATABASE_URL=postgresql://user:password@host:5432/database

# Node Environment
NODE_ENV=production
```

**Générer SESSION_SECRET** :
```bash
# Sur votre ordinateur, exécutez :
openssl rand -base64 32

# Ou en ligne : https://generate-secret.vercel.app
```

#### Variables OPTIONNELLES (pour fonctionnalités complètes) :

```bash
# Cloudinary (upload de photos de profil)
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# SendGrid (envoi d'emails)
SENDGRID_API_KEY=votre-sendgrid-api-key
FROM_EMAIL=noreply@altusfinancesgroup.com
```

### Étape 5 : Configurer le Domaine Personnalisé

1. Dans votre Web Service, allez à l'onglet **"Settings"**
2. Scrollez jusqu'à **"Custom Domain"**
3. Cliquez sur **"Add Custom Domain"**
4. Entrez : `api.altusfinancesgroup.com`
5. Render vous donnera un **CNAME target** (par exemple : `altus-backend.onrender.com`)
6. **COPIEZ CE CNAME** - vous en aurez besoin pour la configuration DNS

### Étape 6 : Déploiement

1. Cliquez sur **"Save Changes"**
2. Le service va redémarrer automatiquement
3. Attendez que le déploiement soit terminé (status : **"Live"** en vert)
4. Le processus prend environ 5-10 minutes

### Étape 7 : Vérification Backend

Testez que votre backend fonctionne :

```bash
curl https://api.altusfinancesgroup.com/health
```

Vous devriez recevoir une réponse JSON similaire à :

```json
{
  "status": "ok",
  "timestamp": "2025-11-12T08:00:00.000Z",
  "environment": "production",
  "database": "healthy",
  "session": {
    "configured": true,
    "cookieDomain": ".altusfinancesgroup.com",
    "secure": true,
    "sameSite": "none"
  },
  "cors": {
    "allowedOrigins": [
      "https://altusfinancesgroup.com",
      "https://www.altusfinancesgroup.com"
    ],
    "frontendUrl": "https://altusfinancesgroup.com"
  }
}
```

✅ Si `status: "ok"` et `database: "healthy"` → Backend configuré correctement !

❌ Si erreur → Vérifiez les logs dans Render et les variables d'environnement.

---

## 🎨 Déploiement Frontend (Vercel)

### Étape 1 : Créer un nouveau Site

1. Connectez-vous à https://app.vercel.com
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Sélectionnez **"GitHub"** et autorisez l'accès
4. Choisissez votre repository `altusfinancegroup`

### Étape 2 : Configuration du Build

```
Branch to deploy:     main (ou master)
Base directory:       (laisser vide)
Build command:        npm run build
Publish directory:    dist
```

### Étape 3 : Variables d'Environnement

1. Avant de déployer, cliquez sur **"Show advanced"**
2. Cliquez sur **"New variable"**
3. Ajoutez ces variables :

```bash
# URL de l'API Backend (OBLIGATOIRE)
VITE_API_URL=https://api.altusfinancesgroup.com

# URL du site (pour SEO)
VITE_SITE_URL=https://altusfinancesgroup.com
```

### Étape 4 : Déployer

1. Cliquez sur **"Deploy site"**
2. Attendez la fin du build (environ 3-5 minutes)
3. Le site sera disponible sur une URL temporaire Vercel (ex: `random-name-123456.vercel.app`)

### Étape 5 : Configurer le Domaine Personnalisé

1. Une fois le déploiement terminé, allez dans **"Site settings"**
2. Cliquez sur **"Domain management"**
3. Cliquez sur **"Add custom domain"**
4. Entrez : `altusfinancesgroup.com`
5. Vercel vous donnera l'adresse IP ou le CNAME à configurer
6. **COPIEZ CETTE VALEUR** pour la configuration DNS

### Étape 6 : Activer HTTPS

1. Dans **"Domain settings"**
2. Scrollez jusqu'à **"HTTPS"**
3. Cliquez sur **"Verify DNS configuration"**
4. Une fois vérifié, cliquez sur **"Provision certificate"**
5. Attendez quelques minutes pour que le certificat SSL soit émis
6. ✅ Votre site sera accessible via HTTPS

---

## ✅ Vérification et Tests

### 1. Vérifier le Backend

```bash
# Test de santé
curl https://api.altusfinancesgroup.com/health

# Test de session
curl -X GET https://api.altusfinancesgroup.com/api/session-check \
  -H "Origin: https://altusfinancesgroup.com" \
  --cookie-jar cookies.txt
```

### 2. Vérifier le Frontend

1. Ouvrez https://altusfinancesgroup.com dans votre navigateur
2. Ouvrez les DevTools (F12)
3. Allez dans l'onglet **"Console"**
4. Vérifiez qu'il n'y a pas d'erreurs CORS ou réseau

### 3. Test Complet d'Inscription et Connexion

1. **Inscrivez-vous** avec un nouveau compte
2. **Connectez-vous** avec vos identifiants
3. **Vérifiez que le dashboard se charge** sans erreur
4. Dans DevTools → **"Application"** → **"Cookies"** :
   - Vérifiez qu'un cookie `sessionId` existe
   - Domain doit être `.altusfinancesgroup.com`
   - Secure doit être `true`
   - SameSite doit être `None`

### 4. Vérifier les Logs

**Render (Backend)** :
- Allez dans votre Web Service → **"Logs"**
- Vérifiez qu'il n'y a pas d'erreurs CORS
- Cherchez les messages `[CORS DEBUG] ✅ Origin allowed`

**Vercel (Frontend)** :
- Allez dans votre site → **"Deploys"** → **"Deploy log"**
- Vérifiez que le build s'est terminé sans erreur
- Vérifiez que `VITE_API_URL` est correctement définie

---

## 🔧 Dépannage

### Problème : "Erreur lors du chargement des données" dans le dashboard

**Causes possibles** :

1. **VITE_API_URL non défini sur Vercel**
   ```
   Solution : Vérifiez dans Vercel → Site settings → Build & deploy → Environment variables
   Ajoutez : VITE_API_URL=https://api.altusfinancesgroup.com
   Redéployez le site
   ```

2. **Erreur CORS**
   ```
   Symptôme : Erreur dans la console : "CORS policy: No 'Access-Control-Allow-Origin'"
   Solution : Vérifiez que FRONTEND_URL est défini sur Render
   Valeur correcte : https://altusfinancesgroup.com (sans slash final)
   ```

3. **Cookies non envoyés**
   ```
   Symptôme : Session perdue après connexion
   Solution : Vérifiez que COOKIE_DOMAIN=.altusfinancesgroup.com (avec le point)
   Vérifiez que les deux domaines utilisent HTTPS
   ```

### Problème : CORS bloque les requêtes

**Vérification** :
```bash
# Tester CORS
curl -X OPTIONS https://api.altusfinancesgroup.com/api/dashboard \
  -H "Origin: https://altusfinancesgroup.com" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

**Solution** :
- Vérifiez les logs Render pour voir les origines rejetées
- Assurez-vous que `FRONTEND_URL` est exactement `https://altusfinancesgroup.com`
- Pas de slash final, pas de `www.`

### Problème : Base de données ne se connecte pas

**Vérification** :
```bash
curl https://api.altusfinancesgroup.com/health
```

Si `database: "unhealthy"` :
1. Vérifiez que la base PostgreSQL est bien créée et active sur Render
2. Vérifiez que `DATABASE_URL` est correctement configurée
3. Vérifiez les logs Render pour plus de détails

### Problème : Build Vercel échoue

**Causes courantes** :
- Node version incompatible
- Dépendances manquantes

**Solution** :
Ajoutez dans Vercel → **Build settings** :
```
Node version: 20
```

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** :
   - Render : https://dashboard.render.com → Votre service → Logs
   - Vercel : https://app.vercel.com → Votre site → Deploys → Deploy log

2. **Utilisez les health checks** :
   ```bash
   curl https://api.altusfinancesgroup.com/health
   curl https://api.altusfinancesgroup.com/api/session-check
   ```

3. **Mode développement** :
   - Le dashboard affiche des infos de diagnostic détaillées en mode dev
   - Activez les DevTools (F12) pour voir les erreurs réseau et console

---

## ✨ Checklist Finale

Avant de considérer le déploiement terminé :

- [ ] DNS configuré pour `altusfinancesgroup.com` et `api.altusfinancesgroup.com`
- [ ] Backend Render déployé et status "Live"
- [ ] Base de données PostgreSQL créée et connectée
- [ ] Toutes les variables d'environnement Render configurées
- [ ] Frontend Vercel déployé avec succès
- [ ] Variables d'environnement Vercel (`VITE_API_URL`) configurées
- [ ] HTTPS activé sur les deux domaines
- [ ] `/health` retourne `status: "ok"`
- [ ] Test d'inscription/connexion réussi
- [ ] Dashboard se charge sans erreur
- [ ] Cookies `sessionId` présents et configurés correctement

---

**Félicitations ! 🎉**

Votre application Altus Finance Group est maintenant déployée en production !
