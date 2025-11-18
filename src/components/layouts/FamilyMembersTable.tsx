"use client";
import React, { useState, useMemo } from "react";
import { Plus, Search, Users, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Doc } from "@/convex/_generated/dataModel";
import DeleteMemberDialog from "@/app/dashboard/family-members/[family_member_id]/components/DeleteMembersFromFamilyDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddFamilyMembers from "@/components/Add/Add";
import WithFamilyAccess from "../access/WithAccess";
import ProfileDetails from "../osisi-ui/profile/ProfileDetails";

export default function FamilyMembersTable({
  familyData,
  familyMembers,
}: {
  familyData: Doc<"families">;
  familyMembers: Doc<"family_members">[];
}) {
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<
    Array<Doc<"family_members">>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFamilyMembers = useMemo(() => {
    if (!familyMembers) return [];

    if (!searchQuery.trim()) {
      return familyMembers;
    }

    const query = searchQuery.toLowerCase().trim();
    return familyMembers.filter((member) => {
      const fullName = member.full_name?.toLowerCase() || "";
      return fullName.includes(query);
    });
  }, [familyMembers, searchQuery]);

  const handleReset = () => {
    setSelectedFamilyMembers([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredFamilyMembers) {
      setSelectedFamilyMembers(filteredFamilyMembers.map((member) => member));
    } else {
      setSelectedFamilyMembers([]);
    }
  };

  const handleSelectFamily = (
    familyMember: Doc<"family_members">,
    checked: boolean
  ) => {
    let newSelected = [...selectedFamilyMembers];
    if (checked) {
      newSelected.push(familyMember);
    } else {
      newSelected = selectedFamilyMembers.filter(
        (sel) => sel._id !== familyMember._id
      );
    }
    setSelectedFamilyMembers(newSelected);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-1 mt-4">
        <h3 className="text-xl font-medium">Family Members</h3>

        <WithFamilyAccess
          action="delete"
          resource="family_members"
          familyId={familyData._id}
        >
          {familyData?._id && selectedFamilyMembers.length > 0 ? (
            <DeleteMemberDialog
              familyId={familyData?._id}
              members={selectedFamilyMembers}
              onSuccess={handleReset}
            />
          ) : (
            <Button size="sm" className="opacity-0 hidden sm:block">
              Delete
            </Button>
          )}
        </WithFamilyAccess>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-2 min-h-[3rem]">
        {/* Search feature */}
        <div className="relative flex gap-2 w-full sm:w-[500px] max-w-md px-2 rounded border">
          <div className="flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search family members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none p-0"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="text-sm text-gray-500 sm:whitespace-nowrap">
            {filteredFamilyMembers.length} of {familyMembers?.length || 0}{" "}
            members
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="font-sora w-full">
          <thead>
            <tr className="border-b">
              <WithFamilyAccess
                familyId={familyData?._id}
                action="delete"
                resource="family_members"
              >
                <th className="w-0 p-2">
                  <Checkbox
                    checked={
                      selectedFamilyMembers.length ===
                        filteredFamilyMembers.length &&
                      filteredFamilyMembers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              </WithFamilyAccess>
              <th className="text-left">Family Members</th>
              <WithFamilyAccess
                familyId={familyData?._id}
                action="create"
                resource="family_members"
                fallback={<></>}
              >
                <th className="w-fit"></th>
              </WithFamilyAccess>
            </tr>
          </thead>
          <tbody>
            {filteredFamilyMembers.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? `No family members found matching "${searchQuery}"`
                    : "No family members found"}
                </td>
              </tr>
            ) : (
              filteredFamilyMembers.map((familyMember) => (
                <tr
                  key={familyMember?._id}
                  className="border-b hover:bg-muted/50"
                >
                  <WithFamilyAccess
                    familyId={familyData?._id}
                    action="delete"
                    resource="family_members"
                    fallback={<></>}
                  >
                    <td className="w-0 p-2">
                      <Checkbox
                        checked={selectedFamilyMembers.some(
                          (selectedFamilyMember) =>
                            familyMember._id === selectedFamilyMember._id
                        )}
                        onCheckedChange={(checked) =>
                          handleSelectFamily(familyMember, checked as boolean)
                        }
                      />
                    </td>
                  </WithFamilyAccess>
                  <td className="capitalize relative group hover:bg-accent/25">
                    <ProfileDetails details={familyMember}>
                      <Button variant={"ghost"}>{familyMember?.full_name}</Button>
                    </ProfileDetails>
                  </td>
                  <WithFamilyAccess
                    familyId={familyData?._id}
                    action="create"
                    resource="family_members"
                    fallback={<></>}
                  >
                    <td className="p-0 whitespace-nowrap w-0">
                      <div className="flex justify-center p-2">
                        <AddFamilyMembers familyMemberId={familyMember?._id}>
                          <Button className="">
                            <Plus className="size-4" />
                          </Button>
                        </AddFamilyMembers>
                      </div>
                    </td>
                  </WithFamilyAccess>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {/* Mobile Select All */}
        <WithFamilyAccess
          familyId={familyData?._id}
          action="delete"
          resource="family_members"
        >
          {filteredFamilyMembers.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedFamilyMembers.length ===
                      filteredFamilyMembers.length &&
                    filteredFamilyMembers.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
              {selectedFamilyMembers.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedFamilyMembers.length} selected
                </span>
              )}
            </div>
          )}
        </WithFamilyAccess>

        {/* Mobile Member Cards */}
        {filteredFamilyMembers.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-muted/20 rounded-lg">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium mb-1">
              {searchQuery ? "No matches found" : "No family members"}
            </p>
            <p className="text-sm">
              {searchQuery
                ? `No members found matching "${searchQuery}"`
                : "Start by adding family members"}
            </p>
          </div>
        ) : (
          filteredFamilyMembers.map((familyMember) => (
            <div
              key={familyMember?._id}
              className="border rounded-lg p-4  hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <WithFamilyAccess
                    familyId={familyData?._id}
                    action="delete"
                    resource="family_members"
                    fallback={<div className="w-5"></div>}
                  >
                    <Checkbox
                      checked={selectedFamilyMembers.some(
                        (selectedFamilyMember) =>
                          familyMember._id === selectedFamilyMember._id
                      )}
                      onCheckedChange={(checked) =>
                        handleSelectFamily(familyMember, checked as boolean)
                      }
                    />
                  </WithFamilyAccess>
                  <ProfileDetails details={familyMember}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {familyMember?.full_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium capitalize text-base">
                          {familyMember?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tap to view details
                        </p>
                      </div>
                    </div>
                  </ProfileDetails>
                </div>

                <WithFamilyAccess
                  familyId={familyData?._id}
                  action="create"
                  resource="family_members"
                  fallback={<></>}
                >
                  <AddFamilyMembers familyMemberId={familyMember?._id}>
                    <Button size="sm" variant="outline">
                      <Plus className="size-4" />
                    </Button>
                  </AddFamilyMembers>
                </WithFamilyAccess>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
