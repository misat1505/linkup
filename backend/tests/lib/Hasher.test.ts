import { Hasher } from "@/lib/Hasher";

describe("Hasher", () => {
  it("hashes string correctly", () => {
    const plain = "hello world";
    const encrypted = Hasher.hash(plain);
    const hashed =
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";
    expect(encrypted).toEqual(hashed);
  });
});
