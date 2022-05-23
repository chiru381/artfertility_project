interface SubMenuState {
    label: string;
    to: string;
    subMenu?: SubMenuState[];
}
interface MenuState extends SubMenuState {
    subMenu?: SubMenuState[];
}
const diagnosisSubMenu: SubMenuState[] = [
    { label: "Patient", to: "/new-diagnosis/patient" },
    { label: "Partner", to: "/new-diagnosis/partner" }
  ];
  
  export const diagnosisMenuList: MenuState[] = [
    { label: "Diagnosis List", to: "/diagnosis-list", subMenu: [] },
    { label: "New Diagnosis", to: "", subMenu: diagnosisSubMenu },
    { label: "Add New Diagnosis", to: "/all-new-diagnosis", subMenu: [] },
  ];
  