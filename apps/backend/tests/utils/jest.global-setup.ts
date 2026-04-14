import "tsconfig-paths/register";
import { startContainer } from "./setupTests";

export default async function globalSetup() {
  await startContainer();
}
