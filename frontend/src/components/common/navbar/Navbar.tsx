import React from "react";
import Image from "../Image";
import { LOGO_PATH } from "../../../constants";
import NavbarSearch from "./NavbarSearch";
import NavbarSheet from "./NavbarSheet";
import { useAppContext } from "../../../contexts/AppProvider";
import ThemeToggle from "./ThemeToggle";
import Tooltip from "../Tooltip";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../lib/routes";
import FocusableSpan from "../FocusableSpan";

export default function Navbar() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  return (
    <>
      <header className="fixed z-50 flex h-20 w-full items-center justify-between bg-slate-200 p-4 dark:bg-slate-800">
        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <Tooltip content="Home">
              <span>
                <FocusableSpan fn={() => navigate(ROUTES.HOME.path)}>
                  <Image
                    src={LOGO_PATH}
                    className={{ common: "h-12 w-12 rounded-full" }}
                  />
                </FocusableSpan>
              </span>
            </Tooltip>
          </div>
          {isLoggedIn && <NavbarSearch />}
        </div>

        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <NavbarSheet />
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
}
