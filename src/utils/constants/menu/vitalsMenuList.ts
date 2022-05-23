interface SubMenuState {
    label: string;
    to: string;
    subMenu?: SubMenuState[];
  }
  
  interface MenuState extends SubMenuState {
    subMenu?: SubMenuState[];
  }
  
  const newVitalsSubMenu: SubMenuState[] = [
    { label: "Patient", to: "/new-vitals/patient" },
    { label: "Partner", to: "/new-vitals/partner" }
  ];
  
  export const vitalsMenuList: MenuState[] = [
    { label: "Summary", to: "/summary", subMenu: [] },
    { label: "New Vitals", to: "", subMenu: newVitalsSubMenu },
    { label: "Graph & Trends", to: "/vitals/graph-and-trends", subMenu: [] }
  ];
  