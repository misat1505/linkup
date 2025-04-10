import { PostRecommendationService } from "../../src/services/PostRecommendationService";
import { PostService } from "../../src/services/PostService";
import { FriendshipService } from "../../src/services/FriendshipService";
import { Post } from "../../src/types/Post";
import { User } from "../../src/types/User";

jest.mock("../../src/services/PostService");
jest.mock("../../src/services/FriendshipService");
jest.mock("../../src/lib/Prisma");

const USER: User = {
  id: "user1",
  firstName: "Test",
  lastName: "User",
  photoURL: null,
  lastActive: new Date(),
};

const FRIEND1: User = {
  id: "friend1",
  firstName: "Friend",
  lastName: "One",
  photoURL: null,
  lastActive: new Date(),
};

const FRIEND2: User = {
  id: "friend2",
  firstName: "Friend",
  lastName: "Two",
  photoURL: null,
  lastActive: new Date(),
};

const STRANGER: User = {
  id: "stranger1",
  firstName: "Strange",
  lastName: "Person",
  photoURL: null,
  lastActive: new Date(),
};

describe("PostRecommendationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getLastPost", () => {
    it("should return null when postId is null", async () => {
      const result = await PostRecommendationService.getLastPost(null);
      expect(result).toBeNull();
      expect(PostService.getPost).not.toHaveBeenCalled();
    });

    it("should return post when found", async () => {
      const mockPost = {
        id: "post1",
        author: USER,
        createdAt: new Date(),
      } as Post;
      (PostService.getPost as jest.Mock).mockResolvedValue(mockPost);

      const result = await PostRecommendationService.getLastPost("post1");
      expect(result).toBe(mockPost);
      expect(PostService.getPost).toHaveBeenCalledWith("post1");
    });

    it("should throw error when post not found", async () => {
      (PostService.getPost as jest.Mock).mockResolvedValue(null);

      await expect(
        PostRecommendationService.getLastPost("post1")
      ).rejects.toThrow("Last post not found.");
    });
  });

  describe("getUserFriends", () => {
    it("should return friend IDs", async () => {
      const mockFriendships = [
        { status: "ACCEPTED", acceptor: USER, requester: FRIEND1 },
        { status: "ACCEPTED", acceptor: FRIEND2, requester: USER },
        { status: "PENDING", acceptor: USER, requester: STRANGER },
      ];
      (FriendshipService.getUserFriendships as jest.Mock).mockResolvedValue(
        mockFriendships
      );

      const result = await PostRecommendationService.getUserFriends(USER.id);
      expect(result).toEqual([FRIEND1.id, FRIEND2.id]);
    });

    it("should return empty array when no accepted friendships", async () => {
      (FriendshipService.getUserFriendships as jest.Mock).mockResolvedValue([]);
      const result = await PostRecommendationService.getUserFriends(USER.id);
      expect(result).toEqual([]);
    });
  });

  describe("fetchFriendsPostsOnly", () => {
    it("should fetch friends posts with lastPost filter", async () => {
      const mockPost = {
        id: "post1",
        createdAt: new Date(),
        author: FRIEND1,
      } as Post;
      const fetchSpy = jest
        .spyOn(PostRecommendationService, "fetchFriendsPostsOnly")
        .mockResolvedValue([mockPost]);
      (PostService.sanitizePost as jest.Mock).mockReturnValue(mockPost);

      const result = await PostRecommendationService.fetchFriendsPostsOnly(
        mockPost,
        [FRIEND1.id],
        10
      );
      expect(result).toEqual([mockPost]);
      expect(fetchSpy).toHaveBeenCalledWith(mockPost, [FRIEND1.id], 10);
      fetchSpy.mockRestore();
    });
  });

  describe("fetchNonFriendsPostsOnly", () => {
    it("should fetch non-friends posts with deadline", async () => {
      const mockPost = {
        id: "post1",
        author: STRANGER,
        createdAt: new Date(),
      } as Post;
      const fetchSpy = jest
        .spyOn(PostRecommendationService, "fetchNonFriendsPostsOnly")
        .mockResolvedValue([mockPost]);
      (PostService.sanitizePost as jest.Mock).mockReturnValue(mockPost);

      const deadline = new Date();
      const result = await PostRecommendationService.fetchNonFriendsPostsOnly(
        deadline,
        [FRIEND1.id],
        USER.id,
        10
      );
      expect(result).toEqual([mockPost]);
      expect(fetchSpy).toHaveBeenCalledWith(
        deadline,
        [FRIEND1.id],
        USER.id,
        10
      );
      fetchSpy.mockRestore();
    });
  });

  describe("getOthersPostsCreatedAtFilter", () => {
    it("should return undefined when no lastPost", () => {
      const result = PostRecommendationService.getOthersPostsCreatedAtFilter(
        null,
        [],
        [FRIEND1.id]
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined when friendsPosts exist", () => {
      const result = PostRecommendationService.getOthersPostsCreatedAtFilter(
        { id: "post1", author: STRANGER, createdAt: new Date() } as Post,
        [{ id: "post2", author: FRIEND1, createdAt: new Date() } as Post],
        [FRIEND1.id]
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined when lastPost is from friend", () => {
      const result = PostRecommendationService.getOthersPostsCreatedAtFilter(
        { id: "post1", author: FRIEND1, createdAt: new Date() } as Post,
        [],
        [FRIEND1.id]
      );
      expect(result).toBeUndefined();
    });

    it("should return date filter when lastPost is from non-friend", () => {
      const date = new Date();
      const result = PostRecommendationService.getOthersPostsCreatedAtFilter(
        { id: "post1", author: STRANGER, createdAt: date } as Post,
        [],
        [FRIEND1.id]
      );
      expect(result).toEqual({ lt: date });
    });
  });

  describe("getRecommendedPosts", () => {
    it("should return only non-friends posts when lastPost is from non-friend", async () => {
      const lastPost = {
        id: "post1",
        author: STRANGER,
        createdAt: new Date(),
      } as Post;
      const getLastPostSpy = jest
        .spyOn(PostRecommendationService, "getLastPost")
        .mockResolvedValue(lastPost);
      const getUserFriendsSpy = jest
        .spyOn(PostRecommendationService, "getUserFriends")
        .mockResolvedValue([FRIEND1.id]);
      const mockPosts = [
        {
          id: "post2",
          author: STRANGER,
          createdAt: new Date(),
        } as Post,
      ];
      const fetchNonFriendsSpy = jest
        .spyOn(PostRecommendationService, "fetchNonFriendsPostsOnly")
        .mockResolvedValue(mockPosts);

      const result = await PostRecommendationService.getRecommendedPosts(
        USER.id,
        "post1",
        10
      );
      expect(result).toEqual(mockPosts);
      expect(getLastPostSpy).toHaveBeenCalledWith("post1");
      expect(getUserFriendsSpy).toHaveBeenCalledWith(USER.id);
      expect(fetchNonFriendsSpy).toHaveBeenCalledWith(
        lastPost.createdAt,
        [FRIEND1.id],
        USER.id,
        10
      );

      getLastPostSpy.mockRestore();
      getUserFriendsSpy.mockRestore();
      fetchNonFriendsSpy.mockRestore();
    });

    it("should return only friends posts when limit is reached", async () => {
      const getLastPostSpy = jest
        .spyOn(PostRecommendationService, "getLastPost")
        .mockResolvedValue(null);
      const getUserFriendsSpy = jest
        .spyOn(PostRecommendationService, "getUserFriends")
        .mockResolvedValue([FRIEND1.id]);
      const mockPosts = [
        {
          id: "post1",
          author: FRIEND1,
          createdAt: new Date(),
        } as Post,
      ];
      const fetchFriendsSpy = jest
        .spyOn(PostRecommendationService, "fetchFriendsPostsOnly")
        .mockResolvedValue(mockPosts);
      const fetchNonFriendsSpy = jest
        .spyOn(PostRecommendationService, "fetchNonFriendsPostsOnly")
        .mockResolvedValue([]);
      (PostService.sanitizePost as jest.Mock).mockImplementation(
        (post) => post
      );

      const result = await PostRecommendationService.getRecommendedPosts(
        USER.id,
        null,
        1
      );

      expect(result).toHaveLength(1);
      expect(result[0].author.id).toBe(FRIEND1.id);
      expect(result[0]).toEqual(mockPosts[0]);
      expect(getLastPostSpy).toHaveBeenCalledWith(null);
      expect(getUserFriendsSpy).toHaveBeenCalledWith(USER.id);
      expect(fetchFriendsSpy).toHaveBeenCalledWith(null, [FRIEND1.id], 1);
      expect(fetchNonFriendsSpy).not.toHaveBeenCalled();

      getLastPostSpy.mockRestore();
      getUserFriendsSpy.mockRestore();
      fetchFriendsSpy.mockRestore();
      fetchNonFriendsSpy.mockRestore();
    });

    it("should return mix of friends and non-friends posts", async () => {
      const getLastPostSpy = jest
        .spyOn(PostRecommendationService, "getLastPost")
        .mockResolvedValue(null);
      const getUserFriendsSpy = jest
        .spyOn(PostRecommendationService, "getUserFriends")
        .mockResolvedValue([FRIEND1.id]);
      const friendPost = {
        id: "post1",
        author: { ...FRIEND1 },
        createdAt: new Date(),
      } as Post;
      const strangerPost = {
        id: "post2",
        author: STRANGER,
        createdAt: new Date(),
      } as Post;
      const fetchFriendsSpy = jest
        .spyOn(PostRecommendationService, "fetchFriendsPostsOnly")
        .mockResolvedValue([friendPost]);
      const fetchNonFriendsSpy = jest
        .spyOn(PostRecommendationService, "fetchNonFriendsPostsOnly")
        .mockResolvedValue([strangerPost]);

      const result = await PostRecommendationService.getRecommendedPosts(
        USER.id,
        null,
        2
      );
      expect(result).toHaveLength(2);
      expect(result).toContain(friendPost);
      expect(result).toContain(strangerPost);
      expect(getLastPostSpy).toHaveBeenCalledWith(null);
      expect(getUserFriendsSpy).toHaveBeenCalledWith(USER.id);
      expect(fetchFriendsSpy).toHaveBeenCalledWith(null, [FRIEND1.id], 2);

      getLastPostSpy.mockRestore();
      getUserFriendsSpy.mockRestore();
      fetchFriendsSpy.mockRestore();
      fetchNonFriendsSpy.mockRestore();
    });
  });
});
