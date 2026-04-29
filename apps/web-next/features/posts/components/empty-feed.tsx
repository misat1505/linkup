import Image from "next/image";
import logo from "@/assets/logo.webp";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { I18nText } from "@/components/shared/i18n-text";

export default function EmptyFeed() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 p-6 shadow-lg flex flex-col items-center text-center space-y-4 w-72 max-w-[calc(100vw-1rem)]">
      <Image
        src={logo}
        width={144}
        height={144}
        className="rounded-full object-cover"
        alt="Logo"
      />
      <h2 className="text-xl font-semibold">
        <I18nText translationKey="home.feed.empty.title" />
      </h2>
      <p className="text-muted-foreground text-sm">
        <I18nText translationKey="home.feed.empty.description" />
      </p>
      <Link
        href="/posts/editor"
        className={buttonVariants({ variant: "default" })}
      >
        <I18nText translationKey="home.feed.empty.action" />
      </Link>
    </div>
  );
}
