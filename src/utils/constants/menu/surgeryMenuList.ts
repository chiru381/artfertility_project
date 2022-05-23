interface SubMenuState {
  label: string;
  to: string;
  subMenu?: SubMenuState[];
}

interface MenuState extends SubMenuState {
  subMenu?: SubMenuState[];
}

const preOperativeCheckUpSubMenu: SubMenuState[] = [
  { label: "Patient", to: "/pre-operative-checkup-list/patient" },
  { label: "Partner", to: "/pre-operative-checkup-list/partner" }
];

export const surgeryMenuList: MenuState[] = [
  { label: "Surgical Investigations Summary", to: "/surgical-investigations-summary", subMenu: [] },
  { label: "Pre Op. Check Up", to: "", subMenu: preOperativeCheckUpSubMenu },
  { label: "Pre Op. Check Up Form", to: "/pre-operative-checkup/partner/create" },
  { label: "Pre Op. Assessment", to: "/pre-operative-assessment" },
  { label: "Surgery General", to: "/surgery-general" },
  { label: "Surgery OP. Notes", to: "/surgery-operative-note" },
  { label: "Surgery Discharge Summary", to: "/surgery-discharge-summary" },
  { label: "Surgery Discharge Instructions", to: "/surgery-discharge-instructions" },
  { label: "Special Form", to: "/surgery-special-form" }
];
