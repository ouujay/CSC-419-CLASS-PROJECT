import React, { useState, useEffect, useRef } from "react";
import { Search, Focus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";

const FamilyMemberSearchBar = ({
  familyMembers = [],
}: {
  familyMembers: Doc<"family_members">[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<
    Doc<"family_members">[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter family members based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMembers([]);
      setIsDropdownOpen(false);
      return;
    }

    const filtered = familyMembers.filter(
      (member) =>
        member?.name?.given?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member?.name?.family
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member?.name?.married
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member?.name?.middle
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member?.name?.nickname
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member?.name?.other?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredMembers(filtered);
    setIsDropdownOpen(filtered.length > 0);
  }, [searchTerm, familyMembers]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        searchRef.current &&
        target &&
        !(searchRef.current as HTMLDivElement).contains(target) &&
        dropdownRef.current &&
        !(dropdownRef.current as HTMLDivElement).contains(target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update URL query parameter for focus
  const handleFocus = (memberId: Id<"family_members">) => {
    const params = new URLSearchParams(searchParams);
    params.set("focus_member", memberId);
    router.push(`${pathname}?${params.toString()}`);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };
  const handleFind = (memberId: Id<"family_members">) => {
    const params = new URLSearchParams(searchParams);
    params.set("find_member", memberId);
    router.push(`${pathname}?${params.toString()}`);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-full max-w-md  relative">
      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
          <Input
            type="text"
            placeholder="Search family members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base md:h-10 md:text-sm"
          />
        </div>
      </div>

      {/* Dropdown Results */}
      {isDropdownOpen && filteredMembers.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-[70vh] overflow-y-auto bg-background rounded-lg border shadow-lg md:max-h-80 md:rounded md:shadow-md"
        >
          <div className="p-0">
            {filteredMembers.map((member, index) => (
              <div
                key={member._id}
                className={`flex flex-col gap-3 p-4 hover:bg-accent/25 transition-colors md:flex-row md:gap-0 md:items-center md:justify-between md:p-3 ${
                  index !== filteredMembers.length - 1 ? "border-b" : ""
                }`}
              >
                {/* Member Info */}
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Avatar className="w-10 h-10 md:w-8 md:h-8 flex-shrink-0">
                    <AvatarImage
                      src={member.profile_picture || "/placeholder.jpg"}
                      alt={member.full_name || ""}
                    />
                    <AvatarFallback className="text-sm md:text-xs">
                      {getInitials(member.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Button variant="link">
                      <Link href={`/dashboard/family-members/${member._id}`}>
                        {member.full_name}
                      </Link>
                    </Button>
                    <p className="text-base font-medium truncate md:text-sm"></p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 w-full md:flex-row md:gap-2 md:w-auto md:flex-shrink-0">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleFind(member._id)}
                    className="h-10 px-4 text-sm font-medium md:h-8 md:px-3 md:text-xs"
                  >
                    <Search className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleFocus(member._id)}
                    className="h-10 px-4 text-sm font-medium md:h-8 md:px-3 md:text-xs"
                  >
                    <Focus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {isDropdownOpen &&
        filteredMembers.length === 0 &&
        searchTerm.trim() !== "" && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg md:shadow-md">
            <CardContent className="p-6 md:p-4">
              <p className="text-base text-muted-foreground text-center md:text-sm">
                No family members found matching &quot;{searchTerm}&quot;
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default FamilyMemberSearchBar;
