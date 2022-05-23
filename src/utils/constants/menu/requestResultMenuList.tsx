interface SubMenuState {
  label: string;
  to: string;
  subMenu?: SubMenuState[];
}

interface MenuState extends SubMenuState {
  subMenu?: SubMenuState[];
}

const investigationSubMenu: SubMenuState[] = [
  { label: "Patient", to: "/blood-lab/investigation/patient" },
  { label: "Partner", to: "/blood-lab/investigation/partner" }
];

const serologySubMenu: SubMenuState[] = [
  { label: "Patient", to: "/blood-lab/serology/patient" },
  { label: "Partner", to: "/blood-lab/serology/partner" }
];

const bloodLabSubMenu: SubMenuState[] = [
  { label: "Request", to: "/blood-lab/request" },
  { label: "New Request", to: "/blood-lab/new-request" },
  { label: "Investigation", to: "", subMenu: investigationSubMenu },
  { label: "Serology", to: "", subMenu: serologySubMenu },
  { label: "Find", to: "/blood-lab/find" },
];

export const requestResultMenuList: MenuState[] = [
  { label: "Summary", to: "/summary", subMenu: [] },
  { label: "Ultrasound Scan", to: "/ultrasound-scan", subMenu: [] },
  { label: "Blood Lab", to: "", subMenu: bloodLabSubMenu }
];
