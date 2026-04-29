import AuthGuard from "@/components/auth-guard";
import { I18nText } from "@/components/shared/i18n-text";
import { buttonVariants } from "@/components/ui/button";
import { getMyPosts } from "@/features/posts/actions/get-my-posts";
import MyPostPreview from "@/features/posts/components/my-post-preview";
import Link from "next/link";

export default async function MyPostsPage() {
  const posts = await getMyPosts();

  return (
    <AuthGuard>
      <div className="flex flex-col items-center">
        <Link
          className={buttonVariants({ variant: "default", className: "my-4" })}
          data-testid="cy-redirect-to-create-post-btn"
          href="/posts/editor"
        >
          <I18nText translationKey="posts.new.button" />
        </Link>
        <div className="flex w-full flex-col items-center">
          {posts.map((post) => (
            <MyPostPreview post={post} key={post.id} />
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
