import { queryKeys } from "@/lib/queryKeys";
import { getProtectedUrl } from "@/utils/getProtectedUrl";
import { useQuery } from "@tanstack/react-query";

export const useFetchProtectedURL = (url: string) => {
  return useQuery({
    queryKey: queryKeys.file(url),
    queryFn: () => getProtectedUrl(url),
  });
};
