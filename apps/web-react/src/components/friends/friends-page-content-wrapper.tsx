"use client";
import { useAppContext } from "@/contexts/app-provider";
import { queryKeys } from "@/lib/query-keys";
import { FriendService } from "@/services/friend.service";
import { Friendship } from "@packages/schemas";
import { FriendsPageContent } from "@packages/ui/features/friends";
import { useQueryClient } from "react-query";

type FriendsPageContentWrapperProps = {
  friendships: Friendship[];
};

const FriendsPageContentWrapper = ({
  friendships,
}: FriendsPageContentWrapperProps) => {
  const queryClient = useQueryClient();
  const { user } = useAppContext();

  function deleteFriendshipCb(friendship: Friendship) {
    queryClient.setQueryData<Friendship[]>(
      queryKeys.friends(),
      (oldFriendships) => {
        if (!oldFriendships) return [];
        return oldFriendships.filter(
          (fr) =>
            fr.acceptor.id !== friendship.acceptor.id ||
            fr.requester.id !== friendship.requester.id,
        );
      },
    );
  }

  function acceptFriendshipCb(friendship: Friendship) {
    queryClient.setQueryData<Friendship[]>(
      queryKeys.friends(),
      (oldFriendships) => {
        if (!oldFriendships) return [friendship];
        return oldFriendships.map((fr) => {
          if (
            fr.acceptor.id === friendship.acceptor.id &&
            fr.requester.id === friendship.requester.id
          )
            return friendship;
          return fr;
        });
      },
    );
  }

  return (
    <FriendsPageContent
      friendships={friendships}
      me={user!}
      acceptFriendshipAction={FriendService.acceptFriendship}
      deleteFriendshipAction={FriendService.deleteFriendship}
      acceptFriendshipCb={acceptFriendshipCb}
      deleteFriendshipCb={deleteFriendshipCb}
    />
  );
};

export default FriendsPageContentWrapper;
