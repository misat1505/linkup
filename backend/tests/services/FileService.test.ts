import { FileService } from "../../src/services/FileService";
import { testWithTransaction } from "../utils/testWithTransaction";

describe("FileSevice", () => {
  describe("isUserAvatar", () => {
    it("should return true if is valid user avatar", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isUserAvatar(seed.users[0].photoURL!);
        expect(result).toBeTruthy();
      });
    });

    it("should return true if is not valid user avatar", async () => {
      await testWithTransaction(async ({ tx }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isUserAvatar("767.webp");
        expect(result).toBeFalsy();
      });
    });
  });

  describe("isChatPhoto", () => {
    it("should return true if is valid chat photo", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isChatPhoto(
          "chat-photo.webp",
          seed.users[0].id
        );
        expect(result).toBeTruthy();
      });
    });

    it("should return true if is not valid chat photo", async () => {
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
    it("should return true if is valid chat message file", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const fileService = new FileService(tx);
        const result = await fileService.isChatMessage(
          "chat-message.webp",
          seed.users[0].id
        );
        expect(result).toBeTruthy();
      });
    });

    it("should return true if is not valid chat message file", async () => {
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
