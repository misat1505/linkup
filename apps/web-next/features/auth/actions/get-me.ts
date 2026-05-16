"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { cache } from "react";

export const getMeCached = cache(async () => {
	const res = await apiContractClient.getSelf();
	return res.user;
});
