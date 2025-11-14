#!/bin/bash

# 测试本地 API 接口的脚本
# 使用方法: ./test-api.sh

BASE_URL="${1:-http://localhost:8787}"

echo "🚀 测试本地 API 接口: $BASE_URL"
echo ""

# 测试健康检查
echo "1. 测试健康检查端点..."
curl -s "$BASE_URL/health" | jq '.' || echo "❌ 健康检查失败"
echo ""

# 测试聊天接口
echo "2. 测试聊天接口..."
curl -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "今天杭州的天气怎么样？"
      }
    ]
  }' \
  --no-buffer \
  | head -20

echo ""
echo ""
echo "✅ 测试完成！"
echo ""
echo "💡 提示："
echo "   - 如果服务未启动，请先运行: npm run dev"
echo "   - 查看完整流式响应，可以去掉 | head -20"
echo "   - 使用不同的测试用例，修改 JSON 中的 content 字段"

