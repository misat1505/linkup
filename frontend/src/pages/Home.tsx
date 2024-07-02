import { User } from "../models/User";
import Loading from "../components/common/Loading";
import { API_URL } from "../constants";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const fetchUser = async (): Promise<User> => {
  const { data } = await axios.get(`${API_URL}/auth/user`, {
    withCredentials: true,
  });
  return data.user;
};

export default function Home() {
  const { data: user, error, isLoading } = useQuery("user", fetchUser);

  if (isLoading) return <Loading />;
  if (error || !user) return <div>{JSON.stringify(error)}</div>;

  return (
    <div className="flex items-center gap-x-8 m-4 p-4 bg-slate-200 w-56 rounded-md  ">
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
  );
}
