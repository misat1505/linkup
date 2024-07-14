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
  const [isError, setIsError] = useState(false);

  const initials = `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;

  useEffect(() => {
    setTimeout(() => {
      setIsError(true);
    }, 2000);
  }, []);

  return (
    <Avatar className="w-12 h-12">
      <AvatarImage
        src={`${API_URL}/files/${user.photoURL}`}
        className="object-cover"
      />
      <AvatarFallback className="bg-transparent">
        {isError ? (
          <div className="font-semibold bg-white w-full h-full flex items-center justify-center">
            {initials}
          </div>
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
