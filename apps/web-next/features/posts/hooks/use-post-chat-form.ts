"use client";
import { createMessage } from "@/features/chats/actions/create-message";
import { chatFormSchema, ChatFormType } from "@/features/chats/schemas/chat-form";
import { queryKeys } from "@/lib/query-keys";
import { useLanguageContext } from "@/providers/language-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chat, Message } from "@packages/schemas";
import { useToast } from "@packages/ui/components/shadcn/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { FieldErrors, SubmitHandler, useForm, UseFormRegister } from "react-hook-form";

type PostChatFormEntries = {
	content: string;
	files?: File[] | undefined;
	responseId?: Message["id"] | null;
};

type FormSubmitEvent = React.BaseSyntheticEvent<object, unknown, unknown> | undefined;

export type usePostChatFormValue = {
	register: UseFormRegister<PostChatFormEntries>;
	errors: FieldErrors<PostChatFormEntries>;
	isSubmitting: boolean;
	files: File[] | undefined;
	appendFiles: (files: File[]) => void;
	removeFile: (id: number) => void;
	setResponse: (message: Message | null) => void;
	responseId: Message["id"] | null | undefined;
	response: Message | null;
	submitForm: (e?: FormSubmitEvent) => Promise<void>;
};

export default function usePostChatForm(chatId: Chat["id"]): usePostChatFormValue {
	const { t } = useLanguageContext();
	const queryClient = useQueryClient();
	const [response, setResponseInner] = useState<Message | null>(null);
	const { toast } = useToast();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
		getValues,
		watch,
		setValue,
	} = useForm<ChatFormType>({
		resolver: zodResolver(chatFormSchema),
	});
	const onSubmit: SubmitHandler<ChatFormType> = async (data) => {
		try {
			const formData = new FormData();
			formData.append("content", data.content);
			if (data.responseId) formData.append("responseId", data.responseId);

			data.files?.forEach((file) => {
				formData.append("files", file);
			});

			const message = await createMessage(chatId, formData);
			reset();
			queryClient.setQueryData<Message[]>(
				queryKeys.messages(message.chatId, message.response?.id || null),
				(oldMessages) => {
					if (!oldMessages) return [message];
					return [...oldMessages, message];
				},
			);
			setResponseInner(null);
			toast({
				title: t("posts.comments.form.toasts.success.title"),
			});
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				toast({
					title: t("posts.comments.form.toasts.error.title"),
					description: "Failed to post comment. Please try again.",
					variant: "destructive",
				});
			}
		}
	};

	const appendFiles = (files: File[]) => {
		const prevFiles = getValues().files || [];

		setValue("files", [...prevFiles, ...files]);
	};

	const removeFile = (id: number) => {
		const prevFiles = getValues().files || [];

		setValue(
			"files",
			prevFiles.filter((_, idx) => idx !== id),
		);
	};

	const setResponse = (message: Message | null) => {
		setResponseInner(message);
		setValue("responseId", message?.id);
	};

	const submitForm = handleSubmit(onSubmit);

	// eslint-disable-next-line react-hooks/incompatible-library
	const { files, responseId } = watch();

	return {
		register,
		errors,
		isSubmitting,
		submitForm,
		files,
		responseId,
		appendFiles,
		removeFile,
		setResponse,
		response,
	};
}
