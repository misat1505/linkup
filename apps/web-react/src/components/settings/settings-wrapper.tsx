import { useLanguageContext } from "@/contexts/language-provider";
import { useThemeContext } from "@/contexts/theme-provider";
import i18n from "@/i18n";
import { SettingsCards } from "@packages/ui/components/features/settings/settings-cards";
import { SettingsSlogan } from "@packages/ui/components/features/settings/settings-slogan";
import React from "react";

const SettingsWrapper = () => {
	const { theme, toggleTheme } = useThemeContext();
	const { changeLanguage } = useLanguageContext();

	return (
		<React.Fragment>
			<SettingsSlogan />
			<SettingsCards
				changeLanguage={changeLanguage}
				language={i18n.language}
				theme={theme}
				toggleTheme={toggleTheme}
			/>
		</React.Fragment>
	);
};

export default SettingsWrapper;
