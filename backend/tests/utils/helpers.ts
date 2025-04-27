import { env } from "../../src/config/env";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { User } from "../../src/types/User";

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
