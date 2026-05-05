import Loading from "@/components/common/loading";
import PostPreview from "@/components/posts/post-preview";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { queryKeys } from "@/lib/query-keys";
import { PostService } from "@/services/post.service";
import { EmptyFeed } from "@packages/ui/components/features/home/empty-feed";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";

export default function Home() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.home"));

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: queryKeys.posts(),
      queryFn: ({ pageParam }) =>
        PostService.getRecommendedPosts(
          pageParam || null,
          parseInt(localStorage.getItem("posts-limit")!) || 10,
        ),
      getNextPageParam: (lastPage) => {
        if (lastPage.length > 0) {
          return lastPage[lastPage.length - 1].id;
        }
        return undefined;
      },
    });

  const { ref: bottomRef, inView: bottomInView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (bottomInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [bottomInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || !data) return <Loading />;

  const posts = data?.pages.flatMap((page) => page) || [];

  if (posts?.length === 0)
    return (
      <div className="relative w-full h-[calc(100vh-5rem)]">
        <EmptyFeed />
      </div>
    );

  return (
    <div>
      {posts.map((post) => (
        <PostPreview post={post} key={post.id} />
      ))}

      {hasNextPage && <div ref={bottomRef} className="h-6" />}

      {isFetchingNextPage && (
        <div className="relative text-center py-4">
          <Loading />
        </div>
      )}
    </div>
  );
}
