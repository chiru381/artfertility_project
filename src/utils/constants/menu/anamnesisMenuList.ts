interface SubMenuState {
  label: string;
  to: string;
  subMenu?: SubMenuState[];
}

interface MenuState extends SubMenuState {
  subMenu?: SubMenuState[];
}

const clinicalHistorySubMenu: SubMenuState[] = [
  { label: "General History", to: "/clinical-history/general" },
  { label: "Medical History", to: "/clinical-history/medical" },
  { label: "Surgical History", to: "/clinical-history/surgical" },
  { label: "Obstetric History", to: "/clinical-history/obstetric" },
  { label: "Medication History", to: "/clinical-history/medication" },
  { label: "Family History", to: "/clinical-history/family" },
];

const previousExaminationsSubMenu: SubMenuState[] = [
  { label: "Complimentary tests", to: "/previous-examination/complimentary-tests" },
  { label: "Hormonal Determination", to: "/previous-examination/hormonal-determination" },
  { label: "Genetic Tests", to: "/previous-examination/genetic-tests" },
  { label: "Complimentary Analytics", to: "/previous-examination/complimentary-analytics" },
];

const femaleAssessmentSubMenu: SubMenuState[] = [
  { label: "First Ultrasound Scan", to: "/woman-assessment/first-ultrasound-scan" },
  { label: "General/Gynaecological Examination", to: "/woman-assessment/general-gynaecological-examination" }
];

const maleAssessmentSubMenu: SubMenuState[] = [
  { label: "Previous Examination", to: "/male-assessment/previous-examination" },
  { label: "Medical History", to: "/male-assessment/medical-history" },
  { label: "Surgical History", to: "/male-assessment/surgical-history" },
  { label: "Medication History", to: "/male-assessment/medication-history" },
  { label: "Current Examination", to: "/male-assessment/current-examination" },
];

export const anamnesisMenuList: MenuState[] = [
  { label: "Summary", to: "/clinical-history/infertility-summary", subMenu: [] },
  { label: "Clinical History", to: "", subMenu: clinicalHistorySubMenu },
  { label: "Previous Examinations", to: "", subMenu: previousExaminationsSubMenu },
  { label: "Previous Treatments", to: "/clinical-history/previous-treatment", subMenu: [] },
  { label: "Woman Assessment", to: "", subMenu: femaleAssessmentSubMenu },
  { label: "Male Assessment", to: "", subMenu: maleAssessmentSubMenu },
];
