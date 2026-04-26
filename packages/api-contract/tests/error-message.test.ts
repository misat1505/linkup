import { describe, expect, it } from "vitest";
import { z } from "zod";
import { errors } from "../src/utils/error-responses";

describe("errorResponse", () => {
  it("uses default ErrorMessage schema", () => {
    const res = errors.notFound({
      description: "Not found",
    });

    expect(res.description).toBe("Not found");
    expect(res.content["application/json"].schema).toBeDefined();
  });

  it("uses custom schema when provided", () => {
    const custom = z.object({ foo: z.string() });

    const res = errors.badRequest({
      description: "Bad",
      schema: custom,
    });

    expect(res.content["application/json"].schema).toBe(custom);
  });
});
