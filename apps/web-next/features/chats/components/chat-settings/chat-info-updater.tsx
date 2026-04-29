"use client";
import { I18nText } from "@/components/shared/i18n-text";
import Loading from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadFile } from "@/features/files/actions/download-file";
import { queryKeys } from "@/lib/query-keys";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { buildFileURL } from "@/utils/build-file-url";
import { Chat } from "@packages/schemas";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { updateChat } from "../../actions/update-chat";

type ChatInfoUpdaterProps = {
  chat: Chat;
};

export default function ChatInfoUpdater({ chat }: ChatInfoUpdaterProps) {
  const { user: me } = useAppContext();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.downloadFile(me!.photoURL!),
    queryFn: async () => {
      if (!me!.photoURL) return null;

      const data = await downloadFile(
        buildFileURL(chat.photoURL, { type: "chat-photo", id: chat.id }),
      );
      if (!data) return null;

      const file = new File([data.buffer], me!.photoURL, {
        type: data.type,
      });

      return file;
    },
  });

  if (isLoading)
    return (
      <div className="relative h-32 w-full">
        <Loading />
      </div>
    );

  return <Updater file={data || null} chat={chat} />;
}

function Updater({ file, chat }: { file: File | null; chat: Chat }) {
  const { t } = useLanguageContext();
  const [image, setImage] = useState(file);
  const [groupName, setGroupName] = useState(chat.name);

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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

    const formData = new FormData();

    formData.append("name", groupName ?? "");
    if (image) formData.append("file", image);

    await updateChat(chat.id, formData);
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
          <Image
            src={source}
            alt="Group image"
            width={128}
            height={128}
            className="overflow-hidden rounded-full object-cover"
          />
        ) : (
          <FaUserGroup className="h-32 w-32 overflow-hidden rounded-full pt-8" />
        )}
        {source && (
          <button
            onClick={handleRemoveFile}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:cursor-pointer group-hover:opacity-100"
          >
            <I18nText translationKey="chats.settings.group.info.input.file.remove" />
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
        <I18nText translationKey="chats.settings.group.info.submit" />
      </Button>
    </form>
  );
}
