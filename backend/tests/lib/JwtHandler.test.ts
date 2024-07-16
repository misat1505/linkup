import { JwtHandler, JwtPayload } from "../../src/lib/JwtHandler";
import { v4 as uuidv4 } from "uuid";

describe("JwtHandler", () => {
  const payload: JwtPayload = { userId: uuidv4() };

  it("encodes correctly", () => {
    const encoded = JwtHandler.encode(payload);
    expect(typeof encoded).toBe("string");
  });

  describe("decodes correctly", () => {
    it("without options", () => {
      const encoded = JwtHandler.encode(payload);
      const decoded = JwtHandler.decode(encoded);
      expect(decoded?.userId).toEqual(payload.userId);
    });

    it("with options", () => {
      const encoded = JwtHandler.encode(payload, { expiresIn: "1h" });
      const decoded = JwtHandler.decode(encoded);
      expect(decoded?.userId).toEqual(payload.userId);
    });

    it("returns null if not valid", () => {
      const encoded = JwtHandler.encode(payload, { expiresIn: "0" });
      const decoded = JwtHandler.decode(encoded);
      expect(decoded).toBeNull();
    });
  });
});
