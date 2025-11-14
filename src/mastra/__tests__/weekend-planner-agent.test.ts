import { describe, it, expect, beforeAll } from "vitest";
import { config } from "dotenv";
import { weekendPlannerAgent } from "../agents/weekend-planner-agent";

// 加载环境变量
config();

describe("weekendPlannerAgent", () => {
	beforeAll(() => {
		// 确保环境变量已加载
		if (!process.env.OPENAI_API_KEY) {
			throw new Error(
				"OPENAI_API_KEY is not set. Please create a .env file with your OpenAI API key.",
			);
		}
	});

	it("应该能够处理天气查询请求", async () => {
		const userMessage = "今天杭州的天气怎么样？";

		const response = await weekendPlannerAgent.stream(userMessage);
		let hasContent = false;

		for await (const chunk of response.textStream) {
			hasContent = true;
			expect(typeof chunk).toBe("string");
			break; // 只检查第一个 chunk
		}

		expect(hasContent).toBe(true);
	});

	it("应该能够处理运动场馆查询请求", async () => {
		const userMessage = "帮我找一下杭州适合周末打篮球的场馆";

		const response = await weekendPlannerAgent.stream(userMessage);
		let hasContent = false;

		for await (const chunk of response.textStream) {
			hasContent = true;
			expect(typeof chunk).toBe("string");
			break;
		}

		expect(hasContent).toBe(true);
	});

	it("应该能够处理旅游计划制定请求", async () => {
		const userMessage = "帮我制定这周末杭州的一日游计划";

		const response = await weekendPlannerAgent.stream(userMessage);
		let hasContent = false;

		for await (const chunk of response.textStream) {
			hasContent = true;
			expect(typeof chunk).toBe("string");
			break;
		}

		expect(hasContent).toBe(true);
	});

	it("应该能够处理综合规划请求", async () => {
		const userMessage = "帮我制定这周末在杭州的完整计划，包括天气、运动和旅游";

		const response = await weekendPlannerAgent.stream(userMessage);
		let hasContent = false;

		for await (const chunk of response.textStream) {
			hasContent = true;
			expect(typeof chunk).toBe("string");
			break;
		}

		expect(hasContent).toBe(true);
	});
});

