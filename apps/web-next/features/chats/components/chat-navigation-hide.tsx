"use client";

import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

type ChatNavigationHideProps = PropsWithChildren & {
	className?: string;
};

export function ChatNavigationHide({ children, className }: ChatNavigationHideProps) {
	const { id } = useParams();

	const classnames = cn("w-full md:w-80", className, {
		"hidden md:block": !!id,
	});

	return <div className={classnames}>{children}</div>;
}
