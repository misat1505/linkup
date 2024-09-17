import Editor from "../components/posts/Editor";
import React, { useEffect, useState } from "react";

export default function NewPost() {
  const [markdown, setMarkdown] = useState<string>("");

  return (
    <div className="flex w-full justify-between gap-x-4">
      {/* <Buttons markdown={markdown} /> */}

      <Editor markdown={markdown} setMarkdown={setMarkdown} />
    </div>
  );
}
