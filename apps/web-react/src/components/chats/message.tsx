import { useAppContext } from "@/contexts/app-provider";
import { useChatContext } from "@/contexts/chat-provider";
import { cn } from "@/lib/utils";
import { buildFileURL } from "@/utils/build-file-url";
import { ChatUtils } from "@/utils/chat-utils";
import { createFullName } from "@/utils/create-full-name";
import { getInitials } from "@/utils/get-initials";
import { isShowingAvatar } from "@/utils/is-showing-avatar";
import { timeDifference } from "@/utils/time-difference";
import { Message as MessageType } from "@packages/schemas";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Avatar from "../common/avatar";
import Tooltip from "../common/tooltip";
import MessageControls from "./message-controls";
import MultimediaDisplay from "./multimedia-display";
import Reactions from "./reactions";
import Response from "./response";
import ResponseText from "./response-text";

export default function Message({ message }: { message: MessageType }) {
  const { t } = useTranslation();
  const { user: me } = useAppContext();
  const { messages } = useChatContext();
  if (!me || !messages) throw new Error();

  const isMine = message.author.id === me.id;

  const Component = isMine ? MyMessage : ForeignMessage;

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
    const diff = timeDifference(
      prevMessage.createdAt,
      moment(message.createdAt),
    );

    if (diff.days === 0 && diff.hours === 0) return "";

    return compareWithNow();
  };

  const dateText = getDateText();

  return (
    <>
      {dateText && (
        <div className="my-2 text-center text-xs font-semibold text-muted-foreground">
          {dateText}
        </div>
      )}
      <Component message={message} />
    </>
  );
}

function MyMessage({ message }: { message: MessageType }) {
  const { t } = useTranslation();
  const { messageRefs } = useChatContext();

  const date = message.createdAt.toLocaleDateString(
    t("chats.date-seperator.locale"),
    JSON.parse(t("chats.date-seperator.options.message-tooltip")),
  );

  const tooltipText = t("chats.message.tooltip.mine", {
    date,
  });

  return (
    <div className="group flex items-center justify-end gap-x-4">
      <MessageControls message={message} />
      <Tooltip content={tooltipText}>
        <div
          className="flex w-fit max-w-[75%] flex-col items-end"
          ref={(el) => {
            messageRefs.current[message.id] = el;
          }}
        >
          {message.response && (
            <>
              <ResponseText message={message} />
              <Response message={message.response} />
            </>
          )}

          <MultimediaDisplay files={message.files} />

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
            <Reactions reactions={message.reactions} />
          )}
        </div>
      </Tooltip>
    </div>
  );
}

function ForeignMessage({ message }: { message: MessageType }) {
  const { t } = useTranslation();
  const { user: me } = useAppContext();
  const { messages, messageRefs, chat } = useChatContext();
  const isDisplayingAvatar = isShowingAvatar(messages!, message);

  if (!chat || !me) throw new Error();

  const utils = new ChatUtils(chat, me);
  const utilsText = utils.getDisplayNameById(message.author.id);
  const authorDisplayName = utilsText || createFullName(message.author);

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
          ref={(el) => {
            messageRefs.current[message.id] = el;
          }}
        >
          {message.response && (
            <div className="ml-10">
              <ResponseText message={message} />
              <Response message={message.response} />
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
              <MultimediaDisplay files={message.files} />

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
              <Reactions reactions={message.reactions} />
            </div>
          )}
        </div>
      </Tooltip>
      <MessageControls message={message} />
    </div>
  );
}
