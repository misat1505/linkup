import { useChatPageContext } from "@/contexts/ChatPageProvider";
import { cn } from "@/lib/utils";
import { FaUserGroup } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../common/Loading";
import ChatCreator from "./chatCreationDialog/ChatCreator";
import { Chat } from "@/types/Chat";
import { useAppContext } from "@/contexts/AppProvider";
import { ChatUtils } from "@/utils/chatUtils";
import { ROUTES } from "@/lib/routes";
import { buildFileURL, Filter } from "@/utils/buildFileURL";
import Tooltip from "../common/Tooltip";
import Avatar from "../common/Avatar";
import NoChats from "./NoChats";

export default function ChatNavigation() {
  const { chatId } = useParams();
  const { chats, isLoading } = useChatPageContext();

  const classnames = cn("w-full md:w-80", { "hidden md:block": !!chatId });

  if (isLoading)
    return (
      <div className={cn(classnames, "relative")}>
        <Loading />
      </div>
    );

  return (
    <div className={classnames}>
      <ChatNavigationHeader />
      <div
        className="no-scrollbar h-[calc(100vh-8rem)] overflow-auto relative"
        data-testid="cy-chat-nav"
      >
        {chats?.length === 0 && <NoChats />}
        {chats?.map((chat) => (
          <NavigationItem key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
}

function ChatNavigationHeader() {
  return (
    <div className="flex w-full items-center justify-between bg-transparent px-4 py-2 text-white">
      <h2 className="text-lg font-semibold">Chat with others</h2>
      <ChatCreator />
    </div>
  );
}

function NavigationItem({ chat }: { chat: Chat }) {
  const navigate = useNavigate();
  const { user: me } = useAppContext();

  if (!me) throw new Error();

  const utils = new ChatUtils(chat, me);

  const handleOpenChat = (chatId: Chat["id"]) => {
    navigate(ROUTES.CHAT_DETAIL.$buildPath({ params: { chatId } }));
  };

  const src = utils.getImageURL()!;
  const alt =
    chat.type === "PRIVATE" ? (
      utils.getImageAlt()
    ) : (
      <FaUserGroup className="object-fit h-full w-full pt-4" />
    );
  const chatName = utils.getChatName();
  const lastActive = utils.getLastActive();

  const buildFilter = (): Filter => {
    if (chat.type === "PRIVATE") return { type: "avatar" };
    return { type: "chat-photo", id: chat.id };
  };

  return (
    <Tooltip content="Open chat">
      <span>
        <button
          className="mx-4 mb-2 flex w-[calc(100%-2rem)] items-center gap-x-4  bg-slate-100 px-4 py-2 shadow-md transition-all hover:cursor-pointer hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 md:w-72"
          onClick={() => handleOpenChat(chat.id)}
        >
          <Avatar
            src={buildFileURL(src, buildFilter())}
            className="min-h-12 min-w-12"
            alt={alt}
            lastActive={lastActive}
          />
          <div className="overflow-hidden text-left">
            <div className="overflow-hidden text-nowrap font-semibold">
              {chatName}
            </div>
            <div className="overflow-hidden text-nowrap text-sm">
              <LastMessageDisplayer
                chat={chat}
                lastMessage={chat.lastMessage}
              />
            </div>
          </div>
        </button>
      </span>
    </Tooltip>
  );
}

function LastMessageDisplayer({
  lastMessage,
  chat,
}: {
  lastMessage: Chat["lastMessage"];
  chat: Chat;
}) {
  const { user: me } = useAppContext();

  if (!lastMessage) return null;

  const utils = new ChatUtils(chat!, me!);

  const displayName = utils.getNavigationLastMessageDisplayName();

  if (lastMessage.content)
    return (
      <>
        <span className="font-semibold">{displayName}: </span>
        <span>{lastMessage.content?.substring(0, 20)}</span>
      </>
    );

  return (
    <span>
      {displayName} sent {lastMessage.files.length} file(s).
    </span>
  );
}
