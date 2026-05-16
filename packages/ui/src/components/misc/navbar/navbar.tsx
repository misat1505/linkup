"use client";

import { User } from "@packages/schemas";
import { IMAGE_COMPONENT, LINK_COMPONENT, LOGO_PATH, TRANSLATION_COMPONENT } from "../../../config";
import { Tooltip } from "../tooltip";
import { NavbarSearch, NavbarSearchProps } from "./navbar-search";
import { NavbarSheet } from "./navbar-sheet";
import { ThemeToggle, ThemeToggleProps } from "./theme-toggle";

type NavbarProps = Omit<NavbarSearchProps, "user"> &
	ThemeToggleProps & {
		handleLogout: () => Promise<void>;
		user: User | null;
	};

export function Navbar(props: NavbarProps) {
	return (
		<>
			<header className="fixed z-50 flex h-20 w-full items-center justify-between bg-slate-200 p-4 dark:bg-slate-800">
				<div className="flex items-center gap-x-4">
					<div className="hidden sm:block">
						<Tooltip
							content={<TRANSLATION_COMPONENT translationKey="common.navbar.logo.tooltip" />}
						>
							<LINK_COMPONENT href="/">
								<IMAGE_COMPONENT
									src={LOGO_PATH}
									alt="logo"
									width={48}
									height={48}
									className="rounded-full"
									loading="eager"
								/>
							</LINK_COMPONENT>
						</Tooltip>
					</div>
					{props.user && <NavbarSearch {...props} user={props.user} />}
				</div>

				<div className="flex items-center gap-x-4">
					<div className="hidden sm:block">
						<ThemeToggle theme={props.theme} toggleTheme={props.toggleTheme} />
					</div>
					<NavbarSheet user={props.user ?? null} handleLogout={props.handleLogout} />
				</div>
			</header>
			<div className="h-20"></div>
		</>
	);
}
