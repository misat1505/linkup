import React, { useState } from "react";
import { useQuery } from "react-query";
import { useChatContext } from "../../../contexts/ChatProvider";
import { FileService } from "../../../services/File.service";
import { buildFileURL } from "../../../utils/buildFileURL";
import Image from "../../common/Image";
import { cn } from "../../../lib/utils";
import { FaUserGroup } from "react-icons/fa6";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

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

  if (isLoading) return <div>loading...</div>;

  // if (!data) return <div>no image</div>;

  // const imageUrl = URL.createObjectURL(data);

  const fileData = data ? URL.createObjectURL(data) : null;
  return <Updater file={fileData} />;
}

function Updater({ file }: { file: string | null }) {
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
      const objectUrl = URL.createObjectURL(selectedFile);
      setImage(objectUrl);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const newValue = text || null;
    setGroupName(newValue);
  };

  return (
    <form className="mx-auto mt-4 flex max-w-60 flex-col items-center gap-4">
      <Input value={groupName || ""} onChange={handleTextChange} />
      <button onClick={handleRemoveFile} className="group relative mt-8">
        <Image
          className={{
            common: "h-32 w-32 overflow-hidden rounded-full object-cover"
          }}
          src={image!}
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
      <Button variant="blueish" className="self-end">
        Save
      </Button>
    </form>
  );
}
