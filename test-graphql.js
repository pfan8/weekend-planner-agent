/**
 * GraphQL API 测试脚本
 * 用于测试 GraphQL 格式的聊天接口
 */

const API_URL = "http://localhost:8787/api/chat";

async function testGraphQLAPI() {
	console.log("🚀 测试 GraphQL API 接口:", API_URL);
	console.log("");

	// 测试 1: 健康检查查询
	console.log("1. 测试健康检查查询...");
	try {
		const healthQuery = {
			query: `
				query {
					health
				}
			`,
		};

		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(healthQuery),
		});

		const data = await response.json();
		if (data.errors) {
			console.error("❌ 健康检查失败:", data.errors);
		} else {
			console.log("✅ 健康检查成功:", data.data);
		}
	} catch (error) {
		console.error("❌ 健康检查请求失败:", error.message);
	}

	console.log("");

	// 测试 2: 聊天 Mutation
	console.log("2. 测试聊天 Mutation...");
	try {
		const chatMutation = {
			query: `
				mutation Chat($messages: [MessageInput!]!) {
					chat(messages: $messages) {
						content
					}
				}
			`,
			variables: {
				messages: [
					{
						role: "user",
						content: "今天杭州的天气怎么样？",
					},
				],
			},
		};

		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(chatMutation),
		});

		const data = await response.json();
		if (data.errors) {
			console.error("❌ 聊天请求失败:", data.errors);
		} else {
			console.log("✅ 聊天请求成功");
			console.log("📝 响应内容:");
			console.log(data.data.chat.content);
		}
	} catch (error) {
		console.error("❌ 聊天请求失败:", error.message);
	}

	console.log("");

	// 测试 3: 运动场馆查询
	console.log("3. 测试运动场馆查询...");
	try {
		const sportsQuery = {
			query: `
				mutation Chat($messages: [MessageInput!]!) {
					chat(messages: $messages) {
						content
					}
				}
			`,
			variables: {
				messages: [
					{
						role: "user",
						content: "帮我找一下杭州适合周末打篮球的场馆",
					},
				],
			},
		};

		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(sportsQuery),
		});

		const data = await response.json();
		if (data.errors) {
			console.error("❌ 运动场馆查询失败:", data.errors);
		} else {
			console.log("✅ 运动场馆查询成功");
			console.log("📝 响应内容:");
			console.log(data.data.chat.content.substring(0, 200) + "...");
		}
	} catch (error) {
		console.error("❌ 运动场馆查询失败:", error.message);
	}

	console.log("");
	console.log("✅ 所有测试完成！");
}

// 运行测试
testGraphQLAPI().catch(console.error);

