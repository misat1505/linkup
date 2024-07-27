import React from "react";
import Image from "../Image";
import { LOGO_PATH } from "../../../constants";
import NavbarAvatar from "./NavbarAvatar";

export default function Navbar() {
  return (
    <>
      <header className="fixed z-10 flex h-20 w-full items-center justify-between bg-slate-200 p-4">
        <Image
          src={LOGO_PATH}
          className={{ common: "h-12 w-12 rounded-full" }}
        />

        <NavbarAvatar />
      </header>
      <div className="h-20"></div>
    </>
  );
}
