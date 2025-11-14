/**
 * Type definitions for the Mastra Agent Weekend Planner application.
 */

export interface Env {
	/**
	 * OpenAI API Key (from environment variables)
	 */
	OPENAI_API_KEY?: string;

	/**
	 * Other API keys for weather, maps, etc.
	 */
	WEATHER_API_KEY?: string;
	MAP_API_KEY?: string;
}

/**
 * Represents a chat message.
 */
export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}
