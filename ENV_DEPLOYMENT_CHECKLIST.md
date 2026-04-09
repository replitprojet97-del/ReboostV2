# 🚀 Configuration Déploiement - Checklist Rapide

## Backend Render (api.altusfinancesgroup.com)

### Variables OBLIGATOIRES ⚠️
```bash
# Générer avec: openssl rand -base64 32
SESSION_SECRET=

# Fournie automatiquement par Render si PostgreSQL attachée
DATABASE_URL=

# URL exacte du frontend Vercel (SANS slash final)
FRONTEND_URL=https://altusfinancesgroup.com

# Domaine pour cookies cross-domain (AVEC le point au début)
COOKIE_DOMAIN=.altusfinancesgroup.com

# Environnement
NODE_ENV=production
```

### Variables OPTIONNELLES (mais recommandées)
```bash
# Cloudinary - Pour upload fichiers (KYC, contrats)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SendGrid - Pour emails (vérification, notifications)
SENDGRID_API_KEY=
FROM_EMAIL=noreply@altusfinancesgroup.com
```

---

## Frontend Vercel (altusfinancesgroup.com)

### Variables OBLIGATOIRES ⚠️
```bash
# URL complète du backend Render (SANS slash final)
VITE_API_URL=https://api.altusfinancesgroup.com

# URL complète du site (SANS slash final)
VITE_SITE_URL=https://altusfinancesgroup.com
```

---

## Configuration DNS Requise

```
# Frontend
altusfinancesgroup.com → Vercel
Type: A ou CNAME
Valeur: Fournie par Vercel

# Backend
api.altusfinancesgroup.com → Render
Type: CNAME
Valeur: Fournie par Render
```

⚠️ **IMPORTANT:** Les deux domaines DOIVENT utiliser HTTPS (obligatoire pour cookies secure)

---

## Tests de Vérification Post-Déploiement

### 1. Backend accessible
```bash
curl https://api.altusfinancesgroup.com/health
# Doit retourner: 200 OK
```

### 2. Frontend accessible
- Ouvrir: https://altusfinancesgroup.com
- Console navigateur (F12) ne doit pas avoir d'erreurs CORS

### 3. Authentification fonctionne
- Créer un compte
- Se connecter
- Vérifier cookie dans F12 → Application → Cookies
- Se déconnecter
- Se reconnecter (session doit persister)

### 4. Flux complet
- Soumettre une demande de prêt
- Admin approuve (dans /admin/loans)
- Upload contrat signé
- Admin confirme contrat
- Initier transfert
- Valider codes

---

## Erreurs Courantes et Solutions

### ❌ Erreur CORS
```
Access to fetch at ... has been blocked by CORS policy
```
**Solution:** Vérifier `FRONTEND_URL` sans slash final

### ❌ Cookies non définis
```
User not authenticated (session manquante)
```
**Solutions:**
- Vérifier `COOKIE_DOMAIN=.altusfinancesgroup.com` (avec le point)
- Vérifier les deux domaines utilisent HTTPS
- Vérifier `sameSite: 'none'` en production

### ❌ Base de données non accessible
```
DATABASE_URL must be set
```
**Solution:** Attacher base PostgreSQL sur Render

### ❌ Emails non envoyés
```
SendGrid configuration missing
```
**Solution:** Configurer `SENDGRID_API_KEY` (optionnel mais recommandé)

### ❌ Upload de fichiers échoue
```
Cloudinary configuration not found
```
**Solution:** Configurer variables Cloudinary (optionnel mais recommandé)

---

## Commandes Utiles

### Générer SESSION_SECRET
```bash
openssl rand -base64 32
```

### Vérifier logs Render
```
Dashboard Render → Service → Logs
```

### Vérifier build Vercel
```
Dashboard Vercel → Site → Deploys → Build logs
```

### Test API locale
```bash
# Tester endpoint
curl -X POST https://api.altusfinancesgroup.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## Liens Rapides

- 🎛️ Render: https://dashboard.render.com
- 🌐 Vercel: https://app.vercel.com
- ☁️ Cloudinary: https://cloudinary.com/console
- 📧 SendGrid: https://app.sendgrid.com

---

**Date:** 12 Novembre 2025  
**Statut:** ✅ Prêt pour déploiement
