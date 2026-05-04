import AuthGuard from "@/components/auth-guard";
import { getMyPosts } from "@/features/posts/actions/get-my-posts";
import MyPostPreviewWrapper from "@/features/posts/components/my-post-preview-wrapper";
import { PostsPageLayout } from "@packages/ui";

export default async function MyPostsPage() {
  const posts = await getMyPosts();

  return (
    <AuthGuard>
      <PostsPageLayout>
        {posts.map((post) => (
          <MyPostPreviewWrapper post={post} key={post.id} />
        ))}
      </PostsPageLayout>
    </AuthGuard>
  );
}
