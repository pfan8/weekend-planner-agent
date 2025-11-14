import { describe, it, expect } from "vitest";
import { sportsVenueTool } from "../tools/sports-venue-tool";

describe("sportsVenueTool", () => {
	it("应该能够查询杭州的篮球场馆", async () => {
		const result = await sportsVenueTool.execute({
			context: {
				city: "杭州",
				sportType: "篮球",
				limit: 3,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("venues");
		expect(result.venues.length).toBeGreaterThan(0);
		expect(result.venues[0]).toHaveProperty("name");
		expect(result.venues[0]).toHaveProperty("address");
	});

	it("应该能够查询杭州的游泳场馆", async () => {
		const result = await sportsVenueTool.execute({
			context: {
				city: "杭州",
				sportType: "游泳",
				limit: 3,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("venues");
		expect(result.venues.length).toBeGreaterThan(0);
	});

	it("应该能够查询杭州的羽毛球场馆", async () => {
		const result = await sportsVenueTool.execute({
			context: {
				city: "杭州",
				sportType: "羽毛球",
				limit: 3,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("venues");
		expect(result.venues.length).toBeGreaterThan(0);
	});

	it("应该能够按区域查询运动场馆", async () => {
		const result = await sportsVenueTool.execute({
			context: {
				city: "杭州",
				area: "西湖区",
				sportType: "篮球",
				limit: 3,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("venues");
		expect(result.venues.length).toBeGreaterThan(0);
	});

	it("应该能够查询综合运动场馆", async () => {
		const result = await sportsVenueTool.execute({
			context: {
				city: "杭州",
				limit: 5,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("venues");
		expect(result.venues.length).toBeGreaterThan(0);
		expect(result).toHaveProperty("total");
	});
});

