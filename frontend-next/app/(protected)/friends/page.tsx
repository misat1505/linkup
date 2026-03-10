import { getMyFriendships } from "@/features/friends/actions/getMyFriendships";
import { FriendsPageContent } from "@/features/friends/components/FriendsPageContent";

export default async function FriendsPage() {
  const friendships = await getMyFriendships();

  return <FriendsPageContent friendships={friendships} />;
}
