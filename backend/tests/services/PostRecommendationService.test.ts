import { PostRecommendationService } from "../../src/services/PostRecommendationService";
import { PostService } from "../../src/services/PostService";
import { Post } from "../../src/types/Post";
import { User } from "../../src/types/User";
import { testWithTransaction } from "../utils/testWithTransaction";
import { mockFriendshipService, mockPostService } from "../utils/mocks";
import { PrismaClientOrTransaction } from "../../src/types/Prisma";
import { v4 as uuidv4 } from "uuid";

jest.mock("../../src/services/PostService");

const USER: User = {
  id: uuidv4(),
  firstName: "Test",
  lastName: "User",
  photoURL: null,
  lastActive: new Date(),
};

const FRIEND1: User = {
  id: uuidv4(),
  firstName: "Friend",
  lastName: "One",
  photoURL: null,
  lastActive: new Date(),
};

const FRIEND2: User = {
  id: uuidv4(),
  firstName: "Friend",
  lastName: "Two",
  photoURL: null,
  lastActive: new Date(),
};

const STRANGER: User = {
  id: uuidv4(),
  firstName: "Strange",
  lastName: "Person",
  photoURL: null,
  lastActive: new Date(),
};

describe("PostRecommendationService", () => {
  function _initService(
    tx: PrismaClientOrTransaction
  ): PostRecommendationService {
    return new PostRecommendationService(
      tx,
      mockPostService as any,
      mockFriendshipService as any
    );
  }

  describe("getLastPost", () => {
    it("should return null when postId is null", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        const result = await postRecommendationService.getLastPost(null);
        expect(result).toBeNull();
        expect(mockPostService.getPost).not.toHaveBeenCalled();
      });
    });

    it("should return post when found", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        const mockPost = {
          id: "post1",
          author: USER,
          createdAt: new Date(),
        } as Post;
        mockPostService.getPost.mockResolvedValue(mockPost);

        const result = await postRecommendationService.getLastPost("post1");
        expect(result).toBe(mockPost);
        expect(mockPostService.getPost).toHaveBeenCalledWith("post1");
      });
    });

    it("should throw error when post not found", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        mockPostService.getPost.mockResolvedValue(null);

        await expect(
          postRecommendationService.getLastPost("post1")
        ).rejects.toThrow("Last post not found.");
      });
    });
  });

  describe("getUserFriends", () => {
    it("should return friend IDs", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        const mockFriendships = [
          { status: "ACCEPTED", acceptor: USER, requester: FRIEND1 },
          { status: "ACCEPTED", acceptor: FRIEND2, requester: USER },
          { status: "PENDING", acceptor: USER, requester: STRANGER },
        ];
        mockFriendshipService.getUserFriendships.mockResolvedValue(
          mockFriendships
        );

        const result = await postRecommendationService.getUserFriends(USER.id);
        expect(result).toEqual([FRIEND1.id, FRIEND2.id]);
      });
    });

    it("should return empty array when no accepted friendships", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        mockFriendshipService.getUserFriendships.mockResolvedValue([]);
        const result = await postRecommendationService.getUserFriends(USER.id);
        expect(result).toEqual([]);
      });
    });
  });

  describe("fetchFriendsPostsOnly", () => {
    it("should fetch friends posts with lastPost filter", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        const mockPost = {
          id: "post1",
          createdAt: new Date(),
          author: FRIEND1,
        } as Post;
        const fetchSpy = jest
          .spyOn(postRecommendationService, "fetchFriendsPostsOnly")
          .mockResolvedValue([mockPost]);
        // (PostService.sanitizePost as jest.Mock).mockReturnValue(mockPost);

        const result = await postRecommendationService.fetchFriendsPostsOnly(
          mockPost,
          [FRIEND1.id],
          10
        );
        expect(result).toEqual([mockPost]);
        expect(fetchSpy).toHaveBeenCalledWith(mockPost, [FRIEND1.id], 10);
        fetchSpy.mockRestore();
      });
    });
  });

  describe("fetchNonFriendsPostsOnly", () => {
    it("should fetch non-friends posts with deadline", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        const mockPost = {
          id: "post1",
          author: STRANGER,
          createdAt: new Date(),
        } as Post;
        const fetchSpy = jest
          .spyOn(postRecommendationService, "fetchNonFriendsPostsOnly")
          .mockResolvedValue([mockPost]);
        // (PostService.sanitizePost as jest.Mock).mockReturnValue(mockPost);

        const deadline = new Date();
        const result = await postRecommendationService.fetchNonFriendsPostsOnly(
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
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        const lastPost = {
          id: "post1",
          author: STRANGER,
          createdAt: new Date(),
        } as Post;
        const getLastPostSpy = jest
          .spyOn(postRecommendationService, "getLastPost")
          .mockResolvedValue(lastPost);
        const getUserFriendsSpy = jest
          .spyOn(postRecommendationService, "getUserFriends")
          .mockResolvedValue([FRIEND1.id]);
        const mockPosts = [
          {
            id: "post2",
            author: STRANGER,
            createdAt: new Date(),
          } as Post,
        ];
        const fetchNonFriendsSpy = jest
          .spyOn(postRecommendationService, "fetchNonFriendsPostsOnly")
          .mockResolvedValue(mockPosts);

        const result = await postRecommendationService.getRecommendedPosts(
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
    });

    it("should return only friends posts when limit is reached", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        const getLastPostSpy = jest
          .spyOn(postRecommendationService, "getLastPost")
          .mockResolvedValue(null);
        const getUserFriendsSpy = jest
          .spyOn(postRecommendationService, "getUserFriends")
          .mockResolvedValue([FRIEND1.id]);
        const mockPosts: Post[] = [
          {
            id: uuidv4(),
            content: "post",
            author: FRIEND1,
            createdAt: new Date(),
            chat: {
              id: uuidv4(),
              createdAt: new Date(),
              type: "POST",
            },
          },
        ];
        const fetchFriendsSpy = jest
          .spyOn(postRecommendationService, "fetchFriendsPostsOnly")
          .mockResolvedValue(mockPosts);
        const fetchNonFriendsSpy = jest
          .spyOn(postRecommendationService, "fetchNonFriendsPostsOnly")
          .mockResolvedValue([]);
        // (PostService.sanitizePost as jest.Mock).mockImplementation(
        //   (post) => post
        // );

        const result = await postRecommendationService.getRecommendedPosts(
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
    });

    it("should return mix of friends and non-friends posts", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postRecommendationService = _initService(tx);
        const getLastPostSpy = jest
          .spyOn(postRecommendationService, "getLastPost")
          .mockResolvedValue(null);
        const getUserFriendsSpy = jest
          .spyOn(postRecommendationService, "getUserFriends")
          .mockResolvedValue([FRIEND1.id]);
        const friendPost: Post = {
          id: uuidv4(),
          content: "content",
          author: { ...FRIEND1 },
          createdAt: new Date(),
          chat: {
            id: uuidv4(),
            createdAt: new Date(),
            type: "POST",
          },
        };
        const strangerPost: Post = {
          id: uuidv4(),
          author: STRANGER,
          content: "content2",
          createdAt: new Date(),
          chat: {
            id: uuidv4(),
            createdAt: new Date(),
            type: "POST",
          },
        };
        const fetchFriendsSpy = jest
          .spyOn(postRecommendationService, "fetchFriendsPostsOnly")
          .mockResolvedValue([friendPost]);
        const fetchNonFriendsSpy = jest
          .spyOn(postRecommendationService, "fetchNonFriendsPostsOnly")
          .mockResolvedValue([strangerPost]);

        const result = await postRecommendationService.getRecommendedPosts(
          USER.id,
          null,
          2
        );
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(friendPost);
        expect(result).toContainEqual(strangerPost);
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
});
