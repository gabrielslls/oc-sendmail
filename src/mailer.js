const nodemailer = require('nodemailer');
const { marked } = require('marked');
const path = require('path');
const { isMarkdown, validateEmail, normalizeEmail, loadConfig } = require('./utils');

// Configure marked for security
marked.setOptions({
  headerIds: false,
  mangle: false
});

/**
 * Configure the nodemailer transporter
 */
function createTransporter(config) {
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    }
  });
}

/**
 * Send an email
 * @param {object} options 
 * @returns {Promise<object>}
 */
async function sendEmail({ to, subject, text, html, cc = [], bcc = [], attachments = [] }) {
  const config = loadConfig();
  const transporter = createTransporter(config);
  
  try {
    // Determine recipient
    let toAddress = to || config.defaultTo;
    if (!toAddress) {
      throw new Error('No recipient email address specified');
    }

    // Validate and normalize
    if (!validateEmail(toAddress)) {
      throw new Error(`Invalid recipient email format: ${toAddress}`);
    }
    const normalizedTo = normalizeEmail(toAddress);

    const normalizedCc = cc.map(email => {
      if (!validateEmail(email)) throw new Error(`Invalid CC email: ${email}`);
      return normalizeEmail(email);
    });

    const normalizedBcc = bcc.map(email => {
      if (!validateEmail(email)) throw new Error(`Invalid BCC email: ${email}`);
      return normalizeEmail(email);
    });

    // Process content
    let htmlContent = html;
    if (!htmlContent && text) {
      if (isMarkdown(text)) {
        htmlContent = marked.parse(text);
      } else {
        htmlContent = text.replace(/\n/g, '<br>');
      }
    }

    // Attachments
    const emailAttachments = attachments.map(filePath => ({
      filename: path.basename(filePath),
      path: filePath
    }));

    // Send
    const info = await transporter.sendMail({
      from: `"${config.senderName}" <${config.smtpUser}>`,
      to: normalizedTo,
      cc: normalizedCc,
      bcc: normalizedBcc,
      subject: subject || 'No Subject',
      text: text,
      html: htmlContent,
      attachments: emailAttachments
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendEmail
};
