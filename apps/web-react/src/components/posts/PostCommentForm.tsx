import React, { useRef } from "react";
import { IoSend } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { usePostCommentsSectionContext } from "@/contexts/PostCommentSectionProvider";
import { Input } from "../ui/input";
import { ClipLoader } from "react-spinners";
import Tooltip from "../common/Tooltip";
import { useAppContext } from "@/contexts/AppProvider";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { createFullName } from "@/utils/createFullName";

export default function PostCommentForm() {
  const { t } = useTranslation();
  const { register, submitForm, response } = usePostCommentsSectionContext();

  return (
    <>
      <div className="h-2"></div>
      <form
        onSubmit={submitForm}
        className="sticky bottom-0 z-20 rounded-md bg-slate-100 px-4 py-2 dark:bg-slate-900"
      >
        {response && <ResponseDisplayer />}
        <FileDisplayer />
        <div className="flex items-center gap-x-2 pt-2">
          <FileAdder />
          <Input
            placeholder={t("posts.comments.form.inputs.text.placeholder")}
            {...register("content")}
          />
          <SubmitFormButton />
        </div>
      </form>
    </>
  );
}

function SubmitFormButton() {
  const { t } = useTranslation();
  const { isSubmitting } = usePostCommentsSectionContext();

  const isDisabled = isSubmitting;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      data-testid="cy-chat-footer-button"
    >
      {isSubmitting ? (
        <ClipLoader size={20} color="grey" />
      ) : (
        <Tooltip content={t("posts.comments.form.submit.tooltip")}>
          <span>
            <IoSend
              className={cn("text-blue-500 transition-all", {
                "opacity-40": isSubmitting,
                "hover:scale-110": !isSubmitting,
              })}
            />
          </span>
        </Tooltip>
      )}
    </button>
  );
}

function ResponseDisplayer() {
  const { t } = useTranslation();
  const { user: me } = useAppContext();
  const { response, setResponse } = usePostCommentsSectionContext();

  const getReplyText = (): string => {
    if (response!.author.id === me!.id)
      return t("posts.comments.form.reply.to.me");
    return t("posts.comments.form.reply.to.other", {
      fullName: createFullName(response!.author),
    });
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-[calc(100%-2rem)]">
        <h2 className="my-1 font-semibold">{getReplyText()}</h2>
        <p className="overflow-hidden text-nowrap">{response?.content}</p>
      </div>
      <Tooltip content={t("posts.comments.form.reply.remove.tooltip")}>
        <button onClick={() => setResponse(null)}>
          <MdCancel className="transition-all hover:scale-110" />
        </button>
      </Tooltip>
    </div>
  );
}

function FileAdder() {
  const { t } = useTranslation();
  const { register, appendFiles } = usePostCommentsSectionContext();
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
        <Tooltip content={t("posts.comments.form.inputs.file.tooltip")}>
          <span>
            <FaFileAlt className="text-blue-500 transition-all hover:scale-125" />
          </span>
        </Tooltip>
      </button>
    </>
  );
}

function FileDisplayer() {
  const { t } = useTranslation();
  const { files, removeFile } = usePostCommentsSectionContext();
  if (files === undefined || files.length === 0) return null;

  const handleRemoveFile = (id: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    removeFile(id);
  };

  return (
    <div className="my-4 flex justify-end">
      {files.map((file, id) => (
        <button
          key={id}
          className="group relative h-40 w-40"
          onClick={handleRemoveFile(id)}
        >
          <FileDisplayerItem file={file} />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:cursor-pointer group-hover:opacity-100">
            {t("posts.comments.form.inputs.file.remove")}
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
