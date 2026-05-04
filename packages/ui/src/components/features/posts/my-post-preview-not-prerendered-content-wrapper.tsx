"use client";

import { Post } from "@packages/schemas";
import MDEditor from "@uiw/react-md-editor";
import { markdownPreviewOptions } from "../../../utils/markdown-preview-options";

type MyPostPreviewNotPrerenderedContentWrapperProps = {
  content: Post["content"];
  useTheme: () => { theme: "light" | "dark" };
};

const MyPostPreviewNotPrerenderedContentWrapper = ({
  content,
  useTheme,
}: MyPostPreviewNotPrerenderedContentWrapperProps) => {
  const { theme } = useTheme();

  return (
    <div data-color-mode={theme}>
      <MDEditor.Markdown source={content} components={markdownPreviewOptions} />
    </div>
  );
};

export default MyPostPreviewNotPrerenderedContentWrapper;
