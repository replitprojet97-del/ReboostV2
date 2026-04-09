/**
 * Génère un numéro de référence unique pour un transfert de manière déterministe
 * basé sur l'ID et la date de création.
 * 
 * Format: TRF-YYMMDD-XXXX
 * Ex: TRF-241120-A3F9
 * 
 * IMPORTANT: Cette fonction génère les références à la volée SANS utiliser de 
 * colonne de base de données, ce qui est compatible avec toutes les bases de 
 * données de production sans nécessiter de migration.
 * 
 * @param transferId - L'ID unique du transfert (UUID)
 * @param createdAt - La date de création du transfert
 * @returns Un numéro de référence unique au format TRF-YYMMDD-XXXX
 */
export function generateTransferReference(transferId: string, createdAt: Date): string {
  // Format date YYMMDD
  const year = createdAt.getFullYear().toString().slice(-2);
  const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
  const day = createdAt.getDate().toString().padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;
  
  // Extraire les 8 premiers caractères de l'UUID et les convertir en format court
  // Exemple: "a3f9b2c1-..." → "A3F9B2C1" → "A3F9"
  const idHash = transferId
    .replace(/-/g, '') // Retirer les tirets
    .substring(0, 8)   // Prendre les 8 premiers caractères
    .toUpperCase()     // En majuscules
    .substring(0, 4);  // Garder seulement 4 caractères
  
  // Format final: TRF-YYMMDD-XXXX
  return `TRF-${datePrefix}-${idHash}`;
}
