import React, { useRef } from "react";
import { FaFileAlt } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import { IoSend } from "react-icons/io5";
import { Input } from "../ui/input";
import { useChatContext } from "../../contexts/ChatProvider";
import { cn } from "../../lib/utils";
import { ClipLoader } from "react-spinners";
import { useChatFooterContext } from "../../contexts/ChatFooterProvider";
import { useAppContext } from "../../contexts/AppProvider";
import { RxCross2 } from "react-icons/rx";
import { ChatFooterUtils } from "../../utils/chatFooterUtils";

export default function ChatFooter() {
  const { isLoading } = useChatContext();
  const { register, submitForm, isSubmitting } = useChatFooterContext();

  const isDisabled = isLoading || isSubmitting;

  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitForm();
    }
  };

  return (
    <form onSubmit={submitForm} className="bg-slate-200 p-4">
      <ResponseDisplayer />
      <FileDisplayer />
      <div className="flex items-center gap-x-4">
        <FileAdder />
        <Input
          {...register("content")}
          className="z-20 min-h-8"
          placeholder="Type..."
          onKeyDown={handleTextInputKeyDown}
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

function FileAdder() {
  const { register, appendFiles } = useChatFooterContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const clickInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleAppendFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    appendFiles(Array.from(e.currentTarget.files || []));
    e.currentTarget.value = "";
  };

  const { ref, ...rest } = register("files");

  return (
    <>
      <input
        ref={inputRef}
        {...rest}
        onChange={handleAppendFiles}
        type="file"
        multiple
        className="hidden"
      />
      <button onClick={clickInput}>
        <FaFileAlt className="text-blue-500 transition-all hover:scale-125" />
      </button>
    </>
  );
}

function FileDisplayer() {
  const { files, removeFile } = useChatFooterContext();
  if (files === undefined || files.length === 0) return null;

  const handleRemoveFile = (id: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    removeFile(id);
  };

  return (
    <div className="mb-4 flex justify-end">
      {files.map((file, id) => (
        <button
          key={id}
          className="group relative h-40 w-40"
          onClick={handleRemoveFile(id)}
        >
          <FileDisplayerItem file={file} />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:cursor-pointer group-hover:opacity-100">
            Remove File
          </div>
        </button>
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
        className="h-full w-full object-cover"
        alt={file.name}
      />
    );

  if (type === "video")
    return (
      <video className="h-full w-full object-cover" controls>
        <source src={URL.createObjectURL(file)} type={file.type} />
        Your browser does not support the video tag.
      </video>
    );

  return (
    <div className="h-full w-full overflow-hidden border border-gray-300 p-2">
      <p>{file.name}</p>
    </div>
  );
}

function ResponseDisplayer() {
  const { user: me } = useAppContext();
  const { messages } = useChatContext();
  const { responseId, setResponse } = useChatFooterContext();
  const message = messages?.find((m) => m.id === responseId);
  if (!me) throw new Error();

  if (!message) return null;

  const utils = new ChatFooterUtils(message, me);

  return (
    <div className="flex w-full items-center justify-between pb-4">
      <div>
        <h2 className="font-semibold">{utils.getReplyAuthorText()}.</h2>
        <p className="overflow-hidden text-nowrap">{utils.getReplyText()}</p>
      </div>
      <button onClick={() => setResponse(null)}>
        <RxCross2 size={20} className="transition-all hover:scale-125" />
      </button>
    </div>
  );
}
