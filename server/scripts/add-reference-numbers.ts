import { db } from "../db";
import { transfers } from "@shared/schema";
import { sql } from "drizzle-orm";

/**
 * Script pour ajouter des numéros de référence aux transferts existants
 */
async function addReferenceNumbers() {
  console.log("Récupération des transferts existants...");
  
  const existingTransfers = await db
    .select({ id: transfers.id, createdAt: transfers.createdAt })
    .from(transfers)
    .orderBy(transfers.createdAt);
  
  console.log(`Trouvé ${existingTransfers.length} transferts à mettre à jour`);
  
  if (existingTransfers.length === 0) {
    console.log("Aucun transfert à mettre à jour");
    return;
  }
  
  // Regrouper par date pour maintenir la séquence cohérente
  const transfersByDate = new Map<string, typeof existingTransfers>();
  
  for (const transfer of existingTransfers) {
    const date = new Date(transfer.createdAt);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateKey = `${year}${month}${day}`;
    
    if (!transfersByDate.has(dateKey)) {
      transfersByDate.set(dateKey, []);
    }
    transfersByDate.get(dateKey)!.push(transfer);
  }
  
  let updated = 0;
  
  // Générer les références pour chaque jour
  for (const [dateKey, dayTransfers] of transfersByDate) {
    let sequence = 1;
    
    for (const transfer of dayTransfers) {
      const sequenceStr = sequence.toString().padStart(4, '0');
      const referenceNumber = `TRF-${dateKey}-${sequenceStr}`;
      
      await db
        .update(transfers)
        .set({ referenceNumber })
        .where(sql`${transfers.id} = ${transfer.id}`);
      
      console.log(`✓ ${transfer.id} → ${referenceNumber}`);
      sequence++;
      updated++;
    }
  }
  
  console.log(`\n✅ ${updated} transferts mis à jour avec succès`);
}

addReferenceNumbers()
  .then(() => {
    console.log("Migration terminée");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Erreur lors de la migration:", err);
    process.exit(1);
  });
