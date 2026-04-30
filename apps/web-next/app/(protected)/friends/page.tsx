import AuthGuard from "@/components/auth-guard";
import { getMyFriendships } from "@/features/friends/actions/get-my-friendships";
import { FriendsPageContent } from "@/features/friends/components/friends-page-content";

export default async function FriendsPage() {
  const friendships = await getMyFriendships();

  return (
    <AuthGuard>
      <FriendsPageContent friendships={friendships} />
    </AuthGuard>
  );
}
