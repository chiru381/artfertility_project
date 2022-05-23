interface SubMenuState {
  label: string;
  to: string;
  subMenu?: SubMenuState[];
}

interface MenuState extends SubMenuState {
  subMenu?: SubMenuState[];
}

const prescriptionSubMenu: SubMenuState[] = [
  { label: "Patient", to: "/new-prescription/patient" },
  { label: "Partner", to: "/new-prescription/partner" }
];

export const prescriptionMenuList: MenuState[] = [
  { label: "Summary", to: "/summary", subMenu: [] },
  { label: "New Prescription", to: "", subMenu: prescriptionSubMenu },
  { label: "All Medication View", to: "/all-medication-view", subMenu: [] },
];
