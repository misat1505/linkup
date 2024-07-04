import React, { MouseEvent } from "react";
import Loading from "../components/common/Loading";
import { API_URL } from "../constants";
import { useQuery } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { fetchUser, logoutUser } from "../api/authAPI";
import StyledButton from "../components/common/StyledButton";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { data: user, error, isLoading } = useQuery("user", fetchUser);
  const navigate = useNavigate();

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault();
    await logoutUser();
    navigate("/login");
  };

  if (isLoading) return <Loading />;
  if (error || !user) return <div>{JSON.stringify(error)}</div>;

  return (
    <div className="w-full flex justify-between">
      <div className="flex items-center gap-x-8 m-4 p-4 bg-slate-200 w-fit rounded-md  ">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={`${API_URL}${user.photoURL}`}
            className="object-cover"
          />
          <AvatarFallback>
            {user.firstName[0].toUpperCase()}
            {user.lastName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold text-lg">
          {user.firstName} {user.lastName}
        </p>
      </div>
      <StyledButton onClick={handleLogout}>logout</StyledButton>
    </div>
  );
}
