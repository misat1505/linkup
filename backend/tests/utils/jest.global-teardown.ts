import { stopContainer } from "./setupTests";

export default async function globalTeardown() {
  await stopContainer();
}
