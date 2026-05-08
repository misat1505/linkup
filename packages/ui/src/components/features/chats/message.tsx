import { Chat, Message as MessageType, User } from "@packages/schemas";
import { useUiPackageContext } from "../../../config";
import { cn } from "../../../lib/utils";
import { buildFileURL } from "../../../utils/build-file-url";
import { ChatUtils } from "../../../utils/chat-utils";
import { createFullName } from "../../../utils/create-full-name";
import { getInitials } from "../../../utils/get-initials";
import { isShowingAvatar } from "../../../utils/is-showing-avatar";
import { timeDifference } from "../../../utils/time-difference";
import { Avatar } from "../../misc/avatar";
import { Tooltip } from "../../misc/tooltip";
import { MultimediaDisplay } from "./multimedia-display";
import { Reactions } from "./reactions";
import { Response } from "./response";
import { ResponseText } from "./response-text";

export type MessageProps = {
  message: MessageType;
  me: User;
  chat: Chat;
  messages: MessageType[];
  messageRef: (el: HTMLDivElement | null) => void;
  messageControls: React.ReactNode;
  onScrollToMessage: (messageId: MessageType["id"]) => void;
};

export function Message({
  message,
  me,
  chat,
  messages,
  messageRef,
  messageControls,
  onScrollToMessage,
}: MessageProps) {
  const { t } = useUiPackageContext();

  const isMine = message.author.id === me.id;

  const compareWithNow = (): string => {
    const diffWithNow = timeDifference(message.createdAt);

    if (diffWithNow.days === 0)
      return message.createdAt.toLocaleTimeString(
        t("chats.date-seperator.locale"),
        JSON.parse(t("chats.date-seperator.options.short")),
      );

    if (diffWithNow.days < 7)
      return message.createdAt.toLocaleDateString(
        t("chats.date-seperator.locale"),
        JSON.parse(t("chats.date-seperator.options.long")),
      );

    return message.createdAt.toLocaleDateString(
      t("chats.date-seperator.locale"),
      JSON.parse(t("chats.date-seperator.options.message-tooltip")),
    );
  };

  const getDateText = (): string => {
    const idx = messages.findIndex((m) => m.id === message.id);
    if (idx === messages.length - 1) return compareWithNow();

    const prevMessage = messages[idx + 1];
    const diff = timeDifference(prevMessage.createdAt, message.createdAt);

    if (diff.days === 0 && diff.hours === 0) return "";

    return compareWithNow();
  };

  const dateText = getDateText();

  const sharedProps = {
    message,
    me,
    chat,
    messages,
    messageRef,
    messageControls,
    onScrollToMessage,
  };

  return (
    <>
      {dateText && (
        <div className="my-2 text-center text-xs font-semibold text-muted-foreground">
          {dateText}
        </div>
      )}
      {isMine ? (
        <MyMessage {...sharedProps} />
      ) : (
        <ForeignMessage {...sharedProps} />
      )}
    </>
  );
}

type InnerMessageProps = Omit<MessageProps, "me" | "chat" | "messages"> & {
  me: User;
  chat: Chat;
  messages: MessageType[];
};

function MyMessage({
  message,
  me,
  chat,
  messageRef,
  messageControls,
  onScrollToMessage,
}: InnerMessageProps) {
  const { t } = useUiPackageContext();

  const date = message.createdAt.toLocaleDateString(
    t("chats.date-seperator.locale"),
    JSON.parse(t("chats.date-seperator.options.message-tooltip")),
  );

  const tooltipText = t("chats.message.tooltip.mine", { date });

  return (
    <div className="group flex items-center justify-end gap-x-4">
      {messageControls}
      <Tooltip content={tooltipText}>
        <div
          className="flex w-fit max-w-[75%] flex-col items-end"
          ref={messageRef}
        >
          {message.response && (
            <>
              <ResponseText message={message} me={me} chat={chat} />
              <Response
                message={message.response}
                isMe={me.id === message.response.author.id}
                onScrollTo={() => onScrollToMessage(message.response!.id)}
              />
            </>
          )}

          <MultimediaDisplay files={message.files} chatId={chat.id} />

          {message.content && (
            <div
              className={cn(
                "w-fit rounded-b-md bg-blue-500 px-2 py-1 text-white",
                {
                  "rounded-md": message.files.length === 0,
                  "mb-1": message.reactions.length === 0,
                },
              )}
            >
              {message.content}
            </div>
          )}
          {message.reactions.length > 0 && (
            <Reactions reactions={message.reactions} chat={chat} me={me} />
          )}
        </div>
      </Tooltip>
    </div>
  );
}

function ForeignMessage({
  message,
  me,
  chat,
  messages,
  messageRef,
  messageControls,
  onScrollToMessage,
}: InnerMessageProps) {
  const { t } = useUiPackageContext();

  const isDisplayingAvatar = isShowingAvatar(messages, message);

  const utils = new ChatUtils(chat, me);
  const authorDisplayName =
    utils.getDisplayNameById(message.author.id) ||
    createFullName(message.author);

  const date = message.createdAt.toLocaleDateString(
    t("chats.date-seperator.locale"),
    JSON.parse(t("chats.date-seperator.options.message-tooltip")),
  );

  const tooltipText = t("chats.message.tooltip.foreign", {
    date,
    name: authorDisplayName,
  });

  return (
    <div
      className={cn("group flex items-center justify-start gap-x-4", {
        "mb-2": isDisplayingAvatar,
      })}
    >
      <Tooltip content={tooltipText}>
        <div
          className="flex w-fit max-w-[75%] flex-col items-start"
          ref={messageRef}
        >
          {message.response && (
            <div className="ml-10">
              <ResponseText message={message} me={me} chat={chat} />
              <Response
                message={message.response}
                isMe={me.id === message.response.author.id}
                onScrollTo={() => onScrollToMessage(message.response!.id)}
              />
            </div>
          )}
          <div className="flex w-fit items-end gap-x-2">
            <div className="h-8 w-8">
              {isDisplayingAvatar && (
                <Avatar
                  src={buildFileURL(message.author.photoURL, {
                    type: "avatar",
                  })}
                  alt={getInitials(message.author)}
                  className="h-8 w-8 object-cover text-xs"
                />
              )}
            </div>
            <div className="w-fit">
              <MultimediaDisplay files={message.files} chatId={chat.id} />
              {message.content && (
                <div
                  className={cn(
                    "w-fit rounded-b-md bg-slate-200 px-2 py-1 dark:bg-slate-800",
                    {
                      "rounded-md": message.files.length === 0,
                      "mb-1": message.reactions.length === 0,
                    },
                  )}
                >
                  {message.content}
                </div>
              )}
            </div>
          </div>
          {message.reactions.length > 0 && (
            <div className="ml-10">
              <Reactions reactions={message.reactions} chat={chat} me={me} />
            </div>
          )}
        </div>
      </Tooltip>
      {messageControls}
    </div>
  );
}

// import { Message as MessageType } from "@packages/schemas";
// import { useAppContext } from "../../../context";
// import { useChatContext } from "../providers/chat-provider";
// import { Message } from "@packages/ui";
// import { MessageControlsContainer } from "./message-controls-container";

// export function MessageContainer({ message }: { message: MessageType }) {
//   const { user: me } = useAppContext();
//   const { messages, messageRefs, chat } = useChatContext();

//   if (!me || !messages || !chat) throw new Error();

//   return (
//     <Message
//       message={message}
//       me={me}
//       chat={chat}
//       messages={messages}
//       messageRef={(el) => (messageRefs.current[message.id] = el)}
//       messageControls={<MessageControlsContainer message={message} />}
//       onScrollToMessage={(id) =>
//         messageRefs.current[id]?.scrollIntoView({ behavior: "smooth" })
//       }
//     />
//   );
// }
