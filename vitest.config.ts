import { defineConfig } from "vitest/config";
import { config } from "dotenv";

// Load environment variables from .env file
config();

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		testTimeout: 30000, // 增加超时时间到30秒，因为需要调用 OpenAI API
	},
});

