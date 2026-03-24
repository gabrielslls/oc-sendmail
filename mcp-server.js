// Load .env from project root directory (absolute path)
const path = require('path');
const dotenv = require('dotenv');
const projectRoot = __dirname;
dotenv.config({ path: path.join(projectRoot, '.env') });

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { sendEmail } = require('./src/mailer');

// 创建服务器实例
const server = new Server(
  {
    name: 'oc-sendmail',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// 邮件发送工具定义 - 动态从 .env 读取 DEFAULT_TO 插入描述
const defaultTo = process.env.DEFAULT_TO;
let toolDescription = 'Send an email via SMTP server';
let toDescription = 'Recipient email address (default: from configuration)';

if (defaultTo) {
  toolDescription = `Send an email via SMTP server. When the user says "send to myself" or "send email to me", use "${defaultTo}" as the recipient email address.`;
  toDescription = `Recipient email address. When the user asks to send to yourself, use: ${defaultTo}`;
}

const sendEmailTool = {
  name: 'send_email',
  description: toolDescription,
  inputSchema: {
    type: 'object',
    properties: {
      to: {
        type: 'string',
        description: toDescription
      },
      subject: {
        type: 'string',
        description: 'Email subject'
      },
      content: {
        type: 'string',
        description: 'Email content (Markdown support)'
      },
      cc: {
        type: 'array',
        items: { type: 'string' },
        description: 'CC recipients email addresses'
      },
      bcc: {
        type: "array",
        items: { type: "string" },
        description: "BCC recipients email addresses"
      },
      attachments: {
        type: "array",
        items: { type: "string" },
        description: "List of file paths to attach to the email"
      }
    },
    required: []
  }
};

// 处理工具列表请求
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [sendEmailTool]
  };
});

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'send_email') {
    try {
      const result = await sendEmail({
        to: args.to,
        subject: args.subject,
        text: args.content,
        cc: args.cc,
        bcc: args.bcc,
        attachments: args.attachments
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            })
          }
        ]
      };
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: false,
          error: `Unknown tool: ${name}`
        })
      }
    ]
  };
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('oc-sendmail MCP Server started');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});