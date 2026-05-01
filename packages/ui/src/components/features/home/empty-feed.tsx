import {
  IMAGE_COMPONENT,
  LINK_COMPONENT,
  LOGO_PATH,
  TRANSLATION_COMPONENT,
} from "../../../config";
import { buttonVariants } from "../../shadcn";

export function EmptyFeed() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 p-6 shadow-lg flex flex-col items-center text-center space-y-4 w-72 max-w-72">
      <IMAGE_COMPONENT
        src={LOGO_PATH}
        className="w-36 h-36 rounded-full object-cover"
        alt="Logo"
        width={144}
        height={144}
      />
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
