"use client";
import Link from "next/link";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { c_GetFamilies, c_GetProfile } from "@/fullstack/PublicConvexFunctions";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Home, Pencil, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import DeleteFamilyDialog from "../[family_id]/components/DeleteFamilyDialog";
import { Id } from "@/convex/_generated/dataModel";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import WithFamilyAccess from "../../../../components/access/WithAccess";
import FamilyName from "@/components/osisi-ui/FamilyName";
import { Input } from "@/components/ui/input";

export function FamilyTable() {
  const { data: families = [], isPending } = useSafeQuery(c_GetFamilies);
  const { data: profile } = useSafeQuery(c_GetProfile);
  const [selectedFamilies, setSelectedFamilies] = useState<
    Array<Id<"families">>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter families based on search query
  const filteredFamilies = useMemo(() => {
    if (!searchQuery.trim()) {
      return families;
    }

    const query = searchQuery.toLowerCase().trim();
    return families.filter((family) => {
      const familyName = family.name?.toLowerCase() || "";
      const ownerEmail = family.email?.toLowerCase() || "";

      return familyName.includes(query) || ownerEmail.includes(query);
    });
  }, [families, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFamilies(
        filteredFamilies
          .filter((fam) => fam.owner_id === profile?.user_id)
          .map((fam) => fam?._id)
      );
    } else {
      setSelectedFamilies([]);
    }
  };

  const handleReset = () => {
    setSelectedFamilies([]);
  };

  const handleSelectFamily = (familyId: Id<"families">, checked: boolean) => {
    let newSelected = [...selectedFamilies];
    if (checked) {
      newSelected.push(familyId);
    } else {
      newSelected = selectedFamilies.filter((sel) => sel !== familyId);
    }
    setSelectedFamilies(newSelected);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (isPending) {
    return <Loader />;
  }

  const ownedFamiliesCount = filteredFamilies.filter(
    (fam) => fam.owner_id === profile?.user_id
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-2 min-h-[3rem]">
        <h6 className="text-lg font-medium">Families</h6>

        {selectedFamilies.length > 0 && (
          <DeleteFamilyDialog
            selectedFamilies={selectedFamilies}
            onSuccess={handleReset}
          />
        )}
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
            placeholder="Search families..."
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
            {filteredFamilies.length} of {families.length} families
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="font-sora w-full">
          <thead>
            <tr>
              <th className="text-left p-2">
                <Checkbox
                  checked={
                    selectedFamilies.length === ownedFamiliesCount &&
                    ownedFamiliesCount > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="text-left">Family Name</th>
              <th className="w-0 whitespace-nowrap px-4 text-left">Owner</th>
              <th className="w-0 whitespace-nowrap px-4 text-center">
                Members
              </th>
              <th className="w-0 whitespace-nowrap px-4 text-left">
                Updated At
              </th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filteredFamilies.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? `No families found matching "${searchQuery}"`
                    : "No families found"}
                </td>
              </tr>
            ) : (
              filteredFamilies.map((fam) => (
                <tr key={fam._id} className="border-b hover:bg-muted/50">
                  <td className="w-0 p-2">
                    <WithFamilyAccess
                      familyId={fam._id}
                      resource="family_members"
                      action="delete"
                      fallback={<div className="w-5"></div>}
                    >
                      <Checkbox
                        checked={selectedFamilies.includes(fam._id)}
                        onCheckedChange={(checked) =>
                          handleSelectFamily(fam._id, checked as boolean)
                        }
                      />
                    </WithFamilyAccess>
                  </td>
                  <td className="capitalize relative hover:bg-accent/25 underline">
                    <Link
                      href={`/dashboard/families/${fam._id}`}
                      className="w-full absolute top-0 left-0 h-full opacity-0"
                    ></Link>
                    <FamilyName name={fam?.name || ""} />
                  </td>
                  <td className="w-0 whitespace-nowrap px-4">{fam.email}</td>
                  <td className="w-0 whitespace-nowrap px-4 text-center">
                    {fam.family_members_count || 0}
                  </td>
                  <td className="w-0 whitespace-nowrap px-4">
                    {fam.updated_at
                      ? new Date(fam._creationTime).toLocaleString()
                      : "N/A"}
                  </td>
                  <WithFamilyAccess
                    familyId={fam._id}
                    resource="families"
                    action="update"
                    fallback={
                      <td className="w-0">
                        <div className="inline-flex items-center text-secondary rounded p-2 duration-300">
                          <Eye className="size-4" />
                        </div>
                      </td>
                    }
                  >
                    <td className="w-0">
                      <Link
                        href={`/dashboard/families/${fam._id}/edit`}
                        className="inline-flex items-center text-secondary hover:text-white hover:bg-secondary rounded p-2 duration-300"
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </td>
                  </WithFamilyAccess>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tablet Horizontal Scroll View */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="font-sora w-full min-w-[700px]">
          <thead>
            <tr>
              <th className="text-left p-2">
                <Checkbox
                  checked={
                    selectedFamilies.length === ownedFamiliesCount &&
                    ownedFamiliesCount > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="text-left">Family</th>
              <th className="text-left px-2">Owner</th>
              <th className="text-center px-2">Members</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filteredFamilies.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? `No families found matching "${searchQuery}"`
                    : "No families found"}
                </td>
              </tr>
            ) : (
              filteredFamilies.map((fam) => (
                <tr key={fam._id} className="border-b hover:bg-muted/50">
                  <td className="w-0 p-2">
                    <WithFamilyAccess
                      familyId={fam._id}
                      resource="family_members"
                      action="delete"
                      fallback={<div className="w-5"></div>}
                    >
                      <Checkbox
                        checked={selectedFamilies.includes(fam._id)}
                        onCheckedChange={(checked) =>
                          handleSelectFamily(fam._id, checked as boolean)
                        }
                      />
                    </WithFamilyAccess>
                  </td>
                  <td className="capitalize relative hover:bg-accent/25 underline">
                    <Link
                      href={`/dashboard/families/${fam._id}`}
                      className="w-full absolute top-0 left-0 h-full opacity-0"
                    ></Link>
                    <FamilyName name={fam?.name || ""} />
                  </td>
                  <td className="px-2 text-sm">{fam.email}</td>
                  <td className="px-2 text-center text-sm">
                    {fam.family_members_count || 0}
                  </td>
                  <WithFamilyAccess
                    familyId={fam._id}
                    resource="families"
                    action="update"
                    fallback={
                      <td className="w-0">
                        <div className="inline-flex items-center text-secondary rounded p-2 duration-300">
                          <Eye className="size-4" />
                        </div>
                      </td>
                    }
                  >
                    <td className="w-0">
                      <Link
                        href={`/dashboard/families/${fam._id}/edit`}
                        className="inline-flex items-center text-secondary hover:text-white hover:bg-secondary rounded p-2 duration-300"
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </td>
                  </WithFamilyAccess>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {/* Mobile Select All */}
        {ownedFamiliesCount > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedFamilies.length === ownedFamiliesCount &&
                  ownedFamiliesCount > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">Select All</span>
            </div>
            {selectedFamilies.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedFamilies.length} selected
              </span>
            )}
          </div>
        )}

        {/* Mobile Family Cards */}
        {filteredFamilies.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-muted/20 rounded-lg">
            <Home className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium mb-1">
              {searchQuery ? "No matches found" : "No families"}
            </p>
            <p className="text-sm">
              {searchQuery
                ? `No families found matching "${searchQuery}"`
                : "Start by creating your first family"}
            </p>
          </div>
        ) : (
          filteredFamilies.map((fam) => (
            <div
              key={fam._id}
              className="relative border rounded px-3 py-1.5  shadow-sm hover:shadow-md transition-all"
            >
              {/* Floating Checkbox (only for owners) */}
              <div className="absolute top-3 right-3 z-10">
                <WithFamilyAccess
                  familyId={fam._id}
                  resource="family_members"
                  action="delete"
                  fallback={<div className="w-5 h-5" />}
                >
                  <Checkbox
                    checked={selectedFamilies.includes(fam._id)}
                    onCheckedChange={(checked) =>
                      handleSelectFamily(fam._id, checked as boolean)
                    }
                  />
                </WithFamilyAccess>
              </div>

              {/* Link wrapper */}
              <Link
                href={`/dashboard/families/${fam._id}`}
                className="block space-y-3"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {/* <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {fam?.name?.[0]?.toUpperCase() || "F"}
            </div> */}

                  {/* Title + Meta */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold capitalize ">
                      <FamilyName name={fam?.name || ""} />
                    </h3>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <p>
                        <span className="font-medium">Members:</span>{" "}
                        {fam.family_members_count || 0}
                      </p>
                      <p>
                        <span className="truncate block">{fam.email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date Updated */}
                <p className="text-xs text-gray-400">
                  Updated:{" "}
                  {fam.updated_at
                    ? new Date(fam._creationTime).toLocaleDateString()
                    : "N/A"}
                </p>
              </Link>

              {/* Edit button (only for owner/editor) */}
              <div className="absolute bottom-3 right-3">
                <WithFamilyAccess
                  familyId={fam._id}
                  resource="families"
                  action="update"
                  fallback={
                    <div className="inline-flex items-center text-secondary bg-secondary/10 rounded p-2">
                      <Eye className="size-4" />
                    </div>
                  }
                >
                  <Link
                    href={`/dashboard/families/${fam._id}/edit`}
                    className="inline-flex items-center text-secondary hover:text-white hover:bg-secondary rounded p-2 duration-300"
                  >
                    <Pencil className="size-4" />
                  </Link>
                </WithFamilyAccess>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
