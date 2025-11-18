import React from "react";
import EditDescendantsPage from "@/features/layouts/components/DescendantsPage";

export default async function page() {
  return <EditDescendantsPage />;
}
// <RemoveFamilyMember familyMemberId={familyMember._id} />
//   function RemoveFamilyMember({
//   familyMemberId,
// }: {
//   familyMemberId: Id<"family_members">;
// }) {
//   const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
//   const removeFamilyMember = useMutation(c_RemoveFamilyMember);
//   async function remove() {
//     const { error } = await tryCatch(
//       removeFamilyMember({
//         familyMemberId,
//         familyId,
//         eventType: "delete_family-membership",
//       })
//     );
//     if (error) {
//       const CError = error as ConvexError<string>;
//       toast.error(CError.data);
//       console.error(error);
//     }
//     toast.success("Family member removed successfully");
//   }

//   if (!familyId) {
//     return <></>;
//   }
//   return (
//     <Button
//       variant="outline_destructive"
//       size="icon"
//       onClick={remove}
//       className="mt-2"
//     >
//       <X className="w-4 h-4" />
//     </Button>
//   );
// }
