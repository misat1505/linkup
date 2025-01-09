import { useAppContext } from "@/contexts/AppProvider";
import { queryKeys } from "@/lib/queryKeys";
import { Friendship } from "@/types/Friendship";
import { useQueryClient } from "react-query";

export default function useCountStatusCategories() {
  const { user: me } = useAppContext();
  const queryClient = useQueryClient();
  const data =
    (queryClient.getQueryData(queryKeys.friends()) as Friendship[]) || [];

  const countStatusCategories = () => {
    const counts = { accepted: 0, awaitingMe: 0, awaitingOther: 0 };
    data.forEach((fr) => {
      if (fr.status === "ACCEPTED") return counts.accepted++;
      if (fr.requester.id === me!.id) return counts.awaitingOther++;
      counts.awaitingMe++;
    });

    return counts;
  };

  const counts = countStatusCategories();

  return counts;
}
