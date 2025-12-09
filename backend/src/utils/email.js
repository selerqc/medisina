import nodemailer from "nodemailer";
import config from "../config/config.js";
import logger from "../logger/logger.js";

const transport = nodemailer.createTransport({
  service: config.email.EMAIL_SERVICE,
  auth: {
    user: config.email.EMAIL_USER,
    pass: config.email.EMAIL_PASSWORD,
  },
});

transport
  .verify()
  .then(() => logger.info("connected to email server"))
  .catch((error) => logger.error("Failed to connect to email server:", error))


const sendEmail = async (to, subject, text, html) => {
  const msg = {
    from: config.email.EMAIL_USER,
    to,
    subject,
    text,
    html, // Add HTML support
  };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token) => {
  const resetPasswordUrl = `${config.CLIENT_URL}/reset-password/${token}`;

  // Plain text version (fallback)
  const text = `
    You are receiving this because you (or someone else) have requested the reset of the password for your account.
    Please click on the following link, or paste this into your browser to complete the process:
    ${resetPasswordUrl}
    If you did not request this, please ignore this email and your password will remain unchanged.
  `;

  // Styled HTML version
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
       

        <!-- Content -->
        <div style="padding: 40px 30px;">

          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
            You are receiving this email because you (or someone else) have requested a password reset for your account.
          </p>

          <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
            Click the button below to reset your password. This link will expire in 24 hours for security reasons.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetPasswordUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 50px; font-size: 16px; font-weight: 500; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
              Reset My Password
            </a>
          </div>

          <!-- Alternative link -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <p style="color: #666666; font-size: 13px; margin: 0 0 10px 0;">
              If the button above doesn't work, copy and paste this URL into your browser:
            </p>
            <p style="color: #667eea; font-size: 13px; word-break: break-all; margin: 0; font-family: monospace; background-color: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #e9ecef;">
              ${resetPasswordUrl}
            </p>
          </div>

          <!-- Security notice -->
          <div style="border-left: 4px solid #ffc107; background-color: #fffdf5; padding: 20px; margin: 30px 0;">
            <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
              <strong>Security Notice:</strong> If you did not request this password reset, please ignore this email. Your password will remain unchanged and your account will stay secure.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="color: #6c757d; font-size: 12px; margin: 0 0 10px 0;">
            This email was sent from an automated system. Please do not reply to this email.
          </p>
          <p style="color: #adb5bd; font-size: 11px; margin: 0;">
            If you're having trouble with the link above, contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(to, "Reset Your Password", text, html);
};

const sendEmailApproval = async (to) => {
  const text = `
    🎉 Congratulations! Your account has been approved.
    You can now log in and start using MediSync.
  `;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Approved</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
      </style>
    </head>
    <body style="margin:0; padding:0; font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f6f8fa;">
      <div style="max-width:520px; margin:40px auto; background:#fff; border-radius:16px; box-shadow:0 6px 24px rgba(60,72,88,0.08); overflow:hidden;">
        <div style="background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%); padding:36px 24px; text-align:center;">
          <svg width="48" height="48" fill="none" style="margin-bottom:16px;">
            <circle cx="24" cy="24" r="24" fill="#fff" />
            <path d="M16 24l6 6 10-10" stroke="#43cea2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h1 style="color:#fff; margin:0; font-size:2rem; font-weight:600; letter-spacing:1px;">
            Account Approved!
          </h1>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#222; font-size:1.1rem; line-height:1.7; margin-bottom:18px; text-align:center;">
            🎉 Congratulations! Your MediSync account is now active.
          </p>
          <p style="color:#555; font-size:0.98rem; line-height:1.6; margin-bottom:28px; text-align:center;">
            You can now log in and start using our services. If you have any questions, our support team is here to help.
          </p>
          <div style="text-align:center; margin:32px 0;">
            <a href="${config.CLIENT_URL}/login"
               style="display:inline-block; background:linear-gradient(135deg, #43cea2 0%, #185a9d 100%); color:#fff; text-decoration:none; padding:14px 36px; border-radius:40px; font-size:1rem; font-weight:600; letter-spacing:0.5px; box-shadow:0 4px 16px rgba(67,206,162,0.15); transition:background 0.2s;">
              Log In to MediSync
            </a>
          </div>
        </div>
        <div style="background-color:#f8f9fa; padding:24px; text-align:center; border-top:1px solid #e9ecef;">
          <p style="color:#6c757d; font-size:0.92rem; margin:0 0 8px 0;">
            This email was sent from an automated system. Please do not reply.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(to, "Your Account Has Been Approved", text, html);
}

export { sendEmail, sendResetPasswordEmail, sendEmailApproval, transport };
