import React from "react";
import Image from "../Image";
import { LOGO_PATH } from "../../../constants";
import NavbarAvatar from "./NavbarAvatar";

export default function Navbar() {
  return (
    <>
      <header className="fixed z-10 flex h-24 w-full items-center justify-between bg-slate-200 p-4">
        <Image
          src={LOGO_PATH}
          className={{ common: "h-16 w-16 rounded-full" }}
        />

        <NavbarAvatar />
      </header>
      <div className="h-24"></div>
    </>
  );
}
