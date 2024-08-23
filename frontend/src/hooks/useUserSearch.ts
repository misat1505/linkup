import { UserService } from "../services/User.service";
import { queryKeys } from "../lib/queryKeys";
import { User } from "../models/User";
import { useQuery, UseQueryResult } from "react-query";
import { useDebounce } from "use-debounce";

type useUserSearchOptions = {
  timeout: number;
};

const defaultOptions: useUserSearchOptions = {
  timeout: 300
};

export default function useUserSearch(
  text: string,
  options = defaultOptions
): UseQueryResult<User[], unknown> {
  const [debouncedText] = useDebounce(text, options.timeout);

  const data = useQuery({
    queryKey: queryKeys.searchUsers(debouncedText),
    queryFn: () => UserService.search(debouncedText),
    enabled: debouncedText.length > 0
  });

  return data;
}
