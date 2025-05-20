import { Post } from "@/types/Post";
import { User } from "@/types/User";
import { userSelect } from "@/utils/prisma/userSelect";
import { postChatSelect } from "@/utils/prisma/postChatSelect";
import { PrismaClientOrTransaction } from "@/types/Prisma";

/**
 * Service class responsible for managing post-related operations in the database using Prisma.
 */
export class PostService {
  private prisma: PrismaClientOrTransaction;

  constructor(prisma: PrismaClientOrTransaction) {
    this.prisma = prisma;
  }

  /**
   * Deletes a post by its ID.
   * @param id - The ID of the post to be deleted.
   */
  async deletePost(id: Post["id"]) {
    await this.prisma.post.delete({
      where: { id },
    });
  }

  /**
   * Updates the content of an existing post.
   * @param id - The ID of the post to update.
   * @param content - The new content of the post.
   * @returns The updated post object, or `null` if no post was found.
   */
  async updatePost({
    id,
    content,
  }: {
    id: Post["id"];
    content: Post["content"];
  }): Promise<Post | null> {
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) return null;

    const post = await this.prisma.post.update({
      data: { content },
      where: { id },
      include: {
        author: { select: userSelect },
        chat: {
          select: postChatSelect,
        },
      },
    });

    return Post.parse(post);
  }

  /**
   * Retrieves a post by its ID.
   * @param id - The ID of the post to retrieve.
   * @returns The post object, or `null` if not found.
   */
  async getPost(id: Post["id"]): Promise<Post | null> {
    const post = await this.prisma.post.findFirst({
      where: { id },
      include: {
        author: { select: userSelect },
        chat: {
          select: postChatSelect,
        },
      },
    });

    if (!post) return null;

    return Post.parse(post);
  }

  /**
   * Retrieves all posts by a specific user.
   * @param id - The ID of the user whose posts are to be retrieved.
   * @returns A list of posts created by the user.
   */
  async getUserPosts(id: User["id"]): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: { authorId: id },
      include: {
        author: { select: userSelect },
        chat: {
          select: postChatSelect,
        },
      },
    });

    return posts.map((p) => Post.parse(p));
  }

  /**
   * Creates a new post with the given data.
   * @param id - The ID of the new post.
   * @param content - The content of the new post.
   * @param authorId - The ID of the user who is creating the post.
   * @returns The created post object.
   */
  async createPost({
    id,
    content,
    authorId,
  }: {
    id: Post["id"];
    content: Post["content"];
    authorId: User["id"];
  }): Promise<Post> {
    const chat = await this.prisma.chat.create({
      data: { type: "POST" },
    });

    const result = await this.prisma.post.create({
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

    return Post.parse(result);
  }

  /**
   * Reports a post.
   * @param userId - The ID of the user that reports the post.
   * @param postId - The ID of the post being reported.
   */
  async reportPost(userId: User["id"], postId: Post["id"]) {
    await this.prisma.postReport.create({
      data: { userId, postId },
    });
  }
}
