import { queryKeys } from "@/lib/queryKeys";
import { getAccessToken } from "@/lib/token";
import { useQuery } from "react-query";

export const useFetchProtectedURL = (url: string) => {
  return useQuery({
    queryKey: queryKeys.file(url),
    queryFn: async () => {
      const result = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      if (!result.ok) throw new Error();
      const data = await result.json();
      return data.url;
    },
  });
};
