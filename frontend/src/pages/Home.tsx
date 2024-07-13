import React, { MouseEvent, useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import { API_URL } from "../constants";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { logoutUser } from "../api/authAPI";
import StyledButton from "../components/common/StyledButton";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppProvider";
import { User } from "../models/User";
import { Skeleton } from "../components/ui/skeleton";

export default function Home() {
  const { user, isLoading, setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault();
    await logoutUser();
    setUser(null);
    navigate("/login");
  };

  if (isLoading || !user) return <Loading />;

  return (
    <div className="w-full flex justify-between">
      <div className="flex items-center gap-x-8 m-4 p-4 bg-slate-200 w-fit rounded-md  ">
        <ProfileAvatar user={user} />
        <p className="font-semibold text-lg">
          {user.firstName} {user.lastName}
        </p>
      </div>
      <StyledButton onClick={() => navigate("/settings")}>
        Settings
      </StyledButton>
      <StyledButton onClick={handleLogout}>logout</StyledButton>
    </div>
  );
}

function ProfileAvatar({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`${API_URL}/files/${user.photoURL}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const imageData = await response.blob();
        setAvatarFile(new File([imageData], user.photoURL!));
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [user.photoURL]);

  const initials = `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;

  return (
    <Avatar className="w-12 h-12">
      {isLoading && (
        <AvatarFallback className="bg-transparent">
          <Skeleton className="w-full h-full" />
        </AvatarFallback>
      )}
      {isError && (
        <AvatarFallback className="font-semibold">{initials}</AvatarFallback>
      )}
      {avatarFile && (
        <AvatarImage
          src={URL.createObjectURL(avatarFile)}
          className="object-cover"
          alt={`${user.firstName} ${user.lastName}`}
          onClick={() => console.log("Image clicked")}
        />
      )}
    </Avatar>
  );
}
