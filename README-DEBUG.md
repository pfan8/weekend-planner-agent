# 本地调试指南

## 启动本地服务

### 方法 1: 使用 npm 脚本（推荐）

```bash
npm run dev
```

服务将在 `http://localhost:8787` 启动。

### 方法 2: 使用 Wrangler 直接启动

```bash
npx wrangler dev
```

## 调试配置

### 在 VS Code 中调试

1. **调试 Wrangler Dev Server**（推荐）
   - 在代码中设置断点
   - 按 `F5` 或点击调试面板
   - 选择 "Debug Wrangler Dev Server"
   - 等待服务启动（终端会显示 "Ready on http://localhost:8787"）
   - 发送请求到 API，断点会被触发

2. **手动附加调试器**
   - 在一个终端运行: `npx wrangler dev --inspector-port 9229`
   - 在 VS Code 中选择 "Debug Wrangler Dev Server" 配置
   - 点击启动调试

## 测试接口

### 方法 1: 使用测试脚本（Node.js）

```bash
node test-api.js
```

### 方法 2: 使用测试脚本（Bash）

```bash
./test-api.sh
```

### 方法 3: 使用 curl

```bash
# 健康检查
curl http://localhost:8787/health

# 测试聊天接口
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "今天杭州的天气怎么样？"
      }
    ]
  }'
```

### 方法 4: 使用 Postman 或 Insomnia

1. 创建 POST 请求到 `http://localhost:8787/api/chat`
2. 设置 Header: `Content-Type: application/json`
3. 设置 Body (JSON):
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

## 测试用例示例

### 1. 天气查询
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

### 2. 运动场馆查询
```json
{
  "messages": [
    {
      "role": "user",
      "content": "帮我找一下杭州适合周末打篮球的场馆"
    }
  ]
}
```

### 3. 旅游计划制定
```json
{
  "messages": [
    {
      "role": "user",
      "content": "帮我制定这周末杭州的一日游计划"
    }
  ]
}
```

### 4. 综合规划
```json
{
  "messages": [
    {
      "role": "user",
      "content": "帮我制定这周末在杭州的完整计划，包括天气、运动和旅游"
    }
  ]
}
```

## 环境变量

确保 `.dev.vars` 文件包含必要的环境变量：

```
OPENAI_API_KEY=your-api-key-here
```

Wrangler 会自动从 `.dev.vars` 文件加载环境变量。

## 常见问题

### 1. 服务启动失败
- 检查 `.dev.vars` 文件是否存在
- 确认 `OPENAI_API_KEY` 已设置
- 检查端口 8787 是否被占用

### 2. API 返回错误
- 查看终端中的错误日志
- 检查环境变量是否正确加载
- 确认 OpenAI API key 有效

### 3. 断点不触发
- 确保使用 "Debug Wrangler Dev Server" 配置
- 检查 source maps 是否启用
- 确认代码已保存

## 查看日志

Wrangler 会在终端中显示所有日志，包括：
- 请求日志
- 错误信息
- 控制台输出（console.log）

