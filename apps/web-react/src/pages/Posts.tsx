import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { orderBy } from "lodash";
import { queryKeys } from "@/lib/queryKeys";
import { PostService } from "@/services/Post.service";
import Loading from "@/components/common/Loading";
import { Post } from "@/types/Post";
import { Button } from "@/components/ui/button";
import MyPostPreview from "@/components/posts/MyPostPreview";
import { ROUTES } from "@/lib/routes";
import { useTranslation } from "react-i18next";
import useChangeTabTitle from "@/hooks/useChangeTabTitle";

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
      ["desc"]
    );
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        className="my-4"
        data-testid="cy-redirect-to-create-post-btn"
        onClick={() =>
          navigate(
            ROUTES.POST_EDITOR.$buildPath({ params: { postId: undefined } })
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
