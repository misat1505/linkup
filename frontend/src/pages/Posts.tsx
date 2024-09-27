import MyPostPreview from "../components/posts/MyPostPreview";
import Loading from "../components/common/Loading";
import { PostService } from "../services/Post.service";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/routes";
import { Button } from "../components/ui/button";

export default function Posts() {
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["my-posts"],
    queryFn: PostService.getMyPosts
  });

  if (isLoading)
    return (
      <div className="relative flex h-[calc(100vh-5rem)] w-screen">
        <Loading />
      </div>
    );

  return (
    <div className="flex flex-col items-center">
      <Button
        className="my-4"
        onClick={() =>
          navigate(ROUTES.POST_EDITOR.buildPath({ postId: undefined }))
        }
      >
        Create new post
      </Button>
      <div className="flex w-full flex-col items-center">
        {posts?.map((post) => <MyPostPreview post={post} key={post.id} />)}
      </div>
    </div>
  );
}
