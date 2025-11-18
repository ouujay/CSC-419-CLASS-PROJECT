import { useState } from "react";
import { Clock, Eye, EyeClosed, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { c_SearchFamilies } from "@/fullstack/PublicConvexFunctions";
import { Id } from "@/convex/_generated/dataModel";
import { useMakeStable } from "@/hooks/useStableQuery";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import FamilyName from "@/components/osisi-ui/FamilyName";

export function SearchFamilies({
  onClick,
}: {
  onClick: (id: Id<"families">) => void;
}) {
  const [searchText, setSearchText] = useState("");
  const { data: result, isPending } = useSafeQuery(c_SearchFamilies, {
    searchText,
  });
  const data = useMakeStable(result);
  const families = data || [];

  const handleConnect = async (id: Id<"families">) => {
    onClick(id);
  };

  return (
    <Command className="rounded-lg border shadow-md ">
      <CommandInput
        placeholder="Search families..."
        value={searchText}
        onValueChange={setSearchText}
        className="h-12"
      />
      <div
        className={`max-h-[400px] overflow-y-auto ${isPending ? "opacity-50" : ""}`}
      >
        {data === undefined ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading families...</p>
          </div>
        ) : families.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <User className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {searchText
                ? "No families found."
                : "Start typing to search families."}
            </p>
          </div>
        ) : (
          <ul className="">
            {families.map((family) => (
              <li key={family.id}>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-4 hover:bg-accent/25  px-4 py-2 border-b">
                  <div className="flex flex-col">
                    <h6 className="capitalize text-lg sm:text-xl">
                      <FamilyName name={family?.name || ""} />
                    </h6>
                    {family?.description && (
                      <p className="text-sm text-white/75 max-w-md">
                        {family?.description}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs">
                          {family?.updated_at
                            ? new Date(family.updated_at)
                                .toISOString()
                                .split("T")[0]
                            : ""}
                        </p>
                      </div>

                      {/* Member Count */}
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs">
                          {family?.family_members_count}{" "}
                          {family?.family_members_count === 1
                            ? "Member"
                            : "Members"}
                        </p>
                      </div>

                      {/* Privacy Status */}
                      <div className="flex items-center gap-1.5">
                        {family?.is_public ? (
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <EyeClosed className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <p className="text-xs">
                          {family?.is_public ? "Public" : "Private"} Family
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end items-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConnect(family.id)}
                    >
                      Select Family
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Command>
  );
}
