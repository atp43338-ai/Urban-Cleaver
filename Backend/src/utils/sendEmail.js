const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer Transport using Gmail SMTP
 * Uses process.env.EMAIL_USER and process.env.EMAIL_PASS
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('[Urban Cleaver Mailer] WARNING: EMAIL_USER or EMAIL_PASS not configured. Falling back to console logging.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: pass.trim(),
    },
  });
};

// Singleton transporter instance
const transporter = createTransporter();

/**
 * Generate a clean, branded HTML email template for Urban Cleaver OTP verification
 */
const getOtpEmailTemplate = ({ name, otp, purpose = 'Email Verification', expiryMinutes = 10 }) => {
  const currentYear = new Date().getFullYear();
  const recipientName = name ? name.trim() : 'Valued Customer';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urban Cleaver - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="background-color: #09090b; padding: 32px 24px; border-bottom: 2px solid #18181b;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: #18181b; border: 1px solid #27272a; border-radius: 12px; width: 44px; height: 44px; line-height: 44px; text-align: center; color: #ffffff; font-size: 20px; font-weight: bold; margin-bottom: 12px;">
                      &#x1F525;
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="display: block; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">
                      URBAN CLEAVER
                    </span>
                    <span style="display: block; color: #a1a1aa; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px;">
                      Artisanal Butchery & Gourmet Kitchen
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #09090b; letter-spacing: -0.3px;">
                ${purpose}
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Hello <strong>${recipientName}</strong>, thank you for choosing <strong>Urban Cleaver</strong>. Please use the 6-digit One-Time Password (OTP) below to verify your account:
              </p>

              <!-- OTP Highlight Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px 16px; text-align: center; margin: 28px 0;">
                <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #09090b; padding-left: 10px;">
                  ${otp}
                </div>
                <div style="display: inline-block; margin-top: 14px; padding: 4px 12px; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #92400e;">
                  &#x23F1; Expires in ${expiryMinutes} minutes
                </div>
              </div>

              <!-- Security Information -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; border-radius: 8px; padding: 14px 16px; margin-top: 20px;">
                <tr>
                  <td style="font-size: 12px; line-height: 1.5; color: #64748b;">
                    <strong style="color: #334155;">Security Notice:</strong> Never share this code with anyone. Urban Cleaver representatives will never ask for your password or verification code. If you did not request this, please ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                &copy; ${currentYear} Urban Cleaver Inc. All rights reserved.<br>
                Fresh, premium artisanal cuts delivered to your kitchen.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Send Email via Nodemailer Gmail SMTP
 * Handles errors gracefully without crashing the server.
 */
const sendEmail = async ({ to, subject, html, text, fallbackOtp }) => {
  const from = process.env.EMAIL_FROM || (process.env.EMAIL_USER ? `"Urban Cleaver" <${process.env.EMAIL_USER}>` : '"Urban Cleaver" <no-reply@urbancleaver.com>');

  // Active Transporter check
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text: text || `Your Urban Cleaver verification OTP is ${fallbackOtp || ''}. Valid for 10 minutes.`,
        html,
      });

      console.log(`[Urban Cleaver Mailer] Email delivered successfully to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`[Urban Cleaver Mailer] SMTP Delivery Error to ${to}:`, err.message);
      // Fall through to console fallback so development/testing continues seamlessly
    }
  }

  // Fallback logging for local testing if SMTP transport fails or credentials missing
  console.log('\n======================================================');
  console.log('   URBAN CLEAVER - EMAIL NOTIFICATION (FALLBACK)');
  console.log('======================================================');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  if (fallbackOtp) {
    console.log(`\n >>> 6-DIGIT OTP CODE: [ ${fallbackOtp} ] <<<\n`);
    console.log(' (Valid for 10 minutes)');
  }
  console.log('======================================================\n');

  return { success: false, fallback: true };
};

module.exports = {
  sendEmail,
  getOtpEmailTemplate,
  transporter,
};
