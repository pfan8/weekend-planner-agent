# Weekend Planner Agent

一个基于 Mastra Agent 和 Cloudflare Workers 的周末规划应用，使用 GraphQL API 提供天气查询、运动场馆搜索和旅游计划制定功能。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/llm-chat-app-template)

<!-- dash-content-start -->

## Demo

This template demonstrates how to build an AI-powered chat interface using Cloudflare Workers AI with streaming responses. It features:

- Real-time streaming of AI responses using Server-Sent Events (SSE)
- Easy customization of models and system prompts
- Support for AI Gateway integration
- Clean, responsive UI that works on mobile and desktop

## Features

- 🤖 **Mastra Agent 集成** - 使用 Mastra 框架构建智能 Agent
- 📊 **GraphQL API** - 提供 GraphQL 接口，支持查询和变更操作
- 🌤️ **天气查询** - 查询中国城市的天气信息
- 🏀 **运动场馆搜索** - 搜索适合周末运动的场馆（篮球、游泳、羽毛球等）
- 🗺️ **旅游计划** - 制定周末旅游计划，包括路线规划和景点推荐
- ⚡ **Cloudflare Workers** - 基于 Cloudflare Workers 的边缘计算部署
- 🔒 **类型安全** - 使用 TypeScript 和 Zod 确保类型安全
- 🧪 **完整测试** - 包含单元测试和集成测试
<!-- dash-content-end -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- A Cloudflare account with Workers AI access

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/cloudflare/templates.git
   cd templates/llm-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Generate Worker type definitions:
   ```bash
   npm run cf-typegen
   ```

### Development

Start a local development server:

```bash
npm run dev
```

This will start a local server at http://localhost:8787.

Note: Using Workers AI accesses your Cloudflare account even during local development, which will incur usage charges.

### Deployment

部署到 Cloudflare Workers：

```bash
npm run deploy
```

**详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)**

部署前需要：
1. 登录 Cloudflare：`npx wrangler login`
2. 设置环境变量：`npx wrangler secret put OPENAI_API_KEY`
3. 部署：`npm run deploy`

### Monitor

View real-time logs associated with any deployed Worker:

```bash
npm wrangler tail
```

## Project Structure

```
/
├── src/
│   ├── index.ts              # Main Worker entry point (GraphQL handler)
│   ├── types.ts              # TypeScript type definitions
│   ├── graphql/              # GraphQL schema and resolvers
│   │   ├── schema.ts         # GraphQL schema definition
│   │   └── resolvers.ts      # GraphQL resolvers
│   └── mastra/               # Mastra Agent configuration
│       ├── index.ts          # Mastra instance configuration
│       ├── agents/            # Agent definitions
│       │   └── weekend-planner-agent.ts
│       ├── tools/             # Agent tools
│       │   ├── date-weather-tool.ts
│       │   ├── sports-venue-tool.ts
│       │   ├── travel-plan-tool.ts
│       │   └── index.ts
│       └── __tests__/        # Unit tests
├── test/                     # Integration tests
├── wrangler.jsonc            # Cloudflare Worker configuration
├── tsconfig.json             # TypeScript configuration
├── vitest.config.ts          # Vitest test configuration
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This documentation
```

## How It Works

### Architecture

1. **GraphQL API** (`/api/chat` 或 `/graphql`): 接受 GraphQL 查询和变更请求
2. **Mastra Agent**: 处理用户请求，调用相应的工具
3. **Tools**: 
   - `dateWeatherTool`: 查询天气信息
   - `sportsVenueTool`: 搜索运动场馆
   - `travelPlanTool`: 制定旅游计划
4. **OpenAI Integration**: 使用 OpenAI API 作为 LLM 提供商

### API 使用示例

#### GraphQL Query（健康检查）

```graphql
query {
  health
}
```

#### GraphQL Mutation（聊天）

```graphql
mutation Chat($messages: [MessageInput!]!) {
  chat(messages: $messages) {
    content
  }
}
```

**Variables:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "今天杭州的天气怎么样？"
    }
  ]
}
```

### 测试

运行测试：

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test src/mastra/__tests__/weekend-planner-agent.test.ts
```

本地测试 API：

```bash
# 使用测试脚本
node test-graphql.js

# 或使用 curl
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { chat(messages: [{role: \"user\", content: \"今天杭州的天气怎么样？\"}]) { content } }"
  }'
```

## Customization

### Changing the Model

To use a different AI model, update the `MODEL_ID` constant in `src/index.ts`. You can find available models in the [Cloudflare Workers AI documentation](https://developers.cloudflare.com/workers-ai/models/).

### Using AI Gateway

The template includes commented code for AI Gateway integration, which provides additional capabilities like rate limiting, caching, and analytics.

To enable AI Gateway:

1. [Create an AI Gateway](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway) in your Cloudflare dashboard
2. Uncomment the gateway configuration in `src/index.ts`
3. Replace `YOUR_GATEWAY_ID` with your actual AI Gateway ID
4. Configure other gateway options as needed:
   - `skipCache`: Set to `true` to bypass gateway caching
   - `cacheTtl`: Set the cache time-to-live in seconds

Learn more about [AI Gateway](https://developers.cloudflare.com/ai-gateway/).

### Modifying the System Prompt

The default system prompt can be changed by updating the `SYSTEM_PROMPT` constant in `src/index.ts`.

### Styling

The UI styling is contained in the `<style>` section of `public/index.html`. You can modify the CSS variables at the top to quickly change the color scheme.

## 环境变量

在 `.dev.vars` 文件中配置本地开发环境变量：

```
OPENAI_API_KEY=your-openai-api-key
WEATHER_API_KEY=your-weather-api-key  # 可选
MAP_API_KEY=your-map-api-key          # 可选
```

**注意**: `.dev.vars` 文件不应提交到 Git。在生产环境中，使用 `wrangler secret put` 设置环境变量。

## 相关资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Mastra 文档](https://docs.mastra.ai/)
- [GraphQL 文档](https://graphql.org/)
- [OpenAI API 文档](https://platform.openai.com/docs)

## License

MIT
