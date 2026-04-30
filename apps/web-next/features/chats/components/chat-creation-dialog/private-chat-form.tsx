"use client";
import { Input } from "@/components/ui/input";
import useUserSearch from "@/hooks/use-user-search";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { User } from "@packages/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPrivateChat } from "../../actions/create-private-chats";
import UserDisplay from "./user-display";

export default function PrivateChatForm() {
  const { t } = useLanguageContext();
  const [text, setText] = useState("");
  const { data } = useUserSearch(text);
  const { user: me } = useAppContext();
  const router = useRouter();

  const handleClick =
    (user: User) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const chat = await createPrivateChat(me!.id, user.id);

      router.push(`/chats/${chat.id}`);
    };

  return (
    <div className="mx-auto max-w-72">
      <Input
        placeholder={t("chats.create-new-chat.private.form.input.placeholder")}
        className="mb-2 mt-4"
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <div className="no-scrollbar max-h-100 overflow-auto">
        {data?.map((user) => (
          <UserDisplay user={user} key={user.id} onClick={handleClick(user)} />
        ))}
      </div>
    </div>
  );
}
