"use client";
import { isServer, QueryClient } from "@tanstack/react-query";
import { makeQueryClient } from "./make-query-client";

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	if (isServer) {
		// On the server, always create a new QueryClient
		return makeQueryClient();
	} else {
		// On the browser, reuse the same QueryClient
		// so we don’t recreate it on every render
		if (!browserQueryClient) {
			browserQueryClient = makeQueryClient();
		}
		return browserQueryClient;
	}
}
