import { StatusCodes } from "http-status-codes";
import { describe, expect, it } from "vitest";
import { CONTRACT_KEYS, extractResponseSchema } from "../src";

describe("extractResponseSchema", () => {
  it("extracts schema for valid response", () => {
    const schema = extractResponseSchema(
      CONTRACT_KEYS.GET_SELF,
      StatusCodes.OK,
    );

    expect(schema).toBeDefined();
  });

  it("returns error message on error codes", () => {
    const schema = extractResponseSchema(
      CONTRACT_KEYS.GET_SELF,
      StatusCodes.NOT_FOUND,
    );

    expect(() => schema.parse({ message: "foo" })).not.toThrow();
  });
});
