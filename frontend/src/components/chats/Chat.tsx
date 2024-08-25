import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import ChatProvider, { useChatContext } from "../../contexts/ChatProvider";
import { useChatPageContext } from "../../contexts/ChatPageProvider";
import ChatFooterProvider from "../../contexts/ChatFooterProvider";
import { BsChatLeftTextFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { ROUTES } from "../../lib/routes";

export default function ChatGuard() {
  const { createChatTriggerRef } = useChatPageContext();
  const { chatId } = useParams();

  if (!chatId)
    return (
      <div className="relative hidden flex-grow md:block">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-100 p-8 text-muted-foreground">
          <BsChatLeftTextFill className="mx-auto h-64 w-64" />
          <p className="my-4 text-center text-xl font-semibold">
            No chat selected.
          </p>
          <p className="max-w-64">
            Select existing chat in the menu or{" "}
            <span
              className="text-blue-500 underline hover:cursor-pointer"
              onClick={() => createChatTriggerRef.current!.click()}
            >
              create a new one
            </span>
            .
          </p>
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
  const navigate = useNavigate();

  const isUserInChat = chats?.find((c) => c.id === chatId);

  if (error || !isUserInChat)
    return (
      <div className="relative flex-grow">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-100 p-8 text-center text-muted-foreground">
          <BsChatLeftTextFill className="mx-auto h-64 w-64 text-red-500" />
          <p className="my-4 text-center text-xl font-semibold">
            Chat unavailable.
          </p>
          <p className="max-w-64 text-left">
            Selected chat does not exist or is not available for you.
          </p>
          <Button
            variant="blueish"
            className="mx-auto mt-4"
            onClick={() => navigate(ROUTES.CHATS.path)}
          >
            Close
          </Button>
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
