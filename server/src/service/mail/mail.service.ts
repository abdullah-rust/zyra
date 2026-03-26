import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS, 
  },
});

export const MailService = {
  /**
   * @param to 
   * @param otp 
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
            <p style="margin-top: 20px;">This code is for 5 minutes. Do not share it with anyone.</p>
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
