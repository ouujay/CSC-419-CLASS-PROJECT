// import { FAMILY_MEMBER_DIMENSIONS } from "@/utils/constants";
import { Handle, Position } from "@xyflow/react";
import { familyMemberType } from "@/fullstack/types";
import DateRange from "../osisi-ui/Dates";
import { RoundedPreviewImage } from "../images/RoundedImage";
// import RoundedImage from "../images/RoundedImage";

export const PreviewNode = ({ data: familyMember }: { data: familyMemberType }) => {
  return (
    <div className={` font-cardo flex flex-col items-center text-center gap-1 relative`}>
      <RoundedPreviewImage
        src={familyMember?.profile_picture || "/placeholder.jpg"}
        alt="Profile photo"
        width={125}
        height={125}
      />

      <div>
        <h6 className="text-primary text-sm font-semibold text">
          {familyMember?.name.given} {familyMember?.name.married || familyMember?.name.family}
        </h6>
      </div>

      <DateRange
        birthDate={familyMember?.dates?.birth}
        isDeceased={familyMember?.is_deceased}
        variant="compact"
      />

      <>
        <Handle
          type="target"
          id="parents-to"
          position={Position.Top}
          style={{ background: "#004a5800", border: 0 }}
        />
        <Handle
          type="source"
          id="parents-from"
          position={Position.Bottom}
          style={{ background: "#004a5800", border: 0 }}
        />
        <Handle
          type="target"
          id="partners-to"
          position={Position.Right}
          style={{ background: "#004a5800", border: 0 }}
        />
        <Handle
          type="source"
          id="partners-from"
          position={Position.Left}
          style={{ background: "#004a5800", border: 0 }}
        />
      </>
    </div>
  );
};
// export const PreviewNode = ({
//   data: familyMember,
// }: {
//   data: familyMemberType;
// }) => {
//   return (
//     <div
//       className={`bg-background border border-muted rounded-xl p-4 font-cardo flex flex-col items-center text-center shadow-lg transition hover:shadow-xl gap-1 relative`}
//       style={{
//         width: FAMILY_MEMBER_DIMENSIONS.width,
//         height: FAMILY_MEMBER_DIMENSIONS.height - 50,
//       }}
//     >
//       <RoundedImage
//         src={familyMember?.profile_picture || "/placeholder.jpg"}
//         alt="Profile photo"
//         width={100}
//         height={100}
//       />

//       <div>
//         <h6 className="text-primary text-lg font-semibold text">
//           {familyMember?.name.given}
//         </h6>
//         <h6 className="text-primary text-lg font-semibold text">
//           {familyMember?.name.married || familyMember?.name.family}
//         </h6>
//       </div>

//       <DateRange
//         birthDate={familyMember?.dates?.birth}
//         isDeceased={familyMember?.is_deceased}
//         variant="detailed"
//       />

//       <>
//         <Handle
//           type="target"
//           id="parents-to"
//           position={Position.Top}
//           style={{ background: "#004a58" }}
//         />
//         <Handle
//           type="source"
//           id="parents-from"
//           position={Position.Bottom}
//           style={{ background: "#004a58" }}
//         />
//         <Handle
//           type="target"
//           id="partners-to"
//           position={Position.Right}
//           style={{ background: "#004a58" }}
//         />
//         <Handle
//           type="source"
//           id="partners-from"
//           position={Position.Left}
//           style={{ background: "#004a58" }}
//         />
//       </>
//     </div>
//   );
// };
