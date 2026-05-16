"use client";

import { Post } from "@packages/schemas";
import { IoPencil } from "react-icons/io5";
import { TRANSLATION_COMPONENT, useUiPackageContext } from "../../../config";
import { Tooltip } from "../../misc/tooltip";

type EditChatLinkProps = {
	id: Post["id"];
};

export function EditChatLink({ id }: EditChatLinkProps) {
	const { LinkComponent } = useUiPackageContext();

	return (
		<Tooltip content={<TRANSLATION_COMPONENT translationKey="posts.edit.button.tooltip" />}>
			<LinkComponent href={`/posts/editor/${id}`}>
				<IoPencil className="text-black transition-all hover:scale-110 hover:cursor-pointer dark:text-white h-4 w-4" />
			</LinkComponent>
		</Tooltip>
	);
}
