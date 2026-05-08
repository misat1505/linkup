import { startContainer } from "./setup-tests";

export default async function globalSetup() {
  await startContainer();
}
