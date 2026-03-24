const { sendEmail } = require('./send-mail.js');

// 测试附件功能
async function testAttachments() {
  console.log('测试附件功能...');

  // 创建一个测试文件
  const fs = require('fs');
  const path = require('path');

  const testFile1 = path.join(__dirname, 'test-attachment1.txt');
  const testFile2 = path.join(__dirname, 'test-attachment2.txt');

  fs.writeFileSync(testFile1, '这是测试附件1的内容');
  fs.writeFileSync(testFile2, '这是测试附件2的内容');

  try {
    const result = await sendEmail({
      to: 'test@example.com',  // 替换为实际邮箱进行测试
      subject: '测试附件功能',
      text: '这是一封包含附件的测试邮件',
      attachments: [testFile1, testFile2]
    });

    console.log('测试结果:', result);

    if (result.success) {
      console.log('✅ 附件功能测试通过');
    } else {
      console.log('❌ 附件功能测试失败:', result.error);
    }
  } catch (error) {
    console.log('❌ 测试过程中发生错误:', error.message);
  } finally {
    // 清理测试文件
    if (fs.existsSync(testFile1)) fs.unlinkSync(testFile1);
    if (fs.existsSync(testFile2)) fs.unlinkSync(testFile2);
  }
}

if (require.main === module) {
  testAttachments();
}

module.exports = { testAttachments };