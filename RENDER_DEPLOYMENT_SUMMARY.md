# 🚀 Guide Complet de Déploiement Render

## 📋 Résumé des Corrections

Deux erreurs ont été identifiées et corrigées :

1. ✅ **Build manquant** : Changé pour utiliser `tsx` directement (pas de compilation)
2. ✅ **Import Vite en production** : Retiré car Vite est uniquement pour le développement

---

## 🎯 Architecture de Production

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│         altusfinancesgroup.com                    │
│              (Vercel)                            │
│         React + Vite + TypeScript                │
└───────────────────┬─────────────────────────────┘
                    │
                    │ CORS + Cookies
                    │ (Session partagée)
                    ▼
┌─────────────────────────────────────────────────┐
│                   BACKEND                        │
│       api.altusfinancesgroup.com                  │
│             (Render)                             │
│      Express + TypeScript + PostgreSQL           │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Render - ÉTAPE PAR ÉTAPE

### 1️⃣ Préparation du Code

Les modifications ont déjà été faites :
- ✅ `package.json` : Script `start` utilise maintenant `tsx`
- ✅ `server/index.ts` : Vite retiré de la production
- ✅ `tsx` déplacé dans `dependencies`

### 2️⃣ Push vers GitHub

```bash
git add .
git commit -m "fix: Configure backend for Render deployment (API only)"
git push origin main
```

### 3️⃣ Créer le Service sur Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur **New +** → **Web Service**
3. Connectez votre dépôt : `gitunivers-web/Lepari1`
4. Cliquez sur **Connect**

### 4️⃣ Configuration du Service

| Paramètre | Valeur EXACTE |
|-----------|---------------|
| **Name** | `altus-finance-backend` |
| **Region** | `Frankfurt (EU)` ou `Oregon (US)` |
| **Branch** | `main` |
| **Root Directory** | *Laisser vide* |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | **Starter** ($7/mois) recommandé |

⚠️ **IMPORTANT** :
- **Build Command** : Uniquement `npm install` (pas `npm run build`)
- **Start Command** : Uniquement `npm start`

### 5️⃣ Variables d'Environnement

Dans l'onglet **Environment**, ajoutez ces variables :

#### Variables Obligatoires

| Variable | Valeur / Où la trouver |
|----------|------------------------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Votre URL PostgreSQL Neon |
| `SESSION_SECRET` | Générez : `openssl rand -base64 32` |
| `FRONTEND_URL` | `https://altusfinancesgroup.com` |
| `COOKIE_DOMAIN` | `.altusfinancesgroup.com` |

#### Variables Optionnelles (Email)

| Variable | Valeur |
|----------|--------|
| `SENDGRID_API_KEY` | Votre clé SendGrid |
| `SENDGRID_FROM_EMAIL` | `noreply@altusfinancesgroup.com` |
| `SENDGRID_FROM_NAME` | `Altus Finance Group` |

#### Variables Optionnelles (Cloudinary)

| Variable | Valeur |
|----------|--------|
| `CLOUDINARY_CLOUD_NAME` | Votre nom Cloudinary |
| `CLOUDINARY_API_KEY` | Votre clé API |
| `CLOUDINARY_API_SECRET` | Votre secret API |

### 6️⃣ Configuration du Domaine Personnalisé

1. Dans Render, allez dans **Settings** → **Custom Domain**
2. Ajoutez : `api.altusfinancesgroup.com`
3. Render vous donnera un **CNAME record**
4. Dans votre DNS (Namecheap, Cloudflare, etc.) :
   ```
   Type:  CNAME
   Name:  api
   Value: [le-domaine-fourni-par-render]
   TTL:   Auto
   ```
5. Attendez 5-30 minutes pour la propagation DNS
6. Render activera automatiquement le SSL (Let's Encrypt)

---

## 🧪 Vérification du Déploiement

### Étape 1 : Vérifier les Logs Render

Vous devriez voir :
```
==> Building...
==> Running 'npm install'
✅ added 547 packages in 8s

==> Deploying...
==> Running 'npm start'
> rest-express@1.0.0 start
> NODE_ENV=production tsx server/index.ts

✅ Backend API server listening on port 10000
🌍 Environment: production
🗄️ Database: Connected
```

### Étape 2 : Tester l'Endpoint Health

```bash
# Avec le domaine Render temporaire
curl https://altus-finance-backend.onrender.com/health

# Avec votre domaine personnalisé (après configuration DNS)
curl https://api.altusfinancesgroup.com/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2025-11-16T21:50:00.000Z",
  "environment": "production",
  "database": "connected",
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

---

## 🔍 Débogage

### Si le déploiement échoue

#### Erreur : "Cannot find module"
- ✅ Vérifiez que `tsx` est dans `dependencies` (pas `devDependencies`)
- ✅ Build Command doit être exactement `npm install`

#### Erreur : "DATABASE_URL is not defined"
- ✅ Ajoutez la variable `DATABASE_URL` dans Render
- ✅ Vérifiez qu'elle est bien formatée : `postgresql://user:pass@host/db?sslmode=require`

#### Erreur : "Port 5000 is already in use"
- ✅ Render définit automatiquement `PORT=10000`
- ✅ Votre code utilise `process.env.PORT` (déjà fait)

#### Logs : "Session store not configured"
- ✅ Vérifiez que `DATABASE_URL` est défini
- ✅ Vérifiez que la table `user_sessions` a été créée

### Commandes de Débogage

```bash
# Dans le Dashboard Render, ouvrez le Shell et testez :
echo $NODE_ENV
echo $DATABASE_URL
node --version
npm --version
```

---

## 📊 Monitoring en Production

### Métriques à Surveiller

1. **Temps de Réponse** : Doit être < 500ms pour `/health`
2. **Utilisation Mémoire** : Doit rester < 512MB (plan Starter)
3. **Erreurs 5xx** : Doit être 0%
4. **Uptime** : Doit être > 99.5%

### Logs à Surveiller

```bash
# Dans Render Dashboard → Logs
# Recherchez ces patterns :

✅ "Backend API server listening"  → Démarrage réussi
❌ "FATAL:"                         → Erreur critique
⚠️  "WARNING:"                      → Attention requise
ℹ️  "POST /api/"                    → Requêtes API
```

---

## 🔄 Redéploiement

### Déploiement Automatique
- ✅ Chaque `git push` sur `main` déclenche un redéploiement
- ✅ Render build et redémarre automatiquement

### Déploiement Manuel
1. Dans Render Dashboard
2. Cliquez sur **Manual Deploy**
3. Sélectionnez la branche `main`
4. Cliquez sur **Deploy**

---

## 🎉 Checklist Finale

Avant de considérer le déploiement comme terminé :

### Configuration
- [ ] Code poussé sur GitHub
- [ ] Service Render créé et configuré
- [ ] Build Command : `npm install`
- [ ] Start Command : `npm start`
- [ ] Toutes les variables d'environnement définies

### Domaine
- [ ] Domaine personnalisé ajouté : `api.altusfinancesgroup.com`
- [ ] DNS CNAME configuré
- [ ] SSL activé (certificat Let's Encrypt)

### Tests
- [ ] `/health` répond avec status 200
- [ ] `database: "connected"` dans la réponse
- [ ] `environment: "production"` confirmé
- [ ] Logs ne montrent aucune erreur
- [ ] Session fonctionne (test avec frontend)

### Frontend (Vercel)
- [ ] Frontend déployé sur Vercel
- [ ] `VITE_API_URL=https://api.altusfinancesgroup.com` défini
- [ ] CORS fonctionne (requêtes API réussies)
- [ ] Cookies de session fonctionnent

---

## 📞 Support

### Si quelque chose ne fonctionne pas :

1. **Vérifiez les logs Render** : Dashboard → Logs
2. **Testez l'endpoint health** : `curl https://api.altusfinancesgroup.com/health`
3. **Vérifiez les variables d'environnement** : Dashboard → Environment
4. **Consultez la documentation Render** : https://render.com/docs

### Documents Utiles

- `RENDER_FIX.md` : Explication des erreurs corrigées
- `DEPLOYMENT_GUIDE.md` : Guide complet Vercel + Render
- Ce fichier : Résumé du déploiement Render

---

## 🚀 Prochaines Étapes

1. ✅ Backend sur Render (ce guide)
2. 🔜 Frontend sur Vercel (`DEPLOYMENT_GUIDE.md`)
3. 🔜 Configuration DNS complète
4. 🔜 Tests de bout en bout
5. 🔜 Monitoring et alertes

---

**Votre backend est maintenant prêt pour la production !** 🎉
