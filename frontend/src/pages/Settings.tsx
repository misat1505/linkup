import React from "react";
import SignupFormProvider from "../contexts/SignupFormProvider";
import SignupForm from "../components/signup/SignupForm";
import { useAppContext } from "../contexts/AppProvider";
import { useQuery } from "react-query";
import { FileService } from "../services/File.service";
import { buildFileURL } from "../utils/buildFileURL";
import { SignupFormEntries } from "../hooks/signup/useSignupForm";
import { DefaultValues, SubmitHandler } from "react-hook-form";
import { SignupFormType } from "../validators/auth.validators";
import { AxiosError } from "axios";
import { toast } from "../components/ui/use-toast";
import { AuthService } from "../services/Auth.service";
import Loading from "../components/common/Loading";

export default function Settings() {
  const { user: me, setUser } = useAppContext();
  const { data, isLoading } = useQuery({
    queryKey: ["files", me!.photoURL],
    queryFn: () =>
      FileService.downloadFile(
        buildFileURL(me!.photoURL, "avatar"),
        me!.photoURL
      )
  });

  let fileList = data ? new DataTransfer().files : undefined;
  if (data) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(data);
    fileList = dataTransfer.files;
  }

  if (isLoading)
    return (
      <div className="relative h-[calc(100vh-5rem)] w-full">
        <Loading />
      </div>
    );

  const defaultValues: DefaultValues<SignupFormEntries> = {
    firstName: me!.firstName,
    lastName: me!.lastName,
    file: fileList
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
          title: "Cannot change settings.",
          description: e.response?.data.message,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="my-auto min-h-[calc(100vh-5rem)] w-full grid-cols-2 px-12 xl:grid">
      <div />
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
