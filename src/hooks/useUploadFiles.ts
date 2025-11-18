import { R2TableName } from "@/convex/files/uploadFiles";
import {
  c_GenerateUploadUrl,
  c_SyncMetadata,
} from "@/fullstack/PublicConvexFunctions";
import { useAction } from "convex/react";
import { useCallback } from "react";

/**
 * A hook that allows you to upload a file to R2.
 *
 * This hook can be used as is, or copied into your own code for customization
 * and tighter control.
 *
 * @param api - The client API object from the R2 component, including at least
 * `generateUploadUrl` and `syncMetadata`.
 * @returns A function that uploads a file to R2.
 */
export function useUploadFile(
  tableName: R2TableName,
  fieldName: "profile-picture",
  id: string
) {
  const generateUploadUrl = useAction(c_GenerateUploadUrl);
  const syncMetadata = useAction(c_SyncMetadata);

  return useCallback(
    async (file: File) => {
      console.log(`Uploading file to bucket: ${tableName}`);

      const { url, key } = await generateUploadUrl({
        tableName,
        fieldName,
        id,
      });
      try {
        const result = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!result.ok) {
          throw new Error(`Failed to upload image: ${result.statusText}`);
        }
      } catch (error) {
        throw new Error(`Failed to upload image: ${error}`);
      }
      await syncMetadata({ key });
      return key;
    },
    [generateUploadUrl, syncMetadata, tableName, fieldName, id]
  );
}
