import LoginForm from "@/components/login/login-form";
import LoginFormProvider from "@/contexts/login-form-provider";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import {
  LoginPageLogo,
  LoginSlogan,
  NoAccount,
} from "@packages/ui/features/login";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.login"));

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full grid-cols-2 px-4 xl:grid xl:px-12">
      <LoginSlogan />
      <div className="col-span-1 mx-auto mb-4 h-fit w-96 max-w-full rounded-md bg-black/10 dark:bg-white/5 px-4 py-8 shadow-2xl shadow-black xl:my-auto">
        <LoginPageLogo />
        <LoginFormProvider>
          <LoginForm />
        </LoginFormProvider>
        <NoAccount />
      </div>
    </div>
  );
}
