import FormSwitch from "@/components/osisi-ui/inputs/FormSwitch";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import { useAddMemberStore } from "@/contexts/AddMemberContext";
import { ExtendedRelationshipsType } from "@/types";
import { extendedRelationshipOptions } from "@/utils/constants";
import React from "react";

export default function SelectRelationshipType() {
  const setRelationship = useAddMemberStore((state) => state.setRelationship);
  const relationship = useAddMemberStore((state) => state.relationship);
  const rememberRelationship = useAddMemberStore(
    (state) => state.rememberRelationship
  );
  const setRememberRelationship = useAddMemberStore(
    (state) => state.setRememberRelationship
  );
  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <FormSelect
          label="Relationship"
          name="relationship"
          options={extendedRelationshipOptions}
          placeholder="Select relationship"
          value={relationship || ""}
          onChange={(value) => {
            setRelationship(value as ExtendedRelationshipsType);
          }}
        />
        <FormSwitch
          defaultChecked={rememberRelationship}
          required={false}
          name="remember_relationship"
          id="remember_relationship"
          label="Remember Relationship"
          onCheckedChange={(checked) => setRememberRelationship(checked)}
        />
      </div>
      {!relationship && (
        <p className="text-sm text-muted-foreground">
          Please select a relationship to continue.
        </p>
      )}
    </>
  );
}
