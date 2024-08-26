import { FileService } from "../../src/services/FileService";

describe("FileSevice", () => {
  describe("isUserAvatar", () => {
    it("should return true if is valid user avatar", async () => {
      const result = await FileService.isUserAvatar(
        "65ee3504-123f-4ccb-b6c9-97f8e302b40d.webp"
      );
      expect(result).toBe(true);
    });

    it("should return true if is not valid user avatar", async () => {
      const result = await FileService.isUserAvatar("767.webp");
      expect(result).toBe(false);
    });
  });

  describe("isChatPhoto", () => {
    it("should return true if is valid chat photo", async () => {
      const result = await FileService.isChatPhoto(
        "chat-photo.webp",
        "3daf7676-ec0f-4548-85a7-67b4382166d4"
      );
      expect(result).toBe(true);
    });

    it("should return true if is not valid chat photo", async () => {
      const result = await FileService.isChatPhoto(
        "chat-photo-invalid.webp",
        "3daf7676-ec0f-4548-85a7-67b4382166d4"
      );
      expect(result).toBe(false);
    });
  });

  describe("isChatMessage", () => {
    it("should return true if is valid chat message file", async () => {
      const result = await FileService.isChatMessage(
        "chat-message.webp",
        "3daf7676-ec0f-4548-85a7-67b4382166d4"
      );
      expect(result).toBe(true);
    });

    it("should return true if is not valid chat message file", async () => {
      const result = await FileService.isChatMessage(
        "chat-message-invalid.webp",
        "3daf7676-ec0f-4548-85a7-67b4382166d4"
      );
      expect(result).toBe(false);
    });
  });
});
