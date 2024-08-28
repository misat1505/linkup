import { CiSettings } from "react-icons/ci";
import Tooltip from "../../common/Tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../ui/dialog";
import React from "react";
import ChatMembersDisplayer from "./ChatMembersDisplayer";

export default function ChatSettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Tooltip content="Settings">
            <span>
              <CiSettings
                size={20}
                className="transition-all hover:scale-125"
              />
            </span>
          </Tooltip>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Update users&apos; aliases. To delete an alias clear the input and
            save.
          </DialogDescription>
        </DialogHeader>
        <ChatMembersDisplayer />
      </DialogContent>
    </Dialog>
  );
}
