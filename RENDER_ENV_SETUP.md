# 🔧 Configuration Render - Instructions Détaillées

## 📝 Variables à Ajouter sur Render

### Étape 1: Accéder aux Variables d'Environnement

1. Connectez-vous à [Render Dashboard](https://dashboard.render.com)
2. Sélectionnez votre service `api.altusfinancesgroup.com`
3. Cliquez sur l'onglet **Environment**

### Étape 2: Générer SESSION_SECRET

Ouvrez un terminal et exécutez :
```bash
openssl rand -base64 32
```

Copiez le résultat (exemple : `Xk7m9PqR3wN8vL2JfG5hT1dY6cB4zS0`).

### Étape 3: Ajouter les Variables

Pour chaque variable ci-dessous, cliquez sur **Add Environment Variable** :

#### 1. SESSION_SECRET (CRITIQUE)
- **Key**: `SESSION_SECRET`
- **Value**: Collez la valeur générée à l'étape 2
- ⚠️ Ne partagez JAMAIS cette valeur publiquement

#### 2. FRONTEND_URL (CRITIQUE)
- **Key**: `FRONTEND_URL`
- **Value**: `https://altusfinancesgroup.com`
- ⚠️ Sans slash final !

#### 3. COOKIE_DOMAIN (CRITIQUE)
- **Key**: `COOKIE_DOMAIN`
- **Value**: `.altusfinancesgroup.com`
- ⚠️ Le point au début est OBLIGATOIRE !

#### 4. NODE_ENV (CRITIQUE)
- **Key**: `NODE_ENV`
- **Value**: `production`

#### 5. DATABASE_URL (Automatique)
- Si vous avez attaché une base PostgreSQL, cette variable est automatique
- Ne la modifiez pas manuellement

#### 6. Variables Optionnelles

##### Cloudinary (Upload d'images)
- **Key**: `CLOUDINARY_CLOUD_NAME`
- **Value**: Votre cloud name Cloudinary

- **Key**: `CLOUDINARY_API_KEY`
- **Value**: Votre API key Cloudinary

- **Key**: `CLOUDINARY_API_SECRET`
- **Value**: Votre API secret Cloudinary

##### SendGrid (Emails)
- **Key**: `SENDGRID_API_KEY`
- **Value**: Votre API key SendGrid

- **Key**: `FROM_EMAIL`
- **Value**: `noreply@altusfinancesgroup.com`

### Étape 4: Sauvegarder

1. Après avoir ajouté toutes les variables, cliquez sur **Save Changes**
2. Render redémarre automatiquement le service
3. Attendez que le statut passe à **Live** (30-60 secondes)

---

## ✅ Variables Minimales Requises

Pour que l'authentification fonctionne, vous devez AU MINIMUM avoir :

```bash
SESSION_SECRET=<votre_secret_généré>
FRONTEND_URL=https://altusfinancesgroup.com
COOKIE_DOMAIN=.altusfinancesgroup.com
NODE_ENV=production
DATABASE_URL=<fourni_automatiquement_par_render>
```

---

## 🔍 Vérification de la Configuration

### Test 1: Variables Chargées

1. Dans Render Dashboard → Votre service → Logs
2. Cherchez les lignes de démarrage :
   ```
   [CONFIG] Environment: production
   [CONFIG] Cookie Domain: .altusfinancesgroup.com
   [CONFIG] Cookie SameSite: none
   [CONFIG] Cookie Secure: true
   [CONFIG] CORS Allowed Origins: production domains
   [CONFIG] Frontend URL: https://altusfinancesgroup.com
   ```

3. Si vous voyez `undefined` ou des valeurs incorrectes, revérifiez les variables

### Test 2: Health Check

Exécutez dans un terminal :
```bash
curl https://api.altusfinancesgroup.com/health
```

Devrait retourner quelque chose comme :
```json
{
  "status": "ok",
  "timestamp": "2024-11-19T...",
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

### Test 3: Session & Cookies

```bash
curl -i https://api.altusfinancesgroup.com/api/csrf-token
```

Vérifiez dans les headers :
```
Set-Cookie: sessionId=...; Domain=.altusfinancesgroup.com; Path=/; HttpOnly; Secure; SameSite=None
```

---

## 🐛 Dépannage

### "Cookie Domain: undefined"
- La variable `COOKIE_DOMAIN` n'est pas définie
- Ajoutez-la avec la valeur `.altusfinancesgroup.com` (avec le point)

### "CORS Error" dans les logs
- Vérifiez que `FRONTEND_URL=https://altusfinancesgroup.com`
- Vérifiez qu'il n'y a PAS de slash final
- Redémarrez le service après modification

### "Session invalide"
- Vérifiez que `SESSION_SECRET` est défini
- Vérifiez que `DATABASE_URL` est connecté
- Consultez les logs Render pour voir les erreurs exactes

### "Database: not_configured"
- Vous n'avez pas de base PostgreSQL attachée
- Allez dans votre service → Settings → Add PostgreSQL
- Une fois ajouté, Render créera automatiquement `DATABASE_URL`

---

## 🔐 Sécurité

### SESSION_SECRET
- DOIT être aléatoire et unique
- NE JAMAIS commiter dans Git
- Générer avec `openssl rand -base64 32`
- Minimum 32 caractères

### COOKIE_DOMAIN
- DOIT commencer par un point : `.altusfinancesgroup.com`
- Permet le partage entre `altusfinancesgroup.com` et `api.altusfinancesgroup.com`
- Ne fonctionnera que si les deux domaines sont sur HTTPS

### DATABASE_URL
- Ne PAS modifier manuellement
- Fournie automatiquement par Render quand vous attachez PostgreSQL
- Contient des credentials sensibles

---

## 📊 Ordre de Priorité

1. **SESSION_SECRET** → Sans ceci, aucune session ne fonctionnera
2. **DATABASE_URL** → Sans ceci, impossible de stocker les données
3. **COOKIE_DOMAIN** → Sans ceci, les cookies ne seront pas partagés
4. **FRONTEND_URL** → Sans ceci, CORS bloquera les requêtes
5. **NODE_ENV** → Sans ceci, les configurations de sécurité ne s'appliquent pas
6. Cloudinary & SendGrid → Optionnels, pour upload et emails

---

## 📞 Support Render

Si vous avez des difficultés :
- [Documentation Render - Environment Variables](https://render.com/docs/environment-variables)
- [Support Render](https://render.com/support)
- Consultez les logs : Dashboard → Service → Logs
