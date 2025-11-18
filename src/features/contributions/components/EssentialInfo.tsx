import EssentialInfo from "@/components/osisi-ui/Form/EssentialInfo";
import { useAddMemberStore } from "@/contexts/AddMemberContext";
import React from "react";

export default function EssentialInfoContainer() {
    const memberData = useAddMemberStore((state) => state.memberData);
    const setMemberData = useAddMemberStore((state) => state.setMemberData);

    if (!memberData) {
        return null;
    }

    return (
        <EssentialInfo familyMemberDetails={memberData} onChange={setMemberData} />
    );
}
