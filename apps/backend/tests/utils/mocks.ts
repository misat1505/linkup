import { Request, Response } from "express";
import { vi } from "vitest";

export const mockPostRecommendationService = {
  fetchFriendsPostsOnly: vi.fn(),
  fetchNonFriendsPostsOnly: vi.fn(),
  getLastPost: vi.fn(),
  getRecommendedPosts: vi.fn(),
  getUserFriends: vi.fn(),
};

export const mockFileService = {
  isChatMessage: vi.fn(),
  isChatPhoto: vi.fn(),
  isUserAvatar: vi.fn(),
};

export const mockChatService = {
  addUserToChat: vi.fn(),
  createGroupChat: vi.fn(),
  createMessage: vi.fn(),
  createPrivateChat: vi.fn(),
  createReactionToMessage: vi.fn(),
  deleteFromChat: vi.fn(),
  getChatById: vi.fn(),
  getChatMessages: vi.fn(),
  getChatType: vi.fn(),
  getPostChatMessages: vi.fn(),
  getPrivateChatByUserIds: vi.fn(),
  getUserChats: vi.fn(),
  isMessageInChat: vi.fn(),
  isUserInChat: vi.fn(),
  updateAlias: vi.fn(),
  updateGroupChat: vi.fn(),
};

export const mockFriendshipService = {
  acceptFriendship: vi.fn(),
  createFriendship: vi.fn(),
  deleteFriendship: vi.fn(),
  getUserFriendships: vi.fn(),
};

export const mockPostService = {
  createPost: vi.fn(),
  deletePost: vi.fn(),
  getPost: vi.fn(),
  getUserPosts: vi.fn(),
  reportPost: vi.fn(),
  updatePost: vi.fn(),
  sanitizePost: vi.fn(),
};

export const mockFileStorage = {
  copyFile: vi.fn(),
  deleteAllFilesInDirectory: vi.fn(),
  deleteFile: vi.fn(),
  getSignedUrl: vi.fn().mockResolvedValue("https://signed-url.com/file"),
  listFiles: vi.fn(),
  uploadFile: vi.fn(),
};

export const mockUserService = {
  searchUsers: vi.fn(),
  updateUser: vi.fn(),
  isLoginTaken: vi.fn(),
  insertUser: vi.fn(),
  getUserByLogin: vi.fn(),
  getUser: vi.fn(),
  updateLastActive: vi.fn(),
};

export function mockRequest(data: Partial<Request> = {}): Request {
  return {
    app: {
      services: {
        userService: mockUserService,
        fileStorage: mockFileStorage,
        postService: mockPostService,
        friendshipService: mockFriendshipService,
        chatService: mockChatService,
        fileService: mockFileService,
        postRecommendationService: mockPostRecommendationService,
      },
    },
    t: vi.fn(),
    ...data,
  } as unknown as Request;
}

export function mockResponse(): Response {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
}
