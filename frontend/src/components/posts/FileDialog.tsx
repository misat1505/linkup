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
import ProtectedVideo from "../common/ProtectedVideo";

export default function FileDialog({ content }: { content?: Post["content"] }) {
  function extractUrlsFromMarkdown(content: Post["content"]): string[] {
    const urlRegex =
      /!\[.*?\]\(\s*(.*?)\s*\)|<img[^>]+src="([^"]+)"|<source[^>]+src="([^"]+)"/g;
    const urls: string[] = [];
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      if (match[1]) {
        urls.push(match[1]);
      } else if (match[2]) {
        urls.push(match[2]);
      } else if (match[3]) {
        urls.push(match[3]);
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

  const isImage = (filename: string): boolean => {
    const path = filename.split("?")[0];
    const splitted = path.split("/");
    const file = splitted[splitted.length - 1];
    const splittedExt = file.split(".");
    const ext = splittedExt[splittedExt.length - 1];

    const availableExt = ["webp", "jpg", "jpeg", "png"];
    return availableExt.includes(ext);
  };

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
                  {isImage(file) ? (
                    <Image
                      key={idx}
                      src={file}
                      className={{ common: "h-full w-full object-cover" }}
                    />
                  ) : (
                    <div className="h-32 w-32 overflow-hidden">
                      <ProtectedVideo src={file} />
                    </div>
                  )}
                  <div className="absolute right-4 top-4 flex items-center">
                    <CopyElementToClipboardButton file={file} />
                  </div>
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
              {isImage(file) ? (
                <Image
                  key={idx}
                  src={file}
                  className={{ common: "h-full w-full object-cover" }}
                />
              ) : (
                <div className="h-32 w-32 overflow-hidden">
                  <ProtectedVideo src={file} />
                </div>
              )}
              <FileDialogImageButtons file={file} />
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
      <CopyElementToClipboardButton file={file} />

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

function CopyElementToClipboardButton({ file }: { file: string }) {
  const { toast } = useToast();
  const copyFileURLToClipboard = async () => {
    const noQuery = file.split("?")[0];
    const splitted = noQuery.split(".");
    const ext = splitted[splitted.length - 1];

    if (["webp", "png", "jpg"].includes(ext))
      await navigator.clipboard.writeText(`![image](${file})`);

    if (["mp4"].includes(ext))
      await navigator.clipboard.writeText(
        `<video>
  <source src="${file}" />
</video>`
      );

    toast({
      title: "Element copied to clipboard."
    });
  };

  return (
    <button onClick={copyFileURLToClipboard}>
      <Tooltip content="Copy element">
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
        accept=".jpg, .png, .webp, .mp4"
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
<video>
  <source src="https://localhost:5500/files/93a8c573-fb6a-48b7-b2c4-5fa0c1418f22.mp4?filter=cache" />
</video>;

<video>
  <source src="https://localhost:5500/files/93a8c573-fb6a-48b7-b2c4-5fa0c1418f22.mp4?filter=cache" />
</video>;
