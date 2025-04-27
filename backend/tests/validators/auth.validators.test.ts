import { validate } from "../../src/middlewares/validate";
import { loginRules, signupRules } from "../../src/validators/auth.validator";
import { mockRequest, mockResponse } from "../utils/mocks";

describe("Auth validators", () => {
  describe("Login validation rules", () => {
    it("passes with correct data", async () => {
      const req = mockRequest({ body: { login: "login1", password: "pass1" } });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(loginRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("fails with data of bad types", async () => {
      const req = mockRequest({ body: { login: 11111, password: 22222 } });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(loginRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(2);
    });

    it("fails with no data", async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(loginRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(2);
    });

    it("fails with data too short", async () => {
      const req = mockRequest({ body: { login: "logi", password: "pass" } });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(loginRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(2);
    });

    it("fails with data too long", async () => {
      const req = mockRequest({
        body: { login: "l".repeat(51), password: "pass1" },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(loginRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });
  });

  describe("Signup validation rules", () => {
    it("passes with correct data", async () => {
      const req = mockRequest({
        body: {
          firstName: "John",
          lastName: "Doe",
          login: "login1",
          password: "pass1",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(signupRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("fails with no data", async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(signupRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();
      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(4);
    });

    it("fails with bad data types", async () => {
      const req = mockRequest({
        body: {
          firstName: 11111,
          lastName: 22222,
          login: 33333,
          password: 44444,
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(signupRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();
      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(4);
    });

    it("fails with too short data", async () => {
      const req = mockRequest({
        body: { firstName: "", lastName: "", login: "", password: "" },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(signupRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();
      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(4);
    });

    it("fails with too long data", async () => {
      const req = mockRequest({
        body: {
          firstName: "a".repeat(51),
          lastName: "a".repeat(51),
          login: "a".repeat(51),
          password: "pass1",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(signupRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();
      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(3);
    });
  });
});
