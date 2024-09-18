import { prisma } from "../lib/Prisma";
import { File } from "../types/File";
import { Post } from "../types/Post";
import { User } from "../types/User";
import { v4 as uuidv4 } from "uuid";
import { userSelect } from "../utils/prisma/userSelect";

export class PostService {
  static async updatePost({
    id,
    content,
  }: {
    id: Post["id"];
    content: Post["content"];
  }): Promise<Post | null> {
    const posts: Post | null = await prisma.post.update({
      data: { content },
      where: { id },
      include: {
        author: { select: userSelect },
        files: {
          select: { id: true, url: true },
        },
      },
    });

    return posts;
  }

  static async getPost(id: Post["id"]): Promise<Post | null> {
    const posts: Post | null = await prisma.post.findFirst({
      where: { id },
      include: {
        author: { select: userSelect },
        files: {
          select: { id: true, url: true },
        },
      },
    });

    return posts;
  }

  static async getUserPosts(id: User["id"]): Promise<Post[]> {
    const posts: Post[] = await prisma.post.findMany({
      where: { authorId: id },
      include: {
        author: { select: userSelect },
        files: {
          select: { id: true, url: true },
        },
      },
    });

    return posts;
  }

  static async getPosts(): Promise<Post[]> {
    const posts: Post[] = await prisma.post.findMany({
      include: {
        author: { select: userSelect },
        files: {
          select: { id: true, url: true },
        },
      },
    });

    return posts;
  }

  static async createPost({
    content,
    authorId,
    files,
  }: {
    content: Post["content"];
    authorId: User["id"];
    files: File["url"][];
  }): Promise<Post> {
    const chat = await prisma.chat.create({
      data: { type: "POST" },
    });

    const result: Post = await prisma.post.create({
      data: {
        content,
        authorId,
        files: {
          create: files.map((fileUrl) => ({
            id: uuidv4(),
            url: fileUrl,
          })),
        },
        chatId: chat.id,
      },
      include: {
        author: { select: userSelect },
        files: {
          select: { id: true, url: true },
        },
      },
    });

    return result;
  }
}
