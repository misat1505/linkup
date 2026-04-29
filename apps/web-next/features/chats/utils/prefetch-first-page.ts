import { queryKeys } from "@/lib/query-keys";
import { Chat, Message } from "@packages/schemas";
import { QueryClient } from "@tanstack/react-query";
import { getMessages } from "../actions/get-messages";

export async function prefetchFirstPage(
  queryClient: QueryClient,
  id: Chat["id"],
): Promise<void> {
  await queryClient.prefetchInfiniteQuery<
    Message[],
    Error,
    Message[],
    ReturnType<typeof queryKeys.messages>,
    string | null
  >({
    queryKey: queryKeys.messages(id),
    queryFn: () => getMessages(id, undefined, null),
    getNextPageParam: (lastPage: Message[]) => lastPage.at(-1)?.id ?? null,
    initialPageParam: null,
  });
}
