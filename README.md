# oc-sendmail - OpenCode MCP 邮件发送工具

一个基于 Model Context Protocol (MCP) 的邮件发送工具，专为 OpenCode 设计，可以通过 MCP 协议发送邮件。

## 🌟 核心亮点

- 📝 **极简 MD 渲染** - 自动识别并渲染 Markdown，让你的邮件像文档一样专业、优雅。
- ⚡️ **轻量高效** - 基于 Node.js，核心逻辑精简，无冗余依赖，启动即用。
- 📎 **完整附件支持** - 轻松发送文档、图片等各类附件，满足全场景办公需求。
- 🤖 **MCP 深度集成** - 专为 OpenCode 等 AI 编辑器设计，通过自然语言即可调动邮件发送能力。
- 📧 **智能邮箱识别** - 自动正规化邮箱地址，极大降低因格式问题导致的发送失败率。

## 快速开始

### 方式一：直接使用

```bash
cd opencode-email-sender

# 已安装依赖，直接配置
cp .env.example .env
# 编辑 .env 文件，填入你的邮箱配置
```

### 方式二：作为模板创建新项目

```bash
# 复制项目
cp -r opencode-email-sender my-email-mcp
cd my-email-mcp

# 配置
cp .env.example .env
# 编辑 .env
```

### 配置

编辑 `.env` 文件：

```bash
# SMTP 服务器设置
SMTP_HOST=smtp.yeah.net
SMTP_PORT=465
SMTP_USER=your-email@yeah.net
SMTP_PASSWORD=your-password-or-authorization-code
SENDER_NAME=OpenCode 邮件系统
```

### 测试

```bash
# 命令行发送普通文本邮件
npm run test:send recipient@example.com "测试主题" "测试内容"

# 发送 Markdown 格式邮件
node send-mail.js recipient@example.com "Markdown 测试" "# 标题

**粗体文本**
*斜体文本*

- 列表项1
- 列表项2"

# 发送测试邮件到默认邮箱
node send-mail.js your-email@example.com "测试邮件" "这是一封测试邮件"

# 发送带抄送和附件的邮件
node send-mail.js recipient@example.com "测试带附件" "这是带附件的测试邮件" \
  "[]" \
  '["cc@example.com"]' \
  '["/path/to/file1.pdf", "/path/to/image.jpg"]'

# 发送带抄送、密送和附件的邮件
node send-mail.js recipient@example.com "测试完整功能" "这是完整功能的测试邮件" \
  '["cc1@example.com", "cc2@example.com"]' \
  '["bcc@example.com"]' \
  '["/path/to/document.docx"]'
```

### OpenCode MCP 部署

**git clone 后部署：**

```bash
# 克隆项目
git clone https://github.com/gabrielslls/oc-sendmail.git
cd oc-sendmail
npm install
cp .env.example .env
# 编辑 .env 填入你的 SMTP 配置
```

 在 `~/.config/opencode/opencode.json` 的 `mcp` 部分添加：

```json
{
  "mcp": {
    "oc-sendmail": {
      "type": "local",
      "command": ["node", "/absolute/path/to/oc-sendmail/mcp-server.js"]
    }
  }
}
```

**配置说明**：
- SMTP 配置从项目根目录的 `.env` 文件读取，不需要在 `opencode.json` 中重复配置
- 默认收件人也在 `.env` 文件中通过 `DEFAULT_TO` 配置

**重启 OpenCode** 后即可使用。

### 使用方式

在 OpenCode 中使用自然语言调用：

```
"发送邮件给 xxx@xxx.com，主题是生日祝福，内容是祝你生日快乐！"
```

或者指定抄送和附件：

```
"发送邮件给 main@example.com，主题是周报，抄送 cc@example.com，附件是 /path/to/week-report.md，内容是# 周报\n\n- 完成了...\n- 计划..."
```

## 项目结构

```
oc-sendmail/
├── src/
│   ├── utils.js        # 工具函数与配置加载
│   └── mailer.js       # 核心邮件发送逻辑
├── mcp-server.js       # MCP 服务器入口
├── send-mail.js        # 命令行工具入口
├── .env                # 环境变量配置
├── .env.example        # 环境变量模板
├── package.json        # 项目配置
└── README.md           # 项目文档
```

## Markdown 支持

本项目支持发送 Markdown 格式的邮件内容，会自动将 Markdown 语法转换为美观的 HTML 邮件。

### 支持的 Markdown 语法

- **标题**：`# 标题1`, `## 标题2`, `### 标题3` 等
- **文本格式**：`**粗体**`, `*斜体*`
- **列表**：无序列表 `- 项目1`, 有序列表 `1. 项目1`
- **链接**：`[链接文本](URL)`
- **图片**：`![图片描述](URL)`
- **代码块**：三个反引号包裹的代码
- **内联代码**：单个反引号包裹的代码
- **引用**：`> 引用文本`
- **水平线**：`---` 或 `***`

### 使用示例

```markdown
# 邮件主题

**重要通知**

- 第一条要点
- 第二条要点
- 第三条要点

详细内容请查看 [OpenCode 官方网站](https://opencode.ai)。

```

## 可用工具

### send_email

在 OpenCode 中使用自然语言调用：

```
"发送邮件给 xxx@xxx.com，主题是生日祝福，内容是祝你生日快乐！"
```

参数：
- `to` (optional): 收件人邮箱地址（未提供时使用默认配置）
- `subject` (optional): 邮件主题，默认"来自 OpenCode 的邮件"
- `content` (optional): 邮件内容（支持 Markdown 格式，自动渲染为 HTML）
- `cc` (optional): CC 收件人邮箱地址数组
- `bcc` (optional): BCC 收件人邮箱地址数组  
- `attachments` (optional): 要附件的本地文件路径数组

## 默认邮箱地址配置

直接在 `.env` 中配置默认收件人：

```env
# .env 文件中配置
DEFAULT_TO=your-email@example.com
```

配置后，当你说"**发送邮件给我自己**"且不指定收件人时，系统会自动发送到这个邮箱。

### 优先级

`args.to` (显示指定收件人) > `.env.DEFAULT_TO` (默认配置) > 默认 `your-email@example.com`



## SMTP 服务器配置

本项目默认配置为网易 yeah.net SMTP 服务器。如需使用其他邮箱服务，修改 `.env` 文件：

### 网易 yeah.net (默认)
```
SMTP_HOST=smtp.yeah.net
SMTP_PORT=465
```

### 其他邮箱服务参考

- **Gmail**: `smtp.gmail.com`, 端口 `465` 或 `587`
- **QQ 邮箱**: `smtp.qq.com`, 端口 `465`
- **163 邮箱**: `smtp.163.com`, 端口 `465`

## 故障排除

### 认证失败
- 确认用户名和密码正确
- 如果开启了两步验证，需要使用授权码而非登录密码
- 在邮箱设置中开启 POP3/SMTP 服务

### 连接超时
- 检查防火墙设置
- 确认可以访问 SMTP 服务器地址和端口

### 发送失败
- 检查是否被邮箱服务器限制
- 查看详细错误信息调整配置

## 技术栈

- [Node.js](https://nodejs.org/) >= 18
- [nodemailer](https://nodemailer.com/) - 邮件发送库
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) - MCP 协议实现
- [marked](https://marked.js.org/) - Markdown 转 HTML 渲染库

## 开源协议

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

如有问题或建议，请联系作者或提交 Issue。
