import { env } from "@/config/env";
import { TokenProcessor, JwtPayload } from "@/lib/TokenProcessor";
import { v4 as uuidv4 } from "uuid";

describe("TokenProcessor", () => {
  const payload: JwtPayload = { userId: uuidv4() };

  it("encodes token correctly", () => {
    const encoded = TokenProcessor.encode(payload, env.ACCESS_TOKEN_SECRET);
    expect(typeof encoded).toBe("string");
  });

  describe("decodes token correctly", () => {
    it("without options", () => {
      const encoded = TokenProcessor.encode(payload, env.ACCESS_TOKEN_SECRET);
      const decoded = TokenProcessor.decode(encoded, env.ACCESS_TOKEN_SECRET);
      expect(decoded?.userId).toEqual(payload.userId);
    });

    it("with options", () => {
      const encoded = TokenProcessor.encode(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      const decoded = TokenProcessor.decode(encoded, env.ACCESS_TOKEN_SECRET);
      expect(decoded?.userId).toEqual(payload.userId);
    });

    it("returns null if not valid", () => {
      const encoded = TokenProcessor.encode(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: "0",
      });
      const decoded = TokenProcessor.decode(encoded, env.ACCESS_TOKEN_SECRET);
      expect(decoded).toBeNull();
    });

    it("doesn't decode access token with refresh token secret", () => {
      const encoded = TokenProcessor.encode(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: "0",
      });
      const decoded = TokenProcessor.decode(encoded, env.REFRESH_TOKEN_SECRET);
      expect(decoded).toBeNull();
    });
  });
});
