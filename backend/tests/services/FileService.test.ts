import { FileService } from "../../src/services/FileService";
import { testWithTransaction } from "../utils/testWithTransaction";

describe("FileSevice", () => {
  describe("isUserAvatar", () => {
    it("confirms valid user avatar", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isUserAvatar(seed.users[0].photoURL!);
        expect(result).toBeTruthy();
      });
    });

    it("denies invalid user avatar", async () => {
      await testWithTransaction(async ({ tx }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isUserAvatar("767.webp");
        expect(result).toBeFalsy();
      });
    });
  });

  describe("isChatPhoto", () => {
    it("confirms valid chat photo", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isChatPhoto(
          "chat-photo.webp",
          seed.users[0].id
        );
        expect(result).toBeTruthy();
      });
    });

    it("denies invalid chat photo", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isChatPhoto(
          "chat-photo-invalid.webp",
          seed.users[0].id
        );
        expect(result).toBeFalsy();
      });
    });
  });

  describe("isChatMessage", () => {
    it("confirms valid chat message file", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isChatMessage(
          "chat-message.webp",
          seed.users[0].id
        );
        expect(result).toBeTruthy();
      });
    });

    it("denies invalid chat message file", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isChatMessage(
          "chat-message-invalid.webp",
          seed.users[0].id
        );
        expect(result).toBeFalsy();
      });
    });
  });
});
