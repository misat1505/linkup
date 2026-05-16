import { Chat } from "@packages/schemas";
import { API_URL } from "../config";

export type Filter =
	| { type: "avatar" }
	| { type: "cache" }
	| { type: "chat-photo"; id: Chat["id"] }
	| { type: "chat-message"; id: Chat["id"] };

export function buildFileURL(baseUrl: string | null, filter: Filter) {
	try {
		if (!baseUrl) return "";

		const url = new URL(`${API_URL}/files/${baseUrl}`);
		const searchParams = new URLSearchParams();

		searchParams.set("filter", filter.type);
		if (filter.type === "chat-photo" || filter.type === "chat-message") {
			searchParams.set("chat", filter.id);
		}

		url.search = searchParams.toString();

		return url.toString();
	} catch {
		return "";
	}
}
