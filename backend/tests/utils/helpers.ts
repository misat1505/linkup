import { env } from "../../src/config/env";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { User } from "../../src/types/User";

export namespace TestHelpers {
  export const createTokens = (ids: User["id"][]) => {
    return ids.map((id) =>
      TokenProcessor.encode({ userId: id }, env.ACCESS_TOKEN_SECRET)
    );
  };
}
