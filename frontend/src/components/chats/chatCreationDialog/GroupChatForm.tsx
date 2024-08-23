import Image from "../../common/Image";
import { Input } from "../../ui/input";
import { useGroupChatFormContext } from "../../../contexts/GroupChatFormProvider";
import useUserSearch from "../../../hooks/useUserSearch";
import { User } from "../../../models/User";
import { useMemo, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import UserDisplay from "./UserDisplay";
import { Button } from "../../ui/button";

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
  const { register, file: fileData } = useGroupChatFormContext();

  const file = useMemo(
    () => (fileData ? URL.createObjectURL(fileData) : null),
    [fileData]
  );

  return (
    <div className="flex flex-col items-center justify-between">
      <Input
        placeholder="Chat display name (optional)"
        className="my-2"
        {...register("name")}
      />
      <div>
        <Image
          src={file!}
          className={{
            common:
              "mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full object-cover"
          }}
          errorContent={<FaUserGroup className="h-full w-full pt-10" />}
        />
        <Input
          type="file"
          className="hover:cursor-pointer"
          {...register("file")}
        />
      </div>
    </div>
  );
}

function UserSearch() {
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
        placeholder="Search for people..."
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
  const { users, removeUser } = useGroupChatFormContext();

  const handleClick =
    (user: User) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      removeUser(user);
    };

  return (
    <div>
      <h2 className="my-4 text-center font-semibold">Invited people</h2>
      <div className="no-scrollbar h-[340px] overflow-auto">
        {users?.map((user) => (
          <UserDisplay user={user} key={user.id} onClick={handleClick(user)} />
        ))}
      </div>
    </div>
  );
}

function SubmitFormButton() {
  return (
    <div className="mt-4 flex w-full flex-row-reverse">
      <Button variant="blueish" type="submit">
        Create
      </Button>
    </div>
  );
}
