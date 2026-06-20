import { useEffect } from "react";

export default function useChangeTabTitle(title: string) {
	useEffect(() => {
		if (!title) document.title = "Nexus";
		else document.title = `Nexus - ${title}`;
	}, [title]);
}
