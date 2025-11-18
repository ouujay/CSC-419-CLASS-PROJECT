"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmButtonProps extends React.ComponentProps<typeof Button> {
  onConfirm: () => void;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmActionText?: string;
  cancelActionText?: string;
}

export function ConfirmButton({
  onConfirm,
  confirmTitle = "Are you absolutely sure?",
  confirmDescription = "This action cannot be undone.",
  confirmActionText = "Continue",
  cancelActionText = "Cancel",
  children,
  ...buttonProps
}: ConfirmButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...buttonProps}>{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelActionText}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button {...buttonProps} onClick={onConfirm} size={"default"}>
              {confirmActionText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
