# 🔐 Création d'un compte administrateur ALTUS

Ce guide vous explique comment créer un compte administrateur pour votre plateforme ALTUS en production.

## 📋 Prérequis

- Avoir accès au serveur de production ou à l'environnement où la base de données est hébergée
- Avoir la variable d'environnement `DATABASE_URL` configurée
- Node.js et npm installés

## 🚀 Méthode 1 : Script automatique (Recommandé)

### Étape 1 : Préparer les variables d'environnement

Assurez-vous que `DATABASE_URL` est défini dans votre environnement :

```bash
export DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

### Étape 2 : Exécuter le script

```bash
npx tsx scripts/create-admin.ts
```

### Étape 3 : Suivre les instructions

Le script vous demandera :
- **Nom complet** : Le nom complet de l'administrateur
- **Email** : L'adresse email (doit être unique)
- **Nom d'utilisateur** : Laissez vide pour en générer un automatiquement
- **Mot de passe** : Minimum 12 caractères (requis pour la sécurité)

### Exemple d'utilisation

```
🔧 Création d'un compte administrateur ALTUS

Nom complet de l'admin: Jean Dupont
Email de l'admin: jean.dupont@altus.fr
Nom d'utilisateur (laisser vide pour générer automatiquement): admin_jean
Mot de passe (minimum 12 caractères): ••••••••••••••

🔐 Hachage du mot de passe...
📡 Connexion à la base de données...
👤 Création du compte administrateur...

✅ Compte administrateur créé avec succès!

📋 Détails du compte:
   Nom d'utilisateur: admin_jean
   Email: jean.dupont@altus.fr
   Nom complet: Jean Dupont
   Rôle: admin
   Statut: actif

🔑 Vous pouvez maintenant vous connecter avec ces identifiants.
```

## 🗄️ Méthode 2 : Via SQL direct

Si vous préférez utiliser SQL directement, vous pouvez exécuter cette requête (remplacez les valeurs) :

```sql
INSERT INTO users (
  username,
  password,
  email,
  email_verified,
  full_name,
  account_type,
  role,
  status,
  kyc_status,
  preferred_language
) VALUES (
  'votre_username',
  -- Pour le mot de passe, utilisez bcrypt avec 10 rounds
  -- Exemple avec le mot de passe "MonMotDePasse123": $2b$10$...
  'HASH_BCRYPT_ICI',
  'votre.email@example.com',
  true,
  'Votre Nom Complet',
  'business',
  'admin',
  'active',
  'approved',
  'fr'
);
```

⚠️ **Note** : Pour générer le hash bcrypt, vous pouvez utiliser :

```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('VotreMotDePasse123', 10, (err, hash) => {
  console.log(hash);
});
```

## 🔒 Sécurité

- Le mot de passe doit contenir **au moins 12 caractères**
- Le mot de passe est automatiquement haché avec bcrypt (10 rounds)
- Le compte admin est créé avec :
  - `role: 'admin'` - Accès administrateur complet
  - `status: 'active'` - Compte actif immédiatement
  - `emailVerified: true` - Email vérifié
  - `kycStatus: 'approved'` - KYC approuvé

## 🔑 Connexion

Après la création, connectez-vous sur la plateforme ALTUS avec :
- **Nom d'utilisateur** ou **Email**
- **Mot de passe** défini lors de la création

Vous aurez accès au tableau de bord administrateur à `/admin`.

## ❌ Dépannage

### Erreur : "L'email ou le nom d'utilisateur existe déjà"
- Vérifiez que l'email n'est pas déjà utilisé
- Changez le nom d'utilisateur

### Erreur : "DATABASE_URL n'est pas défini"
- Assurez-vous que la variable d'environnement DATABASE_URL est bien configurée
- Vérifiez votre fichier `.env` ou vos variables d'environnement système

### Erreur de connexion à la base de données
- Vérifiez que l'URL de connexion est correcte
- Assurez-vous que le serveur PostgreSQL est accessible
- Pour Neon/production, vérifiez que `?sslmode=require` est présent

## 📞 Support

Pour toute question, contactez l'équipe de développement ALTUS.
