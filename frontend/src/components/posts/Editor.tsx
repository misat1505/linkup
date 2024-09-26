import { API_URL } from "../../constants";
import { useThemeContext } from "../../contexts/ThemeProvider";
import MDEditor, { ICommand, commands } from "@uiw/react-md-editor";
import React from "react";
import { FaSave } from "react-icons/fa";
import { useEditorContext } from "../../contexts/EditorProvider";
import { useToast } from "../ui/use-toast";
import Image from "../common/Image";

export default function Editor() {
  const { markdown, handleSafeChange, handleSave, variant } =
    useEditorContext();
  const { toast } = useToast();
  const { theme } = useThemeContext();

  const buttonText = variant === "new" ? "Save" : "Update";

  const successText =
    variant === "new"
      ? "Post created successfully."
      : "Post updated successfully.";

  const failureText =
    variant === "new" ? "Cannot create post." : "Cannot update post.";

  const customCommands: ICommand[] = [
    {
      name: buttonText,
      keyCommand: buttonText,
      buttonProps: { "aria-label": buttonText, title: buttonText },
      icon: <FaSave />,
      execute: async (state, api) => {
        try {
          await handleSave();
          toast({
            title: successText
          });
        } catch (e) {
          toast({
            variant: "destructive",
            title: failureText
          });
        }
      }
    }
  ];

  return (
    <div data-color-mode={theme} className="w-full">
      <MDEditor
        value={markdown}
        onChange={(text) => handleSafeChange(text || "")}
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
              return (
                <Image
                  src={props.src!}
                  alt={props.alt || "image"}
                  unloader={<div>{props.alt}</div>}
                />
              );
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
