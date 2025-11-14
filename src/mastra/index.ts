import { Mastra } from "@mastra/core/mastra";
import { createWeekendPlannerAgent } from "./agents/weekend-planner-agent";
import type { Env } from "../types";

/**
 * 创建 Mastra 实例
 * 注册所有 agents、tools 和 workflows
 * 
 * @param env - Cloudflare Workers 环境变量
 * 
 * 注意：在开发环境中不使用 deployer，避免构建时的依赖问题（typescript-paths）
 * deployer 只在部署时通过 mastra build 命令使用
 */
export function createMastra(env?: Env) {
	return new Mastra({
		agents: {
			weekendPlannerAgent: createWeekendPlannerAgent(env?.OPENAI_API_KEY),
		},
		// 开发环境中不使用 deployer，避免 typescript-paths 依赖问题
		// deployer 只在部署时通过 mastra build 使用
		bundler: {
			// 将 typescript-paths 和相关部署依赖标记为 external
			externals: ["typescript-paths", "@mastra/deployer", "@mastra/deployer-cloudflare"],
			sourcemap: true,
		},
	});
}

/**
 * 默认的 Mastra 实例（用于向后兼容和测试）
 * 注意：在生产环境中，应该使用 createMastra(env) 创建
 */
export const mastra = createMastra();

