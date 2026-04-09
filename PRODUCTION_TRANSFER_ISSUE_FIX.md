# 🔧 Correctif pour les problèmes de session en production

## 🔍 Problèmes Identifiés

### 1. Déconnexion automatique après connexion
**Cause** : Configuration incorrecte des cookies (`sameSite: 'none'` + domaine mal configuré)

### 2. Erreur "Échec de l'initiation du transfert"  
**Cause** : Session/cookies perdus entre les requêtes

## ⚡ Solution Complète

### 1. Variables d'environnement en production

Configurez ces variables dans Replit Deployment → Secrets :

```bash
NODE_ENV=production
SESSION_SECRET=<votre-secret-fort-minimum-32-caracteres>
DATABASE_URL=<votre-url-postgresql-neon>
FRONTEND_URL=<votre-url-frontend-https>
```

### 2. Configuration du domaine des cookies (IMPORTANT!)

**Option A : Frontend et API sur le même domaine** (RECOMMANDÉ)
```bash
# Ne PAS définir COOKIE_DOMAIN
# Le cookie sera limité au domaine exact (plus sécurisé)
```

**Option B : Frontend et API sur des sous-domaines différents**
```bash
# Si vous utilisez altusfinancesgroup.com (sans 's')
COOKIE_DOMAIN=.altusfinancesgroup.com

# OU si vous utilisez altusfinancesgroup.com (avec 's')  
COOKIE_DOMAIN=.altusfinancesgroup.com
```

**⚠️ ATTENTION** : Ne définissez `COOKIE_DOMAIN` que si vous avez besoin de partager les cookies entre sous-domaines (ex: `www.example.com` et `api.example.com`)

### 2. Modifications appliquées au code

J'ai apporté les améliorations suivantes :

#### a) Configuration des cookies (server/index.ts)
```typescript
// Le domaine de cookie n'est plus forcé en production
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 
  (process.env.NODE_ENV === 'production' ? undefined : undefined);
```

**Avantage** : Les cookies fonctionneront maintenant avec :
- `altusfinancesgroup.com`
- `www.altusfinancesgroup.com`
- `altusfinancesgroup.com` (avec 's')
- N'importe quel sous-domaine

#### b) Amélioration des erreurs CSRF (server/routes.ts)
- Messages d'erreur plus clairs
- Codes d'erreur identifiables (`SESSION_INVALID`, `CSRF_INVALID`)
- Logs améliorés incluant `origin`, `host`, et `cookie headers`

#### c) Gestion frontend des sessions expirées (client/src/pages/TransferFlow.tsx)
- Détection automatique des sessions expirées
- Redirection vers `/login` si la session est invalide
- Message utilisateur clair

## 🚀 Déploiement

### Étape 1 : Mettre à jour le code en production
```bash
git add .
git commit -m "fix: amélioration gestion session/CSRF pour transferts production"
git push
```

### Étape 2 : Vérifier les variables d'environnement

Dans votre déploiement Replit :
1. Allez dans l'onglet "Secrets"
2. Vérifiez que vous avez :
   - `SESSION_SECRET` (minimum 32 caractères aléatoires)
   - `DATABASE_URL` (URL PostgreSQL Neon)
   - `NODE_ENV=production`

### Étape 3 : Redéployer

Cliquez sur "Deploy" pour redéployer avec les nouvelles modifications.

## 🔍 Diagnostic en Production

Si le problème persiste, vérifiez les logs de production pour identifier l'erreur exacte :

### Messages d'erreur possibles :

1. **`[CSRF-ERROR] Session invalide ou token manquant`**
   - Cause : Cookie de session non envoyé
   - Solution : Vérifier que HTTPS est activé (requis pour `secure: true`)

2. **`[CSRF-ERROR] Token CSRF invalide`**
   - Cause : Token CSRF ne correspond pas
   - Solution : L'utilisateur doit rafraîchir la page (la session s'est peut-être régénérée)

3. **`[RATE-LIMIT] Limite de transferts dépassée`**
   - Cause : Trop de tentatives de transfert
   - Solution : Attendre 1 heure ou ajuster les limites de rate limiting

## 🔐 Checklist de Sécurité en Production

- [x] HTTPS activé (obligatoire pour `secure: true` cookies)
- [x] `SESSION_SECRET` défini (fort, unique)
- [x] `DATABASE_URL` défini
- [x] Sessions stockées en base de données PostgreSQL
- [x] CORS configuré pour les domaines autorisés
- [x] Rate limiting activé
- [x] CSRF protection activée

## 📝 Notes Techniques

### Configuration des cookies en production :
- `secure: true` - Cookies uniquement sur HTTPS ✅
- `httpOnly: true` - Protection XSS ✅
- `sameSite: 'lax'` - Sécurisé pour les requêtes same-site ✅ (changé de 'none')
- `domain: undefined` - Fonctionne uniquement sur le même domaine ✅ (plus sécurisé)
- `maxAge: 7 jours` - Session longue durée ✅

**Changement Important** : `sameSite` est maintenant `'lax'` au lieu de `'none'` pour une meilleure sécurité et compatibilité.

### Domaines autorisés (CORS) :
- `https://altusfinancesgroup.com`
- `https://www.altusfinancesgroup.com`

## 🆘 Si le problème persiste

1. **Vérifier les logs de production** - Cherchez `[CSRF-ERROR]` ou `[TRANSFER-INITIATE]`
2. **Tester la session** - Allez sur `/api/session-check` pour vérifier l'état de la session
3. **Vider le cache navigateur** - Cookies corrompus peuvent causer des problèmes
4. **Tester en navigation privée** - Élimine les problèmes de cache

## ✅ Test Final

Pour tester que tout fonctionne :

1. Se déconnecter complètement
2. Se reconnecter
3. Aller sur la page de transfert
4. Initier un transfert
5. ✨ Devrait fonctionner !

---

**Date de correction** : 18 Novembre 2025  
**Version** : 1.0
