import { FileStorage } from "../lib/FileStorage";
import { ChatService } from "../services/ChatService";
import { FileService } from "../services/FileService";
import { FriendshipService } from "../services/FriendshipService";
import { PostRecommendationService } from "../services/PostRecommendationService";
import { PostService } from "../services/PostService";
import { UserService } from "../services/UserService";
import { PrismaClientOrTransaction } from "../types/Prisma";

export type AppServices = {
  chatService: ChatService;
  fileService: FileService;
  friendshipService: FriendshipService;
  postRecommendationService: PostRecommendationService;
  postService: PostService;
  userService: UserService;
  fileStorage: FileStorage;
};

export function initializeServices(
  prisma: PrismaClientOrTransaction
): AppServices {
  const chatService = new ChatService(prisma);
  const fileService = new FileService(prisma);
  const friendshipService = new FriendshipService(prisma);
  const postService = new PostService(prisma);
  const userService = new UserService(prisma);
  const postRecommendationService = new PostRecommendationService(
    prisma,
    postService,
    friendshipService
  );
  const fileStorage = new FileStorage();

  return {
    chatService,
    fileService,
    friendshipService,
    postService,
    userService,
    postRecommendationService,
    fileStorage,
  };
}
