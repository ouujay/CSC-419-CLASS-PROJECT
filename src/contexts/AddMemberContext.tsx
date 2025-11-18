"use client";

import { createStore, StoreApi, useStore } from "zustand";
import { createContext, useContext, ReactNode, useState } from "react";
import { CreateMemberType } from "@/convex/familyMembers/mutations";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ExtendedRelationshipsType } from "@/types";
import { familyMemberDetailsType } from "@/components/osisi-ui/Form/EssentialInfo";

type FamilyMembersType = Doc<"family_members">;
interface AddMemberState {
  familyId: Id<"families">;
  memberData: familyMemberDetailsType | null;
  relationships: CreateMemberType["relationships"] | null;
  relationship: ExtendedRelationshipsType | null;
  rememberRelationship: boolean;
  referringMember: FamilyMembersType | null | undefined;

  setMemberData: <Key extends keyof familyMemberDetailsType>(
    key: Key,
    value: familyMemberDetailsType[Key]
  ) => void;
  resetMember: () => void;
  reset: () => void;
  setReferringMember: (member: FamilyMembersType | null | undefined) => void;
  setRelationships: (data: CreateMemberType["relationships"]) => void;
  setRelationship: (relationship: ExtendedRelationshipsType) => void;
  setRememberRelationship: (remember: boolean) => void;
  updateMemberData: (data: Partial<AddMemberState>) => void;
}

const AddMemberContext = createContext<StoreApi<AddMemberState> | undefined>(
  undefined
);

type AddMemberProviderProps = {
  children: ReactNode;
  familyId: Id<"families">;
  familyMemberDetails?: familyMemberDetailsType;
  relationships?: CreateMemberType["relationships"];
};

export function AddMemberProvider({
  children,
  familyId,
  familyMemberDetails,
  relationships = [],
}: AddMemberProviderProps) {
  const [store] = useState(() =>
    createStore<AddMemberState>((set, get) => ({
      familyId,
      memberData: familyMemberDetails || {
        sex: "unknown",
        is_deceased: false,
        is_public: false,
        family_id: familyId
      },
      relationships: relationships,
      relationship: null,
      referringMember: undefined,
      rememberRelationship: false,

      setMemberData: <Key extends keyof familyMemberDetailsType>(
        key: Key,
        value: familyMemberDetailsType[Key]
      ) => {
        set((state) => ({
          memberData: state.memberData
            ? { ...state.memberData, [key]: value }
            : null,
        }));
      },
      resetMember: () => {
        set({
          memberData: {
            sex: "unknown",
            is_deceased: false,
            is_public: false,
            name: {},
            family_id: familyId
          },
        });
      },
      setReferringMember: (member) => {
        set({ referringMember: member });
      },
      setRelationships: (data: CreateMemberType["relationships"]) => {
        set({ relationships: data });
      },
      setRelationship: (relationship: ExtendedRelationshipsType) => {
        set({ relationship: relationship });
      },
      setRememberRelationship: (remember: boolean) => {
        set({ rememberRelationship: remember });
      },

      updateMemberData: (data: Partial<AddMemberState>) => {
        set(data);
      },
      reset: () => {
        const rememberRelationship = get().rememberRelationship;

        set({
          memberData: {
            sex: "unknown",
            is_deceased: false,
            is_public: false,
            name: {},
            family_id: familyId
          },
          relationship: rememberRelationship ? get().relationship : null,
          relationships: rememberRelationship ? get().relationships : [],
        });
      },
    }))
  );

  return (
    <AddMemberContext.Provider value={store}>
      {children}
    </AddMemberContext.Provider>
  );
}

export function useAddMemberStore<T>(selector: (state: AddMemberState) => T) {
  const context = useContext(AddMemberContext);

  if (!context) {
    throw new Error("useAddMember must be used within an AddMemberProvider");
  }

  return useStore(context, selector);
}
