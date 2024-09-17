import MDEditor from "@uiw/react-md-editor";
import { useThemeContext } from "../../contexts/ThemeProvider";
import { Post } from "../../types/Post";
import React from "react";

export default function PostPreview({ text }: { text: Post["content"] }) {
  const { theme } = useThemeContext();

  return (
    <div
      data-color-mode={theme}
      className="m-auto my-4 max-w-[60%] rounded-md p-4"
      style={{ backgroundColor: theme === "light" ? "white" : "#0c1117" }}
    >
      <MDEditor.Markdown source={text} />
    </div>
  );
}
