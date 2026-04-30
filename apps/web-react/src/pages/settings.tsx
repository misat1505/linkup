import { useQuery } from "react-query";
import { DefaultValues, SubmitHandler } from "react-hook-form";
import { AxiosError } from "axios";
import { useAppContext } from "@/contexts/app-provider";
import { queryKeys } from "@/lib/query-keys";
import { FileService } from "@/services/file.service";
import { buildFileURL } from "@/utils/build-file-url";
import Loading from "@/components/common/loading";
import { SignupFormEntries } from "@/hooks/signup/use-signup-form";
import { SignupFormType } from "@/validators/auth.validators";
import { AuthService } from "@/services/auth.service";
import { toast } from "@/components/ui/use-toast";
import SignupFormProvider from "@/contexts/signup-form-provider";
import SignupForm from "@/components/signup/signup-form";
import SettingsCards from "@/components/settings/settings-cards";
import SettingsSlogan from "@/components/settings/settings-slogan";
import { useTranslation } from "react-i18next";
import useChangeTabTitle from "@/hooks/use-change-tab-title";

export default function Settings() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.settings"));
  const { user: me, setUser } = useAppContext();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.downloadFile(me!.photoURL!),
    queryFn: () =>
      FileService.downloadFile(
        buildFileURL(me!.photoURL, { type: "avatar" }),
        me!.photoURL
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
    data: SignupFormEntries
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
        <SettingsSlogan />
        <SettingsCards />
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
