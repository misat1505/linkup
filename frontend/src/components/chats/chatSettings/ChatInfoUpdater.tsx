import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useChatContext } from "../../../contexts/ChatProvider";
import { FileService } from "../../../services/File.service";
import { buildFileURL } from "../../../utils/buildFileURL";
import Image from "../../common/Image";
import { FaUserGroup } from "react-icons/fa6";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { ChatService } from "../../../services/Chat.service";
import Loading from "../../common/Loading";
import { Chat } from "../../../types/Chat";
import { queryKeys } from "../../../lib/queryKeys";
import { sortChatsByActivity } from "../../../utils/sortChatsByActivity";

export default function ChatInfoUpdater() {
  const { chat } = useChatContext();
  const { data, isLoading } = useQuery({
    queryKey: ["files", chat!.photoURL],
    queryFn: () =>
      FileService.downloadFile(
        buildFileURL(chat!.photoURL, "chat-photo"),
        chat!.photoURL
      )
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
      <Input value={groupName || ""} onChange={handleTextChange} />
      <button onClick={handleRemoveFile} className="group relative mt-8">
        <Image
          className={{
            common: "h-32 w-32 overflow-hidden rounded-full object-cover"
          }}
          src={source}
          errorContent={<FaUserGroup className="h-full w-full pt-8" />}
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:cursor-pointer group-hover:opacity-100">
          Remove
        </div>
      </button>
      <Input
        type="file"
        className="hover:cursor-pointer"
        onChange={handleFileChange}
      />
      <Button variant="blueish" className="self-end" type="submit">
        Save
      </Button>
    </form>
  );
}
