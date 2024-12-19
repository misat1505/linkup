import { useAppContext } from "@/contexts/AppProvider";
import { useChatContext } from "@/contexts/ChatProvider";
import { Message } from "@/types/Message";
import { createFullName } from "@/utils/createFullName";

type ResponseProps = { message: Message["response"] };

export default function Response({ message }: ResponseProps) {
  const { messageRefs } = useChatContext();
  const { user: me } = useAppContext();

  if (!message) throw new Error("Message is required in Response component");

  const getText = () => {
    if (message.content) return message.content.substring(0, 20);
    if (me!.id === message.author.id)
      return `You sent ${message.files.length} file(s).`;

    return `${createFullName(message.author)} sent ${
      message.files.length
    } file(s).`;
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
