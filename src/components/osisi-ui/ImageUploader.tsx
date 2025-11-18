"use client";

import { useState } from "react";
import { useUploadFile } from "@/hooks/useUploadFiles";
import Image from "next/image";
import { R2TableName, R2FieldName } from "@/convex/files/uploadFiles";
import { tryCatch } from "@/utils/try-catch";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface ImageUploaderProps {
  imageUrl: string;
  fallbackText: string;
  onUpload: (imageUrl: string) => void;
  onRemove: () => void;
  label?: string;
  alt?: string;
  tableName: R2TableName;
  tableId: string;
  fieldName?: R2FieldName;
}

export default function ImageUploader({
  imageUrl,
  fallbackText,
  onUpload,
  onRemove,
  alt = "photo",
  label = "Update Photo",
  tableName,
  tableId,
  fieldName = "profile-picture",
}: ImageUploaderProps) {
  const uploadFile = useUploadFile(tableName, fieldName, tableId);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const { data: storageId, error } = await tryCatch(uploadFile(file));

    if (error) {
      toast.error("Failed to upload image");
      console.error(error);
      setUploading(false);
      return;
    }
    await onUpload(storageId);
    toast.error("Image Uploaded Successfully!");
    setUploading(false);
  };
  const removePicture = async () => {
    
    setUploading(true);
    await onRemove();
    setUploading(false);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <figure className="h-20 w-20 sm:h-32 sm:w-32 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden relative isolate">
        <Image
          src={imageUrl || "/placeholder-family-tree-1.png"}
          alt={fallbackText || alt}
          fill
          sizes="(max-width: 640px) 4rem, 5rem"
          className="object-cover object-center"
          priority
        />
      </figure>
      <label className="mt-4 px-4 py-2 bg-primary text-white rounded cursor-pointer">
        {uploading ? "Uploading..." : label}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
      <Button variant={"outline_destructive"} onClick={removePicture}>
        Remove Photo
      </Button>
    </div>
  );
}
