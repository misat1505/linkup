import { initReactions } from "../src/config/reactions";
import { resetDB } from "./utils/setup";

beforeAll(async () => {
  await initReactions();
});

beforeEach(async () => {
  await resetDB();
});
