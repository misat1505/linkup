import { prisma } from "../lib/Prisma";
import { Post } from "../types/Post";
import { User } from "../types/User";
import { userSelect } from "../utils/prisma/userSelect";
import {
  postChatSelect,
  transformPostChatSelect,
} from "../utils/prisma/postChatSelect";

function sanitizePost(post: any): Post {
  const { authorId, chatId, ...sanitizedPost } = post;
  return { ...sanitizedPost } as Post;
}

/**
 * Service class responsible for managing post-related operations in the database using Prisma.
 */
export class PostService {
  /**
   * Sanitizes post
   * @param post - data to be sanitized
   */
  static sanitizePost(post: any): Post {
    return sanitizePost({
      ...post,
      chat: transformPostChatSelect(post.chat),
    });
  }

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

    return this.sanitizePost(post);
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

    return this.sanitizePost(post);
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

    return posts.map(this.sanitizePost);
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

    return this.sanitizePost(result);
  }
}
