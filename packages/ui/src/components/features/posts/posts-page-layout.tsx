import { PropsWithChildren } from "react";
import { LINK_COMPONENT, TRANSLATION_COMPONENT } from "../../../config";
import { buttonVariants } from "../../shadcn/button";

type PostsPageLayoutProps = PropsWithChildren;

const PostsPageLayout = ({ children }: PostsPageLayoutProps) => {
  return (
    <div className="flex flex-col items-center">
      <LINK_COMPONENT
        className={buttonVariants({ variant: "default", className: "my-4" })}
        data-testid="cy-redirect-to-create-post-btn"
        href="/posts/editor"
      >
        <TRANSLATION_COMPONENT translationKey="posts.new.button" />
      </LINK_COMPONENT>
      <div className="flex w-full flex-col items-center">{children}</div>
    </div>
  );
};

export { PostsPageLayout };
