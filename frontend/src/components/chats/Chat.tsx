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

export default function ChatGuard() {
  const { createChatTriggerRef } = useChatPageContext();
  const { chatId } = useParams();

  if (!chatId)
    return (
      <div className="relative hidden flex-grow md:block">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  bg-slate-100 p-8 dark:bg-slate-900 text-center shadow-lg">
          <BsChatLeftTextFill className="mx-auto h-64 w-64 text-muted-foreground" />
          <h2 className="my-4 text-center text-xl font-semibold">
            No chat selected.
          </h2>
          <p className="max-w-64 text-muted-foreground text-sm text-center">
            Select existing chat in the menu or
          </p>
          <Button
            onClick={() => createChatTriggerRef.current!.click()}
            className="mt-4 mx-auto"
          >
            Create new chat
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
  const { error, chatId } = useChatContext();
  const { chats } = useChatPageContext();

  const isUserInChat = chats?.find((c) => c.id === chatId);

  if (error || !isUserInChat)
    return (
      <div className="relative flex-grow">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 p-8 text-center dark:bg-slate-900 shadow-lg">
          <BsChatLeftTextFill className="mx-auto h-64 w-64 text-red-500" />
          <h2 className="my-4 text-center text-xl font-semibold">
            Chat unavailable.
          </h2>
          <p className="max-w-64 text-left text-muted-foreground text-sm">
            Selected chat does not exist or is not available for you.
          </p>
          <Link
            className={cn(
              "mx-auto mt-4",
              buttonVariants({ variant: "default" })
            )}
            to={ROUTES.CHATS.$path()}
          >
            Close
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
