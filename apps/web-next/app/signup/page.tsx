"use client";
import { toast } from "@/components/ui/use-toast";
import { signupUser } from "@/features/auth/actions/signup-user";
import SignupForm from "@/features/auth/components/signup-form";
import { SignupFormEntries } from "@/features/auth/hooks/use-signup-form";
import SignupFormProvider from "@/features/auth/providers/signup-form-provider";
import { SignupFormType } from "@/features/auth/schemas/auth.validators";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { sleep } from "@/utils/sleep";
import { AlreadyHaveAccount, SignupSlogan } from "@packages/ui/features/signup";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export default function Signup() {
  const { t } = useLanguageContext();
  // useChangeTabTitle(t("tabs.signup"));
  const router = useRouter();
  const { invalidateCurrentUser } = useAppContext();
  const onSubmit: SubmitHandler<SignupFormType> = async (
    data: SignupFormEntries,
  ) => {
    try {
      const formData = new FormData();
      formData.append("login", data.login);
      formData.append("password", data.password);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      if (data.file) {
        formData.append("file", data.file);
      }
      await signupUser(formData);

      invalidateCurrentUser();

      // give time for cookies to be stored
      await sleep(10);
      router.push("/");
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast({
          title: t("signup.form.errors.toast.title"),
          description: e.message,
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
