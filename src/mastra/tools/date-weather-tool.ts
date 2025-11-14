import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * 日期和天气查询工具
 * 支持查询中国城市的天气信息
 */
export const dateWeatherTool = createTool({
	id: "date-weather",
	description: "查询中国城市的天气信息和日期。支持查询当前天气、未来天气预报，以及特定日期的天气情况。",
	inputSchema: z.object({
		city: z.string().describe("城市名称，例如：杭州、北京、上海"),
		date: z
			.string()
			.optional()
			.describe(
				"日期，格式：YYYY-MM-DD 或相对日期（如：今天、明天、这周六、下周末）。如果不提供，默认为今天",
			),
	}),
	outputSchema: z.object({
		date: z.string().describe("查询的日期"),
		city: z.string().describe("城市名称"),
		temperature: z.number().optional().describe("温度（摄氏度）"),
		feelsLike: z.number().optional().describe("体感温度（摄氏度）"),
		humidity: z.number().optional().describe("湿度（百分比）"),
		windSpeed: z.number().optional().describe("风速（公里/小时）"),
		windDirection: z.string().optional().describe("风向"),
		condition: z.string().describe("天气状况（如：晴、多云、雨等）"),
		description: z.string().describe("天气描述"),
	}),
	execute: async ({ context }) => {
		const { city, date } = context;

		try {
			// 解析日期
			const targetDate = parseDate(date || "今天");
			const dateStr = formatDate(targetDate);

			// 使用和风天气 API（免费版）
			// 注意：实际使用时需要申请 API key
			const weatherData = await getWeatherData(city, targetDate);

			return {
				date: dateStr,
				city: city,
				temperature: weatherData.temperature,
				feelsLike: weatherData.feelsLike,
				humidity: weatherData.humidity,
				windSpeed: weatherData.windSpeed,
				windDirection: weatherData.windDirection,
				condition: weatherData.condition,
				description: weatherData.description,
			};
		} catch (error) {
			throw new Error(
				`获取 ${city} 的天气信息失败: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	},
});

/**
 * 解析日期字符串
 */
function parseDate(dateStr: string): Date {
	const today = new Date();
	const date = new Date(today);

	// 处理相对日期
	if (dateStr === "今天" || dateStr === "今日") {
		return today;
	}
	if (dateStr === "明天" || dateStr === "明日") {
		date.setDate(today.getDate() + 1);
		return date;
	}
	if (dateStr === "后天") {
		date.setDate(today.getDate() + 2);
		return date;
	}

	// 处理"这周六"、"下周末"等
	if (dateStr.includes("周六") || dateStr.includes("星期六")) {
		const dayOfWeek = today.getDay();
		const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
		date.setDate(today.getDate() + daysUntilSaturday);
		return date;
	}
	if (dateStr.includes("周日") || dateStr.includes("星期天") || dateStr.includes("星期日")) {
		const dayOfWeek = today.getDay();
		const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
		date.setDate(today.getDate() + daysUntilSunday);
		return date;
	}
	if (dateStr.includes("周末")) {
		// 返回这周六
		const dayOfWeek = today.getDay();
		const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
		date.setDate(today.getDate() + daysUntilSaturday);
		return date;
	}

	// 处理标准日期格式 YYYY-MM-DD
	if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
		return new Date(dateStr);
	}

	// 默认返回今天
	return today;
}

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * 获取天气数据
 * 注意：这里使用模拟数据，实际使用时需要集成真实的天气 API
 */
async function getWeatherData(
	city: string,
	date: Date,
): Promise<{
	temperature: number;
	feelsLike: number;
	humidity: number;
	windSpeed: number;
	windDirection: string;
	condition: string;
	description: string;
}> {
	// 这里应该调用真实的天气 API
	// 推荐使用和风天气 API: https://dev.qweather.com/
	// 或者心知天气 API: https://www.seniverse.com/

	// 模拟 API 调用
	// 实际实现时，需要：
	// 1. 申请天气 API key
	// 2. 使用城市名称获取经纬度
	// 3. 使用经纬度和日期获取天气数据

	// 临时返回模拟数据（用于测试）
	const isToday = formatDate(date) === formatDate(new Date());
	const baseTemp = isToday ? 22 : 20 + Math.floor(Math.random() * 10);

	return {
		temperature: baseTemp,
		feelsLike: baseTemp - 2,
		humidity: 60 + Math.floor(Math.random() * 20),
		windSpeed: 10 + Math.floor(Math.random() * 10),
		windDirection: ["北", "南", "东", "西", "东北", "西北", "东南", "西南"][
			Math.floor(Math.random() * 8)
		],
		condition: ["晴", "多云", "阴", "小雨"][Math.floor(Math.random() * 4)],
		description: `${city}${formatDate(date)}的天气情况`,
	};
}

