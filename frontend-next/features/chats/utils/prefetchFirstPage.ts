import { QueryClient } from "@tanstack/react-query";
import { Chat } from "../schemas/chat";
import { Message } from "../schemas/message";
import { queryKeys } from "@/lib/queryKeys";
import { getMessages } from "../actions/getMessages";

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
