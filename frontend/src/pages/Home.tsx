import React, { MouseEvent } from "react";
import Loading from "../components/common/Loading";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppProvider";
import { User } from "../types/User";
import Image from "../components/common/Image";
import { ROUTES } from "../lib/routes";
import { Button } from "../components/ui/button";
import { AuthService } from "../services/Auth.service";
import { buildFileURL } from "../utils/buildFileURL";
import { useQuery } from "react-query";
import { PostService } from "../services/Post.service";
import PostPreview from "../components/posts/PostPreview";

export default function Home() {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  // const handleLogout = async (e: MouseEvent) => {
  //   e.preventDefault();
  //   await AuthService.logout();
  //   setUser(null);
  //   navigate(ROUTES.LOGIN.path);
  // };

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: PostService.getPosts
  });

  if (!user || isLoading) return <Loading />;

  return <div>{posts?.map((post) => <PostPreview text={post.content} />)}</div>;

  // return (
  //   <div className="flex w-full justify-between">
  //     <div className="m-4 flex w-fit items-center gap-x-8 rounded-md bg-slate-200 p-4 dark:bg-slate-800">
  //       <ProfileAvatar user={user} />
  //       <p className="text-lg font-semibold">
  //         {user.firstName} {user.lastName}
  //       </p>
  //     </div>
  //     <Button variant="blueish" onClick={() => navigate(ROUTES.SETTINGS.path)}>
  //       Settings
  //     </Button>
  //     <Button variant="blueish" onClick={handleLogout}>
  //       logout
  //     </Button>
  //   </div>
  // );
}

function ProfileAvatar({ user }: { user: User }) {
  const initials = `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;

  return (
    <Image
      src={buildFileURL(user.photoURL, { type: "avatar" })}
      className={{
        common: "h-12 w-12 rounded-full",
        img: "object-cover",
        error: "bg-white font-semibold dark:bg-black"
      }}
      errorContent={initials}
    />
  );
}
