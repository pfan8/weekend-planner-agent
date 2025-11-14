import { mastra } from "../mastra";

/**
 * GraphQL Resolvers
 * GraphQL resolver 函数签名: (parent, args, context, info)
 */
export const rootValue = {
	_empty: () => null,
	health: () => "ok",
	chat: async (
		args: { messages: Array<{ role: string; content: string }> },
		context: { env?: unknown },
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

