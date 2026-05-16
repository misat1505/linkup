"use client";
import { Chat } from "@packages/schemas";
import React, { useMemo, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IMAGE_COMPONENT, TRANSLATION_COMPONENT, useUiPackageContext } from "../../../../config";
import { Button } from "../../../shadcn/button";
import { Input } from "../../../shadcn/input";

export function Updater({
	file,
	chat,
	updateChatAction,
	updateChatCb,
}: {
	file: File | null;
	chat: Chat;
	updateChatAction: (id: Chat["id"], fd: FormData) => Promise<Chat>;
	updateChatCb?: (chat: Chat) => void;
}) {
	const { t } = useUiPackageContext();
	const [image, setImage] = useState(file);
	const [groupName, setGroupName] = useState(chat.name);

	const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

		const updatedChat = await updateChatAction(chat.id, formData);
		updateChatCb?.(updatedChat);
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
					<IMAGE_COMPONENT
						src={source}
						alt="Group image"
						width={128}
						height={128}
						className="overflow-hidden w-32 h-32 rounded-full object-cover"
					/>
				) : (
					<FaUserGroup className="h-32 w-32 overflow-hidden rounded-full pt-8" />
				)}
				{source && (
					<button
						onClick={handleRemoveFile}
						className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:cursor-pointer group-hover:opacity-100"
					>
						<TRANSLATION_COMPONENT translationKey="chats.settings.group.info.input.file.remove" />
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
				<TRANSLATION_COMPONENT translationKey="chats.settings.group.info.submit" />
			</Button>
		</form>
	);
}
