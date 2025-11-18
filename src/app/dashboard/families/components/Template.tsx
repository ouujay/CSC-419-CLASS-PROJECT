"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LayoutPanelTop } from "lucide-react";

export default function FamilyTemplate() {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-col gap-2 text-left cursor-pointer p-2 border-accent rounded border bg-accent/10 hover:bg-accent/50 duration-300">
        <div className="flex gap-2 items-center">
          <LayoutPanelTop className="size-4" />
          <h6 className=" ">Create from templates</h6>
        </div>

        <p className=" text-xs opacity-75">
          Choose from pre-designed family tree layouts and customize as you add
          relatives.
        </p>
      </DialogTrigger>
      <DialogContent className="rounded">
        <DialogHeader className=" ">
          <DialogTitle>Coming Soon.</DialogTitle>

          <DialogDescription>
            This feature is coming soon. Stay tuned for updates!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
