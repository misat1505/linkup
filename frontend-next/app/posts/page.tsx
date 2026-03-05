import { getMyPosts } from "@/features/posts/actions/getMyPosts";

export default async function MyPostsPage() {
  const posts = await getMyPosts();

  return (
    <div className="m-4">
      {posts.map((p) => (
        <div key={p.id} className="mb-8">
          <div
            className="markdown-body p-4"
            dangerouslySetInnerHTML={{ __html: p.renderedContent }}
          ></div>
        </div>
      ))}
    </div>
  );
}
