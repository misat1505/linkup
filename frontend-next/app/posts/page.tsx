import { I18nText } from "@/components/shared/I18nText";
import { buttonVariants } from "@/components/ui/button";
import { getMyPosts } from "@/features/posts/actions/getMyPosts";
import MyPostPreview from "@/features/posts/components/MyPostPreview";
import Link from "next/link";

export default async function MyPostsPage() {
  const posts = await getMyPosts();

  return (
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
  );
}
