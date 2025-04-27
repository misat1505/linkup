import { v4 as uuidv4 } from "uuid";
import { UserWithCredentials } from "../../../src/types/User";
import { mockRequest, mockResponse, mockUserService } from "../../utils/mocks";
import { AuthControllers } from "../../../src/controllers";

describe("getUser", () => {
  it("should get a user by id", async () => {
    const id = uuidv4();
    const salt = "salt";

    const mockUser: UserWithCredentials = {
      id,
      firstName: "John",
      lastName: "Doe",
      login: "john_doe",
      password: "hashed_password",
      salt,
      photoURL: "file.jpg",
      lastActive: new Date(),
    };

    mockUserService.getUser.mockResolvedValue(mockUser);

    const req = mockRequest({ body: { token: { userId: id } } });
    const res = mockResponse();

    await AuthControllers.getSelf(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if user not found", async () => {
    mockUserService.getUser.mockResolvedValue(null);

    const req = mockRequest({ body: { token: { userId: 1 } } });
    const res = mockResponse();

    await AuthControllers.getSelf(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
