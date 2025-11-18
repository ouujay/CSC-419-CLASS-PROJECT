import { Id } from "@/convex/_generated/dataModel";
import { FAMILY_MEMBER_DIMENSIONS } from "@/utils/constants";
import ProfileDetails from "../osisi-ui/profile/ProfileDetails";
import { Handle, Position } from "@xyflow/react";
import WithFamilyAccess from "../access/WithAccess";
import AddFamilyMembers from "../Add/Add";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeClosed, Focus, House } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { familyMemberType } from "@/fullstack/types";
import DateRange from "../osisi-ui/Dates";
import RoundedImage from "../images/RoundedImage";
import { useFamilyMemberControls } from "@/contexts/FamilyMemberControl";
import { FamilyMemberImage } from "@/app/dashboard/family-members/[family_member_id]/components/FamilyMemberDetails";
import { Checkbox } from "../ui/checkbox";
import { Profile } from "../osisi-ui/sheets/EditFamilyMemberSheets";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";

export const FamilyNode = ({ data: familyMember }: { data: familyMemberType }) => {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const { data } = useFamilyData();
  const familyMembers = data.members;
  const baseFamilyMember = familyMembers.find((member) => member._id === familyMember._id);

  const hiddenFamilyMembers = useFamilyMemberControls((state) => state.hiddenFamilyMembers);
  const selectedFamilyMembers = useFamilyMemberControls((state) => state.selectedFamilyMembers);
  const isHidden = hiddenFamilyMembers.includes(familyMember._id);
  const isSelected = selectedFamilyMembers.includes(familyMember._id);

  if (!baseFamilyMember) {
    return <></>;
  }
  return (
    <div
      className={`bg-background border border-muted rounded-xl p-2 font-cardo flex flex-col items-center text-center shadow-sm transition hover:shadow-md gap-1 relative ${isHidden ? "opacity-50" : "opacity-100"}`}
      style={{
        width: FAMILY_MEMBER_DIMENSIONS.width,
        height: FAMILY_MEMBER_DIMENSIONS.height,
      }}
    >
      <div className="flex justify-between items-center gap-2 w-full">
        <SelectFamilyMember isSelected={isSelected} familyMemberId={familyMember._id} />
        <WithFamilyAccess
          action="read"
          resource="family_members"
          familyId={familyMember?.family_id}
          fallback={
            <ProfileDetails details={baseFamilyMember}>
              <Button variant={"link"}>View Profile</Button>
            </ProfileDetails>
          }
        >
          <Profile details={baseFamilyMember} />
        </WithFamilyAccess>

        <HideFamilyMember isHidden={isHidden} familyMemberId={familyMember._id} />
      </div>

      <div className="relative isolate">
        <RoundedImage
          src={familyMember?.profile_picture || "/placeholder.jpg"}
          alt="Profile photo"
          width={56}
          height={56}
        />

        <WithFamilyAccess action="read" resource="family_members" familyId={familyMember?.family_id}>
          <FamilyMemberImage
            fallbackText={familyMember?.full_name.charAt(0).toUpperCase() || "FM"}
            familyMemberId={familyMember?._id}
            imageUrl={familyMember?.profile_picture}
          />
        </WithFamilyAccess>
      </div>

      <div>
        <h6 className="text-primary text-lg font-semibold text">{familyMember?.name.given}</h6>
        <h6 className="text-primary text-lg font-semibold text">
          {familyMember?.name.married || familyMember?.name.family}
        </h6>
      </div>

      <DateRange
        birthDate={familyMember?.dates?.birth}
        isDeceased={familyMember?.is_deceased}
        variant="detailed"
      />
      <div className="mt-auto ">
        <WithFamilyAccess familyId={familyId} action={"create"} resource="family_members">
          <AddFamilyMembers familyMemberId={familyMember._id} />
        </WithFamilyAccess>
      </div>
      <FocusFamilyMember familyMemberId={familyMember._id} />
      <SourceFamily
        familyMemberId={familyMember._id}
        sourceFamilyId={familyMember.family_id}
        currentFamilyId={familyId}
      />

      {/* React Flow Handles */}
      <>
        <Handle type="target" id="parents-to" position={Position.Top} style={{ background: "#004a58" }} />
        <Handle
          type="source"
          id="parents-from"
          position={Position.Bottom}
          style={{ background: "#004a58" }}
        />
        <Handle type="target" id="partners-to" position={Position.Right} style={{ background: "#004a58" }} />
        <Handle type="source" id="partners-from" position={Position.Left} style={{ background: "#004a58" }} />
      </>
    </div>
  );
};
function SourceFamily({
  familyMemberId,
  sourceFamilyId,
  currentFamilyId,
}: {
  familyMemberId: Id<"family_members">;
  sourceFamilyId: Id<"families">;
  currentFamilyId: Id<"families">;
}) {
  const pathname = usePathname();

  const currentUrl = `${pathname}?focus_member=${familyMemberId}`;
  const newUrl = currentUrl.replace(currentFamilyId, sourceFamilyId);

  if (sourceFamilyId === currentFamilyId) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 w-fit p-1 m-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild>
            <Link href={newUrl} className=" p-2 flex gap-2 capitalize">
              <House className="size-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Source Family</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function HideFamilyMember({
  isHidden,
  familyMemberId,
}: {
  isHidden: boolean;
  familyMemberId: Id<"family_members">;
}) {
  const hideFamilyMember = useFamilyMemberControls((state) => state.hideFamilyMember);

  function onClick() {
    hideFamilyMember(familyMemberId);
  }

  return (
    <div className="">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onClick}>
            {isHidden ? <Eye /> : <EyeClosed />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hide Family Member</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function SelectFamilyMember({
  isSelected,
  familyMemberId,
}: {
  isSelected: boolean;
  familyMemberId: Id<"family_members">;
}) {
  const selectFamilyMember = useFamilyMemberControls((state) => state.selectFamilyMember);

  function onClick() {
    selectFamilyMember(familyMemberId);
  }

  return (
    <div className="">
      <Button size={"icon"} asChild variant={"ghost"} className="size-6">
        <Checkbox
          name="select_family_member"
          id={`select_family_member_${familyMemberId}`}
          // defaultChecked={isSelected}
          onCheckedChange={onClick}
          checked={isSelected}
        />
      </Button>
    </div>
  );
}

function FocusFamilyMember({ familyMemberId }: { familyMemberId: Id<"family_members"> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleFocus = () => {
    const params = new URLSearchParams(searchParams);
    params.set("focus_member", familyMemberId);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="absolute bottom-0 right-0 w-fit p-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleFocus}>
            <Focus className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Focus on Family Member</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
