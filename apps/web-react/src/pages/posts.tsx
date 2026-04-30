import Loading from "@/components/common/loading";
import MyPostPreview from "@/components/posts/my-post-preview";
import { Button } from "@/components/ui/button";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { queryKeys } from "@/lib/query-keys";
import { ROUTES } from "@/lib/routes";
import { PostService } from "@/services/post.service";
import { Post } from "@packages/schemas";
import { orderBy } from "lodash";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.posts"));
  const navigate = useNavigate();

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
    <div className="flex flex-col items-center">
      <Button
        className="my-4"
        data-testid="cy-redirect-to-create-post-btn"
        onClick={() =>
          navigate(
            ROUTES.POST_EDITOR.$buildPath({ params: { postId: undefined } }),
          )
        }
      >
        {t("posts.new.button")}
      </Button>
      <div className="flex w-full flex-col items-center">
        {getSortedPosts().map((post) => (
          <MyPostPreview post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}
