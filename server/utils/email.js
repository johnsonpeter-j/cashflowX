const nodemailer = require('nodemailer');

// Create transporter - configure based on your email service
// For development, you can use Gmail or other services
// For production, use services like SendGrid, AWS SES, etc.
const createTransporter = () => {
  // Gmail configuration (for development)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
  });
};

const sendTempPasswordEmail = async (email, tempPassword) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'CashFlowX - Temporary Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366F1;">CashFlowX - Temporary Password</h2>
          <p>Hello,</p>
          <p>You have requested a temporary password for your CashFlowX account.</p>
          <p style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold; text-align: center; color: #6366F1; margin: 20px 0;">
            Your temporary password: <span style="font-family: monospace;">${tempPassword}</span>
          </p>
          <p>Please use this temporary password to sign in to your account. We recommend changing your password after signing in.</p>
          <p>If you did not request this password, please ignore this email.</p>
          <p style="margin-top: 30px; color: #6B7280; font-size: 12px;">
            Best regards,<br>
            CashFlowX Team
          </p>
        </div>
      `,
      text: `
        CashFlowX - Temporary Password
        
        Hello,
        
        You have requested a temporary password for your CashFlowX account.
        
        Your temporary password: ${tempPassword}
        
        Please use this temporary password to sign in to your account. We recommend changing your password after signing in.
        
        If you did not request this password, please ignore this email.
        
        Best regards,
        CashFlowX Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendTempPasswordEmail,
};





