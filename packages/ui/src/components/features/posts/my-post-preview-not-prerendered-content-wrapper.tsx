"use client";

import { Post } from "@packages/schemas";
import React, { Suspense } from "react";
import { markdownPreviewOptions } from "../../../utils/markdown-preview-options";
import { Loading } from "../../misc/loading";

const MDEditorMarkdown = React.lazy(() =>
  import("@uiw/react-md-editor").then((m) => ({
    default: m.default.Markdown,
  })),
);

type Props = {
  content: Post["content"];
  useTheme: () => { theme: "light" | "dark" };
};

const MyPostPreviewNotPrerenderedContentWrapper = ({
  content,
  useTheme,
}: Props) => {
  const { theme } = useTheme();

  return (
    <div data-color-mode={theme}>
      <Suspense
        fallback={
          <div className="p-4">
            <Loading />
          </div>
        }
      >
        <MDEditorMarkdown
          source={content}
          components={markdownPreviewOptions}
        />
      </Suspense>
    </div>
  );
};

export default MyPostPreviewNotPrerenderedContentWrapper;
