import MyPostPreview from "../components/posts/MyPostPreview";
import Loading from "../components/common/Loading";
import { PostService } from "../services/Post.service";
import React from "react";
import { useQuery } from "react-query";

export default function Posts() {
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
    <div>
      {posts?.map((post) => <MyPostPreview post={post} key={post.id} />)}
    </div>
  );
}
