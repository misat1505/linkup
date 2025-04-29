import { validate } from "../../src/middlewares/validate";
import { mockRequest, mockResponse } from "../utils/mocks";
import { z } from "zod";

describe("validate middleware", () => {
  const UserDTO = z
    .object({
      name: z.string(),
    })
    .strict();
  type UserDTO = z.infer<typeof UserDTO>;

  const mockNextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should go to next function if validation successful", async () => {
    const middleware = validate({ body: UserDTO });

    const req = mockRequest({ body: { name: "Bob" } });
    const res = mockResponse();

    await middleware(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });

  it("returns errors if validation not successful", async () => {
    const middleware = validate({ body: UserDTO });

    const req = mockRequest({ body: {} });
    const res = mockResponse();

    await middleware(req, res, mockNextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNextFunction).not.toHaveBeenCalled();
  });
});
