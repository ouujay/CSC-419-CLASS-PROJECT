"use client";
import FamilyDetails from "./components/FamilyDetails";
import PublicFamilyMembersTable from "./components/PublicFamilyMembersTable";

export default function FamilyPage() {
  return (
    <div className="p-4 space-y-4 ">
      <FamilyDetails />
      <section className="  max-w-5xl mx-auto pt-4">
        <PublicFamilyMembersTable />
      </section>
    </div>
  );
}
