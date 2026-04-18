import AuthGuard from "@/components/AuthGuard";
import { getRecommendedPosts } from "@/features/posts/actions/getRecommededPosts";
import { PostsFeed } from "@/features/posts/components/PostsFeed";
import { PostWithRenderedContent } from "@/features/posts/schemas/post-with-rendered-content";
import { makeQueryClient } from "@/lib/makeQueryClient";
import { queryKeys } from "@/lib/queryKeys";
import { DEFAULT_POSTS_FEED_PAGE_LENGTH } from "@/utils/constants";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = makeQueryClient();

  await queryClient.prefetchInfiniteQuery<
    PostWithRenderedContent[],
    Error,
    PostWithRenderedContent[],
    readonly ["posts"],
    string | null
  >({
    queryKey: queryKeys.posts(),
    queryFn: ({ pageParam }) =>
      getRecommendedPosts(pageParam || null, DEFAULT_POSTS_FEED_PAGE_LENGTH),
    getNextPageParam: (lastPage: PostWithRenderedContent[]): string | null => {
      if (lastPage.length > 0) return lastPage[lastPage.length - 1].id;
      return null;
    },
    initialPageParam: null,
  });

  return (
    <AuthGuard>
      <div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PostsFeed />
        </HydrationBoundary>
      </div>
    </AuthGuard>
  );
}
