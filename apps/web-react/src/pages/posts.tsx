import MyPostPreviewWrapper from "@/components/posts/my-post-preview-wrapper";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { queryKeys } from "@/lib/query-keys";
import { PostService } from "@/services/post.service";
import { Post } from "@packages/schemas";
import { PostsPageLayout } from "@packages/ui/components/features/posts/posts-page-layout";
import { Loading } from "@packages/ui/components/misc/loading";
import { orderBy } from "lodash";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

export default function Posts() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.posts"));

  const { data: posts, isLoading } = useQuery({
    queryKey: queryKeys.myPosts(),
    queryFn: PostService.getMyPosts,
  });

  if (isLoading)
    return (
      <div className="relative flex h-[calc(100vh-5rem)] w-screen">
        <Loading />
      </div>
    );

  const getSortedPosts = (): Post[] => {
    return orderBy(
      posts,
      [(post) => new Date(post.createdAt).getTime()],
      ["desc"],
    );
  };

  return (
    <PostsPageLayout>
      {getSortedPosts().map((post) => (
        <MyPostPreviewWrapper post={post} key={post.id} />
      ))}
    </PostsPageLayout>
  );
}
