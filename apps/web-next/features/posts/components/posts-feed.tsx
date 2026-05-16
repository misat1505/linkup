"use client";

import { queryKeys } from "@/lib/query-keys";
import { DEFAULT_POSTS_FEED_PAGE_LENGTH } from "@/utils/constants";
import { EmptyFeed } from "@packages/ui/components/features/home/empty-feed";
import { Loading } from "@packages/ui/components/misc/loading";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getRecommendedPosts } from "../actions/get-recommeded-posts";
import { PostWithRenderedContent } from "../schemas/post-with-rendered-content";
import PostPreview from "./post-preview";

export function PostsFeed() {
	const { ref: bottomRef, inView } = useInView({
		threshold: 0,
		rootMargin: "100px",
	});

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
		queryKey: queryKeys.posts(),
		queryFn: ({ pageParam }) =>
			getRecommendedPosts(pageParam || null, DEFAULT_POSTS_FEED_PAGE_LENGTH),
		getNextPageParam: (lastPage: PostWithRenderedContent[]): string | null => {
			if (lastPage?.length > 0) return lastPage[lastPage.length - 1].id;
			return null;
		},
		initialPageParam: null,
	});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (isLoading || !data) return <Loading />;

	const posts = data.pages.flatMap((page) => page);

	if (!posts || !posts.length)
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
