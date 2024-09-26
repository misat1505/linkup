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

export class PostService {
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

  static async getPosts(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
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

  static async createPost({
    content,
    authorId,
  }: {
    content: Post["content"];
    authorId: User["id"];
  }): Promise<Post> {
    const chat = await prisma.chat.create({
      data: { type: "POST" },
    });

    const result = await prisma.post.create({
      data: {
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
