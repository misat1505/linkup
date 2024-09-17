import React from "react";
import Loading from "../components/common/Loading";
import { useAppContext } from "../contexts/AppProvider";
import { useQuery } from "react-query";
import { PostService } from "../services/Post.service";
import PostPreview from "../components/posts/PostPreview";

export default function Home() {
  const { user } = useAppContext();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: PostService.getPosts
  });

  if (!user || isLoading) return <Loading />;

  return <div>{posts?.map((post) => <PostPreview post={post} />)}</div>;
}
