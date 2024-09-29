import React from "react";
import { Input } from "../ui/input";
import { usePostCommentsSectionContext } from "../../contexts/PostCommentSectionProvider";
import { ClipLoader } from "react-spinners";
import Tooltip from "../common/Tooltip";
import { IoSend } from "react-icons/io5";
import { cn } from "../../lib/utils";
import { useAppContext } from "../../contexts/AppProvider";
import { MdCancel } from "react-icons/md";

export default function PostCommentForm() {
  const { register, submitForm, response } = usePostCommentsSectionContext();

  return (
    <form
      onSubmit={submitForm}
      className="mt-2 rounded-md bg-slate-100 px-4 py-2 dark:bg-slate-900"
    >
      {response && <ResponseDisplayer />}
      <div className="flex items-center gap-x-2 pt-2">
        <Input placeholder="Leave your comment..." {...register("content")} />
        <SubmitFormButton />
      </div>
    </form>
  );
}

function SubmitFormButton() {
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
        <Tooltip content="Send message">
          <span>
            <IoSend
              className={cn("text-blue-500 transition-all", {
                "opacity-40": isSubmitting,
                "hover:scale-110": !isSubmitting
              })}
            />
          </span>
        </Tooltip>
      )}
    </button>
  );
}

function ResponseDisplayer() {
  const { user: me } = useAppContext();
  const { response, setResponse } = usePostCommentsSectionContext();

  const getReplyText = (): string => {
    if (response!.author.id === me!.id) return "Replying to yourself.";
    return `Replying to ${response?.author.firstName} ${response?.author.lastName}.`;
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <h2 className="my-1 font-semibold">{getReplyText()}</h2>
        <p>{response?.content}</p>
      </div>
      <Tooltip content="Remove reply">
        <button onClick={() => setResponse(null)}>
          <MdCancel className="transition-all hover:scale-110" />
        </button>
      </Tooltip>
    </div>
  );
}
