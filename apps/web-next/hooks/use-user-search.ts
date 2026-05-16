import { searchUsers } from "@/features/auth/actions/search-users";
import { queryKeys } from "@/lib/query-keys";
import { User } from "@packages/schemas";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

type useUserSearchOptions = {
	timeout: number;
};

const defaultOptions: useUserSearchOptions = {
	timeout: 300,
};

export default function useUserSearch(
	text: string,
	options = defaultOptions,
): UseQueryResult<User[], unknown> {
	const [debouncedText] = useDebounce(text, options.timeout);

	const data = useQuery({
		queryKey: queryKeys.searchUsers(debouncedText),
		queryFn: () => searchUsers(debouncedText),
		enabled: debouncedText.length > 0,
	});

	return data;
}
