import { prisma } from "../lib/Prisma";
import { Post } from "../types/Post";
import { User } from "../types/User";
import { postChatSelect } from "../utils/prisma/postChatSelect";
import { userSelect } from "../utils/prisma/userSelect";
import { FriendshipService } from "./FriendshipService";
import { PostService } from "./PostService";

/**
 * Service class responsible for recommending post for a specific user.
 */
export class PostRecommendationService {
  static async getLastPost(postId: Post["id"] | null): Promise<Post | null> {
    if (!postId) return null;
    const lastPost = await PostService.getPost(postId);
    if (!lastPost) throw new Error("Last post not found.");
    return lastPost;
  }

  static async getUserFriends(userId: User["id"]): Promise<User["id"][]> {
    const friendships = await FriendshipService.getUserFriendships(userId);

    const friends = friendships
      .filter((fr) => fr.status === "ACCEPTED")
      .map((fr) => {
        if (fr.acceptor.id === userId) return fr.requester.id;
        return fr.acceptor.id;
      });

    return friends;
  }

  static async fetchNonFriendsPostsOnly(
    deadline: Date | undefined,
    friends: User["id"][],
    userId: User["id"],
    limit: number
  ): Promise<Post[]> {
    const posts = await prisma.post.findMany({
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

    return posts.map(PostService.sanitizePost);
  }

  static async fetchFriendsPostsOnly(
    lastPost: Post | null,
    friends: User["id"][],
    limit: number
  ): Promise<Post[]> {
    const createdAtFilter = lastPost?.createdAt
      ? { lt: lastPost.createdAt }
      : undefined;

    const friendsPosts = await prisma.post.findMany({
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

    return friendsPosts.map(PostService.sanitizePost);
  }

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

  static async getRecommendedPosts(
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

    if (remainingPosts === 0) return friendsPosts.map(PostService.sanitizePost);

    const othersPostsCreatedAtFilter = this.getOthersPostsCreatedAtFilter(
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

    return [...friendsPosts, ...otherPosts].map(PostService.sanitizePost);
  }
}
