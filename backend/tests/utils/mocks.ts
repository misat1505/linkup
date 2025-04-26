import { Request, Response } from "express";

export const mockUserService = {
  searchUsers: jest.fn(),
  updateUser: jest.fn(),
  isLoginTaken: jest.fn(),
  insertUser: jest.fn(),
  getUserByLogin: jest.fn(),
  getUser: jest.fn(),
  updateLastActive: jest.fn(),
};

export function mockRequest(data: Partial<Request> = {}): Request {
  return {
    app: {
      services: {
        userService: mockUserService,
      },
    },
    t: jest.fn(),
    ...data,
  } as unknown as Request;
}

export function mockResponse(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
