import FriendsPageContentWrapper from "@/components/friends/friends-page-content-wrapper";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { queryKeys } from "@/lib/query-keys";
import { FriendService } from "@/services/friend.service";
import { Loading } from "@packages/ui/components/misc/loading";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

export default function Friends() {
	const { t } = useTranslation();
	useChangeTabTitle(t("tabs.friends"));

	const { isLoading, data } = useQuery({
		queryKey: queryKeys.friends(),
		queryFn: FriendService.getMyFriendships,
	});

	if (isLoading)
		return (
			<div className="relative mt-[-5rem] h-screen">
				<Loading />
			</div>
		);

	return <FriendsPageContentWrapper friendships={data!} />;
}
