import { AuthControllers } from "@/controllers";
import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("signupUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signs up new user successfully", async () => {
    mockUserService.isLoginTaken.mockResolvedValue(false);

    const req = mockRequest({
      validated: {
        body: {
          firstName: "John",
          lastName: "Doe",
          login: "john_doe",
          password: "password123",
        },
      },
    });
    const res = mockResponse();

    await AuthControllers.signup(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CREATED,
      expect.anything(),
    );
    expect(res.cookie).toHaveBeenCalled();
  });

  it("fails for existing login", async () => {
    mockUserService.isLoginTaken.mockResolvedValue(true);

    const req = mockRequest({
      validated: {
        body: {
          firstName: "John",
          lastName: "Doe",
          login: "john_doe",
          password: "password123",
        },
      },
    });
    const res = mockResponse();

    await AuthControllers.signup(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CONFLICT,
      expect.anything(),
    );
    expect(res.cookie).not.toHaveBeenCalled();
  });
});
