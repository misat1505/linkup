"use client";
import { SubmitHandler } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { useLanguageContext } from "@/providers/LanguageProvider";
import SignupSlogan from "@/features/auth/components/SignupSlogan";
import SignupForm from "@/features/auth/components/SignupForm";
import AlreadyHaveAccount from "@/features/auth/components/AlreadyHaveAccount";
import SignupFormProvider from "@/features/auth/providers/SignupFormProvider";
import { useRouter } from "next/navigation";
import { AuthService } from "@/features/auth/services/Auth.service";
import { SignupFormType } from "@/features/auth/schemas/auth.validators";
import { SignupFormEntries } from "@/features/auth/hooks/useSignupForm";

export default function Signup() {
  const { t } = useLanguageContext();
  // useChangeTabTitle(t("tabs.signup"));
  const router = useRouter();
  // const { setUser } = useAppContext();
  const onSubmit: SubmitHandler<SignupFormType> = async (
    data: SignupFormEntries,
  ) => {
    try {
      const user = await AuthService.signup(data);
      console.log(user);
      // setUser(user);
      router.push("/");
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
