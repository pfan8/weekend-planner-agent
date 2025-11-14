import { describe, it, expect } from "vitest";
import { dateWeatherTool } from "../tools/date-weather-tool";

describe("dateWeatherTool", () => {
	it("应该能够查询今天杭州的天气", async () => {
		const result = await dateWeatherTool.execute({
			context: {
				city: "杭州",
				date: "今天",
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("date");
		expect(result).toHaveProperty("city", "杭州");
		expect(result).toHaveProperty("condition");
		expect(result).toHaveProperty("description");
	});

	it("应该能够查询这周六杭州的天气", async () => {
		const result = await dateWeatherTool.execute({
			context: {
				city: "杭州",
				date: "这周六",
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("date");
		expect(result).toHaveProperty("city", "杭州");
		expect(result).toHaveProperty("condition");
	});

	it("应该能够查询周末杭州的天气", async () => {
		const result = await dateWeatherTool.execute({
			context: {
				city: "杭州",
				date: "周末",
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("date");
		expect(result).toHaveProperty("city", "杭州");
	});

	it("应该能够查询特定日期杭州的天气", async () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 7);
		const dateStr = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, "0")}-${String(futureDate.getDate()).padStart(2, "0")}`;

		const result = await dateWeatherTool.execute({
			context: {
				city: "杭州",
				date: dateStr,
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("date", dateStr);
		expect(result).toHaveProperty("city", "杭州");
	});

	it("应该在没有提供日期时默认查询今天", async () => {
		const result = await dateWeatherTool.execute({
			context: {
				city: "杭州",
			},
			runtimeContext: {} as any,
		});

		expect(result).toHaveProperty("date");
		expect(result).toHaveProperty("city", "杭州");
	});
});

