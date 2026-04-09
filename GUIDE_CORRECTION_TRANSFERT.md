# 🔧 GUIDE DE CORRECTION - PROBLÈME "INITIER TRANSFERT"

## ✅ CORRECTIONS APPLIQUÉES

### 1. **vercel.json** - Configuration Vercel mise à jour
**Changement**: Suppression du rewrite API qui causait des problèmes de cookies cross-domain.

**Avant**:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.altusfinancesgroup.com/api/$1"  // ❌ Causait perte de session
    }
  ]
}
```

**Après**:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"  // ✅ SPA routing seulement
    }
  ]
}
```

---

### 2. **NewTransferDialog.tsx** - Frontend corrigé
**Changements**:
- ✅ Utilise maintenant `/api/transfers/initiate` au lieu de `/api/transfers`
- ✅ Récupère automatiquement les prêts disponibles via `/api/loans/available-for-transfer`
- ✅ Envoie le `loanId` requis dans le body de la requête
- ✅ Ajoute un sélecteur de prêt dans le formulaire
- ✅ Utilise `apiRequest()` pour gérer automatiquement les tokens CSRF
- ✅ Gère correctement les erreurs avec messages détaillés
- ✅ Affiche un message lorsqu'aucun prêt n'est disponible

**Nouveaux champs du formulaire**:
- Prêt source (sélection parmi les prêts avec fonds disponibles)
- Bénéficiaire
- Montant
- Compte externe (optionnel)

---

## 🚀 CONFIGURATION REQUISE SUR VERCEL

### Variables d'environnement à configurer

1. **Ouvrir Vercel Dashboard**
   - Aller sur `https://vercel.com/dashboard`
   - Sélectionner votre projet frontend

2. **Configurer les variables** (Settings → Environment Variables)

```bash
# OBLIGATOIRE - URL de votre API backend
VITE_API_URL=https://api.altusfinancesgroup.com

# RECOMMANDÉ - URL de votre site pour SEO
VITE_SITE_URL=https://altusfinancesgroup.com

# OPTIONNEL - Nom de l'application
VITE_APP_NAME=Altus Finances Group
```

3. **Redéployer le frontend**
   - Après avoir ajouté les variables
   - Cliquer sur "Redeploy" pour appliquer les changements

---

## 🔐 CONFIGURATION BACKEND (Render)

### Option A: Sans cookies cross-domain (RECOMMANDÉ)

**Situation**: Frontend et API sur des domaines complètement différents
- Frontend: `https://altusfinancesgroup.com`
- Backend: `https://api.altusfinancesgroup.com`

**Variables à NE PAS configurer**:
```bash
# Ne PAS définir COOKIE_DOMAIN
# Laisser undefined pour que les cookies soient strictement same-site
```

**Avantage**: Plus sécurisé, fonctionne avec Vercel rewrites supprimés.

---

### Option B: Avec cookies cross-domain (SI NÉCESSAIRE)

**Situation**: Vous voulez partager les cookies entre www et api
- Frontend: `https://www.altusfinancesgroup.com`
- Backend: `https://api.altusfinancesgroup.com`

**Variable à configurer sur Render**:
```bash
COOKIE_DOMAIN=.altusfinancesgroup.com
```

**⚠️ Attention**: Cette option nécessite que le domaine soit exactement le même (avec ou sans 's' dans "finances").

---

## 📝 ÉTAPES DE TEST

### 1. **Vérifier la configuration Vercel**

```bash
# Sur https://altusfinancesgroup.com, ouvrir la console DevTools
console.log(import.meta.env.VITE_API_URL)
// Devrait afficher: https://api.altusfinancesgroup.com
```

### 2. **Tester la connexion**
1. Se connecter sur `https://altusfinancesgroup.com/login`
2. Vérifier que la session fonctionne (Dashboard accessible)

### 3. **Tester le transfert**
1. Aller sur `https://altusfinancesgroup.com/transfer/new`
2. Le formulaire devrait afficher:
   - Un sélecteur de prêt avec les prêts disponibles
   - Les champs bénéficiaire et montant
3. Remplir le formulaire et cliquer "Initier le transfert"
4. **Vérifier dans DevTools → Network**:
   - URL appelée: `https://api.altusfinancesgroup.com/api/transfers/initiate`
   - Method: POST
   - Request Payload: contient `loanId`, `amount`, `recipient`
   - Response: 200 OK ou erreur explicite

### 4. **Vérifier les cookies**

```bash
# Dans la console sur https://altusfinancesgroup.com
document.cookie
// Devrait afficher: sessionId=...
```

### 5. **Debug en cas d'erreur**

**Ouvrir DevTools → Network → Filter: Fetch/XHR**

Cliquer "Initier transfert" et vérifier:

| Élément | Ce qui devrait apparaître | Si différent |
|---------|---------------------------|--------------|
| URL | `https://api.altusfinancesgroup.com/api/transfers/initiate` | Vérifier VITE_API_URL |
| Status | 200, 201 | Voir erreur ci-dessous |
| Request Headers | `Cookie: sessionId=...` | Problème de cookies |
| Request Headers | `X-CSRF-Token: ...` | Recharger la page |
| Request Payload | `{ loanId, amount, recipient, ... }` | Problème frontend |

**Erreurs courantes**:

| Status | Message | Cause | Solution |
|--------|---------|-------|----------|
| 401 | Authentification requise | Session perdue | Se reconnecter |
| 403 | Session expirée / CSRF invalid | Token CSRF manquant | Recharger la page |
| 400 | loanId requis | Pas de prêt sélectionné | Vérifier que des prêts sont disponibles |
| 400 | Fonds non disponibles | Prêt pas encore débloqué | Attendre validation admin |
| 429 | Trop de requêtes | Rate limit dépassé | Attendre 1 heure |

---

## 🐛 PROBLÈMES CONNUS ET SOLUTIONS

### Problème: "Aucun prêt avec des fonds disponibles"

**Cause**: Aucun prêt n'a le statut `fundsAvailabilityStatus = 'available'`

**Solution**:
1. Vérifier dans l'interface admin que le prêt a été validé
2. Vérifier que le contrat a été signé
3. Vérifier que l'admin a marqué les fonds comme disponibles

---

### Problème: "Session expirée" ou 401/403

**Causes possibles**:
1. Cookies bloqués par le navigateur
2. VITE_API_URL mal configuré
3. CORS mal configuré côté backend

**Solutions**:
1. Vérifier que les cookies ne sont pas bloqués (Settings → Privacy)
2. Vérifier `VITE_API_URL` sur Vercel
3. Vérifier les allowed origins dans `server/index.ts` (ligne 69-75)

---

### Problème: Requête bloquée par CORS

**Console affiche**: `blocked by CORS policy`

**Solution**:
1. Vérifier que le backend inclut `https://altusfinancesgroup.com` dans allowedOrigins
2. Redéployer le backend si modification nécessaire

---

## 📊 LOGS BACKEND À SURVEILLER

Quand vous cliquez "Initier transfert", le backend devrait afficher:

```
[TRANSFER-INITIATE] REQ-... - DÉBUT
[TRANSFER-INITIATE] REQ-... - UserId: ...
[TRANSFER-INITIATE] REQ-... - Request body: { "loanId": "...", "amount": "...", ... }
[TRANSFER-INITIATE] REQ-... - Étape 1: Validation loanId
[TRANSFER-INITIATE] REQ-... - Étape 2: Récupération du prêt
[TRANSFER-INITIATE] REQ-... - Prêt trouvé: ...
[TRANSFER-INITIATE] REQ-... - Étape 6: Création du transfert et des codes
[TRANSFER-INITIATE] REQ-... - Transfert créé avec succès
```

**Si le backend ne montre aucun log**, cela signifie que la requête n'arrive pas au backend:
- Problème de configuration VITE_API_URL
- Problème de CORS
- Problème de cookies/session

---

## ✅ CHECKLIST FINALE

Avant de marquer comme résolu, vérifier:

- [ ] `VITE_API_URL` configuré sur Vercel
- [ ] Frontend redéployé sur Vercel après configuration
- [ ] Connexion fonctionne (session persistante)
- [ ] Dashboard accessible après connexion
- [ ] Formulaire de transfert affiche les prêts disponibles
- [ ] Soumission du formulaire appelle `/api/transfers/initiate`
- [ ] Backend logs montrent la requête arrivée
- [ ] Réponse 200/201 ou erreur explicite retournée
- [ ] Message de succès ou erreur affiché correctement

---

## 📞 SUPPORT

Si le problème persiste après avoir suivi ce guide:

1. **Vérifier les logs backend** sur Render
2. **Vérifier Network tab** dans DevTools
3. **Vérifier la console** pour erreurs JavaScript
4. **Fournir ces informations**:
   - URL exacte appelée
   - Status code de la réponse
   - Message d'erreur exact
   - Screenshot de la console/network
   - Logs backend (si accessible)

---

## 🎯 RÉSUMÉ DES CHANGEMENTS

| Fichier | Action | Raison |
|---------|--------|--------|
| `vercel.json` | Supprimé rewrite API | Cookies perdus avec rewrite cross-domain |
| `NewTransferDialog.tsx` | Réécrit complètement | Route incorrecte + données manquantes |
| Variables Vercel | Ajouter `VITE_API_URL` | Frontend doit savoir où appeler l'API |
| Variables Render | Vérifier `FRONTEND_URL` | CORS doit autoriser le frontend |

---

**Date de correction**: ${new Date().toLocaleDateString('fr-FR')}
**Version**: 1.0
