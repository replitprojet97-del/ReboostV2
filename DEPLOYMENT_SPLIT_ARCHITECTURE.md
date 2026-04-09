# 🚀 Guide de Déploiement - Architecture Séparée

## 📐 Architecture du Projet

Ce projet utilise une **architecture de déploiement séparée** :

- 🔵 **Frontend** → Déployé sur **Vercel**
- 🟢 **Backend** → Déployé sur **Render**

---

## 📦 Organisation des Dépendances

### `dependencies` (Production + Build Backend)
```json
{
  "express": "^4.21.2",           // Runtime backend
  "pg": "^8.13.1",                // Runtime backend
  "esbuild": "^0.25.0"            // ✅ Build backend uniquement
}
```

### `devDependencies` (Développement + Build Frontend)
```json
{
  "vite": "^5.4.20",              // ✅ Build frontend (Vercel)
  "tsx": "^4.20.6",               // Dev local uniquement
  "typescript": "5.6.3"           // Types
}
```

---

## 🟢 RENDER - Configuration Backend

### **Service Settings sur Render**

```yaml
Build Command:    npm install && npm run build:backend
Start Command:    npm start
Environment:      Node
Node Version:     20.x
```

### **Pourquoi cette configuration ?**

1. **`npm install`** → Installe uniquement les `dependencies` (pas `devDependencies`)
   - ✅ Installe `esbuild` (nécessaire pour compiler le backend)
   - ❌ N'installe PAS `vite` (pas nécessaire sur Render)

2. **`npm run build:backend`** → Compile uniquement le backend
   - Exécute : `esbuild server/index.ts → dist/index.js`
   - ⚡ Rapide : ~50ms
   - 💾 Léger : 410kb

3. **`npm start`** → Lance le serveur compilé
   - Exécute : `node dist/index.js`
   - ✅ Pas de TypeScript runtime
   - ✅ Performance maximale

### **Variables d'Environnement Render**

```bash
NODE_ENV=production
SESSION_SECRET=<votre-secret>
DATABASE_URL=<votre-postgres-url>
FRONTEND_URL=https://votre-frontend.vercel.app
COOKIE_DOMAIN=.votredomaine.com
```

---

## 🔵 VERCEL - Configuration Frontend

### **Vercel Project Settings**

```yaml
Framework Preset:     Vite
Build Command:        npm run build:frontend
Output Directory:     dist/public
Install Command:      npm install
Node Version:         20.x
```

### **Pourquoi cette configuration ?**

1. **`npm install`** → Installe `dependencies` + `devDependencies`
   - ✅ Installe `vite` (nécessaire pour compiler le frontend)
   - ✅ Installe `tailwindcss`, `postcss`, etc.

2. **`npm run build:frontend`** → Compile uniquement le frontend
   - Exécute : `vite build`
   - Output : `dist/public/` (HTML, CSS, JS, assets)
   - ⚡ Optimisé pour production

### **Variables d'Environnement Vercel**

```bash
VITE_API_URL=https://votre-backend.onrender.com
VITE_APP_ENV=production
```

---

## 💻 Développement Local

### **Setup Initial**
```bash
npm install              # Installe tout (dependencies + devDependencies)
```

### **Lancer le projet**
```bash
npm run dev              # Lance frontend + backend en mode dev
```

Ce script exécute :
- Backend : `tsx server/index.ts` (port 5000)
- Frontend : Vite dev server intégré

### **Build Local (Test)**
```bash
npm run build            # Build frontend + backend
npm start                # Lance le backend compilé
```

---

## 📋 Scripts npm Disponibles

### **Build**
```json
{
  "build": "npm run build:frontend && npm run build:backend",  // Build tout (local)
  "build:frontend": "vite build",                               // Build frontend (Vercel)
  "build:backend": "npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"  // Build backend (Render)
}
```

### **Dev & Start**
```json
{
  "dev": "NODE_ENV=development tsx server/index.ts",  // Dev local
  "start": "NODE_ENV=production node dist/index.js"   // Production
}
```

---

## 🔄 Workflow de Déploiement

### **1. Développement**
```bash
# Travailler en local
npm run dev

# Tester
git add .
git commit -m "feat: nouvelle fonctionnalité"
```

### **2. Push vers GitHub**
```bash
git push origin main
```

### **3. Déploiement Automatique**

**Vercel** (Frontend) :
1. ✅ Détecte le push
2. ✅ Exécute `npm install` (installe devDependencies)
3. ✅ Exécute `npm run build:frontend`
4. ✅ Déploie `dist/public/`
5. 🎉 Frontend live

**Render** (Backend) :
1. ✅ Détecte le push
2. ✅ Exécute `npm install` (installe dependencies uniquement)
3. ✅ Exécute `npm run build:backend`
4. ✅ Exécute `npm start`
5. 🎉 Backend live

---

## ✅ Checklist de Déploiement

### **Avant le Premier Déploiement**

**Vercel :**
- [ ] Projet connecté à GitHub
- [ ] Build Command : `npm run build:frontend`
- [ ] Output Directory : `dist/public`
- [ ] Variables d'environnement configurées

**Render :**
- [ ] Service créé (Web Service)
- [ ] Build Command : `npm install && npm run build:backend`
- [ ] Start Command : `npm start`
- [ ] Variables d'environnement configurées
- [ ] Base de données PostgreSQL connectée

---

## 🐛 Troubleshooting

### **Erreur "vite: not found" sur Render**
✅ **NORMAL** - `vite` est dans `devDependencies`, Render ne l'installe pas.  
✅ **SOLUTION** - Render ne doit PAS construire le frontend, uniquement le backend.  
✅ **VÉRIFIER** - Build Command sur Render : `npm run build:backend`

### **Erreur "esbuild: not found" sur Render**
❌ **PROBLÈME** - `esbuild` n'est pas dans `dependencies`.  
✅ **SOLUTION** - Vérifier que `esbuild` est bien dans `dependencies` du package.json.

### **Frontend ne se connecte pas au Backend**
❌ **PROBLÈME** - CORS ou URL incorrecte.  
✅ **SOLUTION** - Vérifier les variables d'environnement :
  - Sur Vercel : `VITE_API_URL` pointe vers Render
  - Sur Render : `FRONTEND_URL` pointe vers Vercel
  - Sur Render : CORS autorise l'origine Vercel

---

## 📊 Résumé

| Plateforme | Build | Dépendances Installées | Output |
|------------|-------|------------------------|--------|
| **Vercel** | `vite build` | dependencies + devDependencies | `dist/public/` |
| **Render** | `esbuild` | dependencies seulement | `dist/index.js` |
| **Local** | `vite + esbuild` | Tout | `dist/` complet |

---

## 🎯 Points Clés

1. ✅ **Séparation stricte** - Frontend et backend sont indépendants
2. ✅ **Build optimisé** - Chaque plateforme ne build que ce dont elle a besoin
3. ✅ **Dépendances minimales** - Render n'installe pas les outils frontend
4. ✅ **Performance maximale** - Pas de compilation inutile

---

**Dernière mise à jour:** 18 novembre 2025  
**Architecture:** Split Deployment (Frontend/Backend séparé)
