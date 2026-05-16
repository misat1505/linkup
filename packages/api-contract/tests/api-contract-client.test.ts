import { describe, expect, it, vi } from "vitest";
import { ApiContractClient } from "../src";

describe("ApiContractClient", () => {
  it("parses response using schema", async () => {
    const mockApi = {
      request: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            firstName: "John",
            lastName: "Doe",
            photoURL: null,
            lastActive: new Date().toISOString(),
          },
        },
      }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = new ApiContractClient(mockApi as any);

    const res = await client.getSelf();

    expect(res.user.id).toBeDefined();
  });

  it("throws on invalid response", async () => {
    const mockApi = {
      request: vi.fn().mockResolvedValue({
        data: { user: { id: "bad-id" } },
      }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = new ApiContractClient(mockApi as any);

    await expect(client.getSelf()).rejects.toThrow();
  });
});
