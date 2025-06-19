"use server"

import { db } from "@/db";
import { emailTable } from "@/db/schema";
import { SpamPrevention, NewsletterSubmission } from "./lib/spam-prevention";
import { headers } from "next/headers";

export async function addEmail(
  email: string, 
  honeypot?: string,
  source?: string
): Promise<{ success: boolean, error?: string }> {
  try {
    // Get request headers for IP detection
    const headersList = await headers();
    const ipAddress = SpamPrevention.getClientIp(headersList);
    const userAgent = headersList.get('user-agent') || undefined;

    // Create submission object
    const submission: NewsletterSubmission = {
      email: email.trim().toLowerCase(),
      ipAddress,
      userAgent,
      source: source || 'footer',
      honeypot,
    };

    // Perform comprehensive spam check
    const spamCheck = await SpamPrevention.checkNewsletterSubmission(submission);
    if (spamCheck.isBlocked) {
      return { 
        success: false, 
        error: spamCheck.reason || 'Submission blocked' 
      };
    }

    // Insert email with additional metadata
    await db.insert(emailTable).values({
      email: submission.email,
      ipAddress: submission.ipAddress,
      userAgent: submission.userAgent,
      source: submission.source,
    });

    return { success: true };
  } catch (error: any) {
    // Handle specific database errors
    if (error.code === '23505') { // Unique constraint violation
      return { success: false, error: "Email already subscribed" };
    }
    
    console.error('Newsletter signup error:', error);
    return { success: false, error: "Error adding email" };
  }
}
