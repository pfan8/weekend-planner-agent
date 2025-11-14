import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * 旅游计划制定工具
 * 查询旅游信息、地图信息，制定周末旅游计划
 */
export const travelPlanTool = createTool({
	id: "travel-plan",
	description:
		"制定旅游计划，包括路线规划、景点推荐、交通信息等。支持一日游、两日游等多种行程安排。",
	inputSchema: z.object({
		origin: z.string().optional().describe("出发地，例如：杭州东站、西湖区等"),
		destination: z.string().describe("目的地或城市，例如：西湖、灵隐寺、北京等"),
		date: z
			.string()
			.optional()
			.describe("日期，格式：YYYY-MM-DD 或相对日期（如：这周末、下周六）。如果不提供，默认为这周末"),
		duration: z
			.number()
			.optional()
			.default(1)
			.describe("行程天数，默认1天"),
		preferences: z
			.array(z.string())
			.optional()
			.describe("偏好，例如：['自然风光', '历史文化', '美食', '购物']"),
		attractions: z
			.array(z.string())
			.optional()
			.describe("指定要游览的景点，例如：['西湖', '雷峰塔', '灵隐寺']"),
	}),
	outputSchema: z.object({
		plan: z.object({
			date: z.string().describe("行程日期"),
			duration: z.number().describe("行程天数"),
			destination: z.string().describe("目的地"),
			attractions: z
				.array(
					z.object({
						name: z.string().describe("景点名称"),
						address: z.string().describe("地址"),
						description: z.string().describe("景点描述"),
						visitTime: z.string().describe("建议游览时间"),
						route: z.string().optional().describe("到达路线"),
					}),
				)
				.describe("景点列表"),
			transportation: z
				.array(
					z.object({
						from: z.string().describe("出发地"),
						to: z.string().describe("目的地"),
						method: z.string().describe("交通方式（地铁、公交、打车等）"),
						duration: z.string().describe("预计时间"),
						route: z.string().optional().describe("具体路线"),
					}),
				)
				.optional()
				.describe("交通安排"),
			schedule: z
				.array(
					z.object({
						time: z.string().describe("时间"),
						activity: z.string().describe("活动内容"),
						location: z.string().describe("地点"),
					}),
				)
				.describe("时间安排"),
		}),
	}),
	execute: async ({ context }) => {
		const {
			origin,
			destination,
			date,
			duration = 1,
			preferences = [],
			attractions = [],
		} = context;

		try {
			const plan = await createTravelPlan(
				origin,
				destination,
				date,
				duration,
				preferences,
				attractions,
			);

			return {
				plan,
			};
		} catch (error) {
			throw new Error(
				`制定旅游计划失败: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	},
});

/**
 * 创建旅游计划
 * 注意：这里使用模拟数据，实际使用时需要集成地图 API 和旅游信息 API
 */
async function createTravelPlan(
	origin: string | undefined,
	destination: string,
	date: string | undefined,
	duration: number,
	preferences: string[],
	attractions: string[],
): Promise<{
	date: string;
	duration: number;
	destination: string;
	attractions: Array<{
		name: string;
		address: string;
		description: string;
		visitTime: string;
		route?: string;
	}>;
	transportation?: Array<{
		from: string;
		to: string;
		method: string;
		duration: string;
		route?: string;
	}>;
	schedule: Array<{
		time: string;
		activity: string;
		location: string;
	}>;
}> {
	// 解析日期
	const targetDate = parseDate(date || "这周末");
	const dateStr = formatDate(targetDate);

	// 获取目的地信息（这里应该调用地图 API 获取真实数据）
	// 推荐使用高德地图 API 或百度地图 API

	// 生成景点列表
	const defaultAttractions = ["西湖", "雷峰塔", "灵隐寺", "宋城", "千岛湖"];
	const selectedAttractions =
		attractions.length > 0 ? attractions : defaultAttractions.slice(0, duration * 2);

	const attractionList = selectedAttractions.map((name, index) => {
		// 这里应该调用地图 API 获取真实地址和路线
		return {
			name,
			address: `${destination}${name}景区`,
			description: `${name}是${destination}的著名景点，值得一游`,
			visitTime: `${2 + index}小时`,
			route: origin ? `从${origin}乘坐地铁/公交约${30 + index * 20}分钟` : undefined,
		};
	});

	// 生成交通安排
	const transportation = origin
		? [
				{
					from: origin,
					to: destination,
					method: "地铁/公交",
					duration: "约30-60分钟",
					route: `从${origin}出发，乘坐地铁1号线至${destination}站`,
				},
			]
		: undefined;

	// 生成时间安排
	const schedule: Array<{ time: string; activity: string; location: string }> = [];
	for (let day = 0; day < duration; day++) {
		schedule.push(
			{
				time: "09:00",
				activity: "出发前往目的地",
				location: origin || destination,
			},
			{
				time: "10:00-12:00",
				activity: `游览${selectedAttractions[day * 2] || "景点1"}`,
				location: selectedAttractions[day * 2] || destination,
			},
			{
				time: "12:00-13:30",
				activity: "午餐",
				location: destination,
			},
			{
				time: "14:00-17:00",
				activity: `游览${selectedAttractions[day * 2 + 1] || "景点2"}`,
				location: selectedAttractions[day * 2 + 1] || destination,
			},
			{
				time: "18:00",
				activity: "晚餐",
				location: destination,
			},
		);
	}

	return {
		date: dateStr,
		duration,
		destination,
		attractions: attractionList,
		transportation,
		schedule,
	};
}

/**
 * 解析日期字符串
 */
function parseDate(dateStr: string): Date {
	const today = new Date();
	const date = new Date(today);

	if (dateStr === "这周末" || dateStr === "本周末") {
		const dayOfWeek = today.getDay();
		const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
		date.setDate(today.getDate() + daysUntilSaturday);
		return date;
	}

	if (dateStr.includes("周六") || dateStr.includes("星期六")) {
		const dayOfWeek = today.getDay();
		const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
		date.setDate(today.getDate() + daysUntilSaturday);
		return date;
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
		return new Date(dateStr);
	}

	// 默认返回这周六
	const dayOfWeek = today.getDay();
	const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
	date.setDate(today.getDate() + daysUntilSaturday);
	return date;
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

