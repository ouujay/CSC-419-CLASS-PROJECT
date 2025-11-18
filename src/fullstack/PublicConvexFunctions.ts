import { api } from "@/convex/_generated/api";

// users
export const c_CreateUser = api.users.mutations.createUser;
export const c_Logout = api.users.mutations.logout;

// profiles
export const c_GetProfile = api.profiles.queries.getProfile;
export const c_CompleteOnboarding = api.profiles.mutations.completeOnboarding;

// families
export const c_GetFamilies = api.families.queries.getFamilies;
export const c_GetPublicFamilies = api.families.queries.getPublicFamilies;
export const c_GetPublicFamily = api.families.queries.getPublicFamily;
export const c_GetFamily = api.families.queries.getFamily;
export const c_GetFamilyDetails = api.families.queries.getFamilyDetails;
export const c_GetFamilyName = api.families.queries.getFamilyName;
export const c_GetDemoFamily = api.families.queries.getDemoFamily;
export const c_GetFamilyAccessDetails = api.families.queries.getFamilyAccessDetails;
export const c_SearchFamilies = api.families.queries.searchFamilies;
export const c_CreateFamily = api.families.mutations.createFamily;
export const c_UpdateFamily = api.families.mutations.updateFamily;
export const c_DeleteFamily = api.families.mutations.deleteFamily;
export const c_RemoveFamilyProfilePicture = api.families.mutations.removeFamilyProfilePicture;
export const c_ExtendFamily = api.families.mutations.extendFamily;
export const c_RequestExtendFamily = api.families.mutations.requestExtendFamily;
export const c_CheckFamilyAccess = api.families.queries.checkFamilyAccess;

// files
export const c_GenerateUploadUrl = api.files.uploadFiles.generateUploadUrl;
export const c_SyncMetadata = api.files.uploadFiles.syncMetadata;

// collaboration
export const c_GetCollaborators = api.collaborators.queries.getCollaborators;
export const c_GetCollaborator = api.collaborators.queries.getCollaborator;
export const c_GetCollaboratorDetails = api.collaborators.queries.getCollaboratorDetails;
export const c_AddCollaborator = api.collaborators.mutations.addCollaborator;
export const c_UpdateCollaborator = api.collaborators.mutations.updateCollaborator;
export const c_AcceptCollaboration = api.collaborators.mutations.acceptCollaboration;
export const c_DeleteCollaborator = api.collaborators.mutations.deleteCollaborators;
export const c_TransferOwnership = api.collaborators.mutations.transferOwnership;

// waitlist
export const c_AddToWaitlist = api.waitlist.actions.addToWaitlist;

// feedback
export const c_CreateFeedback = api.feedback.mutations.createFeedback;

// family members
export const c_CreateMember = api.familyMembers.mutations.createMember;
export const c_RemoveFamilyMembers = api.familyMembers.mutations.removeFamilyMembers;
export const c_RemoveFamilyMember = api.familyMembers.mutations.removeFamilyMember;
export const c_DeleteFamilyMember = api.familyMembers.mutations.deleteFamilyMember;
export const c_RemoveFamilyMemberProfilePicture =
  api.familyMembers.mutations.removeFamilyMemberProfilePicture;
export const c_UpdatedFamilyMember = api.familyMembers.mutations.updatedFamilyMember;
export const c_ConnectFamilyMember = api.familyMembers.mutations.connectFamilyMember;
export const c_RequestConnectionToFamilyMember = api.familyMembers.mutations.requestConnectionToFamilyMember;
export const c_GetIndividual = api.familyMembers.queries.getFamilyMember;
export const c_GetFamilyMemberName = api.familyMembers.queries.getFamilyMemberName;
export const c_GetSuggestedRelationships = api.familyMembers.queries.getSuggestedRelationships;
export const c_CheckFamilyMemberAccess = api.familyMembers.queries.checkFamilyMemberAccess;
export const c_SearchFamilyMembers = api.familyMembers.queries.searchFamilyMembers;
export const c_GetConnectionDetails = api.familyMembers.queries.getConnectionDetails;

// relationships
export const c_DeleteRelationship = api.relationships.mutations.deleteRelationship;
export const c_UpdateRelationship = api.relationships.mutations.updateRelationship;
export const c_UpdateRelationships = api.relationships.mutations.updateRelationships;
export const c_GetFamiliesByFamilyMemberId = api.relationships.queries.getFamiliesByFamilyMemberId;
export const c_GetRelationships = api.relationships.queries.getRelationships;
export const c_GetRelationshipsPathName = api.relationships.queries.getRelationshipsPathName;
export const c_createRelationship = api.relationships.mutations.createRelationship;

// contributions
export const c_CreateContribution = api.familyContributions.mutations.createContribution;
export const c_CreateFamilyMemberContribution = api.familyContributions.mutations.createFamilyMember;
export const c_UpdateFamilyMemberContribution = api.familyContributions.mutations.updateFamilyMember;
export const c_GetContributionDetails = api.familyContributions.queries.getContributionDetails;
export const c_GetContributionFamilyMembers = api.familyContributions.queries.getFamilyMembers;
export const c_GetContributionList = api.familyContributions.queries.getFamilyContributionsByFamilyId;
export const c_DeleteContribution = api.familyContributions.mutations.deleteContribution;
export const c_RenewContribution = api.familyContributions.mutations.renewContribution;

// family requests
export const c_GetFamilyRequestsByFamilyId = api.familyRequests.queries.getFamilyRequestsByFamilyId;
export const c_RespondToRequest = api.familyRequests.mutations.respondToRequest;

// matches
export const c_GetMatchesByStatus = api.familyMemberMatches.queries.getMatchesByStatus;
export const c_ReviewMatch = api.familyMemberMatches.mutations.reviewMatch;

//notifications
export const c_GetNotificationsByUser = api.notifications.queries.getNotificationsByUser;
export const c_MarkNotificationAsRead = api.notifications.mutations.markNotificationAsRead;

// subscription
export const c_CheckFamilyUsage = api.subscriptions.queries.checkFamilyUsage;
export const c_CheckFamilyMembersUsage = api.subscriptions.queries.checkFamilyMembersUsage;
export const c_CheckCollaborationUsage = api.subscriptions.queries.checkCollaborationUsage;
export const c_CheckContributionUsage = api.subscriptions.queries.checkContributionUsage;
