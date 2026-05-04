import { useThemeContext } from "@/contexts/theme-provider";
import { queryKeys } from "@/lib/query-keys";
import { PostService } from "@/services/post.service";
import { Post } from "@packages/schemas";
import { MyPostPreview } from "@packages/ui/features/posts";
import { useQueryClient } from "react-query";

export default function MyPostPreviewWrapper({ post }: { post: Post }) {
  const queryClient = useQueryClient();

  function deletePostCb(id: Post["id"]) {
    const updaterFn = (oldPosts: Post[] | undefined) => {
      if (!oldPosts) return [];
      return oldPosts.filter((post) => post.id !== id);
    };

    queryClient.setQueryData<Post[]>(queryKeys.myPosts(), (oldPosts) =>
      updaterFn(oldPosts),
    );
    queryClient.setQueryData<Post[]>(queryKeys.posts(), (oldPosts) =>
      updaterFn(oldPosts),
    );
  }

  return (
    <MyPostPreview
      useTheme={useThemeContext}
      post={post}
      isPrerendered={false}
      deletePostAction={PostService.deletePost}
      deletePostCb={deletePostCb}
    />
  );
}
