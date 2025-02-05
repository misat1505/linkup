import { useQuery } from "react-query";
import orderBy from "lodash/orderBy";
import { useAppContext } from "@/contexts/AppProvider";
import { queryKeys } from "@/lib/queryKeys";
import { PostService } from "@/services/Post.service";
import { FriendService } from "@/services/Friend.service";
import Loading from "@/components/common/Loading";
import { User } from "@/types/User";
import { Post } from "@/types/Post";
import PostPreview from "@/components/posts/PostPreview";
import EmptyFeed from "@/components/home/EmptyFeed";

export default function Home() {
  const { user: me } = useAppContext();
  const { data: posts, isLoading } = useQuery({
    queryKey: queryKeys.posts(),
    queryFn: PostService.getPosts,
  });

  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryKey: queryKeys.friends(),
    queryFn: FriendService.getMyFriendships,
  });

  if (isLoading || isLoadingFriends) return <Loading />;

  const isMyFriend = (user: User): boolean => {
    if (user.id === me!.id) return false;
    return friends!.some((fr) => {
      const isUserFriendship =
        fr.acceptor.id === user!.id || fr.requester.id === user!.id;
      const isAccepted = fr.status === "ACCEPTED";
      return isUserFriendship && isAccepted;
    });
  };

  const getSortedPosts = (): Post[] => {
    return orderBy(
      posts,
      [
        (post) => isMyFriend(post.author),
        (post) => new Date(post.createdAt).getTime(),
      ],
      ["desc", "desc"]
    );
  };

  if (posts?.length === 0)
    return (
      <div className="relative w-full h-[calc(100vh-5rem)]">
        <EmptyFeed />
      </div>
    );

  return (
    <div>
      {getSortedPosts().map((post) => (
        <PostPreview post={post} key={post.id} />
      ))}
    </div>
  );
}
