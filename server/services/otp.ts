import crypto from "crypto";
import { db } from "../db";
import { userOtps } from "@shared/schema";
import { eq, and, lt } from "drizzle-orm";
import { sendTransactionalEmail } from "../email";

export async function generateAndSendOTP(userId: string, userEmail: string, fullName: string, language: string = 'fr'): Promise<void> {
  try {
    const code = crypto.randomInt(10000000, 99999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await db.insert(userOtps).values({
      userId,
      otpCode: code,
      expiresAt,
      used: false,
    });

    const { getOtpEmailTemplate } = await import('../emailTemplates');
    
    const template = getOtpEmailTemplate(language as any, {
      fullName,
      otpCode: code,
    });

    await sendTransactionalEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
    
    console.log(`OTP code sent to ${userEmail} via SendPulse`);
  } catch (error) {
    console.error('Error generating/sending OTP:', error);
    throw error;
  }
}

const MAX_OTP_ATTEMPTS = 3;

export async function verifyOTP(userId: string, code: string): Promise<boolean> {
  try {
    const now = new Date();
    
    const record = await db.query.userOtps.findFirst({
      where: and(
        eq(userOtps.userId, userId),
        eq(userOtps.used, false),
      ),
      orderBy: (userOtps, { desc }) => [desc(userOtps.createdAt)],
    });

    if (!record) {
      return false;
    }

    if (record.expiresAt < now) {
      return false;
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      return false;
    }

    const recordCodeBuffer = Buffer.from(record.otpCode, 'utf8');
    const inputCodeBuffer = Buffer.from(code, 'utf8');
    
    const isValidCode = recordCodeBuffer.length === inputCodeBuffer.length && 
                        crypto.timingSafeEqual(recordCodeBuffer, inputCodeBuffer);
    
    if (isValidCode) {
      await db
        .update(userOtps)
        .set({ used: true })
        .where(eq(userOtps.id, record.id));
      return true;
    } else {
      await db
        .update(userOtps)
        .set({ attempts: record.attempts + 1 })
        .where(eq(userOtps.id, record.id));
      return false;
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}

export async function cleanupExpiredOTPs(): Promise<void> {
  try {
    const now = new Date();
    await db.delete(userOtps).where(lt(userOtps.expiresAt, now));
    console.log('Expired OTPs cleaned up');
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
  }
}
