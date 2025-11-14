import { Mastra } from "@mastra/core/mastra";
import { weekendPlannerAgent } from "./agents/weekend-planner-agent";

/**
 * Mastra 实例配置
 * 注册所有 agents、tools 和 workflows
 * 
 * 注意：在开发环境中不使用 deployer，避免构建时的依赖问题（typescript-paths）
 * deployer 只在部署时通过 mastra build 命令使用
 */
export const mastra = new Mastra({
	agents: {
		weekendPlannerAgent,
	},
	// 开发环境中不使用 deployer，避免 typescript-paths 依赖问题
	// deployer 只在部署时通过 mastra build 使用
	bundler: {
		// 将 typescript-paths 和相关部署依赖标记为 external
		externals: ["typescript-paths", "@mastra/deployer", "@mastra/deployer-cloudflare"],
		sourcemap: true,
	},
});

