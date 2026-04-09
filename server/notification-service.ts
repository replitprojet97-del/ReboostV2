import {
  notifyLoanRequest,
  notifyLoanApproved as notifyLoanApprovedInternal,
  notifyTransferInitiated,
  notifyAdminsNewLoanRequest,
  notifyAdminsNewTransfer,
  notifyAdminsNewKycDocument,
} from './notification-helper';
import {
  sendLoanRequestUserEmail,
  sendLoanRequestAdminEmail,
  sendKYCUploadedAdminEmail,
  sendLoanApprovedEmail,
  sendTransferInitiatedAdminEmail,
  sendTransferCodeEmail,
  type DocumentInfo,
} from './email';
import type { Language } from './emailTemplates';
import { randomUUID } from 'crypto';
import { storage } from './storage';
import path from 'path';
import fs from 'fs';

interface LoanRequestNotificationParams {
  userId: string;
  loanId: string;
  amount: string;
  loanType: string;
  userFullName: string;
  userEmail: string;
  userPhone: string | null;
  accountType: string;
  duration: number;
  reference: string;
  documents: Array<{
    buffer: Buffer;
    fileName: string;
    mimeType: string;
  }>;
  language: Language;
}

interface KycUploadNotificationParams {
  userId: string;
  userFullName: string;
  userEmail: string;
  documentType: string;
  loanType: string;
  language: Language;
}

interface LoanApprovalNotificationParams {
  userId: string;
  loanId: string;
  amount: string;
  loanType: string;
  userFullName: string;
  userEmail: string;
  reference: string;
  language: Language;
}

interface TransferInitiationNotificationParams {
  userId: string;
  transferId: string;
  amount: string;
  recipient: string;
  userFullName: string;
  userEmail: string;
  language: Language;
}

interface TransferCodeNotificationParams {
  userId: string;
  transferId: string;
  amount: string;
  recipient: string;
  code: string;
  codeSequence: number;
  totalCodes: number;
  userFullName: string;
  userEmail: string;
  language: Language;
}

async function executeMultiChannel(
  channels: Array<() => Promise<unknown>>,
  eventName: string
): Promise<void> {
  const results = await Promise.allSettled(channels.map(fn => fn()));
  
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`[${eventName}] Channel ${index + 1} failed:`, result.reason);
    }
  });
  
  const criticalFailures = results.filter(r => r.status === 'rejected');
  if (criticalFailures.length === results.length) {
    const error = new Error(`[${eventName}] All notification channels failed`);
    console.error(error.message);
    throw error;
  }
}

export async function loanRequestNotification(params: LoanRequestNotificationParams): Promise<void> {
  await executeMultiChannel(
    [
      () => notifyLoanRequest(params.userId, params.loanId, params.amount, params.loanType),
      () => sendLoanRequestUserEmail(
        params.userEmail,
        params.userFullName,
        params.loanType,
        params.amount,
        params.reference,
        params.language
      ),
    ],
    'loanRequestNotification'
  );
}

import { compressDocument } from './compression';

export async function loanRequestAdminNotification(params: LoanRequestNotificationParams): Promise<void> {
  console.log(`[Notification] Triggering loanRequestAdminNotification for loan ${params.loanId}`);
  
  // Compresser les documents avant l'envoi pour éviter l'erreur "Message size limit exceeded"
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.kreditpass.org' 
    : (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000');

  const processedDocs = await Promise.all(
    params.documents.map(async (doc) => {
      // Générer un token unique pour la vue sécurisée
      const viewToken = randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3); // 3 jours

      try {
        // 1. Sauvegarder physiquement le fichier sur le disque pour que le lien fonctionne
        const uploadDir = path.join(process.cwd(), 'uploads', 'kyc');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, doc.fileName);
        fs.writeFileSync(filePath, doc.buffer);
        console.log(`[Notification] Physical file saved to ${filePath}`);

        // 2. Sauvegarder en base pour le stockage temporaire
        await storage.createKycDocument({
          userId: params.userId,
          loanId: params.loanId,
          documentType: 'Loan Application Document',
          loanType: params.loanType,
          status: 'pending',
          fileUrl: `/uploads/kyc/${doc.fileName}`, // URL interne
          fileName: doc.fileName,
          fileSize: doc.buffer.length,
          viewToken: viewToken,
          viewExpiresAt: expiresAt,
        });

        // 3. Retourner uniquement les métadonnées nécessaires (SANS le Buffer)
        return {
          fileName: doc.fileName,
          viewUrl: `${baseUrl}/api/admin/kyc-view/${viewToken}`
        };
      } catch (err) {
        console.error(`[Notification] Failed to process document for secure view:`, err);
        return {
          fileName: doc.fileName,
          viewUrl: ''
        };
      }
    })
  );

  await executeMultiChannel(
    [
      () => notifyAdminsNewLoanRequest(
        params.userId,
        params.userFullName,
        params.loanId,
        params.amount,
        params.loanType
      ),
      () => sendLoanRequestAdminEmail(
        params.userFullName,
        params.userEmail,
        params.userPhone,
        params.accountType,
        params.amount,
        params.duration,
        params.loanType,
        params.reference,
        params.userId,
        processedDocs as any, // Contient uniquement fileName et viewUrl (Pas de Buffer !)
        'fr'
      ),
    ],
    'loanRequestAdminNotification'
  );
}

export async function kycUploadAdminNotification(params: KycUploadNotificationParams): Promise<void> {
  await executeMultiChannel(
    [
      () => notifyAdminsNewKycDocument(
        params.userId,
        params.userFullName,
        params.documentType,
        params.loanType
      ),
      () => sendKYCUploadedAdminEmail(
        params.userFullName,
        params.userEmail,
        params.documentType,
        params.loanType,
        params.userId,
        'fr'
      ),
    ],
    'kycUploadAdminNotification'
  );
}

export async function loanApprovalNotification(params: LoanApprovalNotificationParams): Promise<void> {
  await executeMultiChannel(
    [
      () => notifyLoanApprovedInternal(params.userId, params.loanId, params.amount),
      () => sendLoanApprovedEmail(
        params.userEmail,
        params.userFullName,
        params.loanType,
        params.amount,
        params.reference,
        params.language
      ),
    ],
    'loanApprovalNotification'
  );
}

export async function transferInitiationNotification(params: TransferInitiationNotificationParams): Promise<void> {
  await executeMultiChannel(
    [
      () => notifyTransferInitiated(params.userId, params.transferId, params.amount, params.recipient),
    ],
    'transferInitiationNotification'
  );
}

export async function transferInitiationAdminNotification(params: TransferInitiationNotificationParams): Promise<void> {
  await executeMultiChannel(
    [
      () => notifyAdminsNewTransfer(
        params.userId,
        params.userFullName,
        params.transferId,
        params.amount,
        params.recipient
      ),
      () => sendTransferInitiatedAdminEmail(
        params.userFullName,
        params.userEmail,
        params.amount,
        params.recipient,
        params.transferId,
        params.userId,
        'fr'
      ),
    ],
    'transferInitiationAdminNotification'
  );
}

export async function transferCodeNotification(params: TransferCodeNotificationParams): Promise<void> {
  await executeMultiChannel(
    [
      () => sendTransferCodeEmail(
        params.userEmail,
        params.userFullName,
        params.amount,
        params.recipient,
        params.code,
        params.codeSequence,
        params.totalCodes,
        params.language
      ),
    ],
    'transferCodeNotification'
  );
}
