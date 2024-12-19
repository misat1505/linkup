import { useAppContext } from "@/contexts/AppProvider";
import { useChatContext } from "@/contexts/ChatProvider";
import { Message as MessageType } from "@/types/Message";
import { timeDifference } from "@/utils/timeDifference";
import moment from "moment";
import MessageControls from "./MessageControls";
import Tooltip from "../common/Tooltip";
import ResponseText from "./ResponseText";
import Response from "./Response";
import MultimediaDisplay from "./MultimediaDisplay";
import { cn } from "@/lib/utils";
import Reactions from "./Reactions";
import { isShowingAvatar } from "@/utils/isShowingAvatar";
import { ChatUtils } from "@/utils/chatUtils";
import { createFullName } from "@/utils/createFullName";
import Avatar from "../common/Avatar";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";

export default function Message({ message }: { message: MessageType }) {
  const { user: me } = useAppContext();
  const { messages } = useChatContext();
  if (!me || !messages) throw new Error();

  const isMine = message.author.id === me.id;

  const Component = isMine ? MyMessage : ForeignMessage;

  const compareWithNow = (): string => {
    const diffWithNow = timeDifference(message.createdAt);

    if (diffWithNow.days === 0)
      return message.createdAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

    if (diffWithNow.days < 7)
      return message.createdAt.toLocaleDateString("en-US", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      });

    return message.createdAt.toLocaleDateString("en-US", tooltipDateFormat);
  };

  const getDateText = (): string => {
    const idx = messages.findIndex((m) => m.id === message.id);
    if (idx === 0) return compareWithNow();

    const prevMessage = messages[idx - 1];
    const diff = timeDifference(
      prevMessage.createdAt,
      moment(message.createdAt)
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

const tooltipDateFormat = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
} as const;

function MyMessage({ message }: { message: MessageType }) {
  const { messageRefs } = useChatContext();

  const tooltipText = `${message.createdAt.toLocaleDateString(
    "en-US",
    tooltipDateFormat
  )} by You`;

  return (
    <div className="group flex items-center justify-end gap-x-4">
      <MessageControls message={message} />
      <Tooltip content={tooltipText}>
        <div
          className="flex w-fit max-w-[75%] flex-col items-end"
          ref={(el) => (messageRefs.current[message.id] = el)}
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
                }
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
  const { user: me } = useAppContext();
  const { messages, messageRefs, chat } = useChatContext();
  const isDisplayingAvatar = isShowingAvatar(messages!, message);

  if (!chat || !me) throw new Error();

  const utils = new ChatUtils(chat, me);
  const utilsText = utils.getDisplayNameById(message.author.id);
  const authorDispayName = utilsText || createFullName(message.author);

  const tooltipText = `${message.createdAt.toLocaleDateString(
    "en-US",
    tooltipDateFormat
  )} by ${authorDispayName}`;

  return (
    <div
      className={cn("group flex items-center justify-start gap-x-4", {
        "mb-2": isDisplayingAvatar,
      })}
    >
      <Tooltip content={tooltipText}>
        <div
          className="flex w-fit max-w-[75%] flex-col items-start"
          ref={(el) => (messageRefs.current[message.id] = el)}
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
                    }
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
