import axios from 'axios';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SENDPULSE_API_URL = 'https://api.sendpulse.com';

export interface DocumentInfo {
  documentType: string;
  fileUrl: string;
  fileName: string;
  viewUrl?: string;
}

interface SendPulseTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SENDPULSE_API_ID;
  const clientSecret = process.env.SENDPULSE_API_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SendPulse configuration missing: SENDPULSE_API_ID and SENDPULSE_API_SECRET must be set');
  }

  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < tokenExpiry - 60) {
    return cachedToken;
  }

  try {
    const response = await axios.post<SendPulseTokenResponse>(`${SENDPULSE_API_URL}/oauth/access_token`, {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    cachedToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in;
    return cachedToken;
  } catch (error: any) {
    console.error('Error fetching SendPulse access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with SendPulse');
  }
}

export async function sendTransactionalEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
  }>;
}) {
  const accessToken = await getAccessToken();
  const fromEmail = process.env.SENDPULSE_FROM_EMAIL || 'noreply@kreditpass.org';
  const fromName = process.env.SENDPULSE_FROM_NAME || 'KreditPass';

  const emailData: any = {
    email: {
      subject: options.subject,
      from: {
        name: fromName,
        email: fromEmail,
      },
      to: [
        {
          email: options.to,
        },
      ],
    },
  };

  // Ensure all images in HTML use absolute URLs with the production domain
  let finalHtml = options.html;
  
  // Construct finalText from options.text or strip HTML from finalHtml
  const finalText = options.text || finalHtml.replace(/<[^>]*>?/gm, '');
  const encodedHtml = Buffer.from(finalHtml, 'utf-8').toString('base64');

  emailData.email.html = encodedHtml; 
  emailData.email.text = finalText;

  if (options.replyTo) {
    emailData.email.reply_to = options.replyTo;
  }

  if (options.attachments && options.attachments.length > 0) {
    emailData.email.attachments_binary = {};
    options.attachments.forEach(att => {
      emailData.email.attachments_binary[att.filename] = att.content;
    });
  }

  try {
    const response = await axios.post(`${SENDPULSE_API_URL}/smtp/emails`, emailData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`[Email] SendPulse response:`, response.data);
    if (response.data && response.data.result === false) {
      console.error('[Email] SendPulse reported failure:', response.data);
      throw new Error(`SendPulse error: ${JSON.stringify(response.data)}`);
    }
    return true;
  } catch (error: any) {
    console.error('Error sending SendPulse transactional email:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('[Email] Detailed SendPulse error:', JSON.stringify(error.response.data));
    }
    throw error;
  }
}

function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return 'https://kreditpass.org';
  }
  
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }
  
  return process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
    : 'http://localhost:5000';
}

export async function sendVerificationEmail(toEmail: string, fullName: string, token: string, accountType: string, language: string = 'fr') {
  const { getEmailTemplate } = await import('./emailTemplates');
  const verificationUrl = `${getBaseUrl()}/verify/${token}`;
  const template = getEmailTemplate('verification', language as any, { fullName, verificationUrl, accountTypeText: accountType });
  await sendTransactionalEmail({ to: toEmail, subject: template.subject, html: template.html, text: template.text });
  return true;
}

export async function sendWelcomeEmail(toEmail: string, fullName: string, accountType: string, language: string = 'fr') {
  const { getEmailTemplate } = await import('./emailTemplates');
  const loginUrl = `${getBaseUrl()}/login`;
  const template = getEmailTemplate('welcome', language as any, { fullName, accountTypeText: accountType, loginUrl });
  await sendTransactionalEmail({ to: toEmail, subject: template.subject, html: template.html, text: template.text });
  return true;
}

export async function sendContractEmail(toEmail: string, fullName: string, loanId: string, amount: string, contractUrl: string, language: string = 'fr') {
  const { getEmailTemplate } = await import('./emailTemplates');
  const dashboardUrl = `${getBaseUrl()}/contracts`;
  const template = getEmailTemplate('contract', language as any, { fullName, amount, loanId, dashboardUrl });
  await sendTransactionalEmail({ to: toEmail, subject: template.subject, html: template.html, text: template.text });
  return true;
}

export async function sendResetPasswordEmail(toEmail: string, fullName: string, token: string, language: string = 'fr') {
  const resetUrl = `${getBaseUrl()}/reset-password/${token}`;
  const currentYear = new Date().getFullYear();
  
  const logoTextHtml = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 1px;
      text-align: center;
      color: #1e3a8a;
    ">
      KreditPass
      <span style="color:#0f172a;">GROUP</span>
    </div>
    <div style="
      margin-top: 6px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    ">
      Financing Solutions
    </div>
  `;
  
  const subject = language === 'en' ? 'Reset your password - KreditPass' : 'Réinitialisez votre mot de passe - KreditPass';
  const html = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KreditPass</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table width="100%" bgcolor="#f4f4f4">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" bgcolor="#ffffff" style="border-radius: 8px; overflow: hidden;">
          <tr>
            <td align="center" style="background: #ffffff; padding: 30px; border-bottom: 1px solid #e2e8f0;">
              ${logoTextHtml}
            </td>
          </tr>
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #c9a227 100%); padding: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${language === 'en' ? 'Password Reset' : 'Réinitialisation du mot de passe'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p>Bonjour <strong>${fullName}</strong>,</p>
              <p>${language === 'en' ? 'Click the button below to reset your password:' : 'Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :'}</p>
              <div align="center" style="margin: 30px 0;">
                <a href="${resetUrl}" style="background: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                  ${language === 'en' ? 'Reset Password' : 'Réinitialiser mon mot de passe'}
                </a>
              </div>
              <p style="font-size: 12px; color: #6b7280; word-break: break-all;">${resetUrl}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #64748b;">&copy; ${currentYear} KreditPass</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  const text = `Bonjour ${fullName}, visitez ce lien pour réinitialiser votre mot de passe: ${resetUrl}`;
  await sendTransactionalEmail({ to: toEmail, subject, html, text });
  return true;
}

export async function sendContactFormEmail(name: string, email: string, phone: string, message: string) {
  const fromEmail = process.env.SENDPULSE_FROM_EMAIL || 'noreply@kreditpass.org';
  const subject = `Nouveau message de contact - ${name}`;
  const html = `<p>Nom: ${name}</p><p>Email: ${email}</p><p>Téléphone: ${phone}</p><p>Message: ${message}</p>`;
  const text = `Nouveau message de contact\nNom: ${name}\nEmail: ${email}\nMessage: ${message}`;
  await sendTransactionalEmail({ to: fromEmail, subject, html, text, replyTo: email });
  return true;
}

export async function sendLoanRequestUserEmail(toEmail: string, fullName: string, loanType: string, amount: string, reference: string, language: string = 'fr') {
  const { getEmailTemplate } = await import('./emailTemplates');
  const dashboardUrl = `${getBaseUrl()}/dashboard`;
  const template = getEmailTemplate('loanRequestUser', language as any, { fullName, loanType, amount, reference, dashboardUrl });
  await sendTransactionalEmail({ to: toEmail, subject: template.subject, html: template.html, text: template.text });
  return true;
}

export async function sendLoanRequestAdminEmailWithResend(
  fullName: string,
  email: string,
  phone: string | null,
  accountType: string,
  amount: string,
  duration: number,
  loanType: string,
  reference: string,
  userId: string,
  files: Array<{
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  }>,
  language: string = 'fr'
) {
  if (!resend) {
    console.error('[Resend] API Key missing, cannot send admin email with attachments');
    return false;
  }

  const fromEmail = process.env.SENDPULSE_FROM_EMAIL || 'noreply@kreditpass.org';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kreditpass.org';
  console.log(`[Email] Final Admin Email resolved to: ${adminEmail}`);
  const { getEmailTemplate } = await import('./emailTemplates');
  const reviewUrl = `${getBaseUrl()}/admin/loans/${reference}`;

  const template = getEmailTemplate('loanRequestAdmin', language as any, {
    fullName,
    email,
    phone,
    accountType,
    amount,
    duration,
    loanType,
    reference,
    userId,
    reviewUrl,
    documents: files.map(f => ({ 
      fileName: f.originalname, 
      viewUrl: '#',
      documentType: 'Loan Application',
      fileUrl: '#'
    }))
  });

  console.log(`[Resend] Sending loan request email to admin with ${files.length} attachments`);

  try {
    const { data, error } = await resend.emails.send({
      from: `KreditPass <${fromEmail}>`,
      to: adminEmail,
      subject: template.subject,
      html: template.html,
      attachments: files.map(file => ({
        filename: file.originalname,
        content: file.buffer,
      })),
    });

    if (error) {
      console.error('[Resend] Error sending email:', error);
      return false;
    }

    console.log('[Resend] Email sent successfully:', data?.id);
    return true;
  } catch (err) {
    console.error('[Resend] Exception sending email:', err);
    return false;
  }
}

export async function sendKYCUploadedAdminEmail(fullName: string, email: string, documentType: string, loanType: string, userId: string, language: string = 'fr') {
  const fromEmail = process.env.SENDPULSE_FROM_EMAIL || 'noreply@kreditpass.org';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kreditpass.org';
  const subject = `Nouveau document KYC - ${fullName}`;
  const html = `<p>L'utilisateur ${fullName} (${email}) a téléchargé un document KYC (${documentType}) pour un prêt ${loanType}.</p>`;
  const text = `L'utilisateur ${fullName} (${email}) a téléchargé un document KYC (${documentType}) pour un prêt ${loanType}.`;
  await sendTransactionalEmail({ to: adminEmail, subject, html, text });
  return true;
}

export async function sendLoanApprovedEmail(toEmail: string, fullName: string, loanType: string, amount: string, reference: string, language: string = 'fr') {
  const { getEmailTemplate } = await import('./emailTemplates');
  const template = getEmailTemplate('loanApprovedUser', language as any, { fullName, reference, amount, loanType, loginUrl: `\${getBaseUrl()}/login` });
  await sendTransactionalEmail({ to: toEmail, subject: template.subject, html: template.html, text: template.text });
  return true;
}

export async function sendTransferInitiatedAdminEmail(fullName: string, email: string, amount: string, recipient: string, transferId: string, userId: string, language: string = 'fr') {
  const fromEmail = process.env.SENDPULSE_FROM_EMAIL || 'noreply@kreditpass.org';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kreditpass.org';
  const subject = `Nouveau transfert initié - ${fullName}`;
  const html = `<p>L'utilisateur ${fullName} (${email}) a initié un transfert de ${amount} vers ${recipient}. Transfert ID: ${transferId}</p>`;
  const text = `L'utilisateur ${fullName} (${email}) a initié un transfert de ${amount} vers ${recipient}. Transfert ID: ${transferId}`;
  await sendTransactionalEmail({ to: adminEmail, subject, html, text });
  return true;
}

export async function sendTransferCodeEmail(toEmail: string, fullName: string, amount: string, recipient: string, code: string, sequence: number, total: number, language: string = 'fr') {
  const { getEmailTemplate } = await import('./emailTemplates');
  const template = getEmailTemplate('transferCodeUser', language as any, { 
    fullName, 
    amount, 
    recipient, 
    code, 
    codeSequence: sequence.toString(), 
    totalCodes: total.toString() 
  });
  await sendTransactionalEmail({ to: toEmail, subject: template.subject, html: template.html, text: template.text });
  return true;
}

export async function sendSignedContractToAdmins(fullName: string, email: string, loanId: string, amount: string, fileBuffer: Buffer, fileName: string, fileType: string, language: string = 'fr') {
  const fromEmail = process.env.SENDPULSE_FROM_EMAIL || 'noreply@kreditpass.org';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kreditpass.org';
  const subject = `Contrat signé reçu - ${fullName}`;
  
  const logoTextHtml = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 1px;
      text-align: center;
      color: #1e3a8a;
    ">
      KreditPass
      <span style="color:#0f172a;">GROUP</span>
    </div>
  `;

  const html = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <div style="margin-bottom: 20px; text-align: center;">
        ${logoTextHtml}
      </div>
      <p>L'utilisateur ${fullName} (${email}) a envoyé son contrat signé pour le prêt ${loanId} d'un montant de ${amount} €.</p>
    </div>
  `;
  const text = `L'utilisateur ${fullName} (${email}) a envoyé son contrat signé pour le prêt ${loanId} d'un montant de ${amount} €.`;
  
  await sendTransactionalEmail({ 
    to: adminEmail, 
    subject, 
    html, 
    text,
    attachments: [{
      content: fileBuffer.toString('base64'),
      filename: fileName,
      type: 'application/pdf'
    }]
  });
  return true;
}

export async function sendTransferCompletedEmail(toEmail: string, fullName: string, amount: string, recipient: string, iban: string, transferId: string, language: string = 'fr') {
  const { getEmailTemplate } = await import('./emailTemplates');
  const template = getEmailTemplate('transferCompletedUser', language as any, { 
    fullName, 
    amount, 
    recipient, 
    recipientIban: iban, 
    transferId,
    supportEmail: 'support@kreditpass.org'
  });
  await sendTransactionalEmail({ to: toEmail, subject: template.subject, html: template.html, text: template.text });
  return true;
}

export async function sendAdminTransferCompletionReport(fullName: string, email: string, transferId: string, amount: string, recipient: string, iban: string, loanId: string, language: string = 'fr') {
  const { getEmailTemplate } = await import('./emailTemplates');
  const template = getEmailTemplate('transferCompletedAdmin', language as any, {
    fullName,
    email,
    amount,
    recipient,
    recipientIban: iban,
    transferId,
    userId: 'N/A',
    completedAt: new Date().toLocaleString(),
    totalValidations: 'All',
    reviewUrl: '#'
  });
  await sendTransactionalEmail({ to: process.env.ADMIN_EMAIL || 'admin@kreditpass.org', subject: template.subject, html: template.html, text: template.text });
  return true;
}

export async function sendTransferCodesAdminEmail(fullName: string, email: string, loanId: string, amount: string, codes: any[], language: string = 'fr') {
  const { getEmailTemplate } = await import('./emailTemplates');
  const template = getEmailTemplate('transferCodesAdmin', language as any, {
    fullName,
    amount,
    loanId,
    codes: codes.map((c, i) => ({ sequence: i + 1, code: c.code, pausePercent: c.pausePercent, context: c.codeContext }))
  });
  await sendTransactionalEmail({ to: process.env.ADMIN_EMAIL || 'admin@kreditpass.org', subject: template.subject, html: template.html, text: template.text });
  return true;
}
