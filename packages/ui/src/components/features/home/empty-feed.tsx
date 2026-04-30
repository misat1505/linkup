import { LINK_COMPONENT, TRANSLATION_COMPONENT } from "../../../config";
import { buttonVariants } from "../../shadcn";

// TODO: do not pass images like this
type EmptyFeedProps = {
  logo: React.ReactNode;
};

export function EmptyFeed({ logo }: EmptyFeedProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 p-6 shadow-lg flex flex-col items-center text-center space-y-4 w-72 max-w-72">
      {logo}
      <h2 className="text-xl font-semibold mt-4">
        <TRANSLATION_COMPONENT translationKey="home.feed.empty.title" />
      </h2>
      <p className="text-muted-foreground text-sm mt-4">
        <TRANSLATION_COMPONENT translationKey="home.feed.empty.description" />
      </p>
      <LINK_COMPONENT
        href="/posts/editor"
        className={buttonVariants({ variant: "default", className: "mt-4" })}
      >
        <TRANSLATION_COMPONENT translationKey="home.feed.empty.action" />
      </LINK_COMPONENT>
    </div>
  );
}
