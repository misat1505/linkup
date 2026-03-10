import { I18nText } from "@/components/shared/I18nText";
import { CreateChatTrigger } from "@/features/chats/components/CreateChatTrigger";
import { BsChatLeftTextFill } from "react-icons/bs";

export default function ChatsPage() {
  return (
    <div className="relative hidden grow md:block">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  bg-slate-100 p-8 dark:bg-slate-900 text-center shadow-lg">
        <BsChatLeftTextFill className="mx-auto h-64 w-64 text-muted-foreground" />
        <h2 className="my-4 text-center text-xl font-semibold">
          <I18nText translationKey="chats.no-chat-selected.title" />
        </h2>
        <p className="max-w-64 text-muted-foreground text-sm text-center">
          <I18nText translationKey="chats.no-chat-selected.description" />
        </p>
        <CreateChatTrigger />
      </div>
    </div>
  );
}
