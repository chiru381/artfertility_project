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

export const stimulationMenuList: MenuState[] = [
    { label: "Validation", to: "/validation" },
    { label: "Stimulation", to: "/stimulation" },
    { label: "ERA", to: "/era" },
    { label: "Cancel Cycle", to: "/cancel-cycle" },
];