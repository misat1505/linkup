import { useAppContext } from "@/contexts/app-provider";
import { useChatContext } from "@/contexts/chat-provider";
import { createFullName } from "@/utils/create-full-name";
import { Message } from "@packages/schemas";
import { useTranslation } from "react-i18next";

type ResponseProps = { message: Message["response"] };

export default function Response({ message }: ResponseProps) {
  const { t } = useTranslation();
  const { messageRefs } = useChatContext();
  const { user: me } = useAppContext();

  if (!message) throw new Error("Message is required in Response component");

  const getText = () => {
    if (message.content) return message.content.substring(0, 20);
    if (me!.id === message.author.id)
      return t("chats.message.reply.only-files", {
        name: t("common.you"),
        count: message.files.length,
      });

    return t("chats.message.reply.only-files", {
      name: createFullName(message.author),
      count: message.files.length,
    });
  };

  const onclick = () => {
    messageRefs.current[message.id]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      onClick={onclick}
      className="w-fit rounded-md bg-black p-2 text-muted-foreground shadow-lg transition-all hover:cursor-pointer hover:text-slate-400"
      style={{ boxShadow: "0 10px black" }}
    >
      {getText()}
    </div>
  );
}
