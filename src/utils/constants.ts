export const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
export const customDomain = process.env.NEXT_PUBLIC_AUTH0_CUSTOM_DOMAIN;
export const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
export const appBaseUrl = process.env.APP_BASE_URL;

export const FAMILY_MEMBER_DIMENSIONS = {
  width: 250,
  height: 300,
  padding: 10,
  gap: {
    x: 50,
    y: 100,
  }
} as const

export const maxUsageOptions = [
  { id: 1, value: "1", label: "1 Time" },
  { id: 2, value: "2", label: "2 Times" },
  { id: 3, value: "3", label: "3 Times" },
  { id: 4, value: "4", label: "4 Times" },
  { id: 5, value: "5", label: "5 Times" },
  { id: 6, value: "6", label: "6 Times" },
  { id: 7, value: "7", label: "7 Times" },
  { id: 8, value: "8", label: "8 Times" },
  { id: 9, value: "9", label: "9 Times" },
  { id: 10, value: "10", label: "10 Times" },
];

export const sexOptions = [
  {
    id: 1,
    label: "Male",
    value: "male",
  },
  {
    id: 2,
    label: "Female",
    value: "female",
  },
  {
    id: 3,
    label: "Unknown",
    value: "unknown",
  },
  {
    id: 4,
    label: "Prefer not to say",
    value: "prefer not to say",
  },
];
export const isDeceasedOptions = [
  {
    id: 0,
    label: "Deceased",
    value: "true",
  },
  {
    id: 1,
    label: "Living",
    value: "false",
  },
];

export const expirationOptions = [
  { id: 1, value: "1", label: "1 Day" },
  { id: 2, value: "2", label: "2 Days" },
  { id: 3, value: "3", label: "3 Days" },
  { id: 4, value: "4", label: "4 Days" },
  { id: 5, value: "5", label: "5 Days" },
  { id: 6, value: "6", label: "6 Days" },
  { id: 7, value: "7", label: "7 Days" },
];

export const collaboratorRolesOptions = [
  {
    id: 1,
    label: "Viewer",
    value: "viewer",
  },
  {
    id: 2,
    label: "Editor",
    value: "editor",
  },
];
export const isPublicOptions = [
  {
    id: 0,
    label: "Public",
    value: "true",
  },
  {
    id: 1,
    label: "Private",
    value: "false",
  },
];

export const prefixOptions = [
  {
    label: "Rev",
    value: "Rev",
  },
  {
    label: "Pastor",
    value: "Pastor",
  },
  {
    label: "Barr",
    value: "Barrister",
  },
  {
    label: "Sir",
    value: "Sir",
  },
  {
    label: "Chief",
    value: "Chief",
  },
  {
    label: "Mr.",
    value: "Mr.",
  },
  {
    label: "Mrs.",
    value: "Mrs.",
  },
  {
    label: "Miss",
    value: "Miss",
  },
  {
    label: "Dr.",
    value: "Dr.",
  },

  {
    label: "Prof.",
    value: "Prof.",
  },
];

export const suffixOptions = [
  {
    label: "Jr.",
    value: "Jr.",
  },
  {
    label: "Sr.",
    value: "sr",
  },
  {
    label: "II",
    value: "ii",
  },
  {
    label: "III",
    value: "iii",
  },
  {
    label: "IV",
    value: "iv",
  },
];

export const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  id: i + 1,
  label: `${i + 1}`,
  value: `${i + 1}`,
}));

export const yearOptions = Array.from({ length: 101 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return {
    id: i + 1,
    label: `${year}`,
    value: `${year}`,
  };
});

export const monthOptions = [
  { id: 1, label: "January", value: "1" },
  { id: 2, label: "February", value: "2" },
  { id: 3, label: "March", value: "3" },
  { id: 4, label: "April", value: "4" },
  { id: 5, label: "May", value: "5" },
  { id: 6, label: "June", value: "6" },
  { id: 7, label: "July", value: "7" },
  { id: 8, label: "August", value: "8" },
  { id: 9, label: "September", value: "9" },
  { id: 10, label: "October", value: "10" },
  { id: 11, label: "November", value: "11" },
  { id: 12, label: "December", value: "12" },
];

export const parentageTypeOptions = [
  { id: 1, label: "Biological", value: "biological" },
  { id: 2, label: "Adopted", value: "adopted" },
  { id: 4, label: "Foster", value: "foster" },
  { id: 3, label: "Unknown", value: "unknown" },
];
export const relationshipOptions = [
  { id: 1, label: "Parent", value: "parents" },
  { id: 2, label: "Partner", value: "partners" },
];
export const extendedRelationshipOptions = [
  { id: 1, label: "Parents", value: "parents" },
  { id: 2, label: "Children", value: "children" },
  { id: 3, label: "Partners", value: "partners" },
];

export const maritalStatusOptions = [
  { id: 1, label: "Married", value: "Married" },
  { id: 2, label: "Divorced", value: "Divorced" },
  { id: 3, label: "Separated", value: "Separated" },
  { id: 4, label: "Widowed", value: "Widowed" },
  { id: 5, label: "Engaged", value: "Engaged" },
  { id: 6, label: "Partner", value: "Partner" },
  { id: 7, label: "Friends", value: "Friends" },
  { id: 8, label: "Annulment", value: "Annulment" },
  { id: 9, label: "Unknown", value: "Unknown" },
  { id: 10, label: "Other", value: "Other" },
];

// export const p5Colors = {
//   line: {
//     parents: [0, 163, 136],    // Strong blue - representing guidance, wisdom, protection
//     children: [0, 163, 136],//[255, 183, 77],   // Vibrant gold/amber - representing potential, youth, brightness
//     spouses: [0, 163, 136],    // Deep rose/magenta - representing love, partnership
//   },
//   text:  [200, 200, 200],
//   node:  [0, 74, 88],
// }
// export const p5Colors = {
//   line: {
//     parents: [200, 200, 200],    // Strong blue - representing guidance, wisdom, protection
//     children: [200, 200, 200],//[255, 183, 77],   // Vibrant gold/amber - representing potential, youth, brightness
//     spouses: [200, 200, 200],    // Deep rose/magenta - representing love, partnership
//   },
//   text:  [200, 200, 200],
//   node:  [0, 74, 88],
// }
export const p5Colors = {
  line: {
    parents: [41, 128, 185], // Calming blue - representing stability and guidance
    partners: [231, 76, 60], // Warm red - representing love and connection
  },
  text: [236, 240, 241], // Light gray - for better readability
  node: [44, 62, 80], // Dark blue-gray - for strong node visibility
};
