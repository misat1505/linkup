import SignupSlogan from "../components/signup/SignupSlogan";
import BgGradient from "../components/common/BgGradient";
import AlreadyHaveAccount from "../components/signup/AlreadyHaveAccount";
import SignupForm from "../components/signup/SignupForm";
import SignupFormProvider from "../contexts/SignupFormProvider";
import React from "react";
import { SubmitHandler } from "react-hook-form";
import { SignupFormType } from "../validators/auth.validators";
import { SignupFormEntries } from "../hooks/signup/useSignupForm";
import { AuthService } from "../services/Auth.service";
import { AxiosError } from "axios";
import { toast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppProvider";
import { ROUTES } from "../lib/routes";

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const onSubmit: SubmitHandler<SignupFormType> = async (
    data: SignupFormEntries
  ) => {
    try {
      const user = await AuthService.signup(data);
      setUser(user);
      navigate(ROUTES.HOME.path);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: "Cannot create new account.",
          description: e.response?.data.message,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <>
      <BgGradient />
      <div className="relative z-10 min-h-[calc(100vh-5rem)] w-full grid-cols-2 px-12 xl:grid">
        <SignupSlogan />
        <div className="col-span-1 mx-auto my-auto h-fit w-fit rounded-lg bg-transparent p-4 shadow-2xl shadow-black">
          <SignupFormProvider type="create" onSubmit={onSubmit}>
            <SignupForm />
          </SignupFormProvider>
          <AlreadyHaveAccount />
        </div>
      </div>
    </>
  );
}
