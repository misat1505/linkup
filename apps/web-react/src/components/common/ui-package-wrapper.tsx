import { API_URL, LOGO_PATH } from "@/constants";
import { useFetchProtectedURL } from "@/hooks/use-fetch-protected-url";
import { queryKeys } from "@/lib/query-keys";
import { UserService } from "@/services/user.service";
import { UiPackageProvider } from "@packages/ui/config/index";
import { PropsWithChildren, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { LinkWrapper } from "./link-wrapper";

function useSearchUsersQuery() {
	const [text, setText] = useState("");
	const [debouncedText] = useDebounce(text, 300);
	const { data: users = [], isFetching } = useQuery({
		queryKey: queryKeys.searchUsers(debouncedText),
		queryFn: () => UserService.search(debouncedText),
		enabled: debouncedText.length > 0,
	});

	return { users, isFetching, setText, debouncedText };
}

function ImageWrapper(props: { src: string; alt: string; className?: string }) {
	return <img {...props} />;
}

export default function UiPackageWrapper({ children }: PropsWithChildren) {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<UiPackageProvider
			apiUrl={API_URL}
			linkComponent={LinkWrapper}
			imageComponent={ImageWrapper}
			// @ts-expect-error it's fine
			useFetchProtectedURL={useFetchProtectedURL}
			useSearchUsersQuery={useSearchUsersQuery}
			translationFunction={t}
			navigate={navigate}
			logoPath={LOGO_PATH}
		>
			{children}
		</UiPackageProvider>
	);
}
