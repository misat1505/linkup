import { useAppContext } from "../../contexts/AppProvider";
import { Message as MessageType } from "../../models/Message";
import React from "react";
import { cn } from "../../lib/utils";
import MultimediaDisplay from "./MultimediaDisplay";
import { API_URL } from "../../constants";
import Avatar from "../common/Avatar";
import { useChatContext } from "../../contexts/ChatProvider";
import { isShowingAvatar } from "../../utils/isShowingAvatar";
import { getInitials } from "../../utils/getInitials";
import Response from "./Response";

export default function Message({ message }: { message: MessageType }) {
  const { user: me } = useAppContext();
  if (!me) throw new Error();

  const isMine = message.author.id === me.id;

  if (isMine) return <MyMessage message={message} />;
  return <ForeignMessage message={message} />;
}

function MyMessage({ message }: { message: MessageType }) {
  const { messageRefs } = useChatContext();

  return (
    <div
      className="flex w-full flex-col items-end"
      ref={(el) => (messageRefs.current[message.id] = el)}
    >
      {message.response && <Response message={message.response} />}

      <MultimediaDisplay files={message.files} />

      {message.content && (
        <div
          className={cn(
            "mb-1 w-fit max-w-[75%] rounded-b-md bg-blue-500 px-2 py-1 text-white",
            {
              "rounded-md": message.files.length === 0
            }
          )}
        >
          {message.content}
        </div>
      )}
    </div>
  );
}

function ForeignMessage({ message }: { message: MessageType }) {
  const { messages, messageRefs } = useChatContext();
  const isDisplayingAvatar = isShowingAvatar(messages!, message);

  const { firstName, lastName } = message.author;

  return (
    <div
      className="flex w-full flex-col items-start"
      ref={(el) => (messageRefs.current[message.id] = el)}
    >
      {message.response && (
        <div className="ml-10">
          <Response message={message.response} />
        </div>
      )}
      <div className="flex w-full items-end gap-x-2">
        <div className="h-8 w-8">
          {isDisplayingAvatar && (
            <Avatar
              src={`${API_URL}/files/${message.author.photoURL}`}
              alt={getInitials({ firstName, lastName })}
              className="h-8 w-8 object-cover text-xs"
            />
          )}
        </div>

        <div className="w-full">
          <MultimediaDisplay files={message.files} />

          {message.content && (
            <div
              className={cn(
                "mb-1 w-fit max-w-[75%] rounded-b-md bg-slate-200 px-2 py-1",
                {
                  "rounded-md": message.files.length === 0
                }
              )}
            >
              {message.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
