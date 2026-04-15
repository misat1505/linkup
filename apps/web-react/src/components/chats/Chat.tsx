import { Link, useParams } from "react-router-dom";
import { BsChatLeftTextFill } from "react-icons/bs";
import { useChatPageContext } from "@/contexts/ChatPageProvider";
import ChatProvider, { useChatContext } from "@/contexts/ChatProvider";
import { Button, buttonVariants } from "../ui/button";
import { ROUTES } from "@/lib/routes";
import ChatHeader from "./ChatHeader";
import ChatFooterProvider from "@/contexts/ChatFooterProvider";
import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function ChatGuard() {
  const { t } = useTranslation();
  const { createChatTriggerRef } = useChatPageContext();
  const { chatId } = useParams();

  if (!chatId)
    return (
      <div className="relative hidden flex-grow md:block">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  bg-slate-100 p-8 dark:bg-slate-900 text-center shadow-lg">
          <BsChatLeftTextFill className="mx-auto h-64 w-64 text-muted-foreground" />
          <h2 className="my-4 text-center text-xl font-semibold">
            {t("chats.no-chat-selected.title")}
          </h2>
          <p className="max-w-64 text-muted-foreground text-sm text-center">
            {t("chats.no-chat-selected.description")}
          </p>
          <Button
            onClick={() => createChatTriggerRef.current!.click()}
            className="mt-4 mx-auto"
          >
            {t("chats.no-chat-selected.action")}
          </Button>
        </div>
      </div>
    );

  return (
    <ChatProvider key={chatId} chatId={chatId}>
      <Chat />
    </ChatProvider>
  );
}

function Chat() {
  const { t } = useTranslation();
  const { error, chatId } = useChatContext();
  const { chats } = useChatPageContext();

  const isUserInChat = chats?.find((c) => c.id === chatId);

  if (error || !isUserInChat)
    return (
      <div className="relative flex-grow">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 p-8 text-center dark:bg-slate-900 shadow-lg">
          <BsChatLeftTextFill className="mx-auto h-64 w-64 text-red-500" />
          <h2 className="my-4 text-center text-xl font-semibold">
            {t("chats.chat-unavailable.title")}
          </h2>
          <p className="max-w-64 text-left text-muted-foreground text-sm">
            {t("chats.chat-unavailable.description")}
          </p>
          <Link
            className={cn(
              "mx-auto mt-4",
              buttonVariants({ variant: "default" })
            )}
            to={ROUTES.CHATS.$path()}
          >
            {t("chats.chat-unavailable.action")}
          </Link>
        </div>
      </div>
    );

  return (
    <div className="w-[calc(100vw-20rem)] flex-grow">
      <div className="flex h-full w-full flex-col">
        <ChatHeader chatId={chatId} />
        <ChatFooterProvider chatId={chatId}>
          <ChatContent />
          <ChatFooter />
        </ChatFooterProvider>
      </div>
    </div>
  );
}
