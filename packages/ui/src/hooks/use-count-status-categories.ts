import { Friendship, User } from "@packages/schemas";

export default function useCountStatusCategories(
  me: User,
  friendships: Friendship[],
) {
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
