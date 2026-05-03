"use client";
import AuthGuard from "@/components/auth-guard";
import Loading from "@/components/shared/loading";
import { toast } from "@/components/ui/use-toast";
import { updateMe } from "@/features/auth/actions/update-me";
import SignupForm from "@/features/auth/components/signup-form";
import { SignupFormEntries } from "@/features/auth/hooks/use-signup-form";
import SignupFormProvider from "@/features/auth/providers/signup-form-provider";
import { SignupFormType } from "@/features/auth/schemas/auth.validators";
import { downloadFile } from "@/features/files/actions/download-file";
import SettingsWrapper from "@/features/settings/components/settings-wrapper";
import { queryKeys } from "@/lib/query-keys";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { buildFileURL } from "@/utils/build-file-url";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DefaultValues, SubmitHandler } from "react-hook-form";

export default function Settings() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}

function SettingsContent() {
  const { t } = useLanguageContext();
  const { user: me, invalidateCurrentUser } = useAppContext();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.downloadFile(me!.photoURL!),
    queryFn: async () => {
      if (!me!.photoURL) return null;

      const data = await downloadFile(
        buildFileURL(me!.photoURL, { type: "avatar" }),
      );
      if (!data) return null;

      const file = new File([data.buffer], me!.photoURL, {
        type: data.type,
      });

      return file;
    },
  });

  if (isLoading)
    return (
      <div className="relative h-[calc(100vh-5rem)] w-full">
        <Loading />
      </div>
    );

  const defaultValues: DefaultValues<SignupFormEntries> = {
    firstName: me!.firstName,
    lastName: me!.lastName,
    file: data || null,
  };

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
      await updateMe(formData);
      invalidateCurrentUser();
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: t("settings.form.error.toast.title"),
          description: e.response?.data.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="my-auto min-h-[calc(100vh-5rem)] w-full grid-cols-2 px-12 xl:grid mb-4 xl:mb-0">
      <div className="my-auto">
        <SettingsWrapper />
      </div>
      <div className="col-span-1 mx-auto my-auto h-fit w-fit rounded-lg bg-transparent p-4 shadow-2xl shadow-black">
        <SignupFormProvider
          type="modify"
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        >
          <SignupForm />
        </SignupFormProvider>
      </div>
    </div>
  );
}
