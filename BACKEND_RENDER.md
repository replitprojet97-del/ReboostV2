# Configuration Backend sur Render

## 📋 Checklist de Configuration

Voici les variables d'environnement à configurer sur Render pour votre backend:

### 1. Variables Essentielles

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Mode de production |
| `PORT` | Auto (Render l'assigne) | Port du serveur (généralement 10000) |
| `DATABASE_URL` | Auto (si PostgreSQL Render) | URL de connexion PostgreSQL |
| `SESSION_SECRET` | Générer avec `openssl rand -base64 32` | Secret pour les sessions |
| `FRONTEND_URL` | `https://altusfinancesgroup.com` | URL du frontend pour CORS |

### 2. Services Externes

#### SendGrid (Email)
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@altusfinancesgroup.com
```

#### Cloudinary (Upload de fichiers)
```bash
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### 3. Configuration CORS

Assurez-vous que votre code backend contient:

```javascript
const allowedOrigins = [
  'https://altusfinancesgroup.com',
  'https://www.altusfinancesgroup.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : null
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 4. Configuration de Session

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.altusfinancesgroup.com' : undefined
  }
}));
```

### 5. Build & Start Commands sur Render

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start
```

### 6. Configuration du Domaine Custom

1. Dans Render, allez dans **Settings** > **Custom Domain**
2. Ajoutez `api.altusfinancesgroup.com`
3. Configurez les DNS records chez votre registrar:

```
Type: CNAME
Name: api
Value: <votre-app>.onrender.com
```

### 7. Base de Données PostgreSQL

Si vous utilisez PostgreSQL sur Render:

1. Créez une nouvelle base de données PostgreSQL sur Render
2. Liez-la à votre service web
3. La variable `DATABASE_URL` sera automatiquement configurée
4. Exécutez les migrations:

```bash
npm run db:push
```

### 8. Health Check

Assurez-vous d'avoir un endpoint de health check:

```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

Render l'utilisera pour vérifier que votre service fonctionne.

### 9. Vérifications Post-Déploiement

```bash
# Tester le health check
curl https://api.altusfinancesgroup.com/api/health

# Tester CORS
curl -H "Origin: https://altusfinancesgroup.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.altusfinancesgroup.com/api/csrf-token -v
```

### 10. Logs et Monitoring

- Consultez les logs dans Render Dashboard > Logs
- Configurez des alertes pour les erreurs
- Surveillez l'utilisation de la base de données

---

## 🔄 Workflow Complet

### Première Configuration

1. **Créer le service sur Render**
   - Connectez votre repository
   - Sélectionnez la branche `main`
   - Configurez Build & Start commands

2. **Créer la base de données PostgreSQL**
   - Créez une nouvelle instance PostgreSQL
   - Liez-la à votre service web

3. **Configurer les variables d'environnement**
   - Ajoutez toutes les variables listées ci-dessus
   - ⚠️ N'oubliez pas `FRONTEND_URL` pour CORS!

4. **Configurer le domaine custom**
   - Ajoutez `api.altusfinancesgroup.com`
   - Configurez les DNS

5. **Déployer et tester**
   - Render déploiera automatiquement
   - Testez tous les endpoints
   - Vérifiez les logs

### Déploiement Continu

Chaque `git push` sur `main` déclenchera automatiquement un nouveau déploiement sur Render.

---

## 🐛 Dépannage

### Erreur: "Not allowed by CORS"
- Vérifiez que `FRONTEND_URL` est bien configuré
- Vérifiez la configuration CORS dans le code

### Erreur: Base de données non accessible
- Vérifiez que `DATABASE_URL` est configuré
- Vérifiez que la base est bien liée au service

### Erreur: Session non persistante
- Vérifiez `SESSION_SECRET`
- Vérifiez la configuration des cookies

### Erreur 503: Service Unavailable
- Vérifiez les logs pour voir l'erreur exacte
- Le service peut être en cours de déploiement
- Vérifiez le health check endpoint

---

## 📊 Architecture Complète

```
Frontend (Vercel)                Backend (Render)              Database (Render)
altusfinancesgroup.com    →    api.altusfinancesgroup.com    →    PostgreSQL
     ↓                              ↓                              ↓
  Vite Build                   Express Server              Neon/Render DB
  Static Files                 Node.js 20                  Connection Pool
  HTTPS (Let's Encrypt)        HTTPS (Let's Encrypt)       SSL Required
```

---

## ✅ Checklist Finale Backend

- [ ] Service web créé sur Render
- [ ] Base de données PostgreSQL créée et liée
- [ ] Toutes les variables d'environnement configurées
- [ ] Domaine custom `api.altusfinancesgroup.com` configuré
- [ ] DNS CNAME configuré
- [ ] CORS configuré avec `altusfinancesgroup.com`
- [ ] Sessions configurées correctement
- [ ] Health check endpoint fonctionne
- [ ] Migrations de base de données exécutées
- [ ] Tests API réussis
- [ ] Logs vérifiés sans erreurs

---

Bon déploiement ! 🚀
