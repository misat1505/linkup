import { Request, Response } from "express";

export const mockFriendshipService = {
  acceptFriendship: jest.fn(),
  createFriendship: jest.fn(),
  deleteFriendship: jest.fn(),
  getUserFriendships: jest.fn(),
};

export const mockPostService = {
  createPost: jest.fn(),
  deletePost: jest.fn(),
  getPost: jest.fn(),
  getUserPosts: jest.fn(),
  reportPost: jest.fn(),
  updatePost: jest.fn(),
  sanitizePost: jest.fn(),
};

export const mockFileStorage = {
  copyFile: jest.fn(),
  deleteAllFilesInDirectory: jest.fn(),
  deleteFile: jest.fn(),
  getSignedUrl: jest.fn(),
  listFiles: jest.fn(),
  uploadFile: jest.fn(),
};

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
        fileStorage: mockFileStorage,
        postService: mockPostService,
        friendshipService: mockFriendshipService,
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
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
}
