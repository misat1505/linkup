import { acceptFriendship as acceptFriendshipController } from "./acceptFriendship.controller";
import { createFriendship as createFriendshipController } from "./createFriendship.controller";
import { deleteFriendship as deleteFriendshipController } from "./deleteFriendship.controller";
import { getUserFriendships as getUserFriendshipsController } from "./getUserFriendships.controller";

export const FriendshipControllers = {
  acceptFriendship: acceptFriendshipController,
  createFriendship: createFriendshipController,
  deleteFriendship: deleteFriendshipController,
  getUserFriendships: getUserFriendshipsController,
};
