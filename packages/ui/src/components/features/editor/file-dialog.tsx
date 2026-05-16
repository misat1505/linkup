"use client";
import { Post } from "@packages/schemas";
import { useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { PiFilesFill } from "react-icons/pi";
import { TRANSLATION_COMPONENT, useUiPackageContext } from "../../../config";
import { Image } from "../../misc/image";
import { Loading } from "../../misc/loading";
import { ProtectedVideo } from "../../misc/protected-video";
import { Tooltip } from "../../misc/tooltip";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../../shadcn/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "../../shadcn/dialog";
import { useToast } from "../../shadcn/use-toast";

export type FileDialogProps = {
	content?: Post["content"];
	useGetCache: () => { isLoading: boolean; data: string[] };
	insertToCacheAction: (fd: FormData) => Promise<string>;
	insertToCacheCb?: (url: string) => void;
	removeFromCacheAction: (file: string) => Promise<void>;
	removeFromCacheCb?: (file: string) => void;
};

export function FileDialog(props: FileDialogProps) {
	function extractUrlsFromMarkdown(content: Post["content"]): string[] {
		const urlRegex = /!\[.*?\]\(\s*(.*?)\s*\)|<img[^>]+src="([^"]+)"|<source[^>]+src="([^"]+)"/g;
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
		if (!props.content) return null;
		return extractUrlsFromMarkdown(props.content);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<span>
					<PiFilesFill />
				</span>
			</DialogTrigger>
			<FileDialogContent previousURLs={getPreviouslyUsedURLs()} {...props} />
		</Dialog>
	);
}

function FileDialogContent(
	props: FileDialogProps & {
		previousURLs: string[] | null;
	},
) {
	const getValidURLs = (): string[] | null => {
		if (!props.previousURLs) return null;
		const validURLs: string[] = [];
		for (const url of props.previousURLs) {
			try {
				const urlObject = new URL(url);
				const filter = urlObject.searchParams.get("filter");
				if (!validURLs.includes(url) && filter === "post") validURLs.push(url);
			} catch {
				// empty
			}
		}
		return validURLs;
	};

	const validPreviousURLs = getValidURLs();

	const { data: files, isLoading } = props.useGetCache();

	if (isLoading) return <Loading />;

	if (!files)
		return (
			<div>
				<TRANSLATION_COMPONENT translationKey="editor.file-dialog.cache-empty" />
			</div>
		);

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
		<DialogContent className="sm:max-w-106.25">
			<AlertDialogHeader>
				<DialogTitle>
					<TRANSLATION_COMPONENT translationKey="editor.file-dialog.title" />
				</DialogTitle>
				<DialogDescription>
					<TRANSLATION_COMPONENT translationKey="editor.file-dialog.description" />
				</DialogDescription>
			</AlertDialogHeader>
			<div className="grid gap-4 py-4">
				{validPreviousURLs && (
					<>
						<h2>
							<TRANSLATION_COMPONENT translationKey="editor.file-dialog.used-files" />
						</h2>

						<div className="flex flex-wrap items-center gap-2">
							{validPreviousURLs.map((file, idx) => (
								<div key={idx} className="relative aspect-square h-32">
									{isImage(file) ? (
										<Image
											key={idx}
											src={file}
											alt="image"
											className={{ common: "h-full w-full object-cover" }}
											sizes="128px"
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
					<h2>
						<TRANSLATION_COMPONENT translationKey="editor.file-dialog.cache" />
					</h2>
					<CacheFileUploader
						insertToCacheAction={props.insertToCacheAction}
						insertToCacheCb={props.insertToCacheCb}
					/>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{files.map((file, idx) => (
						<div key={idx} className="relative aspect-square h-32">
							{isImage(file) ? (
								<Image
									key={idx}
									src={file}
									alt="image"
									className={{ common: "h-full w-full object-cover" }}
									sizes="128px"
								/>
							) : (
								<div className="h-32 w-32 overflow-hidden">
									<ProtectedVideo src={file} />
								</div>
							)}
							<FileDialogImageButtons
								file={file}
								removeFromCacheAction={props.removeFromCacheAction}
								removeFromCacheCb={props.removeFromCacheCb}
							/>
						</div>
					))}
				</div>
			</div>
		</DialogContent>
	);
}

function FileDialogImageButtons({
	file,
	removeFromCacheAction,
	removeFromCacheCb,
}: Pick<FileDialogProps, "removeFromCacheAction" | "removeFromCacheCb"> & {
	file: string;
}) {
	// const queryClient = useQueryClient();

	const deleteFile = async () => {
		// await removeFromCache(file);
		await removeFromCacheAction(file);

		removeFromCacheCb?.(file);
		// queryClient.setQueryData<string[]>(queryKeys.cache(), (oldPaths) => {
		//   if (!oldPaths) return [];
		//   return oldPaths.filter((p) => p !== file);
		// });
	};

	return (
		<div className="absolute right-4 top-4 flex items-center gap-x-2">
			<CopyElementToClipboardButton file={file} />

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<button className="border-none">
						<Tooltip
							content={
								<TRANSLATION_COMPONENT translationKey="editor.file-dialog.item.remove.trigger.tooltip" />
							}
						>
							<span>
								<AiFillDelete
									className="stroke-black text-white transition-all hover:scale-110 hover:cursor-pointer"
									style={{
										strokeWidth: "32",
									}}
								/>
							</span>
						</Tooltip>
					</button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<TRANSLATION_COMPONENT translationKey="editor.file-dialog.item.remove.dialog.title" />
						</AlertDialogTitle>
						<AlertDialogDescription>
							<TRANSLATION_COMPONENT translationKey="editor.file-dialog.item.remove.dialog.description" />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<TRANSLATION_COMPONENT translationKey="editor.file-dialog.item.remove.dialog.cancel" />
						</AlertDialogCancel>
						<AlertDialogAction onClick={deleteFile}>
							<TRANSLATION_COMPONENT translationKey="editor.file-dialog.item.remove.dialog.confirm" />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function CopyElementToClipboardButton({ file }: { file: string }) {
	const { t } = useUiPackageContext();
	const { toast } = useToast();

	const copyFileURLToClipboard = async () => {
		const noQuery = file.split("?")[0];
		const splitted = noQuery.split(".");
		const ext = splitted[splitted.length - 1];

		if (["webp", "png", "jpg"].includes(ext))
			await navigator.clipboard.writeText(`![image](${file})`);

		if (["mp4"].includes(ext))
			await navigator.clipboard.writeText(
				`<video controls>
  <source src="${file}" />
</video>`,
			);

		toast({
			title: t("editor.file-dialog.item.copy-to-clipboard.toast"),
		});
	};

	return (
		<button onClick={copyFileURLToClipboard}>
			<Tooltip content={t("editor.file-dialog.item.copy-to-clipboard.tooltip")}>
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

function CacheFileUploader({
	insertToCacheAction,
	insertToCacheCb,
}: Pick<FileDialogProps, "insertToCacheAction" | "insertToCacheCb">) {
	// const queryClient = useQueryClient();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleImageUpload = async () => {
		const file = inputRef.current?.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		// const newFilename = await insertFileToCache(formData);
		const newFilename = await insertToCacheAction(formData);

		insertToCacheCb?.(newFilename);
		// queryClient.setQueryData<string[]>(queryKeys.cache(), (oldPaths) => {
		//   if (!oldPaths) return [];
		//   return [...oldPaths, newFilename];
		// });
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
			<Tooltip
				content={<TRANSLATION_COMPONENT translationKey="editor.file-dialog.file-upload.tooltip" />}
			>
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
