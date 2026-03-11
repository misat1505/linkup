import Image from "@/components/shared/Image";
import { buildFileURL, Filter } from "@/utils/buildFileURL";
import { FaUserGroup } from "react-icons/fa6";
import { ChatUtils } from "../utils/chatUtils";
import { useChatContext } from "../providers/ChatProvider";
import { useAppContext } from "@/providers/AppProvider";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { I18nText } from "@/components/shared/I18nText";

export default function ChatStarted() {
  const { t } = useLanguageContext();
  const { user: me } = useAppContext();
  const { chat } = useChatContext();

  const utils = new ChatUtils(chat!, me!);

  const src = utils.getImageURL()!;
  const alt =
    chat!.type === "PRIVATE" ? (
      utils.getImageAlt()
    ) : (
      <FaUserGroup className="object-fit h-[90%] w-[90%] pt-8 mt-4" />
    );
  const chatName = utils.getChatName();

  const buildFilter = (): Filter => {
    if (chat!.type === "PRIVATE") return { type: "avatar" };
    return { type: "chat-photo", id: chat!.id };
  };

  return (
    <div className="flex flex-col items-center mt-12 mb-16">
      <Image
        src={buildFileURL(src, buildFilter())}
        errorContent={alt}
        className={{
          common: "h-40 w-40 mb-4 rounded-full",
          error:
            "text-6xl font-semibold bg-white dark:bg-black overflow-hidden",
        }}
      />
      <h2 className="font-bold text-2xl mb-4">{chatName}</h2>
      <p className="text-muted-foreground mb-2 font-bold text-balance text-center">
        {t("chats.chat-start.created-at", {
          date: chat?.createdAt.toLocaleDateString(
            t("chats.date-seperator.locale"),
            JSON.parse(t("chats.date-seperator.options.message-tooltip")),
          ),
        })}
      </p>
      <p className="text-sm text-muted-foreground text-balance text-center">
        <I18nText translationKey="chats.chat-start.greeting" />
      </p>
    </div>
  );
}
