import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * 运动场馆查询工具
 * 查询美团/大众点评的运动场馆信息
 */
export const sportsVenueTool = createTool({
	id: "sports-venue",
	description:
		"查询指定城市的运动场馆信息，包括篮球馆、游泳馆、羽毛球馆等。可以按运动类型、区域进行筛选。",
	inputSchema: z.object({
		city: z.string().describe("城市名称，例如：杭州、北京、上海"),
		sportType: z
			.string()
			.optional()
			.describe("运动类型，例如：篮球、游泳、羽毛球、乒乓球、健身等。如果不提供，返回综合运动场馆"),
		area: z.string().optional().describe("区域名称，例如：西湖区、上城区等。如果不提供，搜索整个城市"),
		limit: z.number().optional().default(5).describe("返回结果数量，默认5个"),
	}),
	outputSchema: z.object({
		venues: z.array(
			z.object({
				name: z.string().describe("场馆名称"),
				address: z.string().describe("地址"),
				rating: z.number().optional().describe("评分（1-5分）"),
				price: z.string().optional().describe("价格信息"),
				openHours: z.string().optional().describe("营业时间"),
				phone: z.string().optional().describe("联系电话"),
				distance: z.string().optional().describe("距离信息"),
			}),
		),
		total: z.number().describe("找到的场馆总数"),
	}),
	execute: async ({ context }) => {
		const { city, sportType, area, limit = 5 } = context;

		try {
			const venues = await searchSportsVenues(city, sportType, area, limit);

			return {
				venues,
				total: venues.length,
			};
		} catch (error) {
			throw new Error(
				`查询 ${city} 的运动场馆失败: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	},
});

/**
 * 搜索运动场馆
 * 注意：这里使用模拟数据，实际使用时需要集成美团/大众点评 API
 */
async function searchSportsVenues(
	city: string,
	sportType?: string,
	area?: string,
	limit: number = 5,
): Promise<
	Array<{
		name: string;
		address: string;
		rating?: number;
		price?: string;
		openHours?: string;
		phone?: string;
		distance?: string;
	}>
> {
	// 这里应该调用真实的 API
	// 美团/大众点评 API 需要申请，或者使用网页爬取
	// 注意遵守使用条款和 robots.txt

	// 模拟数据（用于测试）
	const mockVenues: Array<{
		name: string;
		address: string;
		rating?: number;
		price?: string;
		openHours?: string;
		phone?: string;
		distance?: string;
	}> = [];

	// 根据运动类型生成模拟数据
	const sportTypes = sportType
		? [sportType]
		: ["篮球", "游泳", "羽毛球", "乒乓球", "健身"];

	for (let i = 0; i < Math.min(limit, sportTypes.length); i++) {
		const type = sportTypes[i];
		const areaName = area || "市区";

		mockVenues.push({
			name: `${city}${areaName}${type}馆${i + 1}`,
			address: `${city}${areaName}体育路${100 + i}号`,
			rating: 4.0 + Math.random() * 1.0,
			price: `${30 + i * 10}元/小时`,
			openHours: "09:00-22:00",
			phone: `0571-${8000 + i}${1000 + i}`,
			distance: `${1 + i * 2}公里`,
		});
	}

	return mockVenues;
}

