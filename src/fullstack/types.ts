import {
  c_GetConnectionDetails,
  c_GetContributionDetails,
  c_GetFamily,
  c_GetFamilyRequestsByFamilyId,
  c_GetRelationships,
  c_GetRelationshipsPathName,
  c_SearchFamilyMembers,
} from "./PublicConvexFunctions";

export type ContributionDetailsType = typeof c_GetContributionDetails._returnType;
export type SearchFamilyMembersType = typeof c_SearchFamilyMembers._returnType;
export type GetConnectionDetailsType = typeof c_GetConnectionDetails._returnType;
export type suggestionsType = GetConnectionDetailsType["suggestions"];
export type GetFamilyType = typeof c_GetFamily._returnType;
export type familyMembersDetails = GetFamilyType["members"];
export type familyMemberType = GetFamilyType["members"][number];
export type GetFamilyRequests = typeof c_GetFamilyRequestsByFamilyId._returnType;
export type GetFamilyRequest = GetFamilyRequests[number];
export type GetRelationships = typeof c_GetRelationships._returnType;
export type GetRelationshipsPathName = typeof c_GetRelationshipsPathName._returnType;
