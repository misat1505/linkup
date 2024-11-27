import React from "react";
import Loading from "../components/common/Loading";
import { useQuery } from "react-query";
import { PostService } from "../services/Post.service";
import PostPreview from "../components/posts/PostPreview";
import { queryKeys } from "../lib/queryKeys";

export default function Home() {
  const { data: posts, isLoading } = useQuery({
    queryKey: queryKeys.posts(),
    queryFn: PostService.getPosts
  });

  if (isLoading) return <Loading />;

  return (
    <div>{posts?.map((post) => <PostPreview post={post} key={post.id} />)}</div>
  );
}
