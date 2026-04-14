import { acceptFriendship as acceptFriendshipController } from "./acceptFriendship.controller";
import { createFriendship as createFriendshipController } from "./createFriendship.controller";
import { deleteFriendship as deleteFriendshipController } from "./deleteFriendship.controller";
import { getUserFriendships as getUserFriendshipsController } from "./getUserFriendships.controller";

export namespace FriendshipControllers {
  export const acceptFriendship = acceptFriendshipController;
  export const createFriendship = createFriendshipController;
  export const deleteFriendship = deleteFriendshipController;
  export const getUserFriendships = getUserFriendshipsController;
}
