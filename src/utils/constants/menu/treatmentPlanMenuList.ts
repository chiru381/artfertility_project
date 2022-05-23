interface SubMenuState {
    label: string;
    to: string;
    subMenu?: SubMenuState[];
}

interface MenuState extends SubMenuState {
    subMenu?: SubMenuState[];
    label: string;
    to: string;
}

const treatmentPlanSubMenu: SubMenuState[] = [
    { label: "PC", to: "/planned-coitus" },
    { label: "Intra Uterine Insemination", to: "/intra-uterine-insemination" },
    { label: "Oocyte Vitrification", to: "/oocyte-vitrification" },
    { label: "In Vitro Fertilization", to: "/in-vitro-fertilization" },
    { label: "Thaw Embryo Transfer", to: "/thaw-embryo-transfer" },
    { label: "Evaluation Cycle", to: "/evaluation-cycle" },
];

export const treatmentPlanMenuList: MenuState[] = [
    { label: "Summary", to: "/summary", subMenu: [] },
    { label: "Treatment Plan", to: "", subMenu: treatmentPlanSubMenu },
];