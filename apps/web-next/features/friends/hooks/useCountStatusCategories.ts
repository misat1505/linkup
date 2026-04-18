import { useAppContext } from "@/providers/AppProvider";
import { Friendship } from "@packages/schemas";

export default function useCountStatusCategories(friendships: Friendship[]) {
  const { user: me } = useAppContext();

  const countStatusCategories = () => {
    const counts = { accepted: 0, awaitingMe: 0, awaitingOther: 0 };
    friendships.forEach((fr) => {
      if (fr.status === "ACCEPTED") return counts.accepted++;
      if (fr.requester.id === me!.id) return counts.awaitingOther++;
      counts.awaitingMe++;
    });

    return counts;
  };

  const counts = countStatusCategories();

  return counts;
}
