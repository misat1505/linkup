"use client";
import { useAppContext } from "@/providers/app-provider";
import { Friendship } from "@packages/schemas";
import { FriendsPageContent } from "@packages/ui/components/features/friends/friends-page-content";
import { acceptFriendship } from "../actions/accept-friendship";
import { deleteFriendship } from "../actions/delete-friendship";

type FriendsPageContentWrapperProps = {
	friendships: Friendship[];
};

const FriendsPageContentWrapper = ({ friendships }: FriendsPageContentWrapperProps) => {
	const { user } = useAppContext();

	return (
		<FriendsPageContent
			friendships={friendships}
			me={user!}
			acceptFriendshipAction={acceptFriendship}
			deleteFriendshipAction={deleteFriendship}
		/>
	);
};

export default FriendsPageContentWrapper;
