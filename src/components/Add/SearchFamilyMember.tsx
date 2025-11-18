import { useState } from "react";
import {
  Heart,
  HeartCrack,
  Loader2,
  Mars,
  Search,
  User,
  Venus,
  VenusAndMars,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  c_ConnectFamilyMember,
  c_GetConnectionDetails,
  c_RequestConnectionToFamilyMember,
  c_SearchFamilyMembers,
} from "@/fullstack/PublicConvexFunctions";
import { Id } from "@/convex/_generated/dataModel";
import { useMakeStable } from "@/hooks/useStableQuery";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import FamilyName from "../osisi-ui/FamilyName";
import SuggestedRelationships from "../osisi-ui/suggestedRelationships/new";
import { CreateMemberType } from "@/convex/familyMembers/mutations";
import { ExtendedRelationshipsType } from "@/types";
import { FormSelect } from "../osisi-ui/Selects/FormSelect";
import { extendedRelationshipOptions } from "@/utils/constants";
import { useMutation } from "convex/react";
import { tryCatch } from "@/utils/try-catch";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  familyMemberId: Id<"family_members">;
  familyId: Id<"families">;
}

export function SearchFamilyMember({
  familyMemberId,
  familyId,
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [expanded, setExpanded] = useState<Set<Id<"family_members">>>(
    new Set()
  );

  const { data: result, isPending } = useSafeQuery(c_SearchFamilyMembers, {
    searchText,
    familyId,
  });
  const data = useMakeStable(result);
  const familyMembers = data || [];

  const handleConnect = async (id: Id<"family_members">) => {
    const isOpen = expanded.has(id);
    const newExpanded = new Set(expanded);
    if (isOpen) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 opacity-50" />
            <span className="truncate"> Search family members...</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-full sm:max-w-xl overflow-y-auto max-h-[90vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Family Members
          </DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md ">
          <CommandInput
            placeholder="Search family members..."
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
                <p className="text-sm text-muted-foreground">
                  Loading family members...
                </p>
              </div>
            ) : familyMembers.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <User className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {searchText
                    ? "No family members found."
                    : "Start typing to search family members."}
                </p>
              </div>
            ) : (
              <ul className="">
                {familyMembers.map((member) => (
                  <li key={member.id}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 hover:bg-accent/25  px-4 py-2 border-b">
                      <div className="flex flex-col ">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h5 className="capitalize text-base sm:text-lg break-words">
                            {member?.full_name}
                          </h5>
                        </div>

                        <div className="flex flex-wrap gap-3  text-xs">
                          <div className="flex items-center gap-1">
                            {member?.is_deceased ? (
                              <HeartCrack className="size-3.5 text-muted-foreground" />
                            ) : (
                              <Heart className="size-3.5 text-muted-foreground" />
                            )}
                            <span>
                              {member?.is_deceased ? "Deceased" : "Living"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {member?.sex === "male" ? (
                              <Mars className="size-3.5 text-muted-foreground" />
                            ) : member?.sex === "female" ? (
                              <Venus className="size-3.5 text-muted-foreground" />
                            ) : (
                              <VenusAndMars className="size-3.5 text-muted-foreground" />
                            )}
                            <span className="capitalize">{member?.sex}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end items-end gap-2">
                        <Button
                          size="sm"
                          variant={
                            expanded.has(member.id) ? "ghost" : "default"
                          }
                          onClick={() => handleConnect(member.id)}
                        >
                          {expanded.has(member.id) ? "Close" : "Connect"}
                        </Button>
                      </div>
                    </div>
                    {expanded.has(member.id) && (
                      <section className="min-h-[200px] border-b">
                        <FamilyMemberDetails
                          sourceFamilyMember={familyMemberId}
                          familyId={familyId}
                          targetFamilyMember={member.id}
                        />
                      </section>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

interface FamilyMemberDetails {
  familyId: Id<"families">;
  sourceFamilyMember: Id<"family_members">;
  targetFamilyMember: Id<"family_members">;
}
type relationshipType = CreateMemberType["relationships"];
export default function FamilyMemberDetails({
  sourceFamilyMember,
  targetFamilyMember,
  familyId,
}: FamilyMemberDetails) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, isPending } = useSafeQuery(c_GetConnectionDetails, {
    sourceFamilyMember,
    targetFamilyMember,
    currentFamilyId: familyId,
  });
  const [relationships, setRelationships] = useState<relationshipType>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [relationship, setRelationship] = useState<
    ExtendedRelationshipsType | undefined
  >(undefined);
  const connectFamilyMember = useMutation(c_ConnectFamilyMember);
  const requestFamilyMember = useMutation(c_RequestConnectionToFamilyMember);

  async function connect() {
    setIsLoading(true);
    if (!data) {
      toast.error("No data found");
      setIsLoading(false);
      return;
    }

    const { error } = await tryCatch(
      connectFamilyMember({
        familyId: familyId,
        targetFamilyMemberId: targetFamilyMember,
        relationships,
        eventType: "create_family-membership",
      })
    );

    if (error) {
      toast.error("Failed to make connection");
      console.error(error);
      setIsLoading(false);
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("focus_member", targetFamilyMember);
    router.push(`${pathname}?${params.toString()}`);
    toast.success("Connection Successful");
    setRelationship(undefined);
    setIsLoading(false);
  }

  async function requestAccess() {
    setIsLoading(true);

    if (!data) {
      toast.error("No data found");
      setIsLoading(false);
      return;
    }

    const { error } = await tryCatch(
      requestFamilyMember({
        familyId: familyId,
        targetFamilyMemberId: targetFamilyMember,
        relationships,
        eventType: "create_family-membership",
      })
    );

    if (error) {
      toast.error("Failed to make connection");
      console.error(error);
      setIsLoading(false);
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("focus_member", targetFamilyMember);
    router.push(`${window.location.pathname}?${params.toString()}`);

    toast.success("Connection Successful");
    setRelationship(undefined);
    setIsLoading(false);
  }

  if (isPending) {
    return (
      <div className="w-full h-full grid place-content-center">
        <span className="flex gap-2 items-center">
          <Loader2 className=" animate-spin size-3" /> <span>Loading data</span>
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full grid place-content-center">
        <span className="flex gap-2 items-center">
          <span>No data found</span>
        </span>
      </div>
    );
  }

  return (
    <div className="h-full p-3 grid gap-4">
      <div className=" border rounded p-2">
        <div className="space-y-0.5 text-xs">
          <p className=" font-medium  truncate">{data.target.full_name}</p>
          <p className="text-xs truncate">
            From: <FamilyName name={data.target.family_name} />
          </p>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              {data.target?.sex === "male" ? (
                <Mars className="size-3.5 text-muted-foreground" />
              ) : data.target?.sex === "female" ? (
                <Venus className="size-3.5 text-muted-foreground" />
              ) : (
                <VenusAndMars className="size-3.5 text-muted-foreground" />
              )}
              <span className="capitalize">{data.target?.sex}</span>
            </div>
            <div className="flex items-center gap-1">
              {data.target?.is_deceased ? (
                <HeartCrack className="size-3.5 text-muted-foreground" />
              ) : (
                <Heart className="size-3.5 text-muted-foreground" />
              )}
              <span>{data.target?.is_deceased ? "Deceased" : "Living"}</span>
            </div>
          </div>
        </div>
      </div>

      <FormSelect
        label="Relationship"
        name="relationship"
        options={extendedRelationshipOptions}
        value={relationship || ""}
        placeholder="Select Relationship"
        onChange={(value) => {
          setRelationships([]);
          setRelationship(value as ExtendedRelationshipsType);
        }}
      />

      {relationship && (
        <SuggestedRelationships
          familyId={data.source.family_id}
          familyMemberId={sourceFamilyMember}
          relationship={relationship}
          data={data.suggestions}
          setRelationships={setRelationships}
        />
      )}

      {data.target.can_access ? (
        <Button
          size="sm"
          disabled={!relationship || isLoading}
          onClick={connect}
          className="w-full"
        >
          Add Family Member
        </Button>
      ) : (
        <Button
          size="sm"
          disabled={!relationship || isLoading}
          onClick={requestAccess}
          className="w-full"
        >
          Request Access
        </Button>
      )}
    </div>
  );
}
