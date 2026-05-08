import AuthGuard from "@/components/auth-guard";
import { getMyFriendships } from "@/features/friends/actions/get-my-friendships";
import FriendsPageContentWrapper from "@/features/friends/components/friends-page-content-wrapper";

export default async function FriendsPage() {
  const friendships = await getMyFriendships();

  return (
    <AuthGuard>
      <FriendsPageContentWrapper friendships={friendships} />
    </AuthGuard>
  );
}
