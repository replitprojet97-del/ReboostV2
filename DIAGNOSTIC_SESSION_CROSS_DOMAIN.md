# Guide de Diagnostic - Problème de Session Cross-Domain

## 🔍 Problème Identifié

L'application rencontre un problème de session lors de l'initiation de transferts :
- **Symptôme** : Message "Votre session a expiré" lors du clic sur "Initier le transfert"
- **Cause probable** : Les cookies de session ne sont pas correctement transmis entre les domaines (altusfinancesgroup.com → api.altusfinancesgroup.com)

## 🛠️ Modifications Apportées

### 1. **Logs de Débogage Améliorés** (`server/index.ts`)
Les requêtes API sans session active affichent maintenant des informations détaillées dans les logs Render :
- Origine de la requête
- Présence des cookies
- État de la session
- Token CSRF

### 2. **Endpoint de Diagnostic** (`/api/debug/session-diagnostic`)
Un nouvel endpoint permet de vérifier la configuration complète :
```bash
GET https://api.altusfinancesgroup.com/api/debug/session-diagnostic
```

### 3. **Messages d'Erreur Améliorés** (`server/routes.ts`)
Le middleware CSRF fournit maintenant des messages plus précis pour identifier le problème exact.

## 📋 Instructions de Test

### Étape 1 : Déployer les Changements

1. **Pousser les modifications sur GitHub** :
```bash
git add .
git commit -m "Fix: Amélioration du diagnostic de session cross-domain"
git push origin main
```

2. **Redéployer sur Render** :
   - Render devrait automatiquement détecter le push et redéployer
   - Ou cliquez sur "Manual Deploy" > "Clear build cache & deploy"

### Étape 2 : Tester l'Endpoint de Diagnostic

1. **Ouvrez votre navigateur** sur https://altusfinancesgroup.com
2. **Connectez-vous** à votre compte
3. **Ouvrez la console développeur** (F12)
4. **Exécutez ce code dans la console** :

```javascript
fetch('https://api.altusfinancesgroup.com/api/debug/session-diagnostic', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(data => {
    console.log('=== DIAGNOSTIC COMPLET ===');
    console.log(JSON.stringify(data, null, 2));
    
    // Analyse des résultats
    console.log('\n=== ANALYSE ===');
    console.log('✓ Cookies présents:', data.cookies.headerPresent);
    console.log('✓ Cookie sessionId:', data.cookies.hasSessionIdCookie);
    console.log('✓ Session active:', data.session.hasId);
    console.log('✓ Authentifié:', data.session.isAuthenticated);
    console.log('✓ Configuration SameSite:', data.serverConfig.cookieSameSite);
    console.log('✓ Configuration Secure:', data.serverConfig.cookieSecure);
    console.log('✓ Cookie Domain:', data.serverConfig.cookieDomain);
    
    if (data.recommendations.length > 0) {
      console.log('\n⚠️ RECOMMANDATIONS:');
      data.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
    }
  });
```

### Étape 3 : Analyser les Résultats

#### ✅ **Configuration Correcte** (attendue)
```json
{
  "cookies": {
    "headerPresent": true,
    "hasSessionIdCookie": true
  },
  "session": {
    "hasId": true,
    "isAuthenticated": true
  },
  "serverConfig": {
    "cookieDomain": ".altusfinancesgroup.com",
    "cookieSecure": true,
    "cookieSameSite": "none"
  }
}
```

#### ❌ **Problème 1 : Cookies Non Reçus**
Si `cookies.headerPresent` = false ou `hasSessionIdCookie` = false :

**Cause** : Le navigateur bloque les cookies cross-domain

**Solutions** :
1. Vérifier que les deux domaines sont bien en HTTPS
2. Vérifier que `COOKIE_DOMAIN` sur Render = `.altusfinancesgroup.com`
3. Tester dans un autre navigateur (Safari peut être plus strict)

#### ❌ **Problème 2 : Session Non Trouvée**
Si `cookies.hasSessionIdCookie` = true mais `session.hasId` = false :

**Cause** : La session existe côté client mais n'est pas trouvée dans la base de données

**Solutions** :
1. Vérifier que `DATABASE_URL` est correctement configuré sur Render
2. Vérifier les logs Render pour des erreurs de connexion à la base
3. Se déconnecter et se reconnecter pour créer une nouvelle session

### Étape 4 : Vérifier les Logs Render

1. **Accédez aux logs Render** : Dashboard > Votre Service > Logs
2. **Cherchez les messages de diagnostic** :
   - `[SESSION DEBUG]` - Informations sur les requêtes sans session
   - `[CSRF-ERROR]` - Détails des erreurs de validation CSRF
3. **Vérifiez la configuration au démarrage** :
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

### Étape 5 : Test Complet du Transfert

1. **Connectez-vous** sur https://altusfinancesgroup.com
2. **Ouvrez la console développeur** (F12) - IMPORTANT : gardez-la ouverte
3. **Naviguez vers** "Transferts" ou "Initier un transfert"
4. **Remplissez le formulaire** de transfert
5. **Cliquez sur "Initier le transfert"**
6. **Observez les logs** dans la console :
   - Regardez les requêtes réseau (onglet Network)
   - Vérifiez les headers de la requête `POST /api/transfers/initiate`
   - Vérifiez si le cookie `sessionId` est envoyé

## 🔧 Solutions Possibles

### Solution A : Vérifier la Configuration Render

**Variables d'environnement requises sur Render** :
```
NODE_ENV=production
COOKIE_DOMAIN=.altusfinancesgroup.com
FRONTEND_URL=https://altusfinancesgroup.com
SESSION_SECRET=(votre secret)
DATABASE_URL=(votre URL PostgreSQL)
```

### Solution B : Vérifier la Configuration Vercel

**Variables d'environnement requises sur Vercel** :
```
VITE_API_URL=https://api.altusfinancesgroup.com
VITE_SITE_URL=https://altusfinancesgroup.com
```

### Solution C : Test avec le Navigateur

**Test dans Chrome DevTools** :
1. Ouvrez DevTools (F12)
2. Allez dans Application > Cookies
3. Vérifiez les cookies pour `https://api.altusfinancesgroup.com`
4. Cherchez le cookie `sessionId`
5. Vérifiez ses propriétés :
   - Domain: `.altusfinancesgroup.com`
   - SameSite: `None`
   - Secure: `✓`

**Si le cookie n'apparaît pas** :
- Le backend ne l'envoie pas correctement
- Le navigateur le bloque

**Si le cookie apparaît mais n'est pas envoyé dans les requêtes** :
- Problème de configuration SameSite ou Secure
- Problème de domaine

## 📞 Prochaines Étapes

1. **Déployez** les changements sur Render
2. **Exécutez** le diagnostic (Étape 2)
3. **Partagez** les résultats du diagnostic :
   - Copiez la sortie JSON complète
   - Notez les recommandations affichées
4. **Testez** le transfert avec la console ouverte
5. **Vérifiez** les logs Render pour les messages `[SESSION DEBUG]` et `[CSRF-ERROR]`

## 💡 Informations Techniques

### Pourquoi les Cookies Cross-Domain sont Complexes

Pour que les cookies fonctionnent entre `altusfinancesgroup.com` et `api.altusfinancesgroup.com` :

1. **SameSite=None** : Permet l'envoi cross-domain
2. **Secure=true** : Requis pour SameSite=None (HTTPS uniquement)
3. **Domain=.altusfinancesgroup.com** : Partage le cookie entre sous-domaines
4. **credentials: 'include'** : Le frontend doit l'inclure dans fetch()
5. **CORS activé** : Le backend doit autoriser l'origine

Toutes ces conditions sont déjà configurées dans votre code. Le problème vient probablement d'une incohérence entre la configuration locale (développement) et la configuration de production (Render).

---

**Créé le** : 20 novembre 2025
**Objectif** : Résoudre le problème de session expirée lors de l'initiation de transferts
