import { API_URL } from "../../constants";
import { useThemeContext } from "../../contexts/ThemeProvider";
import MDEditor, { ICommand, commands } from "@uiw/react-md-editor";
import React from "react";
import DOMPurify from "dompurify";
import { FaSave } from "react-icons/fa";
import { PostService } from "../../services/Post.service";

export default function Editor({
  markdown,
  setMarkdown
}: {
  markdown: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { theme } = useThemeContext();
  const decodeHTMLEntities = (text: string): string => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const customCommands: ICommand[] = [
    {
      name: "Save",
      keyCommand: "Save",
      buttonProps: { "aria-label": "Save", title: "Save" },
      icon: <FaSave />,
      execute: async (state, api) => {
        console.log(await PostService.createPost(markdown));
      }
    }
  ];

  const sanitizeMarkdownWithCodeBlocks = (text: string): string => {
    const codeBlockRegex = /```[\s\S]*?```/g;

    const codeBlocks: string[] = [];

    const sanitizedText = text.replace(codeBlockRegex, (match) => {
      codeBlocks.push(match);
      return `PLACEHOLDER_CODE_BLOCK_${codeBlocks.length - 1}`;
    });

    const purifiedText = DOMPurify.sanitize(sanitizedText);

    const finalText = purifiedText.replace(
      /PLACEHOLDER_CODE_BLOCK_(\d+)/g,
      (match, index) => {
        return codeBlocks[parseInt(index, 10)];
      }
    );

    return finalText;
  };

  return (
    <div data-color-mode={theme} className="flex-grow">
      <MDEditor
        value={markdown}
        onChange={(text) =>
          setMarkdown(decodeHTMLEntities(sanitizeMarkdownWithCodeBlocks(text!)))
        }
        extraCommands={[...commands.getExtraCommands(), ...customCommands]}
        className="!h-[calc(100vh-5rem)] flex-grow !overflow-auto"
        highlightEnable={true}
        previewOptions={{
          components: {
            video({ node, ...props }) {
              return (
                <video {...props} key={props.src} controls>
                  {(props?.children as any)?.map(
                    (child: any, index: number) => {
                      if (child.type !== "source") return null;
                      if (!child.props.src.startsWith(API_URL))
                        return (
                          <div key={index}>Given source is unavailable</div>
                        );

                      return <source key={index} {...child.props} />;
                    }
                  )}
                  Your browser does not support the video tag.
                </video>
              );
            },
            img({ node, ...props }) {
              if (!props.src!.startsWith(API_URL)) {
                return <div>{props.alt || "Image not available"}</div>;
              }
              return <img {...props} alt={props.alt || "image"} />;
            },
            ul(props) {
              return <ul {...props} style={{ listStyle: "disc" }}></ul>;
            },
            ol(props) {
              return <ol {...props} style={{ listStyle: "decimal" }}></ol>;
            }
          }
        }}
      />
    </div>
  );
}
