import { StatusCodes } from "http-status-codes";
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

  it("proceeds to next function on successful validation", async () => {
    const middleware = validate({ body: UserDTO });

    const req = mockRequest({ body: { name: "Bob" } });
    const res = mockResponse();

    await middleware(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });

  it("returns errors on failed validation", async () => {
    const middleware = validate({ body: UserDTO });

    const req = mockRequest({ body: {} });
    const res = mockResponse();

    await middleware(req, res, mockNextFunction);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockNextFunction).not.toHaveBeenCalled();
  });
});
