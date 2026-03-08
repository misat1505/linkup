import { Post, PostWithRenderedContent } from "../schemas/post";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import { cacheTag } from "next/cache";
import { cacheLife } from "next/cache";
import { replaceLinks } from "./replaceLinks";

export const renderMarkdownCached = async (
  postId: string,
  markdown: string,
) => {
  "use cache";
  cacheTag(`post-${postId}`);
  cacheLife({ revalidate: 86400 });

  const withReplacedLinks = replaceLinks(markdown);

  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeShiki, {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    })
    .use(rehypeStringify)
    .process(withReplacedLinks);

  console.log("RENDER MARKDOWN", postId);

  return result.toString();
};

export const getCachedRenderedPost = async (
  post: Post,
): Promise<PostWithRenderedContent> => {
  const html = await renderMarkdownCached(post.id, post.content);

  return {
    ...post,
    renderedContent: html,
  };
};
