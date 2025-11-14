/**
 * Mastra Agent Weekend Planner
 *
 * A weekend planning application using Mastra Agent on Cloudflare Workers.
 * Provides weather queries, sports venue search, and travel planning capabilities.
 * Uses GraphQL API for chat requests.
 *
 * @license MIT
 */
import { Env } from "./types";
import { graphql } from "graphql";
import { schema } from "./graphql/schema";
import { createRootValue } from "./graphql/resolvers";

interface GraphQLRequest {
	query: string;
	variables?: Record<string, unknown>;
	operationName?: string;
}

export default {
	/**
	 * Main request handler for the Worker
	 */
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		// 将 env 中的环境变量设置到 process.env，以便 OpenAI SDK 可以访问
		// 这需要 compatibility_flags 中包含 "nodejs_compat_populate_process_env"
		if (env.OPENAI_API_KEY && typeof process !== "undefined" && process.env) {
			process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
		}
		if (env.WEATHER_API_KEY && typeof process !== "undefined" && process.env) {
			process.env.WEATHER_API_KEY = env.WEATHER_API_KEY;
		}
		if (env.MAP_API_KEY && typeof process !== "undefined" && process.env) {
			process.env.MAP_API_KEY = env.MAP_API_KEY;
		}

		const url = new URL(request.url);

		// GraphQL endpoint
		if (url.pathname === "/api/chat" || url.pathname === "/graphql") {
			// Handle POST requests for GraphQL
			if (request.method === "POST") {
				return handleGraphQLRequest(request, env);
			}

			// Method not allowed for other request types
			return new Response("Method Not Allowed", {
				status: 405,
				headers: { Allow: "POST" },
			});
		}

		// Health check endpoint (also available via GraphQL Query)
		if (url.pathname === "/health") {
			return new Response(JSON.stringify({ status: "ok" }), {
				headers: { "content-type": "application/json" },
			});
		}

		// Handle 404 for unmatched routes
		return new Response("Not found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;

/**
 * Handles GraphQL requests
 */
async function handleGraphQLRequest(
	request: Request,
	env: Env,
): Promise<Response> {
	try {
		// Parse GraphQL request
		const body = (await request.json()) as GraphQLRequest;
		const { query, variables, operationName } = body;

		if (!query || typeof query !== "string") {
			return new Response(
				JSON.stringify({
					errors: [{ message: "GraphQL query is required" }],
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// 创建 rootValue，传入 env 以便访问环境变量
		const rootValue = createRootValue(env);

		// Execute GraphQL query
		const result = await graphql({
			schema,
			source: query,
			rootValue,
			variableValues: variables,
			operationName,
			contextValue: { env },
		});

		// Return GraphQL response
		return new Response(JSON.stringify(result), {
			status: result.errors && result.errors.length > 0 ? 400 : 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("GraphQL handler error:", error);

		return new Response(
			JSON.stringify({
				errors: [
					{
						message:
							error instanceof Error
								? error.message
								: "Internal server error",
					},
				],
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
