import { useInfiniteQuery } from "react-query";
import { queryKeys } from "@/lib/queryKeys";
import { PostService } from "@/services/Post.service";
import Loading from "@/components/common/Loading";
import PostPreview from "@/components/posts/PostPreview";
import EmptyFeed from "@/components/home/EmptyFeed";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: queryKeys.posts(),
      queryFn: ({ pageParam }) =>
        PostService.getRecommendedPosts(
          pageParam || null,
          parseInt(localStorage.getItem("posts-limit")!) || 10
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
      {posts!.map((post) => (
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
