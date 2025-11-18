"use client";
import Link from "next/link";
import {  Home,  Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import FamilyName from "@/components/osisi-ui/FamilyName";
import { Input } from "@/components/ui/input";

export function PublicFamilyList({
  families,
}: {
  families: Doc<"families">[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter families based on search query
  const filteredFamilies = useMemo(() => {
    if (!searchQuery.trim()) {
      return families;
    }

    const query = searchQuery.toLowerCase().trim();
    return families.filter((family) => {
      const familyName = family.name?.toLowerCase() || "";
      return familyName.includes(query);
    });
  }, [families, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div>
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
              <th className="text-left">Family Name</th>
              <th className="w-0 whitespace-nowrap px-4 text-center">
                Members
              </th>
              <th className="w-0 whitespace-nowrap px-4 text-left">
                Updated At
              </th>
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
                  <td className="capitalize relative hover:bg-accent/25 underline">
                    <Link
                      href={`/families/${fam._id}/layouts`}
                      className="w-full absolute top-0 left-0 h-full opacity-0"
                    ></Link>
                    <FamilyName name={fam?.name || ""} />
                  </td>
                  <td className="w-0 whitespace-nowrap px-4 text-center">
                    {fam.family_members_count || 0}
                  </td>
                  <td className="w-0 whitespace-nowrap px-4">
                    {fam.updated_at
                      ? new Date(fam._creationTime).toLocaleString()
                      : "N/A"}
                  </td>
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
              <th className="text-left">Family</th>
              <th className="text-center px-2">Members</th>
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
                  <td className="capitalize relative hover:bg-accent/25 underline">
                    <Link
                      href={`/families/${fam._id}/layouts`}
                      className="w-full absolute top-0 left-0 h-full opacity-0"
                    ></Link>
                    <FamilyName name={fam?.name || ""} />
                  </td>
                  <td className="px-2 text-center text-sm">
                    {fam.family_members_count || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">

        {/* Mobile Family Cards */}
        {filteredFamilies.length === 0 ? (
          <div className="text-center py-12  bg-muted/20 rounded-lg">
            <Home className="h-12 w-12 mx-auto mb-3 " />
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
              className="relative border rounded px-3 py-1.5  transition-all"
            >
              {/* Link wrapper */}
              <Link
                href={`/families/${fam._id}/layouts`}
                className="block space-y-3"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {/* <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {fam?.name?.[0]?.toUpperCase() || "F"}
            </div> */}

                  {/* Title + Meta */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold capitalize text-primary ">
                      <FamilyName name={fam?.name || ""} />
                    </h3>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <p>
                        <span className="font-medium">Members:</span>{" "}
                        {fam.family_members_count || 0}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
