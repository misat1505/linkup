"use client";
import { I18nText } from "@/components/shared/I18nText";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BsChatLeftTextFill } from "react-icons/bs";

export default function ChatError() {
  return (
    <div className="relative grow">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 p-8 text-center dark:bg-slate-900 shadow-lg">
        <BsChatLeftTextFill className="mx-auto h-64 w-64 text-red-500" />
        <h2 className="my-4 text-center text-xl font-semibold">
          <I18nText translationKey="chats.chat-unavailable.title" />
        </h2>
        <p className="max-w-64 text-left text-muted-foreground text-sm">
          <I18nText translationKey="chats.chat-unavailable.description" />
        </p>
        <Link
          className={cn("mx-auto mt-4", buttonVariants({ variant: "default" }))}
          href="/chats"
        >
          <I18nText translationKey="chats.chat-unavailable.action" />
        </Link>
      </div>
    </div>
  );
}
