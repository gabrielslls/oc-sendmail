const fs = require('fs');
const path = require('path');

/**
 * Detect if content is Markdown
 * @param {string} content 
 * @returns {boolean}
 */
function isMarkdown(content) {
  if (!content || typeof content !== 'string') return false;
  const markdownPatterns = [
    /^#{1,6}\s/, // Headers
    /\*\*.+\*\*/, // Bold
    /\*.+\*/, // Italic
    /^\s*[-*+]\s/, // Unordered lists
    /^\s*\d+\.\s/, // Ordered lists
    /\[.+\]\(.+\)/, // Links
    /!\[.+\]\(.+\)/, // Images
    /`{3}[\s\S]*`{3}/, // Code blocks
    /`[^`]+`/, // Inline code
    /^>\s/, // Blockquotes
    /---|\*\*\*/, // Horizontal rules
  ];
  return markdownPatterns.some(pattern => pattern.test(content));
}

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * Normalize email address
 * @param {string} email 
 * @returns {string}
 */
function normalizeEmail(email) {
  if (!email) return email;
  return email.trim().toLowerCase();
}

/**
 * Load email configuration from .env
 * @returns {object}
 */
function loadConfig() {
  return {
    defaultTo: process.env.DEFAULT_TO || 'your-email@example.com',
    smtpHost: process.env.SMTP_HOST || 'smtp.yeah.net',
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 465,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASSWORD,
    senderName: process.env.SENDER_NAME || 'OpenCode'
  };
}

module.exports = {
  isMarkdown,
  validateEmail,
  normalizeEmail,
  loadConfig
};
