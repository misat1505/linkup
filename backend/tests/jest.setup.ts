// import { initReactions } from "../src/config/reactions";
// import { resetDB } from "./utils/setup";

beforeAll(async () => {
  jest.clearAllMocks();
  console.log("seed db");
  // await initReactions();
});

beforeEach(async () => {
  console.log("transaction setup");
  // await resetDB();
});
