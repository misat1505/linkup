"use client";

import { Post } from "@packages/schemas";
import MDEditor from "@uiw/react-md-editor";
import { markdownPreviewOptions } from "../../../utils/markdown-preview-options";

type MyPostPreviewNotPrerenderedContentWrapperProps = {
  content: Post["content"];
};

const MyPostPreviewNotPrerenderedContentWrapper = ({
  content,
}: MyPostPreviewNotPrerenderedContentWrapperProps) => {
  return (
    <MDEditor.Markdown source={content} components={markdownPreviewOptions} />
  );
};

export default MyPostPreviewNotPrerenderedContentWrapper;
