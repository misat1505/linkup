import React from "react";
import Image from "../Image";
import { LOGO_PATH } from "../../../constants";
import NavbarSearch from "./NavbarSearch";
import NavbarSheet from "./NavbarSheet";
import { useAppContext } from "../../../contexts/AppProvider";

export default function Navbar() {
  const { user } = useAppContext();
  const isLoggedIn = !!user;

  return (
    <>
      <header className="fixed z-10 flex h-20 w-full items-center justify-between bg-slate-200 p-4">
        <div className="flex items-center gap-x-4">
          <Image
            src={LOGO_PATH}
            className={{ common: "h-12 w-12 rounded-full" }}
          />
          {isLoggedIn && <NavbarSearch />}
        </div>

        <NavbarSheet />
      </header>
      <div className="h-20"></div>
    </>
  );
}
