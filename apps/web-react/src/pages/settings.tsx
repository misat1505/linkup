import Loading from "@/components/common/loading";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import SignupForm from "@/components/signup/signup-form";
import { useAppContext } from "@/contexts/app-provider";
import SignupFormProvider from "@/contexts/signup-form-provider";
import { SignupFormEntries } from "@/hooks/signup/use-signup-form";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { queryKeys } from "@/lib/query-keys";
import { AuthService } from "@/services/auth.service";
import { FileService } from "@/services/file.service";
import { SignupFormType } from "@/validators/auth.validators";
import { toast } from "@packages/ui/components/shadcn/use-toast";
import { buildFileURL } from "@packages/ui/utils/build-file-url";
import { AxiosError } from "axios";
import { DefaultValues, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

export default function Settings() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.settings"));
  const { user: me, setUser } = useAppContext();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.downloadFile(me!.photoURL!),
    queryFn: () =>
      FileService.downloadFile(
        buildFileURL(me!.photoURL, { type: "avatar" }),
        me!.photoURL,
      ),
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
      const updated = await AuthService.updateMe(data);
      setUser(updated);
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
