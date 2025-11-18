import { FAMILY_MEMBER_DIMENSIONS } from "@/utils/constants";
import { Handle, Position } from "@xyflow/react";
import { familyMemberType, GetRelationshipsPathName } from "@/fullstack/types";
import DateRange from "../osisi-ui/Dates";
import RoundedImage from "../images/RoundedImage";

export const PathNode = ({
  data,
}: {
  data: { familyMember: familyMemberType; path: GetRelationshipsPathName[number] };
}) => {
  const { familyMember, path } = data;
  let sex: "default" | "female" | "male" = "default";

  if (familyMember?.sex === "female") {
    sex = "female";
  }
  if (familyMember?.sex === "male") {
    sex = "male";
  }

  return (
    <div
      className={`bg-background border border-muted rounded-xl p-4 font-cardo flex flex-col items-center text-center shadow-lg transition hover:shadow-xl gap-1 relative`}
      style={{
        width: FAMILY_MEMBER_DIMENSIONS.width+100,
        height: FAMILY_MEMBER_DIMENSIONS.height,
      }}
    >
      <h6 className="text-primary text-lg  text">
        {path.relationship_name.default === "You" ? "You" : "Your"}{" "}
        {path.relationship_name[sex]}
      </h6>
      <RoundedImage
        src={familyMember?.profile_picture || "/placeholder.jpg"}
        alt="Profile photo"
        width={100}
        height={100}
      />

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

      <>
        <Handle type="source" id={`p-from`} position={Position.Right} style={{ background: "#004a58" }} />
        <Handle type="target" id={`p-to`} position={Position.Left} style={{ background: "#004a58" }} />
      </>
    </div>
  );
};
