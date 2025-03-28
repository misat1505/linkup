import Loading from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/contexts/ChatProvider";
import { queryKeys } from "@/lib/queryKeys";
import { ChatService } from "@/services/Chat.service";
import { FileService } from "@/services/File.service";
import { Chat } from "@/types/Chat";
import { buildFileURL } from "@/utils/buildFileURL";
import { sortChatsByActivity } from "@/utils/sortChatsByActivity";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUserGroup } from "react-icons/fa6";
import { useQuery, useQueryClient } from "react-query";

export default function ChatInfoUpdater() {
  const { chat } = useChatContext();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.downloadFile(chat!.photoURL!),
    queryFn: () =>
      FileService.downloadFile(
        buildFileURL(chat!.photoURL, { type: "chat-photo", id: chat!.id }),
        chat!.photoURL
      ),
  });

  if (isLoading)
    return (
      <div className="relative h-32 w-full">
        <Loading />
      </div>
    );

  return <Updater file={data || null} />;
}

function Updater({ file }: { file: File | null }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { chat } = useChatContext();
  const [image, setImage] = useState(file);
  const [groupName, setGroupName] = useState(chat?.name);

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const newValue = text || null;
    setGroupName(newValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedChat = await ChatService.updateChat(
      chat!.id,
      groupName || null,
      image
    );

    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (!oldChats) return [];

      const filteredChats = oldChats.filter((c) => c.id !== chat!.id);
      filteredChats.push(updatedChat);
      return sortChatsByActivity(filteredChats);
    });
  };

  const source = useMemo(() => {
    return image ? URL.createObjectURL(image) : "";
  }, [image]);

  return (
    <form
      className="mx-auto mt-4 flex max-w-60 flex-col items-center gap-4"
      onSubmit={handleSubmit}
    >
      <Input
        value={groupName || ""}
        onChange={handleTextChange}
        placeholder={t("chats.settings.group.info.input.name.placeholder")}
      />
      <div className="group relative mt-8">
        {source ? (
          <img
            className="h-32 w-32 overflow-hidden rounded-full object-cover"
            src={source}
          />
        ) : (
          <FaUserGroup className="h-32 w-32 overflow-hidden rounded-full pt-8" />
        )}
        {source && (
          <button
            onClick={handleRemoveFile}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:cursor-pointer group-hover:opacity-100"
          >
            {t("chats.settings.group.info.input.file.remove")}
          </button>
        )}
      </div>
      <Input
        type="file"
        className="hover:cursor-pointer"
        onChange={handleFileChange}
        accept=".jpg, .png, .webp"
      />
      <Button className="self-end" type="submit">
        {t("chats.settings.group.info.submit")}
      </Button>
    </form>
  );
}
