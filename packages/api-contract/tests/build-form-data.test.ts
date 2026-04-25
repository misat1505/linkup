import { buildFormData } from "../src/client/build-form-data";

describe("buildFormData", () => {
  it("skips null and undefined", () => {
    const fd = buildFormData({
      a: null,
      b: undefined,
      c: "ok",
    });

    expect(fd.has("a")).toBe(false);
    expect(fd.has("b")).toBe(false);
    expect(fd.get("c")).toBe("ok");
  });

  it("handles arrays", () => {
    const file1 = new File(["a"], "a.txt");
    const file2 = new File(["b"], "b.txt");

    const fd = buildFormData({
      files: [file1, file2],
    });

    const values = fd.getAll("files");
    expect(values).toEqual([file1, file2]);
  });

  it("stringifies primitives", () => {
    const fd = buildFormData({
      num: 123,
      bool: true,
    });

    expect(fd.get("num")).toBe("123");
    expect(fd.get("bool")).toBe("true");
  });
});
