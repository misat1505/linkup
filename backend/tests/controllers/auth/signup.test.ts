import { AuthControllers } from "../../../src/controllers";
import { mockRequest, mockResponse, mockUserService } from "../../utils/mocks";

describe("signupUser", () => {
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

    expect(res.status).toHaveBeenCalledWith(201);
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

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.cookie).not.toHaveBeenCalled();
  });
});
