import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LOGO_PATH } from "../../constants";

export default function LoginPageLogo() {
  return (
    <Avatar className="w-64 h-64 mx-auto mb-4">
      <AvatarImage className="object-cover" src={LOGO_PATH} />
      <AvatarFallback>Logo</AvatarFallback>
    </Avatar>
  );
}
