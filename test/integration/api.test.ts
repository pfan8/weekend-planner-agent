import { describe, it, expect } from "vitest";
import { mastra } from "../../src/mastra";

describe("API Integration Tests", () => {
	it("应该能够通过 agent 查询杭州天气", async () => {
		const agent = mastra.getAgent("weekendPlannerAgent");
		expect(agent).toBeDefined();

		if (!agent) return;

		const userMessage = "今天杭州的天气怎么样？";

		const response = await agent.stream(userMessage);
		let content = "";

		for await (const chunk of response.textStream) {
			content += chunk;
			if (content.length > 50) break; // 获取足够的内容
		}

		expect(content.length).toBeGreaterThan(0);
	});

	it("应该能够通过 agent 查询运动场馆", async () => {
		const agent = mastra.getAgent("weekendPlannerAgent");
		expect(agent).toBeDefined();

		if (!agent) return;

		const userMessage = "杭州有哪些周末可以游泳的地方？";

		const response = await agent.stream(userMessage);
		let content = "";

		for await (const chunk of response.textStream) {
			content += chunk;
			if (content.length > 50) break;
		}

		expect(content.length).toBeGreaterThan(0);
	});

	it("应该能够通过 agent 制定旅游计划", async () => {
		const agent = mastra.getAgent("weekendPlannerAgent");
		expect(agent).toBeDefined();

		if (!agent) return;

		const userMessage = "帮我制定这周末杭州的一日游计划";

		const response = await agent.stream(userMessage);
		let content = "";

		for await (const chunk of response.textStream) {
			content += chunk;
			if (content.length > 50) break;
		}

		expect(content.length).toBeGreaterThan(0);
	});
});

