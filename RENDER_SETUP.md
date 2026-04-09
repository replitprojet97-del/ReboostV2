# Configuration Render pour ALTUS

## 🔴 PROBLÈME IDENTIFIÉ

Le backend sur Render ne crée pas correctement les cookies de session pour communiquer avec le frontend Vercel parce que les variables d'environnement nécessaires ne sont pas configurées.

## ✅ SOLUTION : Variables d'environnement obligatoires sur Render

### Variables CRITIQUES (obligatoires)

Allez dans votre service Render → Environment → Ajoutez ces variables :

```bash
# 1. OBLIGATOIRE - Active la configuration de production
NODE_ENV=production

# 2. OBLIGATOIRE - Secret pour les sessions (générez une chaîne aléatoire sécurisée)
SESSION_SECRET=votre_secret_tres_securise_ici_64_caracteres_minimum

# 3. OBLIGATOIRE - URL de votre base de données PostgreSQL
DATABASE_URL=postgresql://user:password@host:port/database

# 4. OBLIGATOIRE - URL du frontend Vercel
FRONTEND_URL=https://altusfinancesgroup.com

# 5. OPTIONNEL mais RECOMMANDÉ - Domaine des cookies
COOKIE_DOMAIN=.altusfinancesgroup.com
```

### Comment générer SESSION_SECRET

Sur votre machine locale, exécutez :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiez le résultat et utilisez-le comme `SESSION_SECRET`.

### Pourquoi ces variables sont nécessaires ?

1. **NODE_ENV=production** → Active :
   - `sameSite: 'none'` (permet les cookies cross-domain)
   - `secure: true` (cookies HTTPS uniquement)
   - `domain: '.altusfinancesgroup.com'` (cookies partagés entre sous-domaines)

2. **SESSION_SECRET** → Chiffre les sessions pour la sécurité

3. **DATABASE_URL** → Stocke les sessions dans PostgreSQL (persistant)

4. **FRONTEND_URL** → Configure CORS pour accepter les requêtes de Vercel

5. **COOKIE_DOMAIN** → Permet de personnaliser le domaine des cookies

## 🔍 Vérification

Après avoir ajouté ces variables :

1. Redémarrez le service Render
2. Vérifiez les logs de démarrage, vous devriez voir :
```
============================================================
[CONFIG] Environment: production
[CONFIG] Cookie Domain: .altusfinancesgroup.com
[CONFIG] Cookie SameSite: none
[CONFIG] Cookie Secure: true
[CONFIG] CORS Allowed Origins: production domains
[CONFIG] Frontend URL: https://altusfinancesgroup.com
[CONFIG] Trust Proxy: enabled
============================================================
```

Puis après le démarrage du serveur (le port dépend de la variable PORT sur Render) :
```
✅ Backend API server listening on port <PORT>
🌍 Environment: production
🗄️ Database: Connected
[CONFIG] FRONTEND_URL: https://altusfinancesgroup.com
[CONFIG] Allowed Origins: ["https://altusfinancesgroup.com","https://www.altusfinancesgroup.com"]
[CONFIG] Session Cookie Domain: .altusfinancesgroup.com
[CONFIG] Session Cookie Secure: true
[CONFIG] Session Cookie SameSite: none
```

3. Pour chaque requête, vous verrez :
```
[REQUEST DEBUG] GET /api/user
[REQUEST DEBUG] Origin: https://altusfinancesgroup.com
[REQUEST DEBUG] Cookie Header: PRESENT
[REQUEST DEBUG] Session Exists: YES
[REQUEST DEBUG] Authenticated: YES
[REQUEST DEBUG] CSRF Token: present
```

4. Lors d'une connexion réussie :
```
[AUTH SUCCESS] User authenticated successfully
[AUTH SUCCESS] Session created and will be sent as cookie
[AUTH SUCCESS] Cookie domain: .altusfinancesgroup.com
```

**Note de sécurité** : Les logs ne montrent jamais les valeurs réelles des sessions ou cookies pour protéger contre le vol de session. Seule la présence/absence est indiquée.

## ❌ Sans ces variables

Si `NODE_ENV` n'est pas défini à `production`, les cookies auront :
- `sameSite: 'lax'` → ❌ Ne fonctionne PAS entre domaines différents
- `domain: undefined` → ❌ Cookie limité à api.altusfinancesgroup.com

**Résultat** : Le navigateur refuse d'envoyer le cookie de `altusfinancesgroup.com` vers `api.altusfinancesgroup.com` → Pas de session → 401 Non authentifié

## 📝 Configuration Vercel (déjà OK normalement)

Votre frontend Vercel doit avoir :
```bash
VITE_API_URL=https://api.altusfinancesgroup.com
```

## 🔐 SendGrid (pour les emails)

Si ce n'est pas déjà fait, ajoutez aussi :
```bash
SENDGRID_API_KEY=votre_cle_sendgrid
SENDGRID_FROM_EMAIL=noreply@altusfinancesgroup.com
```

## 🚀 Après configuration

1. Redémarrez le service Render
2. Testez le flux complet :
   - Inscription
   - Vérification email (devrait auto-connecter)
   - Connexion + code OTP
3. Vérifiez que l'utilisateur reste connecté en rafraîchissant la page

## 📊 Logs de débogage

Les logs de production afficheront maintenant des informations détaillées sur :
- Les requêtes reçues
- Les cookies présents ou manquants
- Les sessions créées
- Les authentifications réussies

Consultez les logs Render pour diagnostiquer tout problème.
