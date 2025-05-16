import { env } from "@/config/env";
import { TokenProcessor } from "@/lib/TokenProcessor";
import { User } from "@/types/User";

export namespace TestHelpers {
  export const createToken = (
    id: User["id"],
    secret = env.ACCESS_TOKEN_SECRET
  ) => TokenProcessor.encode({ userId: id }, secret);

  export const createTokens = (
    ids: User["id"][],
    secret = env.ACCESS_TOKEN_SECRET
  ) => {
    return ids.map((id) => createToken(id, secret));
  };
}
