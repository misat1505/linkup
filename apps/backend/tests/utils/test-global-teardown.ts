import { stopContainer } from "./setup-tests";

export default async function globalTeardown() {
  await stopContainer();
}
