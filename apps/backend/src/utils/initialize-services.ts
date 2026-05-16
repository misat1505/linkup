import { FileStorage } from "@/lib/file-storage";
import { ChatService } from "@/services/chat-service";
import { FileService } from "@/services/file-service";
import { FriendshipService } from "@/services/friendship-service";
import { PostRecommendationService } from "@/services/post-recommendation-service";
import { PostService } from "@/services/post-service";
import { UserService } from "@/services/user-service";
import { PrismaClientOrTransaction } from "@/types/prisma";

export type AppServices = {
	chatService: ChatService;
	fileService: FileService;
	friendshipService: FriendshipService;
	postRecommendationService: PostRecommendationService;
	postService: PostService;
	userService: UserService;
	fileStorage: FileStorage;
};

export function initializeServices(prisma: PrismaClientOrTransaction): AppServices {
	const chatService = new ChatService(prisma);
	const fileService = new FileService(prisma);
	const friendshipService = new FriendshipService(prisma);
	const postService = new PostService(prisma);
	const userService = new UserService(prisma);
	const postRecommendationService = new PostRecommendationService(
		prisma,
		postService,
		friendshipService,
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
