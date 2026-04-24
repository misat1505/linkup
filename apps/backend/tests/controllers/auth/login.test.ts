import { AuthControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("loginUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs in user with valid credentials", async () => {
    const id = uuidv4();
    const salt = "salt";

    const mockUser: UserWithCredentials = {
      id,
      firstName: "John",
      lastName: "Doe",
      login: "john_doe",
      password:
        "7a37b85c8918eac19a9089c0fa5a2ab4dce3f90528dcdeec108b23ddf3607b99",
      salt,
      photoURL: "file.jpg",
      lastActive: new Date(),
    };

    mockUserService.getUserByLogin.mockResolvedValue(mockUser);

    const req = mockRequest({
      validated: { body: { login: "john_doe", password: "password" } },
    });
    const res = mockResponse();

    await AuthControllers.login(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(res.cookie).toHaveBeenCalled();
  });

  it("fails for invalid login", async () => {
    mockUserService.getUserByLogin.mockResolvedValue(null);

    const req = mockRequest({
      validated: { body: { login: "john_doe", password: "wrong_password" } },
    });
    const res = mockResponse();

    await AuthControllers.login(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.UNAUTHORIZED,
      expect.anything(),
    );
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it("fails for invalid password", async () => {
    const mockUser: UserWithCredentials = {
      id: uuidv4(),
      firstName: "John",
      lastName: "Doe",
      login: "login1",
      password:
        "7a37b85c8918eac19a9089c0fa5a2ab4dce3f90528dcdeec108b23ddf3607b99",
      salt: "salt",
      photoURL: "file.jpg",
      lastActive: new Date(),
    };
    mockUserService.getUserByLogin.mockResolvedValue(mockUser);

    const req = mockRequest({
      validated: { body: { login: "john_doe", password: "wrong_password" } },
    });
    const res = mockResponse();

    await AuthControllers.login(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.UNAUTHORIZED,
      expect.anything(),
    );
    expect(res.cookie).not.toHaveBeenCalled();
  });
});
