import React, { MouseEvent } from "react";
import Loading from "../components/common/Loading";
import { API_URL } from "../constants";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { logoutUser } from "../api/authAPI";
import StyledButton from "../components/common/StyledButton";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppProvider";

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
      <StyledButton onClick={() => navigate("/settings")}>
        Settings
      </StyledButton>
      <StyledButton onClick={handleLogout}>logout</StyledButton>
    </div>
  );
}
