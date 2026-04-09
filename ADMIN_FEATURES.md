# Documentation des Fonctionnalités Admin - ALTUS

## Vue d'ensemble

Ce document décrit toutes les fonctionnalités administratives disponibles dans la plateforme ALTUS. Toutes les routes admin requièrent:
- Authentification valide (`requireAuth`)
- Rôle administrateur (`requireAdmin`)
- Rate limiting sur les opérations sensibles (`adminLimiter`)

## Sécurité et Permissions

### Middleware de Sécurité

#### requireAdmin
- Vérifie l'authentification et le rôle admin
- Rejette les requêtes non-authentifiées (401)
- Rejette les utilisateurs non-admin (403)

#### adminLimiter (Rate Limiting)
- Appliqué sur les opérations sensibles (approbation, rejet, suspension, etc.)
- Limite le nombre de requêtes pour prévenir les abus

### Audit Logs
Toutes les actions admin critiques sont enregistrées automatiquement avec:
- ID de l'administrateur
- Type d'action
- Entité affectée
- Métadonnées de l'opération
- Horodatage

## Fonctionnalités par Catégorie

### 1. Gestion des Utilisateurs

#### Liste des utilisateurs
**GET** `/api/admin/users`
- Retourne tous les utilisateurs avec statistiques enrichies
- Données incluses: solde, nombre de prêts, nombre de transferts
- Pas de pagination (à implémenter si nécessaire)

#### Détails d'un utilisateur
**GET** `/api/admin/users/:id`
- Retourne les détails complets d'un utilisateur
- Inclut: profil, prêts, transferts, frais
- Utilisé pour la vue détaillée admin

#### Mise à jour d'un utilisateur
**PATCH** `/api/admin/users/:id`
- Validation Zod: `adminUpdateUserSchema`
- Champs modifiables: fullName, email, accountType, role, status, kycStatus
- Crée un audit log automatiquement

#### Suppression d'un utilisateur
**DELETE** `/api/admin/users/:id`
- Suppression permanente (pas de soft delete)
- Crée un audit log
- ⚠️ **Attention:** Opération irréversible

#### Mise à jour de la capacité d'emprunt
**PATCH** `/api/admin/users/:id/borrowing-capacity`
- Validation Zod: `adminUpdateBorrowingCapacitySchema`
- Champ: `maxLoanAmount` (montant en euros)
- Rate limited
- Crée un audit log

#### Suspension d'un utilisateur
**POST** `/api/admin/users/:id/suspend`
- Validation Zod: `adminSuspendUserSchema`
- Paramètres:
  - `reason`: Raison de la suspension (requis)
  - `suspendedUntil`: Date de fin (null = indéfini)
- Rate limited
- Crée un audit log
- **Effet:** Bloque l'accès à toutes les routes protégées via `requireAuth`

#### Blocage d'un utilisateur
**POST** `/api/admin/users/:id/block`
- Validation Zod: `adminBlockUserSchema`
- Paramètre: `reason` (requis)
- Rate limited
- Crée un audit log
- Change le statut à 'blocked'
- **Effet:** Blocage permanent jusqu'au déblocage manuel

#### Déblocage d'un utilisateur
**POST** `/api/admin/users/:id/unblock`
- Pas de validation requise
- Change le statut à 'active'
- Crée un audit log

#### Blocage des transferts externes
**POST** `/api/admin/users/:id/block-transfers`
- Validation Zod: `adminBlockTransfersSchema`
- Paramètre: `reason` (requis)
- Rate limited
- Crée un audit log
- Définit `externalTransfersBlocked = true`

#### Déblocage des transferts externes
**POST** `/api/admin/users/:id/unblock-transfers`
- Pas de validation requise
- Définit `externalTransfersBlocked = false`
- Crée un audit log

### 2. Gestion des Prêts

#### Liste des prêts
**GET** `/api/admin/loans`
- Retourne tous les prêts avec informations utilisateur enrichies
- Données: userName, userEmail, accountType par prêt
- Filtrage par statut possible (à implémenter si nécessaire)

#### Approbation d'un prêt
**POST** `/api/admin/loans/:id/approve`
- Validation Zod: `adminApproveLoanSchema`
- Paramètres:
  - `reason`: Raison de l'approbation (requis)
  - `interestRate`: Taux d'intérêt personnalisé (optionnel)
- Rate limited
- Change le statut à 'active'
- Définit `approvedAt` et `approvedBy`
- Calcule la `nextPaymentDate`
- Crée une transaction pour la réception du montant
- Crée un audit log

#### Rejet d'un prêt
**POST** `/api/admin/loans/:id/reject`
- Validation Zod: `adminRejectLoanSchema`
- Paramètre: `reason` (requis)
- Rate limited
- Change le statut à 'rejected'
- Définit `rejectedAt` et `rejectionReason`
- Envoie un message automatique à l'utilisateur
- Crée un audit log

#### Suppression d'un prêt
**DELETE** `/api/admin/loans/:id`
- Validation Zod: `adminDeleteLoanSchema`
- Paramètre: `reason` (requis)
- Soft delete (définit `deletedAt`, `deletedBy`, `deletionReason`)
- Crée un audit log
- **Recommandation:** Préférer le soft delete au delete permanent

### 3. Gestion des Transferts

#### Liste des transferts
**GET** `/api/admin/transfers`
- Retourne tous les transferts avec données utilisateur
- Données: userName, userEmail par transfert
- Inclut tous les statuts

#### Mise à jour d'un transfert
**PATCH** `/api/admin/transfers/:id`
- Validation Zod: `adminUpdateTransferSchema`
- Champs modifiables: status, currentStep, approvedAt
- Actions automatiques selon le statut:
  - `suspend_transfer`: Suspendre un transfert
  - `approve_transfer`: Approuver un transfert
  - `update_transfer`: Mise à jour générique
- Crée un audit log avec l'action appropriée

#### Émission de code de validation
**POST** `/api/admin/transfers/:id/issue-code`
- Validation Zod: `adminIssueCodeSchema`
- Paramètres:
  - `sequence`: Numéro de séquence (1, 2, 3...)
  - `method`: 'email' ou 'sms'
- Rate limited
- Génère un code à 6 chiffres
- Expire après 10 minutes
- Envoie le code par email (SMS non implémenté)
- Crée un événement de transfert
- **Sécurité:** Les codes ne sont jamais exposés dans les réponses API

### 4. Communication et Notifications

#### Envoi de message simple
**POST** `/api/admin/messages`
- Validation Zod: `adminSendMessageSchema`
- Paramètres:
  - `userId`: ID de l'utilisateur cible
  - `subject`: Sujet du message
  - `content`: Contenu du message
- Rate limited
- Crée un message admin
- Crée un audit log

#### Envoi de notification avec frais
**POST** `/api/admin/notifications/send-with-fee`
- Validation Zod: `adminSendNotificationWithFeeSchema`
- Paramètres:
  - `userId`: ID de l'utilisateur cible
  - `subject`: Sujet
  - `content`: Contenu
  - `feeType`: Type de frais
  - `feeAmount`: Montant des frais
  - `feeReason`: Raison des frais
- Rate limited
- Crée un message ET un frais associé
- Lien le frais au message (`relatedMessageId`)
- Crée un audit log
- **Cas d'usage:** Pénalités, frais de dossier, etc.

### 5. Paramètres Système

#### Liste des paramètres
**GET** `/api/admin/settings`
- Retourne tous les paramètres système
- Structure: clé, valeur, description, dernière mise à jour

#### Mise à jour d'un paramètre
**PUT** `/api/admin/settings/:key`
- Validation Zod: `adminUpdateSettingSchema`
- Paramètre: `value` (requis)
- Met à jour le paramètre spécifié
- Enregistre l'administrateur qui a fait la modification
- Crée un audit log
- **Exemples de paramètres:**
  - Taux d'intérêt par défaut
  - Montants min/max de prêt
  - Durées de prêt autorisées
  - Frais de traitement

### 6. Statistiques et Rapports

#### Statistiques globales
**GET** `/api/admin/stats`
- Retourne les statistiques de la plateforme:
  - Nombre total d'utilisateurs
  - Nombre de prêts actifs
  - Montant total prêté
  - Nombre de transferts en cours
  - Montant total des frais impayés

#### Logs d'audit
**GET** `/api/admin/audit-logs`
- Retourne tous les logs d'audit (limité aux 100 derniers)
- Informations par log:
  - Nom de l'admin (adminName)
  - Action effectuée
  - Type et ID de l'entité affectée
  - Métadonnées
  - Horodatage
- Tri chronologique inverse (plus récent en premier)

## Validation des Données (Schémas Zod)

### adminUpdateUserSchema
```typescript
{
  fullName: string (optionnel),
  email: email valide (optionnel),
  accountType: 'individual' | 'business' (optionnel),
  role: 'user' | 'admin' (optionnel),
  status: 'active' | 'inactive' | 'suspended' | 'blocked' (optionnel),
  kycStatus: 'pending' | 'approved' | 'rejected' (optionnel)
}
```

### adminUpdateBorrowingCapacitySchema
```typescript
{
  maxLoanAmount: string (montant requis)
}
```

### adminSuspendUserSchema
```typescript
{
  reason: string (requis, min 1 caractère),
  suspendedUntil: date ISO (optionnel, null = indéfini)
}
```

### adminBlockUserSchema
```typescript
{
  reason: string (requis, min 1 caractère)
}
```

### adminBlockTransfersSchema
```typescript
{
  reason: string (requis, min 1 caractère)
}
```

### adminApproveLoanSchema
```typescript
{
  reason: string (requis, min 1 caractère),
  interestRate: string (optionnel, taux personnalisé)
}
```

### adminRejectLoanSchema
```typescript
{
  reason: string (requis, min 1 caractère)
}
```

### adminDeleteLoanSchema
```typescript
{
  reason: string (requis, min 1 caractère)
}
```

### adminUpdateTransferSchema
```typescript
{
  status: 'pending' | 'validating' | 'processing' | 'completed' | 'cancelled' | 'suspended' (optionnel),
  currentStep: number (optionnel),
  approvedAt: date ISO (optionnel)
}
```

### adminIssueCodeSchema
```typescript
{
  sequence: number positif (optionnel, défaut: 1),
  method: 'email' | 'sms' (optionnel)
}
```

### adminSendMessageSchema
```typescript
{
  userId: string (requis, min 1 caractère),
  subject: string (requis, min 1 caractère),
  content: string (requis, min 1 caractère)
}
```

### adminSendNotificationWithFeeSchema
```typescript
{
  userId: string (requis, min 1 caractère),
  subject: string (requis, min 1 caractère),
  content: string (requis, min 1 caractère),
  feeType: string (requis, min 1 caractère),
  feeAmount: string (requis, min 1 caractère),
  feeReason: string (requis, min 1 caractère)
}
```

### adminUpdateSettingSchema
```typescript
{
  value: string (requis, min 1 caractère)
}
```

## Flux de Travail Typiques

### 1. Approbation d'un Prêt
1. GET `/api/admin/loans` - Consulter les prêts en attente
2. GET `/api/admin/users/:id` - Vérifier le profil de l'emprunteur
3. POST `/api/admin/loans/:id/approve` - Approuver avec raison
4. Système: Crée transaction, définit date de paiement, envoie notification

### 2. Suspension d'un Utilisateur
1. GET `/api/admin/users/:id` - Vérifier l'historique
2. POST `/api/admin/users/:id/suspend` - Suspendre avec raison et durée
3. Effet: L'utilisateur ne peut plus accéder aux routes protégées
4. POST `/api/admin/users/:id/unblock` - Réactiver si besoin

### 3. Gestion d'un Transfert Suspect
1. GET `/api/admin/transfers` - Détecter transfert suspect
2. PATCH `/api/admin/transfers/:id` - Passer en status 'suspended'
3. GET `/api/admin/users/:id` - Vérifier le profil
4. POST `/api/admin/users/:id/block-transfers` - Bloquer futurs transferts
5. POST `/api/admin/notifications/send-with-fee` - Notifier avec pénalité si nécessaire

### 4. Modification de Paramètres Système
1. GET `/api/admin/settings` - Consulter paramètres actuels
2. PUT `/api/admin/settings/default_interest_rate` - Mettre à jour
3. Système: Enregistre admin et timestamp
4. GET `/api/admin/audit-logs` - Vérifier l'action dans les logs

## Sécurité et Bonnes Pratiques

### Validations Appliquées
- ✅ Zod validation sur tous les body de requête
- ✅ Vérification IDOR (appartenance des ressources)
- ✅ Rate limiting sur opérations sensibles
- ✅ Audit logging automatique
- ✅ Messages d'erreur génériques (pas d'info sensible)
- ✅ Tokens jamais exposés dans les réponses

### Middleware de Sécurité
```typescript
requireAuth: 
  - Vérifie session valide
  - Vérifie utilisateur existe
  - Bloque comptes bloqués/suspendus/inactifs
  - Exige email vérifié

requireAdmin:
  - Inclut toutes les vérifications de requireAuth
  - Vérifie rôle === 'admin'
```

### Rate Limiting
```typescript
adminLimiter:
  - windowMs: 15 minutes
  - max: 50 requêtes par IP
  - Appliqué sur: approve, reject, suspend, block, issue-code, send-with-fee
```

## Fonctionnalités Manquantes / À Implémenter

### Haute Priorité
- [ ] Pagination sur `/api/admin/users` et `/api/admin/loans`
- [ ] Filtres et recherche sur les listes admin
- [ ] Export de données (CSV, Excel)
- [ ] Envoi SMS pour codes de validation
- [ ] Tableau de bord admin avec métriques en temps réel

### Moyenne Priorité
- [ ] Historique de modifications par utilisateur
- [ ] Notifications en temps réel pour les admins
- [ ] Gestion de rôles granulaires (super-admin, admin lecteur, etc.)
- [ ] Bulk operations (suspendre plusieurs utilisateurs)
- [ ] Planification d'actions (suspension programmée)

### Basse Priorité
- [ ] Templates de messages
- [ ] Rapports financiers automatisés
- [ ] Intégration avec outils de BI
- [ ] API webhooks pour événements critiques

## Notes Techniques

### Performance
- Certaines routes chargent toutes les entités sans pagination
- Optimisation recommandée pour > 1000 utilisateurs
- Considérer la mise en cache pour `/api/admin/stats`

### Base de Données
- Soft deletes utilisés pour les prêts (`deletedAt`)
- Hard deletes pour les utilisateurs (à reconsidérer)
- Audit logs sans limite de rétention (à configurer)

### Intégration Email
- Utilise SendGrid pour les emails
- Templates basiques (à améliorer avec design HTML)
- Gestion des erreurs email à améliorer

## Conclusion

Le système admin d'ALTUS offre toutes les fonctionnalités essentielles pour gérer une plateforme de prêts professionnelle. Toutes les opérations critiques sont sécurisées, validées, et auditées. Les améliorations suggérées concernent principalement l'UX et la scalabilité.
