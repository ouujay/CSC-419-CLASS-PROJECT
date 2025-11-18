"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUp } from "lucide-react";

export default function UploadGEDCOM() {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-col gap-2 text-left cursor-pointer p-2 border-accent rounded border bg-accent/10 hover:bg-accent/50 duration-300">
        <div className="flex gap-2 items-center">
          <FileUp className="size-4" />
          <h6 className=" ">Import GEDCOM</h6>
        </div>

        <p className=" text-xs opacity-75">
          Upload existing family history from other genealogy services in just
          minutes.
        </p>
      </DialogTrigger>
      <DialogContent className="rounded">
        <DialogHeader className=" ">
          <DialogTitle>Coming Soon.</DialogTitle>

          <DialogDescription>
            This feature is not yet available. We are working hard to bring you
            the ability to upload GEDCOM files. Stay tuned for updates!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
