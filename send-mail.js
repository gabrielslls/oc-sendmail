require('dotenv').config();
const { sendEmail } = require('./src/mailer');
const { loadConfig } = require('./src/utils');

async function main() {
  const args = process.argv.slice(2);
  let to = args[0];
  const subject = args[1] || '测试邮件';
  const content = args[2] || '这是一封测试邮件';
  const html = args[3] ? JSON.parse(args[3]) : undefined;
  const cc = args[4] ? JSON.parse(args[4]) : [];
  const bcc = args[5] ? JSON.parse(args[5]) : [];
  const attachments = args[6] ? JSON.parse(args[6]) : [];
  
  const config = loadConfig();
  if (!to) {
    to = config.defaultTo;
    console.log('未提供收件人邮箱，使用默认地址:', to);
  }
  
  const result = await sendEmail({
    to,
    subject,
    text: content,
    html,
    cc,
    bcc,
    attachments
  });

  if (result.success) {
    console.log('邮件发送成功:', result.messageId);
    process.exit(0);
  } else {
    console.error('邮件发送失败:', result.error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  });
}

module.exports = { sendEmail };