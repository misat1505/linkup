import { acceptFriendship as acceptFriendshipController } from "./accept-friendship.controller";
import { createFriendship as createFriendshipController } from "./create-friendship.controller";
import { deleteFriendship as deleteFriendshipController } from "./delete-friendship.controller";
import { getUserFriendships as getUserFriendshipsController } from "./get-user-friendships.controller";

export const FriendshipControllers = {
	acceptFriendship: acceptFriendshipController,
	createFriendship: createFriendshipController,
	deleteFriendship: deleteFriendshipController,
	getUserFriendships: getUserFriendshipsController,
};
