import { TokenProcessor, JwtPayload } from "../../src/lib/TokenProcessor";
import { v4 as uuidv4 } from "uuid";

describe("TokenProcessor", () => {
  const payload: JwtPayload = { userId: uuidv4() };

  it("encodes correctly", () => {
    const encoded = TokenProcessor.encode(payload);
    expect(typeof encoded).toBe("string");
  });

  describe("decodes correctly", () => {
    it("without options", () => {
      const encoded = TokenProcessor.encode(payload);
      const decoded = TokenProcessor.decode(encoded);
      expect(decoded?.userId).toEqual(payload.userId);
    });

    it("with options", () => {
      const encoded = TokenProcessor.encode(payload, { expiresIn: "1h" });
      const decoded = TokenProcessor.decode(encoded);
      expect(decoded?.userId).toEqual(payload.userId);
    });

    it("returns null if not valid", () => {
      const encoded = TokenProcessor.encode(payload, { expiresIn: "0" });
      const decoded = TokenProcessor.decode(encoded);
      expect(decoded).toBeNull();
    });
  });
});
