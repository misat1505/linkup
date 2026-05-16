import { Chat } from "@packages/schemas";
import { TEST_FILENAME_PATH } from "@tests/utils/constants";
import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/test-with-transaction";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { describe, expect, it } from "vitest";

describe("[POST] /chats/group", () => {
	it("creates new group chat", async () => {
		await testWithTransaction(async ({ app, seed }) => {
			const initialChatsCount = seed.chats.length;
			const userId = seed.users[0].id;
			const token = TestHelpers.createToken(userId);

			const res = await request(app)
				.post("/chats/group")
				.set("Authorization", `Bearer ${token}`)
				.field("users[0]", userId)
				.field("users[1]", userId)
				.field("name", "chat name")
				.attach("file", TEST_FILENAME_PATH)
				.expect(StatusCodes.CREATED);

			Chat.strict().parse(res.body.chat);

			const res2 = await request(app)
				.get("/chats")
				.set("Authorization", `Bearer ${token}`)
				.expect(StatusCodes.OK);

			expect(res2.body.chats.length).toBe(initialChatsCount + 1);
			res2.body.chats.forEach((chat: unknown) => {
				Chat.strict().parse(chat);
			});
		});
	});

	it("blocks group chat creation without creator", async () => {
		await testWithTransaction(async ({ app, seed }) => {
			const userId = seed.users[0].id;
			const token = TestHelpers.createToken(userId);

			await request(app)
				.post("/chats/group")
				.set("Authorization", `Bearer ${token}`)
				.field("users[0]", seed.users[1].id)
				.field("name", "chat name")
				.expect(StatusCodes.BAD_REQUEST);
		});
	});
});
