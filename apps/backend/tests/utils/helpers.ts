import { env } from "@/config/env";
import { TokenProcessor } from "@/lib/TokenProcessor";
import { User } from "@packages/schemas";

export const TestHelpers = {
  createToken: (id: User["id"], secret = env.ACCESS_TOKEN_SECRET) =>
    TokenProcessor.encode({ userId: id }, secret),

  createTokens: (ids: User["id"][], secret = env.ACCESS_TOKEN_SECRET) => {
    return ids.map((id) => TestHelpers.createToken(id, secret));
  },
};
