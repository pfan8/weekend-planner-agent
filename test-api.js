/**
 * 测试本地 API 接口的 Node.js 脚本
 * 使用方法: node test-api.js
 */

const BASE_URL = process.env.API_URL || "http://localhost:8787";

async function testHealthCheck() {
	console.log("1. 测试健康检查端点...");
	try {
		const response = await fetch(`${BASE_URL}/health`);
		const data = await response.json();
		console.log("✅ 健康检查成功:", data);
		return true;
	} catch (error) {
		console.error("❌ 健康检查失败:", error.message);
		return false;
	}
}

async function testChatAPI() {
	console.log("\n2. 测试聊天接口...");
	try {
		const response = await fetch(`${BASE_URL}/api/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messages: [
					{
						role: "user",
						content: "今天杭州的天气怎么样？",
					},
				],
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			console.error("❌ 请求失败:", response.status, error);
			return false;
		}

		console.log("✅ 开始接收流式响应...\n");

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let fullContent = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value, { stream: true });
			const lines = chunk.split("\n");

			for (const line of lines) {
				if (line.startsWith("data: ")) {
					try {
						const data = JSON.parse(line.slice(6));
						if (data.content) {
							process.stdout.write(data.content);
							fullContent += data.content;
						}
					} catch (e) {
						// 忽略解析错误
					}
				}
			}
		}

		console.log("\n\n✅ 响应接收完成");
		return true;
	} catch (error) {
		console.error("❌ 聊天接口测试失败:", error.message);
		return false;
	}
}

async function runTests() {
	console.log(`🚀 测试本地 API 接口: ${BASE_URL}\n`);

	const healthOk = await testHealthCheck();
	if (!healthOk) {
		console.error("\n❌ 服务可能未启动，请先运行: npm run dev");
		process.exit(1);
	}

	await testChatAPI();

	console.log("\n✅ 所有测试完成！");
}

runTests().catch(console.error);

