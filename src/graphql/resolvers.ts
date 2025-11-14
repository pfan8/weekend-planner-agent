import { createMastra } from "../mastra";
import type { Env } from "../types";

/**
 * GraphQL Resolvers
 * GraphQL resolver 函数签名: (parent, args, context, info)
 */
export function createRootValue(env?: Env) {
	// 创建 Mastra 实例，传入环境变量
	const mastra = createMastra(env);

	return {
		_empty: () => null,
		health: () => "ok",
		chat: async (
			args: { messages: Array<{ role: string; content: string }> },
		) => {
			const { messages } = args;

			if (!Array.isArray(messages) || messages.length === 0) {
				throw new Error("Invalid request format: messages array required");
			}

			// Get the last user message
			const lastMessage = messages[messages.length - 1];
			if (!lastMessage || lastMessage.role !== "user") {
				throw new Error("Last message must be from user");
			}

			// Get the weekend planner agent
			const agent = mastra.getAgent("weekendPlannerAgent");
			if (!agent) {
				throw new Error("Weekend planner agent not found");
			}

			// Get the last user message content
			const userMessage = lastMessage.content;

			// Generate streaming response using agent.stream()
			const response = await agent.stream(userMessage);

			// Collect all chunks into a single content string
			let fullContent = "";
			for await (const chunk of response.textStream) {
				fullContent += chunk;
			}

			return {
				content: fullContent,
			};
		},
	};
}

/**
 * 默认的 rootValue（用于向后兼容）
 * 注意：在生产环境中，应该使用 createRootValue(env) 创建
 */
export const rootValue = createRootValue();

