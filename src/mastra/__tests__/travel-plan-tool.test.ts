import { describe, it, expect } from "vitest";
import { travelPlanTool } from "../tools/travel-plan-tool";

describe("travelPlanTool", () => {
	it("应该能够制定杭州的一日游计划", async () => {
		const result = await travelPlanTool.execute({
			context: {
				destination: "杭州",
				duration: 1,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("plan");
		expect(result.plan).toHaveProperty("date");
		expect(result.plan).toHaveProperty("duration", 1);
		expect(result.plan).toHaveProperty("destination", "杭州");
		expect(result.plan).toHaveProperty("attractions");
		expect(result.plan.attractions.length).toBeGreaterThan(0);
		expect(result.plan).toHaveProperty("schedule");
	});

	it("应该能够制定杭州的两日游计划", async () => {
		const result = await travelPlanTool.execute({
			context: {
				destination: "杭州",
				duration: 2,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("plan");
		expect(result.plan).toHaveProperty("duration", 2);
		expect(result.plan).toHaveProperty("attractions");
		expect(result.plan.attractions.length).toBeGreaterThan(0);
	});

	it("应该能够制定主题旅游计划", async () => {
		const result = await travelPlanTool.execute({
			context: {
				destination: "杭州",
				attractions: ["西湖", "灵隐寺"],
				duration: 1,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("plan");
		expect(result.plan.attractions.length).toBeGreaterThanOrEqual(2);
		expect(
			result.plan.attractions.some((a) => a.name.includes("西湖") || a.name.includes("灵隐寺")),
		).toBe(true);
	});

	it("应该能够制定带出发地的旅游计划", async () => {
		const result = await travelPlanTool.execute({
			context: {
				origin: "杭州东站",
				destination: "西湖",
				duration: 1,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("plan");
		expect(result.plan).toHaveProperty("transportation");
		if (result.plan.transportation) {
			expect(result.plan.transportation.length).toBeGreaterThan(0);
		}
	});

	it("应该能够制定周末旅游计划", async () => {
		const result = await travelPlanTool.execute({
			context: {
				destination: "杭州",
				date: "这周末",
				duration: 1,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("plan");
		expect(result.plan).toHaveProperty("date");
		expect(result.plan).toHaveProperty("schedule");
		expect(result.plan.schedule.length).toBeGreaterThan(0);
	});

	it("应该能够制定多景点路线规划", async () => {
		const result = await travelPlanTool.execute({
			context: {
				destination: "杭州",
				attractions: ["西湖", "雷峰塔", "宋城"],
				duration: 1,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("plan");
		expect(result.plan.attractions.length).toBeGreaterThanOrEqual(3);
	});
});

