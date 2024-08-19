import React, { useRef } from "react";
import { FaFileAlt } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import { IoSend } from "react-icons/io5";
import { Input } from "../ui/input";
import useChatForm, { ChatFormEntries } from "../../hooks/chats/useChatForm";
import { Chat } from "../../models/Chat";
import { useChatContext } from "../../contexts/ChatProvider";
import { cn } from "../../lib/utils";
import { ClipLoader } from "react-spinners";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger
} from "react-hook-form";

export default function ChatFooter({ chatId }: { chatId: Chat["id"] }) {
  const { isLoading } = useChatContext();
  const { register, submitForm, isSubmitting, files, trigger, setValue } =
    useChatForm(chatId);
  console.log(files);

  const isDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={submitForm} className="bg-slate-100 p-4">
      <FileDisplayer files={files} />
      <div className="flex items-center gap-x-4">
        <FileAdder
          register={register}
          trigger={trigger}
          setValue={setValue}
          files={files}
        />
        <Input
          {...register("content")}
          className="z-20 min-h-8"
          placeholder="Type..."
        />
        <button type="submit" disabled={isDisabled}>
          {isSubmitting ? (
            <ClipLoader size={20} color="grey" />
          ) : (
            <IoSend
              className={cn("text-blue-500 transition-all", {
                "opacity-40": isLoading,
                "hover:scale-125": !isLoading
              })}
            />
          )}
        </button>
      </div>
    </form>
  );
}

function FileAdder({
  register,
  trigger,
  setValue,
  files
}: {
  register: UseFormRegister<ChatFormEntries>;
  trigger: UseFormTrigger<ChatFormEntries>;
  setValue: UseFormSetValue<ChatFormEntries>;
  files: File[] | undefined;
}) {
  const clickInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    trigger("files");
  };

  const prevFiles = files ? files : [];

  return (
    <>
      <input
        {...register("files")}
        onChange={(e) =>
          setValue("files", [
            ...prevFiles,
            ...Array.from(e.currentTarget.files || [])
          ])
        }
        type="file"
        multiple
        className=""
      />
      <button onClick={clickInput}>
        <FaFileAlt className="text-blue-500 transition-all hover:scale-125" />
      </button>
    </>
  );
}

function FileDisplayer({ files }: { files: File[] | undefined }) {
  if (files === undefined || files.length === 0) return null;

  return (
    <div className="flex">
      {files.map((file, id) => (
        <FileDisplayerItem file={file} key={id} />
      ))}
    </div>
  );
}

function FileDisplayerItem({ file }: { file: File }) {
  const getFileType = (file: File): string | null => {
    const mimeType = file.type;
    if (mimeType.startsWith("image/")) {
      return "image";
    } else if (mimeType.startsWith("video/")) {
      return "video";
    } else {
      return "other";
    }
  };
  const type = getFileType(file);

  if (!type) return null;

  if (type === "image")
    return (
      <img
        src={URL.createObjectURL(file)}
        className="h-40 w-40 object-cover"
        alt={file.name}
      />
    );

  if (type === "video")
    return (
      <video className="h-40 w-40 object-cover" controls>
        <source src={URL.createObjectURL(file)} type={file.type} />
        Your browser does not support the video tag.
      </video>
    );

  return (
    <div className="h-40 w-40 overflow-hidden border border-gray-300 p-2">
      <p>{file.name}</p>
    </div>
  );
}
