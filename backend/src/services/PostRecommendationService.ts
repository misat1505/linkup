import { Post } from "@/types/Post";
import { PrismaClientOrTransaction } from "@/types/Prisma";
import { User } from "@/types/User";
import { postChatSelect } from "@/utils/prisma/postChatSelect";
import { userSelect } from "@/utils/prisma/userSelect";
import { FriendshipService } from "./FriendshipService";
import { PostService } from "./PostService";

/**
 * Service class responsible for recommending post for a specific user.
 */
export class PostRecommendationService {
  private prisma: PrismaClientOrTransaction;
  private postService: PostService;
  private friendshipService: FriendshipService;

  constructor(
    prisma: PrismaClientOrTransaction,
    postService: PostService,
    friendshipService: FriendshipService
  ) {
    this.prisma = prisma;
    this.postService = postService;
    this.friendshipService = friendshipService;
  }
  /**
   * Retrieves the last post based on the provided post ID.
   * @param postId - The ID of the post to retrieve the last post for.
   * @returns The last post if found, or null if no post ID is provided.
   * @throws Throws an error if the last post is not found.
   */
  async getLastPost(postId: Post["id"] | null): Promise<Post | null> {
    if (!postId) return null;
    const lastPost = await this.postService.getPost(postId);
    if (!lastPost) throw new Error("Last post not found.");
    return lastPost;
  }

  /**
   * Retrieves the list of friends for a specific user.
   * @param userId - The ID of the user whose friends are to be retrieved.
   * @returns A list of IDs of the user's friends.
   */
  async getUserFriends(userId: User["id"]): Promise<User["id"][]> {
    const friendships = await this.friendshipService.getUserFriendships(userId);

    const friends = friendships
      .filter((fr) => fr.status === "ACCEPTED")
      .map((fr) => {
        if (fr.acceptor.id === userId) return fr.requester.id;
        return fr.acceptor.id;
      });

    return friends;
  }

  /**
   * Fetches posts made by users who are not friends with the specified user.
   * @param deadline - The cutoff date for posts to be fetched.
   * @param friends - A list of user IDs representing the user's friends.
   * @param userId - The ID of the user for whom to exclude their own posts.
   * @param limit - The maximum number of posts to fetch.
   * @returns A list of posts made by non-friends, excluding the user's own posts.
   */
  async fetchNonFriendsPostsOnly(
    deadline: Date | undefined,
    friends: User["id"][],
    userId: User["id"],
    limit: number
  ): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        createdAt: { lt: deadline },
        authorId: { notIn: [...friends, userId] }, // avoid showing own posts
      },
      include: {
        author: { select: userSelect },
        chat: { select: postChatSelect },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return posts.map((p) => Post.parse(p));
  }

  /**
   * Fetches posts made by friends of the specified user.
   * @param lastPost - The last post to compare the date for fetching new posts.
   * @param friends - A list of user IDs representing the user's friends.
   * @param limit - The maximum number of posts to fetch.
   * @returns A list of posts made by the user's friends.
   */
  async fetchFriendsPostsOnly(
    lastPost: Post | null,
    friends: User["id"][],
    limit: number
  ): Promise<Post[]> {
    const createdAtFilter = lastPost?.createdAt
      ? { lt: lastPost.createdAt }
      : undefined;

    const friendsPosts = await this.prisma.post.findMany({
      where: {
        createdAt: createdAtFilter,
        author: {
          id: { in: friends },
        },
      },
      include: {
        author: { select: userSelect },
        chat: {
          select: postChatSelect,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return friendsPosts.map((p) => Post.parse(p));
  }

  /**
   * Determines the filter for fetching posts that are not from friends.
   * @param lastPost - The last post to compare the date for fetching new posts.
   * @param friendsPosts - A list of posts from friends.
   * @param friends - A list of user IDs representing the user's friends.
   * @returns A date filter for fetching non-friend posts based on the last post.
   */
  static getOthersPostsCreatedAtFilter(
    lastPost: Post | null,
    friendsPosts: Post[],
    friends: User["id"][]
  ): { lt: Date } | undefined {
    // user's friends have no posts
    if (!lastPost) return undefined;

    // this page has some friends posts, but it starts fetching others
    if (friendsPosts.length > 0) return undefined;

    // last post was a friend post but this page will have only others
    if (friends.includes(lastPost!.author.id)) return undefined;

    // last post was not-friend post
    return { lt: lastPost!.createdAt };
  }

  /**
   * Retrieves a list of recommended posts for a user, based on their last post and friendships.
   * @param userId - The ID of the user for whom posts are being recommended.
   * @param lastPostId - The ID of the last post to use for determining recommendations.
   * @param limit - The maximum number of recommended posts to fetch.
   * @returns A list of recommended posts for the user.
   */
  async getRecommendedPosts(
    userId: User["id"],
    lastPostId: Post["id"] | null,
    limit: number
  ): Promise<Post[]> {
    const lastPost = await this.getLastPost(lastPostId);
    const friends = await this.getUserFriends(userId);

    // last post was from non-friend - fetch only others posts
    if (lastPost && !friends.includes(lastPost.author.id)) {
      return await this.fetchNonFriendsPostsOnly(
        lastPost.createdAt,
        friends,
        userId,
        limit
      );
    }

    const friendsPosts = await this.fetchFriendsPostsOnly(
      lastPost,
      friends,
      limit
    );

    const remainingPosts = limit - friendsPosts.length;

    if (remainingPosts === 0) return friendsPosts.map((p) => Post.parse(p));

    const othersPostsCreatedAtFilter =
      PostRecommendationService.getOthersPostsCreatedAtFilter(
        lastPost,
        friendsPosts,
        friends
      );

    const otherPosts = await this.fetchNonFriendsPostsOnly(
      othersPostsCreatedAtFilter?.lt,
      friends,
      userId,
      remainingPosts
    );

    return [...friendsPosts, ...otherPosts].map((p) => Post.parse(p));
  }
}
