import React, { ButtonHTMLAttributes, useMemo } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import GroupChatFormProvider, {
  useGroupChatFormContext
} from "../../contexts/GroupChatFormProvider";
import Image from "../common/Image";
import { FaUserGroup } from "react-icons/fa6";
import { User, users } from "../../models/User";
import Avatar from "../common/Avatar";
import { cn } from "../../lib/utils";
import { API_URL } from "../../constants";
import { useAppContext } from "../../contexts/AppProvider";

export default function ChatCreator() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <IoIosAddCircleOutline
            size={20}
            className="transition-all hover:scale-125 hover:cursor-pointer"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create new chat</DialogTitle>
          <DialogDescription>
            Search and invite other users to your newly created chat. Click on
            the user to invite him to the chat.
          </DialogDescription>
        </DialogHeader>
        <ChatCreatorDialogContent />
      </DialogContent>
    </Dialog>
  );
}

function ChatCreatorDialogContent() {
  return (
    <Tabs defaultValue="private" className="">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="private">Private</TabsTrigger>
        <TabsTrigger value="group">Group</TabsTrigger>
      </TabsList>
      <TabsContent value="private">
        <PrivateChatForm />
      </TabsContent>
      <TabsContent value="group">
        <GroupChatFormProvider>
          <GroupChatForm />
        </GroupChatFormProvider>
      </TabsContent>
    </Tabs>
  );
}

function PrivateChatForm() {
  const { user: me } = useAppContext();
  const handleClick =
    (user: User) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      console.log(me, user);
    };

  return (
    <div className="mx-auto max-w-72">
      <Input placeholder="Search for people..." className="my-2" />
      <div className="no-scrollbar max-h-[410px] overflow-auto">
        {users.map((user) => (
          <UserDisplay user={user} key={user.id} onClick={handleClick(user)} />
        ))}
      </div>
    </div>
  );
}

function GroupChatForm() {
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
  const { appendUser } = useGroupChatFormContext();

  const handleClick =
    (user: User) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      appendUser(user);
    };

  return (
    <div>
      <Input placeholder="Search for people..." className="my-2" />
      <div className="no-scrollbar max-h-[340px] overflow-auto">
        {users.map((user) => (
          <UserDisplay user={user} key={user.id} onClick={handleClick(user)} />
        ))}
      </div>
    </div>
  );
}

type UserDisplayProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  user: User;
};

function UserDisplay({ user, className, ...rest }: UserDisplayProps) {
  return (
    <button
      {...rest}
      className={cn(
        "my-1 flex w-full items-center gap-x-2 rounded-md bg-slate-200 p-2 hover:bg-slate-300",
        className
      )}
    >
      <Avatar
        src={`${API_URL}/files/${user.photoURL!}`}
        alt={""}
        className="h-8 w-8"
      />
      <p>
        {user.firstName} {user.lastName}
      </p>
    </button>
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
