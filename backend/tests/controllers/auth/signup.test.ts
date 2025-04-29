import { AuthControllers } from "../../../src/controllers";
import { mockRequest, mockResponse, mockUserService } from "../../utils/mocks";

describe("signupUser", () => {
  it("should sign up a new user", async () => {
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

  it("should not sign up a user with an existing login", async () => {
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
