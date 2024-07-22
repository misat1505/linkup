import React, { MouseEvent } from "react";
import Loading from "../components/common/Loading";
import { API_URL } from "../constants";
import { logoutUser } from "../api/authAPI";
import StyledButton from "../components/common/StyledButton";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppProvider";
import { User } from "../models/User";
import Image from "../components/common/Image";

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
    <Image
      src={`${API_URL}/files/${user.photoURL}`}
      className={{
        common: "h-12 w-12 rounded-full",
        img: "object-cover",
        error: "bg-white font-semibold"
      }}
      errorContent={initials}
    />
  );
}
