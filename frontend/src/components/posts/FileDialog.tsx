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
import { MdDelete } from "react-icons/md";
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

export default function FileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>
          <PiFilesFill />
        </span>
      </DialogTrigger>
      <FileDialogContent />
    </Dialog>
  );
}

function FileDialogContent() {
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
        <div className="flex items-center gap-x-2">
          <h2>Cache</h2>
          <CacheFileUploader />
        </div>
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
    </DialogContent>
  );
}

function FileDialogImageButtons({ file }: { file: string }) {
  const queryClient = useQueryClient();

  const copyFileURLToClipboard = async () => {
    await navigator.clipboard.writeText(file);
  };

  const deleteFile = async () => {
    await FileService.removeFromCache(file);

    queryClient.setQueryData<string[]>(queryKeys.cache(), (oldPaths) => {
      if (!oldPaths) return [];
      return oldPaths.filter((p) => p !== file);
    });
  };

  return (
    <div className="absolute right-4 top-4 flex items-center gap-x-2">
      <button onClick={copyFileURLToClipboard}>
        <Tooltip content="Copy URL">
          <span>
            <FaCopy className="text-white transition-all hover:scale-110 hover:cursor-pointer" />
          </span>
        </Tooltip>
      </button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button>
            <Tooltip content="Remove file">
              <span>
                <MdDelete className="text-white transition-all hover:scale-110 hover:cursor-pointer" />
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
