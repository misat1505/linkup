import { SubmitHandler } from "react-hook-form";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppProvider";
import { SignupFormType } from "@/validators/auth.validators";
import { SignupFormEntries } from "@/hooks/signup/useSignupForm";
import { AuthService } from "@/services/Auth.service";
import { ROUTES } from "@/lib/routes";
import { toast } from "@/components/ui/use-toast";
import SignupSlogan from "@/components/signup/SignupSlogan";
import SignupFormProvider from "@/contexts/SignupFormProvider";
import SignupForm from "@/components/signup/SignupForm";
import AlreadyHaveAccount from "@/components/signup/AlreadyHaveAccount";
import { useTranslation } from "react-i18next";
import useChangeTabTitle from "@/hooks/useChangeTabTitle";

export default function Signup() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.signup"));
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const onSubmit: SubmitHandler<SignupFormType> = async (
    data: SignupFormEntries
  ) => {
    try {
      const user = await AuthService.signup(data);
      setUser(user);
      navigate(ROUTES.HOME.$path());
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: t("signup.form.errors.toast.title"),
          description: e.response?.data.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full grid-cols-2 px-4 xl:grid xl:px-12">
      <SignupSlogan />
      <div className="col-span-1 mx-auto mb-4 h-fit w-fit rounded-md bg-black/10 dark:bg-white/5 p-4 shadow-2xl shadow-black xl:my-auto">
        <SignupFormProvider
          type="create"
          onSubmit={onSubmit}
          defaultValues={{ file: null }}
        >
          <SignupForm />
        </SignupFormProvider>
        <AlreadyHaveAccount />
      </div>
    </div>
  );
}
