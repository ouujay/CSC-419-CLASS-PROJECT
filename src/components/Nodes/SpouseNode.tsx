import { Handle, Position } from "@xyflow/react";

export const SpouseNode = () => {
  return (
    <div className="hidden">
      {/* React Flow Handles */}
      <>
        <Handle
          type="target"
          id="parents-to"
          position={Position.Top}
          style={{ background: "#004a58" }}
        />
        <Handle
          type="source"
          id="parents-from"
          position={Position.Bottom}
          style={{ background: "#004a58" }}
        />
        <Handle
          type="target"
          id="partners-to"
          position={Position.Right}
          style={{ background: "#004a58" }}
        />
        <Handle
          type="source"
          id="partners-from"
          position={Position.Left}
          style={{ background: "#004a58" }}
        />
      </>
    </div>
  );
};