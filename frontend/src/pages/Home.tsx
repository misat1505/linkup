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
import { Img } from "react-image";

export default function Home() {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault();
    await logoutUser();
    setUser(null);
    navigate("/login");
  };

  if (!user) return <Loading />;

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
  const initials = `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;

  return (
    <div className="h-12 w-12">
      <Img
        className="h-full w-full rounded-full object-cover"
        src={`${API_URL}/files/${user.photoURL}`}
        loader={<Skeleton className="h-full w-full rounded-full" />}
        unloader={
          <p className="flex h-full w-full items-center justify-center rounded-full bg-white font-semibold">
            {initials}
          </p>
        }
      />
    </div>
  );
}
