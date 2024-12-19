import MyPostPreview from "../components/posts/MyPostPreview";
import Loading from "../components/common/Loading";
import { PostService } from "../services/Post.service";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/routes";
import { Button } from "../components/ui/button";
import { queryKeys } from "../lib/queryKeys";
import { orderBy } from "lodash";
import { Post } from "../types/Post";

export default function Posts() {
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: queryKeys.myPosts(),
    queryFn: PostService.getMyPosts
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
          navigate(ROUTES.POST_EDITOR.buildPath({ postId: undefined }))
        }
      >
        Create New Post
      </Button>
      <div className="flex w-full flex-col items-center">
        {getSortedPosts().map((post) => (
          <MyPostPreview post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}