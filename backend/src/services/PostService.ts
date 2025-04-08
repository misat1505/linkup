import { prisma } from "../lib/Prisma";
import { Post } from "../types/Post";
import { User } from "../types/User";
import { userSelect } from "../utils/prisma/userSelect";
import {
  postChatSelect,
  transformPostChatSelect,
} from "../utils/prisma/postChatSelect";
import { FriendshipService } from "./FriendshipService";

function sanitizePost(post: any): Post {
  const { authorId, chatId, ...sanitizedPost } = post;
  return { ...sanitizedPost } as Post;
}

/**
 * Service class responsible for managing post-related operations in the database using Prisma.
 */
export class PostService {
  /**
   * Deletes a post by its ID.
   * @param id - The ID of the post to be deleted.
   */
  static async deletePost(id: Post["id"]) {
    await prisma.post.delete({
      where: { id },
    });
  }

  /**
   * Updates the content of an existing post.
   * @param id - The ID of the post to update.
   * @param content - The new content of the post.
   * @returns The updated post object, or `null` if no post was found.
   */
  static async updatePost({
    id,
    content,
  }: {
    id: Post["id"];
    content: Post["content"];
  }): Promise<Post | null> {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) return null;

    const post = await prisma.post.update({
      data: { content },
      where: { id },
      include: {
        author: { select: userSelect },
        chat: {
          select: postChatSelect,
        },
      },
    });

    return sanitizePost({
      ...post,
      chat: transformPostChatSelect(post.chat),
    });
  }

  /**
   * Retrieves a post by its ID.
   * @param id - The ID of the post to retrieve.
   * @returns The post object, or `null` if not found.
   */
  static async getPost(id: Post["id"]): Promise<Post | null> {
    const post = await prisma.post.findFirst({
      where: { id },
      include: {
        author: { select: userSelect },
        chat: {
          select: postChatSelect,
        },
      },
    });

    if (!post) return null;

    return sanitizePost({
      ...post,
      chat: transformPostChatSelect(post.chat),
    });
  }

  /**
   * Retrieves all posts by a specific user.
   * @param id - The ID of the user whose posts are to be retrieved.
   * @returns A list of posts created by the user.
   */
  static async getUserPosts(id: User["id"]): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { authorId: id },
      include: {
        author: { select: userSelect },
        chat: {
          select: postChatSelect,
        },
      },
    });

    return posts.map((post) =>
      sanitizePost({
        ...post,
        chat: transformPostChatSelect(post.chat),
      })
    );
  }

  /**
   * Retrieves all posts in the database.
   * @returns A list of all posts.
   */
  static async getRecommendedPosts(
    userId: User["id"],
    lastPostId: Post["id"] | null,
    limit: number
  ): Promise<Post[]> {
    const getLastPost = async (): Promise<Post | null> => {
      if (!lastPostId) return null;
      const lastPost = await this.getPost(lastPostId);
      if (!lastPost) throw new Error("Last post not found.");
      return lastPost;
    };

    const lastPost = await getLastPost();

    const friendships = await FriendshipService.getUserFriendships(userId);

    const friends = friendships
      .filter((fr) => fr.status === "ACCEPTED")
      .map((fr) => {
        if (fr.acceptor.id === userId) return fr.requester.id;
        return fr.acceptor.id;
      });

    // last post was from non-friend - fetch only others posts
    if (lastPost && !friends.includes(lastPost.author.id)) {
      const posts = await prisma.post.findMany({
        where: {
          createdAt: { lt: lastPost.createdAt },
          authorId: { notIn: [...friends, userId] }, // avoid showing own posts too
        },
        include: {
          author: { select: userSelect },
          chat: { select: postChatSelect },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return posts.map((post) =>
        sanitizePost({
          ...post,
          chat: transformPostChatSelect(post.chat),
        })
      );
    }

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

    const remainingPosts = limit - friendsPosts.length;

    if (remainingPosts === 0)
      return friendsPosts.map((post) =>
        sanitizePost({
          ...post,
          chat: transformPostChatSelect(post.chat),
        })
      );

    const getOthersPostsCreatedAtFilter = () => {
      // user's friends have no posts
      if (!lastPost) return undefined;

      // this page has some friends posts, but it starts fetching others
      if (friendsPosts.length > 0) return undefined;

      // last post was a friend post but this page will have only others
      if (friends.includes(lastPost!.author.id)) return undefined;

      // last post was not-friend post
      return { lt: lastPost!.createdAt };
    };

    const othersPostsCreatedAtFilter = getOthersPostsCreatedAtFilter();

    const otherPosts = await prisma.post.findMany({
      where: {
        createdAt: othersPostsCreatedAtFilter,
        authorId: { notIn: [...friends, userId] }, // avoid showing own posts too
      },
      include: {
        author: { select: userSelect },
        chat: { select: postChatSelect },
      },
      orderBy: { createdAt: "desc" },
      take: remainingPosts,
    });

    return [...friendsPosts, ...otherPosts].map((post) =>
      sanitizePost({
        ...post,
        chat: transformPostChatSelect(post.chat),
      })
    );
  }

  /**
   * Creates a new post with the given data.
   * @param id - The ID of the new post.
   * @param content - The content of the new post.
   * @param authorId - The ID of the user who is creating the post.
   * @returns The created post object.
   */
  static async createPost({
    id,
    content,
    authorId,
  }: {
    id: Post["id"];
    content: Post["content"];
    authorId: User["id"];
  }): Promise<Post> {
    const chat = await prisma.chat.create({
      data: { type: "POST" },
    });

    const result = await prisma.post.create({
      data: {
        id,
        content,
        authorId,
        chatId: chat.id,
      },
      include: {
        author: { select: userSelect },
        chat: {
          select: postChatSelect,
        },
      },
    });

    return sanitizePost({
      ...result,
      chat: transformPostChatSelect(result.chat),
    });
  }
}
