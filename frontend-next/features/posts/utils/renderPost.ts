import { unstable_cache as cache } from "next/cache";
import { Post, PostWithRenderedContent } from "../schemas/post";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";

export async function renderMarkdown(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .use(rehypeShiki, {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    })
    .process(markdown);

  return result.toString();
}

export async function getCachedRenderedPost(post: Post) {
  return cache(
    async () => {
      console.log(`rendering markdown: ${post.id}`);
      const html = await renderMarkdown(post.content);

      const renderedPost: PostWithRenderedContent = {
        ...post,
        renderedContent: html,
      };

      return renderedPost;
    },
    ["post-render", post.id],
    { revalidate: 86400, tags: [`post-${post.id}`] },
  )();
}
