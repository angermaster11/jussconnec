import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Inter', sans-serif; background: #0A0F1E; color: #F5F5F5; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #1a1f35; border-radius: 16px; padding: 40px;">
        <h1 style="color: #00C6C2; margin-bottom: 24px;">Welcome to JussConnecc!</h1>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for signing up. Please verify your email address by clicking the button below:
        </p>
        <a href="${verifyUrl}" 
           style="display: inline-block; background: #00C6C2; color: #0A0F1E; 
                  padding: 14px 32px; border-radius: 8px; text-decoration: none; 
                  font-weight: 600; margin: 24px 0;">
          Verify Email
        </a>
        <p style="font-size: 14px; color: #888;">
          Or copy this link: ${verifyUrl}
        </p>
        <p style="font-size: 14px; color: #888;">
          This link expires in 24 hours.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject: 'Verify your JussConnecc account', html });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Inter', sans-serif; background: #0A0F1E; color: #F5F5F5; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #1a1f35; border-radius: 16px; padding: 40px;">
        <h1 style="color: #00C6C2; margin-bottom: 24px;">Reset Your Password</h1>
        <p style="font-size: 16px; line-height: 1.6;">
          You requested a password reset. Click the button below to set a new password:
        </p>
        <a href="${resetUrl}" 
           style="display: inline-block; background: #00C6C2; color: #0A0F1E; 
                  padding: 14px 32px; border-radius: 8px; text-decoration: none; 
                  font-weight: 600; margin: 24px 0;">
          Reset Password
        </a>
        <p style="font-size: 14px; color: #888;">
          Or copy this link: ${resetUrl}
        </p>
        <p style="font-size: 14px; color: #888;">
          This link expires in 1 hour. If you didn't request this, please ignore.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject: 'Reset your JussConnecc password', html });
};
