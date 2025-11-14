# Cloudflare Workers 部署指南

本文档说明如何将 `weekend-planner-agent` 部署到 Cloudflare Workers。

## 前置要求

1. **Cloudflare 账户**
   - 注册并登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 确保账户已启用 Workers 服务

2. **Wrangler CLI**
   - 已安装 Wrangler CLI（项目已包含在 devDependencies 中）
   - 如果未全局安装，可以使用 `npx wrangler` 运行命令

3. **API Keys**
   - OpenAI API Key（必需）
   - 其他 API Keys（可选，根据工具需求）

## 部署步骤

### 方法一：使用 Wrangler CLI 部署（推荐）

#### 1. 登录 Cloudflare

```bash
npx wrangler login
```

这会打开浏览器，要求你授权 Wrangler 访问你的 Cloudflare 账户。

#### 2. 配置环境变量（Secrets）

在 Cloudflare Workers 中，敏感信息（如 API Keys）应该使用 Secrets 存储，而不是直接写在代码中。

**设置 OpenAI API Key（必需）：**

```bash
npx wrangler secret put OPENAI_API_KEY
```

系统会提示你输入 API Key，输入后按 Enter。

**设置其他可选的环境变量：**

```bash
# 天气 API Key（如果使用）
npx wrangler secret put WEATHER_API_KEY

# 地图 API Key（如果使用）
npx wrangler secret put MAP_API_KEY
```

**查看已设置的 Secrets：**

```bash
npx wrangler secret list
```

#### 3. 更新 wrangler.jsonc 配置

确保 `wrangler.jsonc` 中的配置正确：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "mastra-weekend-planner",  // Worker 名称
  "main": "src/index.ts",
  "compatibility_date": "2025-10-08",
  "compatibility_flags": ["nodejs_compat", "nodejs_compat_populate_process_env"],
  "observability": {
    "enabled": true  // 启用可观测性（日志和监控）
  },
  "upload_source_maps": true,  // 上传 source maps 用于调试
  "vars": {
    "NODE_ENV": "production"  // 生产环境
  }
}
```

#### 4. 部署到 Cloudflare

```bash
npm run deploy
```

或者直接使用：

```bash
npx wrangler deploy
```

部署成功后，你会看到类似以下的输出：

```
✨  Built successfully
✨  Successfully published your Worker to the following routes:
  - weekend-planner-agent.pfan8.workers.dev
```

#### 5. 验证部署

部署后，你的 Worker 会有一个默认的 URL：
- `https://mastra-weekend-planner.<your-subdomain>.workers.dev`

你可以使用以下命令测试：

```bash
# 测试健康检查
curl https://mastra-weekend-planner.<your-subdomain>.workers.dev/health

# 测试 GraphQL API
curl -X POST https://mastra-weekend-planner.<your-subdomain>.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { health }"
  }'
```

### 方法二：通过 Cloudflare Dashboard 部署

#### 1. 创建 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Create Worker**
5. 输入 Worker 名称：`mastra-weekend-planner`
6. 点击 **Deploy**

#### 2. 配置环境变量

1. 在 Worker 详情页面，点击 **Settings** 标签
2. 滚动到 **Variables** 部分
3. 在 **Environment Variables** 中添加：
   - `OPENAI_API_KEY`: 你的 OpenAI API Key
   - `WEATHER_API_KEY`: （可选）天气 API Key
   - `MAP_API_KEY`: （可选）地图 API Key

#### 3. 上传代码

由于代码在 GitHub 仓库中，你可以：

**选项 A：使用 GitHub 集成**
1. 在 Worker 详情页面，点击 **Settings** → **Integrations**
2. 连接你的 GitHub 仓库
3. 配置自动部署

**选项 B：手动上传**
1. 在本地运行 `npm run build`（如果需要）
2. 在 Dashboard 的 **Quick Edit** 中粘贴代码
3. 或者使用 Wrangler CLI 部署

## 配置自定义域名（可选）

### 1. 添加自定义路由

在 `wrangler.jsonc` 中添加路由配置：

```jsonc
{
  "routes": [
    {
      "pattern": "api.yourdomain.com/graphql",
      "zone_name": "yourdomain.com"
    }
  ]
}
```

### 2. 通过 Dashboard 配置

1. 在 Worker 详情页面，点击 **Triggers** 标签
2. 在 **Routes** 部分，点击 **Add route**
3. 输入你的域名和路径，例如：`api.yourdomain.com/*`

## 环境管理

### 创建生产环境和预览环境

在 `wrangler.jsonc` 中配置多个环境：

```jsonc
{
  "name": "mastra-weekend-planner",
  "main": "src/index.ts",
  "compatibility_date": "2025-10-08",
  "compatibility_flags": ["nodejs_compat", "nodejs_compat_populate_process_env"],
  
  // 生产环境配置
  "vars": {
    "NODE_ENV": "production"
  },
  
  // 预览环境配置
  "env": {
    "preview": {
      "vars": {
        "NODE_ENV": "preview"
      }
    },
    "staging": {
      "vars": {
        "NODE_ENV": "staging"
      }
    }
  }
}
```

部署到特定环境：

```bash
# 部署到生产环境（默认）
npx wrangler deploy

# 部署到预览环境
npx wrangler deploy --env preview

# 部署到 staging 环境
npx wrangler deploy --env staging
```

## 监控和日志

### 查看实时日志

```bash
npx wrangler tail
```

这会显示 Worker 的实时日志输出。

### 在 Dashboard 中查看

1. 进入 Worker 详情页面
2. 点击 **Logs** 标签
3. 查看实时日志和历史日志

### 查看指标

1. 进入 Worker 详情页面
2. 查看 **Metrics** 部分，包括：
   - 请求数量
   - 错误率
   - CPU 时间
   - 响应时间

## 更新和回滚

### 更新 Worker

```bash
# 修改代码后，重新部署
npm run deploy
```

### 查看部署历史

```bash
npx wrangler deployments list
```

### 回滚到之前的版本

```bash
# 查看部署列表
npx wrangler deployments list

# 回滚到特定版本
npx wrangler rollback <deployment-id>
```

## 常见问题

### 1. 环境变量未生效

确保使用 `wrangler secret put` 设置 Secrets，而不是在 `wrangler.jsonc` 的 `vars` 中设置敏感信息。

### 2. 构建错误

检查 `compatibility_flags` 是否正确设置，特别是 `nodejs_compat`。

### 3. API Key 未找到

确保：
- 使用 `wrangler secret put` 设置了 Secrets
- 在代码中通过 `env.OPENAI_API_KEY` 访问（不是 `process.env`）

### 4. 部署超时

检查 Worker 的 CPU 时间限制。免费计划有 10ms CPU 时间限制，付费计划有更多资源。

## 性能优化

### 1. 启用缓存

对于不经常变化的数据，可以添加缓存头：

```typescript
return new Response(JSON.stringify(result), {
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=3600"
  }
});
```

### 2. 使用 KV 存储

对于需要持久化存储的数据，可以使用 Cloudflare KV：

```bash
# 创建 KV namespace
npx wrangler kv:namespace create "CACHE"

# 在 wrangler.jsonc 中配置
{
  "kv_namespaces": [
    { "binding": "CACHE", "id": "your-kv-namespace-id" }
  ]
}
```

### 3. 优化 Bundle 大小

确保只导入必要的依赖，避免打包过大的 bundle。

## 安全建议

1. **永远不要**在代码中硬编码 API Keys
2. **使用** `wrangler secret put` 管理敏感信息
3. **启用** Cloudflare 的安全功能（WAF、DDoS 保护等）
4. **限制** API 访问频率（如果需要）
5. **使用** HTTPS（Cloudflare Workers 默认启用）

## 相关资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Workers 最佳实践](https://developers.cloudflare.com/workers/learning/best-practices/)
- [Mastra 文档](https://docs.mastra.ai/)

## 部署检查清单

- [ ] 已登录 Cloudflare（`wrangler login`）
- [ ] 已设置 `OPENAI_API_KEY` Secret
- [ ] 已更新 `wrangler.jsonc` 配置
- [ ] 已测试本地运行（`npm run dev`）
- [ ] 已部署到 Cloudflare（`npm run deploy`）
- [ ] 已验证部署的 Worker 正常工作
- [ ] 已配置自定义域名（可选）
- [ ] 已设置监控和告警（可选）

