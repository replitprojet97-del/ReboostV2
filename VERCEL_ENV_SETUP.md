# 🌐 Configuration Vercel - Instructions Détaillées

## 📝 Variables à Ajouter sur Vercel

### Étape 1: Accéder aux Variables d'Environnement

1. Connectez-vous à [Vercel](https://vercel.com)
2. Sélectionnez votre projet `altusfinancesgroup`
3. Cliquez sur **Settings** (Paramètres)
4. Dans le menu latéral, cliquez sur **Environment Variables**

### Étape 2: Ajouter VITE_API_URL

1. Cliquez sur **Add New**
2. Remplissez les champs :
   - **Name**: `VITE_API_URL`
   - **Value**: `https://api.altusfinancesgroup.com`
   - **Environments**: Cochez **Production**, **Preview**, et **Development**
3. Cliquez sur **Save**

### Étape 3: Ajouter VITE_SITE_URL

1. Cliquez sur **Add New** à nouveau
2. Remplissez les champs :
   - **Name**: `VITE_SITE_URL`
   - **Value**: `https://altusfinancesgroup.com`
   - **Environments**: Cochez **Production**, **Preview**, et **Development**
3. Cliquez sur **Save**

### Étape 4: Redéployer

⚠️ **IMPORTANT**: Les changements de variables ne s'appliquent qu'aux **nouveaux** déploiements.

1. Allez dans l'onglet **Deployments**
2. Trouvez le dernier déploiement
3. Cliquez sur les **trois points** (⋯) à droite
4. Sélectionnez **Redeploy**
5. Cliquez sur **Redeploy** pour confirmer

### Étape 5: Vérification

Une fois le déploiement terminé :

1. Ouvrez https://altusfinancesgroup.com
2. Ouvrez la console développeur (F12)
3. Dans la console, tapez : `import.meta.env.VITE_API_URL`
4. Devrait afficher : `https://api.altusfinancesgroup.com`

---

## ✅ Résultat Attendu

Après configuration, vos variables d'environnement devraient ressembler à :

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_API_URL` | `https://api.altusfinancesgroup.com` | Production, Preview, Development |
| `VITE_SITE_URL` | `https://altusfinancesgroup.com` | Production, Preview, Development |

---

## 🔧 Pourquoi Ces Variables Sont Nécessaires

### VITE_API_URL
- Indique au frontend où se trouve le backend
- Sans cette variable, le frontend essaie d'appeler `https://altusfinancesgroup.com/api/...` (qui n'existe pas)
- Avec cette variable, il appelle `https://api.altusfinancesgroup.com/api/...` (correct)

### VITE_SITE_URL
- Utilisé pour SEO, Open Graph, génération de sitemap
- Utilisé pour les URL absolues dans les emails
- Important pour les partages sur réseaux sociaux

---

## 🐛 Dépannage

### "Les changements ne s'appliquent pas"
- Les variables sont seulement disponibles dans les **nouveaux** builds
- Vous DEVEZ redéployer après avoir ajouté/modifié des variables
- Videz le cache navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

### "import.meta.env.VITE_API_URL est undefined"
- Vérifiez que la variable est bien ajoutée sur Vercel
- Vérifiez qu'elle commence bien par `VITE_` (requis par Vite)
- Redéployez le site après ajout de la variable

### "Les requêtes vont toujours vers altusfinancesgroup.com"
- Le build n'a pas été refait avec les nouvelles variables
- Allez dans Deployments → Redeploy le dernier déploiement
- Attendez que le build se termine (1-2 minutes)
- Rafraîchissez la page avec cache vide

---

## 📞 Support Vercel

Si vous avez des difficultés :
- [Documentation Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Support Vercel](https://vercel.com/support)
