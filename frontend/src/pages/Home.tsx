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
    <div className="flex w-full justify-between">
      <div className="m-4 flex w-fit items-center gap-x-8 rounded-md bg-slate-200 p-4">
        <ProfileAvatar user={user} />
        <p className="text-lg font-semibold">
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
  const [isError, setIsError] = useState(false);

  const initials = `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;

  useEffect(() => {
    setTimeout(() => {
      setIsError(true);
    }, 2000);
  }, []);

  return (
    <Avatar className="h-12 w-12">
      <AvatarImage
        src={`${API_URL}/files/${user.photoURL}`}
        className="object-cover"
      />
      <AvatarFallback className="bg-transparent">
        {isError ? (
          <div className="flex h-full w-full items-center justify-center bg-white font-semibold">
            {initials}
          </div>
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
