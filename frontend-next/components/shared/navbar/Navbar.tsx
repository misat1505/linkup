import Tooltip from "../Tooltip";
import NavbarSearch from "./NavbarSearch";
import ThemeToggle from "./ThemeToggle";
import NavbarSheet from "./NavbarSheet";
import { I18nText } from "../I18nText";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.webp";
import { Switch as ThemeSwitch } from "@/components/ui/theme-switch";

export default function Navbar() {
  return (
    <>
      <header className="fixed z-50 flex h-20 w-full items-center justify-between bg-slate-200 p-4 dark:bg-slate-800">
        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <Tooltip
              content={<I18nText translationKey="common.navbar.logo.tooltip" />}
            >
              <span>
                <Link href="/">
                  <Image
                    src={logo}
                    alt="logo"
                    className="h-12 w-12 rounded-full"
                  />
                </Link>
              </span>
            </Tooltip>
          </div>
          <NavbarSearch />
        </div>

        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <ThemeSwitch />
          </div>
          <NavbarSheet />
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
}
