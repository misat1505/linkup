import { Input } from "@/components/ui/input";
import { useGroupChatFormContext } from "@/contexts/GroupChatFormProvider";
import useUserSearch from "@/hooks/useUserSearch";
import { User } from "@/types/User";
import { useMemo, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import UserDisplay from "./UserDisplay";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function GroupChatForm() {
  const { submitForm } = useGroupChatFormContext();

  return (
    <form onSubmit={submitForm}>
      <div className="grid h-[400px] w-full grid-cols-3 gap-x-2">
        <ChatNameAndImage />
        <UserSearch />
        <SelectedUsers />
      </div>
      <SubmitFormButton />
    </form>
  );
}

function ChatNameAndImage() {
  const { t } = useTranslation();
  const { register, file: fileData } = useGroupChatFormContext();

  const file = useMemo(
    () => (fileData ? URL.createObjectURL(fileData) : null),
    [fileData]
  );

  return (
    <div className="flex flex-col items-center justify-between">
      <Input
        placeholder={t(
          "chats.create-new-chat.group.form.inputs.name.placeholder"
        )}
        className="my-2"
        {...register("name")}
      />
      <div>
        {file ? (
          <img
            src={file!}
            className="mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full object-cover"
          />
        ) : (
          <FaUserGroup className="mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full pt-10" />
        )}
        <Input
          type="file"
          className="hover:cursor-pointer"
          accept=".jpg, .png, .webp"
          {...register("file")}
        />
      </div>
    </div>
  );
}

function UserSearch() {
  const { t } = useTranslation();
  const { appendUser, users } = useGroupChatFormContext();
  const [text, setText] = useState("");
  const { data } = useUserSearch(text);

  const handleClick =
    (user: User) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      appendUser(user);
    };

  const filteredUsers = data?.filter(
    (user) => !users.some((u) => u.id === user.id)
  );

  return (
    <div>
      <Input
        placeholder={t(
          "chats.create-new-chat.group.form.inputs.search.placeholder"
        )}
        className="my-2"
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <div className="no-scrollbar max-h-[340px] overflow-auto">
        {filteredUsers?.map((user) => (
          <UserDisplay user={user} key={user.id} onClick={handleClick(user)} />
        ))}
      </div>
    </div>
  );
}

function SelectedUsers() {
  const { t } = useTranslation();
  const { users, removeUser } = useGroupChatFormContext();

  const handleClick =
    (user: User) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      removeUser(user);
    };

  return (
    <div>
      <h2 className="my-4 text-center font-semibold">
        {t("chats.create-new-chat.invited-users")}
      </h2>
      <div className="no-scrollbar h-[340px] overflow-auto">
        {users?.map((user) => (
          <UserDisplay user={user} key={user.id} onClick={handleClick(user)} />
        ))}
      </div>
    </div>
  );
}

function SubmitFormButton() {
  const { t } = useTranslation();

  return (
    <div className="mt-4 flex w-full flex-row-reverse">
      <Button type="submit">{t("chats.create-new-chat.submit")}</Button>
    </div>
  );
}
