import { queryKeys } from "@/lib/query-keys";
import { getProtectedUrl } from "@/utils/get-protected-url";
import { useQuery } from "@tanstack/react-query";

export const useFetchProtectedURL = (url: string) => {
	return useQuery({
		queryKey: queryKeys.file(url),
		queryFn: () => getProtectedUrl(url),
	});
};
