import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.EMAIL_API_KEY);

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Zyra Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 12px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <h2 style="color: #4f46e5; text-align: center;">🔐 Zyra Email Verification</h2>
          <p style="font-size: 16px; color: #374151;">
            Assalamualaikum 👋, 
          </p>
          <p style="font-size: 16px; color: #374151;">
            Shukriya Zyra join karne ke liye. Niche diya gaya verification code apko 5 minute ke andar use karna hoga:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #111827; background: #e0e7ff; padding: 10px 20px; border-radius: 8px; display: inline-block;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            Agar aapne yeh request nahi kiya toh is email ko ignore kar dein.
          </p>
          <p style="font-size: 14px; color: #9ca3af; text-align: center; margin-top: 20px;">
            &copy; ${new Date().getFullYear()} Zyra. All rights reserved.
          </p>
        </div>
      `,
    });

    return true;
  } catch (e) {
    console.log("Email send error:", e);
    return false;
  }
}
