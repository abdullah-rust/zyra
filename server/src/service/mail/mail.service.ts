import nodemailer from "nodemailer";

// 1. Transporter configuration
// Is mein tum Gmail ya kisi bhi SMTP service (jaise Mailtrap) ki details dalo ge
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // Tumhara email
    pass: process.env.MAIL_PASS, // Tumhara app password
  },
});

export const MailService = {
  /**
   * OTP Bhejne ka function
   * @param to - Jis ko email bhejni hai
   * @param otp - Wo code jo generate kiya hai
   */
  sendOTP: async (to: string, otp: string): Promise<boolean> => {
    try {
      const mailOptions = {
        from: `"Zyra Tech" <${process.env.MAIL_USER}>`, // Sender address
        to: to, // Receiver
        subject: "Your OTP Verification Code", // Subject line
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #333;">Verification Required</h2>
            <p>Jani, aapka security code neeche diya gaya hai:</p>
            <div style="background: #f4f4f4; padding: 10px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #000;">
              ${otp}
            </div>
            <p style="margin-top: 20px;">Ye code 5 minutes ke liye valid hai. Kisi ke sath share na karein.</p>
          </div>
        `, // HTML body
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent: %s", info.messageId);
      return true;
    } catch (error) {
      console.error("❌ Nodemailer Error:", error);
      return false;
    }
  },
};
