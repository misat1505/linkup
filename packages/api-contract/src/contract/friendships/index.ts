import { acceptFriendshipRoute } from "./accept-friendship";
import { createFriendshipRoute } from "./create-friendship";
import { deleteFriendshipRoute } from "./delete-friendship";
import { getUserFriendshipsRoute } from "./get-user-friendships";

export const friendshipsContract = {
	ACCEPT_FRIENDSHIP: acceptFriendshipRoute,
	CREATE_FRIENDSHIP: createFriendshipRoute,
	DELETE_FRIENDSHIP: deleteFriendshipRoute,
	GET_USER_FRIENDSHIPS: getUserFriendshipsRoute,
};
