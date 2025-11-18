import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface FamilyMemberControlStore {
  hiddenFamilyMembers: Id<"family_members">[];
  selectedFamilyMembers: Id<"family_members">[];
  selectFamilyMember: (familyMemberId: Id<"family_members">) => void;
  resetSelectedFamilyMembers: () => void;
  hideFamilyMember: (familyMemberId: Id<"family_members">) => void;
  resetHiddenFamilyMembers: () => void;
}

export const useFamilyMemberControls = create<FamilyMemberControlStore>(
  (set, get) => ({
    hiddenFamilyMembers: [],
    selectedFamilyMembers: [],
    selectFamilyMember: (familyMemberId) => {
      const selectedFamilyMembers = get().selectedFamilyMembers;
      if (selectedFamilyMembers.includes(familyMemberId)) {
        const filteredSelectedFamilyMembers = selectedFamilyMembers.filter(
          (familyMember) => familyMember !== familyMemberId
        );
        set({ selectedFamilyMembers: filteredSelectedFamilyMembers });
      } else {
        const newSelectedFamilyMembers = [
          ...selectedFamilyMembers,
          familyMemberId,
        ];
        set({ selectedFamilyMembers: newSelectedFamilyMembers });
      }
    },
    hideFamilyMember: (familyMemberId) => {
      const hiddenFamilyMembers = get().hiddenFamilyMembers;
      if (hiddenFamilyMembers.includes(familyMemberId)) {
        const filteredHiddenFamilyMembers = hiddenFamilyMembers.filter(
          (familyMember) => familyMember !== familyMemberId
        );
        set({ hiddenFamilyMembers: filteredHiddenFamilyMembers });
      } else {
        const newHiddenFamilyMembers = [familyMemberId, ...hiddenFamilyMembers];
        set({ hiddenFamilyMembers: newHiddenFamilyMembers });
      }
    },
    resetHiddenFamilyMembers: () => {
      set({ hiddenFamilyMembers: [] });
    },
    resetSelectedFamilyMembers: () => {
      set({ selectedFamilyMembers: [] });
    },
  })
);
