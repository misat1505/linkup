import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { PiFilesFill } from "react-icons/pi";
import { useQuery, useQueryClient } from "react-query";
import { queryKeys } from "../../lib/queryKeys";
import { FileService } from "../../services/File.service";
import Loading from "../common/Loading";
import Image from "../common/Image";
import Tooltip from "../common/Tooltip";
import { MdDelete, MdOutlineDelete } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog";
import { IoMdAdd } from "react-icons/io";
import { FaCopy } from "react-icons/fa";
import { useRef } from "react";
import { useToast } from "../ui/use-toast";
import { Post } from "../../types/Post";

export default function FileDialog({ content }: { content?: Post["content"] }) {
  function extractUrlsFromMarkdown(content: Post["content"]): string[] {
    const urlRegex = /!\[.*?\]\(\s*(.*?)\s*\)|<img[^>]+src="([^"]+)"/g;
    const urls: string[] = [];
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      if (match[1]) {
        urls.push(match[1]);
      } else if (match[2]) {
        urls.push(match[2]);
      }
    }

    return urls;
  }

  const getPreviouslyUsedURLs = (): string[] | null => {
    if (!content) return null;
    return extractUrlsFromMarkdown(content);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>
          <PiFilesFill />
        </span>
      </DialogTrigger>
      <FileDialogContent previousURLs={getPreviouslyUsedURLs()} />
    </Dialog>
  );
}

function FileDialogContent({
  previousURLs
}: {
  previousURLs: string[] | null;
}) {
  const getValidURLs = (): string[] | null => {
    if (!previousURLs) return null;
    const validURLs: string[] = [];
    for (const url of previousURLs) {
      try {
        const urlObject = new URL(url);
        const filter = urlObject.searchParams.get("filter");
        if (!validURLs.includes(url) && filter === "post") validURLs.push(url);
      } catch (e) {}
    }
    return validURLs;
  };

  const validPreviousURLs = getValidURLs();

  const { isLoading, data: files } = useQuery({
    queryKey: queryKeys.cache(),
    queryFn: FileService.getCache
  });

  if (isLoading) return <Loading />;

  if (!files) return <div>No files in cache.</div>;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Browse files</DialogTitle>
        <DialogDescription>
          Copy urls from files from your cache to input them to your post.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {validPreviousURLs && (
          <>
            <h2>Used files</h2>

            <div className="flex flex-wrap items-center gap-2">
              {validPreviousURLs.map((file, idx) => (
                <div key={idx} className="relative aspect-square h-32">
                  <div className="absolute right-4 top-4 flex items-center">
                    <CopyURLToClipboardButton file={file} />
                  </div>
                  <Image
                    key={idx}
                    src={file}
                    className={{ common: "h-full w-full object-cover" }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        <div className="flex items-center gap-x-2">
          <h2>Cache</h2>
          <CacheFileUploader />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative aspect-square h-32">
              <FileDialogImageButtons file={file} />
              <Image
                key={idx}
                src={file}
                className={{ common: "h-full w-full object-cover" }}
              />
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  );
}

function FileDialogImageButtons({ file }: { file: string }) {
  const queryClient = useQueryClient();

  const deleteFile = async () => {
    await FileService.removeFromCache(file);

    queryClient.setQueryData<string[]>(queryKeys.cache(), (oldPaths) => {
      if (!oldPaths) return [];
      return oldPaths.filter((p) => p !== file);
    });
  };

  return (
    <div className="absolute right-4 top-4 flex items-center gap-x-2">
      <CopyURLToClipboardButton file={file} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="border-none">
            <Tooltip content="Remove file">
              <span>
                <AiFillDelete
                  className="stroke-black text-white transition-all hover:scale-110 hover:cursor-pointer"
                  style={{
                    strokeWidth: "32"
                  }}
                />
              </span>
            </Tooltip>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              file from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteFile}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CopyURLToClipboardButton({ file }: { file: string }) {
  const { toast } = useToast();
  const copyFileURLToClipboard = async () => {
    await navigator.clipboard.writeText(file);

    toast({
      title: "URL copied to clipboard."
    });
  };

  return (
    <button onClick={copyFileURLToClipboard}>
      <Tooltip content="Copy URL">
        <span>
          <FaCopy
            className="stroke-black text-white transition-all hover:scale-110 hover:cursor-pointer"
            style={{ strokeWidth: "16" }}
          />
        </span>
      </Tooltip>
    </button>
  );
}

function CacheFileUploader() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    const newFilename = await FileService.insertFileToCache(file);

    queryClient.setQueryData<string[]>(queryKeys.cache(), (oldPaths) => {
      if (!oldPaths) return [];
      return [...oldPaths, newFilename];
    });
  };

  return (
    <>
      <input
        type="file"
        onChange={handleImageUpload}
        className="hidden"
        accept=".jpg, .png, .webp"
        ref={inputRef}
      />
      <Tooltip content="Upload file">
        <span>
          <IoMdAdd
            onClick={() => inputRef.current?.click()}
            className="transition-all hover:scale-110 hover:cursor-pointer"
          />
        </span>
      </Tooltip>
    </>
  );
}
