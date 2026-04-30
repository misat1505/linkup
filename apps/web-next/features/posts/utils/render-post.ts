import { Post } from "@packages/schemas";
import rehypeShiki from "@shikijs/rehype";
import { cacheLife, cacheTag } from "next/cache";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { PostWithRenderedContent } from "../schemas/post-with-rendered-content";
import { replaceLinksCachedUnsafe } from "./replace-links";

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "video", "source"],
  attributes: {
    ...defaultSchema.attributes,
    video: [
      ...(defaultSchema.attributes?.video || []),
      "src",
      "controls",
      "autoplay",
      "loop",
      "muted",
      "playsinline",
      "width",
      "height",
      "poster",
    ],
    source: [...(defaultSchema.attributes?.source || []), "src", "type"],
  },
};

export const renderMarkdownCached = async (
  postId: string,
  markdown: string,
) => {
  "use cache";
  cacheTag(`post-${postId}`);
  cacheLife({ revalidate: 86400 });

  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, schema)
    .use(rehypeShiki, {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  console.log("RENDER MARKDOWN", postId);

  return result.toString();
};

export const getCachedRenderedPost = async (
  post: Post,
): Promise<PostWithRenderedContent> => {
  const html = await renderMarkdownCached(post.id, post.content);
  const htmlWithLinks = await replaceLinksCachedUnsafe(html);

  return {
    ...post,
    renderedContent: htmlWithLinks,
  };
};
