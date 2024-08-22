import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { Button } from "../ui/button";

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create group chat</DialogTitle>
          <DialogDescription>
            Search and invite other users to your newly created chat. Click
            create when you're done.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="blueish" type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
