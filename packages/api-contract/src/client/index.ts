import { ClientBody } from "./types";

import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { API_CONTRACT, CONTRACT_KEYS } from "../contract";
import { extractResponseSchema } from "../utils";
import { buildFormData } from "./build-form-data";
import { ExtractResponse } from "./types";

export class ApiContractClient {
	constructor(private readonly api: AxiosInstance) {}

	private async request<
		TKey extends keyof typeof API_CONTRACT,
		TStatus extends keyof (typeof API_CONTRACT)[TKey]["responses"],
	>(
		key: TKey,
		status: TStatus,
		{ body, params, query }: { body?: unknown; params?: Record<string, string>; query?: unknown },
		asFormData = false,
	): Promise<ExtractResponse<TKey, TStatus>> {
		const contract = API_CONTRACT[key];

		const url = params
			? contract.path.replace(/{(\w+)}/g, (_, k) => params[k] ?? `{${k}}`)
			: contract.path;

		const { data: responseData } = await this.api.request({
			method: contract.method,
			url,
			data:
				body !== undefined
					? asFormData
						? // eslint-disable-next-line @typescript-eslint/no-explicit-any
							buildFormData(body as any)
						: body
					: undefined,
			params: query,
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const schema = extractResponseSchema(key, status) as any;
		return schema.parse(responseData);
	}

	// auth
	getSelf() {
		return this.request(CONTRACT_KEYS.GET_SELF, StatusCodes.OK, {});
	}
	login(args: ClientBody<typeof CONTRACT_KEYS.LOGIN>) {
		return this.request(CONTRACT_KEYS.LOGIN, StatusCodes.OK, args);
	}
	logout() {
		return this.request(CONTRACT_KEYS.LOGOUT, StatusCodes.OK, {});
	}
	refreshToken() {
		return this.request(CONTRACT_KEYS.REFRESH_TOKEN, StatusCodes.OK, {});
	}
	signup(args: ClientBody<typeof CONTRACT_KEYS.SIGNUP>) {
		return this.request(CONTRACT_KEYS.SIGNUP, StatusCodes.CREATED, args, true);
	}
	updateSelf(args: ClientBody<typeof CONTRACT_KEYS.UPDATE_SELF>) {
		return this.request(CONTRACT_KEYS.UPDATE_SELF, StatusCodes.OK, args, true);
	}

	// chats
	addUserToGroupChat(args: ClientBody<typeof CONTRACT_KEYS.ADD_USER_TO_GROUP_CHAT>) {
		return this.request(CONTRACT_KEYS.ADD_USER_TO_GROUP_CHAT, StatusCodes.CREATED, args);
	}
	createGroupChat(args: ClientBody<typeof CONTRACT_KEYS.CREATE_GROUP_CHAT>) {
		return this.request(CONTRACT_KEYS.CREATE_GROUP_CHAT, StatusCodes.CREATED, args, true);
	}
	createMessage(args: ClientBody<typeof CONTRACT_KEYS.CREATE_MESSAGE>) {
		return this.request(CONTRACT_KEYS.CREATE_MESSAGE, StatusCodes.CREATED, args, true);
	}
	createPrivateChat(args: ClientBody<typeof CONTRACT_KEYS.CREATE_PRIVATE_CHAT>) {
		return this.request(CONTRACT_KEYS.CREATE_PRIVATE_CHAT, StatusCodes.CREATED, args);
	}
	createReaction(args: ClientBody<typeof CONTRACT_KEYS.CREATE_REACTION>) {
		return this.request(CONTRACT_KEYS.CREATE_REACTION, StatusCodes.CREATED, args);
	}
	deleteSelfFromGroupChat(args: ClientBody<typeof CONTRACT_KEYS.DELETE_SELF_FROM_GROUP_CHAT>) {
		return this.request(CONTRACT_KEYS.DELETE_SELF_FROM_GROUP_CHAT, StatusCodes.OK, args);
	}
	getChatMessages(args: ClientBody<typeof CONTRACT_KEYS.GET_CHAT_MESSAGES>) {
		if (args.query.lastMessageId === null) args.query.lastMessageId = "null";
		if (args.query.responseId === null) args.query.responseId = "null";
		return this.request(CONTRACT_KEYS.GET_CHAT_MESSAGES, StatusCodes.OK, args);
	}
	getReactions() {
		return this.request(CONTRACT_KEYS.GET_REACTIONS, StatusCodes.OK, {});
	}
	getSelfChats() {
		return this.request(CONTRACT_KEYS.GET_SELF_CHATS, StatusCodes.OK, {});
	}
	updateGroupChat(args: ClientBody<typeof CONTRACT_KEYS.UPDATE_GROUP_CHAT>) {
		return this.request(CONTRACT_KEYS.UPDATE_GROUP_CHAT, StatusCodes.OK, args, true);
	}
	updateUserAlias(args: ClientBody<typeof CONTRACT_KEYS.UDPATE_USER_ALIAS>) {
		return this.request(CONTRACT_KEYS.UDPATE_USER_ALIAS, StatusCodes.OK, args);
	}

	// files
	deleteFromCache(args: ClientBody<typeof CONTRACT_KEYS.DELETE_FROM_CACHE>) {
		return this.request(CONTRACT_KEYS.DELETE_FROM_CACHE, StatusCodes.OK, args);
	}
	getCache() {
		return this.request(CONTRACT_KEYS.GET_CACHE, StatusCodes.OK, {});
	}
	getFile(args: ClientBody<typeof CONTRACT_KEYS.GET_FILE>) {
		return this.request(CONTRACT_KEYS.GET_FILE, StatusCodes.OK, args);
	}
	insertToCache(args: ClientBody<typeof CONTRACT_KEYS.INSERT_TO_CACHE>) {
		return this.request(CONTRACT_KEYS.INSERT_TO_CACHE, StatusCodes.CREATED, args, true);
	}

	// friendships
	acceptFriendship(args: ClientBody<typeof CONTRACT_KEYS.ACCEPT_FRIENDSHIP>) {
		return this.request(CONTRACT_KEYS.ACCEPT_FRIENDSHIP, StatusCodes.OK, args);
	}
	createFriendship(args: ClientBody<typeof CONTRACT_KEYS.CREATE_FRIENDSHIP>) {
		return this.request(CONTRACT_KEYS.CREATE_FRIENDSHIP, StatusCodes.CREATED, args);
	}
	deleteFriendship(args: ClientBody<typeof CONTRACT_KEYS.DELETE_FRIENDSHIP>) {
		return this.request(CONTRACT_KEYS.DELETE_FRIENDSHIP, StatusCodes.OK, args);
	}
	getUserFriendships() {
		return this.request(CONTRACT_KEYS.GET_USER_FRIENDSHIPS, StatusCodes.OK, {});
	}

	// posts
	createPost(args: ClientBody<typeof CONTRACT_KEYS.CREATE_POST>) {
		return this.request(CONTRACT_KEYS.CREATE_POST, StatusCodes.CREATED, args);
	}
	deletePost(args: ClientBody<typeof CONTRACT_KEYS.DELETE_POST>) {
		return this.request(CONTRACT_KEYS.DELETE_POST, StatusCodes.OK, args);
	}
	getPost(args: ClientBody<typeof CONTRACT_KEYS.GET_POST>) {
		return this.request(CONTRACT_KEYS.GET_POST, StatusCodes.OK, args);
	}
	getPosts(args: ClientBody<typeof CONTRACT_KEYS.GET_POSTS>) {
		if (args.query.lastPostId === null) args.query.lastPostId = "null";
		return this.request(CONTRACT_KEYS.GET_POSTS, StatusCodes.OK, args);
	}
	getUserPosts() {
		return this.request(CONTRACT_KEYS.GET_USER_POSTS, StatusCodes.OK, {});
	}
	reportPost(args: ClientBody<typeof CONTRACT_KEYS.REPORT_POST>) {
		return this.request(CONTRACT_KEYS.REPORT_POST, StatusCodes.OK, args);
	}
	updatePost(args: ClientBody<typeof CONTRACT_KEYS.UPDATE_POST>) {
		return this.request(CONTRACT_KEYS.UPDATE_POST, StatusCodes.OK, args);
	}

	// users
	searchUser(args: ClientBody<typeof CONTRACT_KEYS.SEARCH_USER>) {
		return this.request(CONTRACT_KEYS.SEARCH_USER, StatusCodes.OK, args);
	}
}
