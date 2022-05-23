import dayjs from "dayjs";
import { DefaultReducerListType, DefaultReducerObjectType, TableFilterStateType, PaginationReducerType, AuthReducerObjectType } from "utils/types";

export const clinicalInitialRoutePath = 'art-emr';
export const genderTypeOptions = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Both', value: 3 },
];

export const callType = [
  { label: 'Enquiry', value: "1" },
  { label: 'Appointment', value: "2" },
];

export const tableInitialState: TableFilterStateType = {
  limit: 10,
  page: 1,
  sortKey: '',
  sortType: '',
  columnFilter: [],
  searchColumnFilters: []
}

export const filterTypes = {
  "text": "STRING",
  "number": "NUMBER",
  "date": "DATE",
  "select": "SELECT",
  "multiSelect": "MULTI-SELECT",
  "boolean": "BOOLEAN"
}

export const filterOperators = {
  "asc": 0,
  "desc": 1,
  "isLessThan": 0,
  "isLessThanOrEqualTo": 1,
  "isEqualTo": 2,
  "isNotEqualTo": 3,
  "isGreaterThanOrEqualTo": 4,
  "isGreaterThan": 5,

  "startsWith": 6,
  "endsWith": 7,
  "contains": 8,
  "isContainedIn": 9,
  "doesNotContain": 10,
}

export const numberFiltersLists = [
  { label: "Is Less Than", operator: filterOperators.isLessThan },
  { label: "Is Less Than Or Equal To", operator: filterOperators.isLessThanOrEqualTo },
  { label: "Is Equal To", operator: filterOperators.isEqualTo },
  { label: "Is Not Equal To", operator: filterOperators.isNotEqualTo },
  { label: "Is Greater Than Or Equal To", operator: filterOperators.isGreaterThanOrEqualTo },
  { label: "Is Greater Than", operator: filterOperators.isGreaterThan },
];

export const dateFiltersLists = numberFiltersLists;

export const textFiltersLists = [
  { label: "Starts With", operator: filterOperators.startsWith },
  { label: "Ends With", operator: filterOperators.endsWith },
  { label: "Contains", operator: filterOperators.contains },
  { label: "Is Contained In", operator: filterOperators.isContainedIn },
  { label: "Does Not Contain", operator: filterOperators.doesNotContain }
];

export const defaultArrayState: DefaultReducerListType = {
  loading: false,
  error: false,
  data: [],
};

export const defaultObjectState: DefaultReducerObjectType = {
  loading: false,
  error: false,
  data: {},
};

export const AuthObjectState: AuthReducerObjectType = {
  loading: false,
  error: false,
  data: {},
  status: 0
};

export const defaultPaginationState: PaginationReducerType = {
  loading: false,
  error: false,
  data: {
    modelItems: [],
    totalRecord: 0
  },
};

export const genderList = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Both', value: 3 },
];

export const leadSourceOrderList = [
  { label: 'Lead Source 1', value: 1 },
  { label: 'Lead Source 2', value: 2 },
  { label: 'Lead Source 3', value: 3 },
];

export const resourceList = [
  { label: 'Doctor', value: "1" },
  { label: 'Ultrasound', value: "2" },
  { label: 'Blood Lab', value: "3" },
  { label: 'Councelling', value: "4" },
  { label: 'IVF lab', value: "5" }
];

export const eligibilityAuthorizationList = [
  { label: 'Taken', value: "1" },
  { label: 'Not Taken', value: "2" },
  { label: 'Not Applicable', value: "3" }
];

export const blockTypeList = [
  { label: 'Full Day', value: "1" },
  { label: 'Half Day', value: "2" },
  { label: 'Time Based', value: "3" }
];

export const halfDayList = [
  { label: 'First Half', value: "1" },
  { label: 'Second Half', value: "2" }
];

export const billTypeList = [
  { label: 'Bill Now', value: "1" },
  { label: 'Bill Later', value: "2" }
];

export const discountTypeList = [
  { label: 'Discount on Service', value: "1" },
  { label: 'Discount on Total', value: "2" }
];

export const chargeTypeList = [
  { label: 'Part of Package', value: "1" },
  { label: 'Out of Package', value: "2" }
];

export const modeOfPaymentList = [
  { label: 'Cash', value: "1" },
  { label: 'Card', value: "2" }
];

export const refundTypeList = [
  { label: 'OP Refund Deposit', value: "1" },
  { label: 'OP Billing Refund', value: "2" },
  { label: 'Package Cancellation', value: "3" }
];

// don't edit day name
const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const getDayName = (dayNumber: any) => {
  return daysList[dayNumber - 1];
}

export const resourceSlotConfigList = [
  { dayOfWeekNumber: 1, fromTime: dayjs('08:00', 'hh:mm').toDate(), toTime: dayjs('18:00', 'hh:mm').toDate(), isExcluded: false },
  { dayOfWeekNumber: 2, fromTime: dayjs('08:00', 'hh:mm').toDate(), toTime: dayjs('18:00', 'hh:mm').toDate(), isExcluded: false },
  { dayOfWeekNumber: 3, fromTime: dayjs('08:00', 'hh:mm').toDate(), toTime: dayjs('18:00', 'hh:mm').toDate(), isExcluded: false },
  { dayOfWeekNumber: 4, fromTime: dayjs('08:00', 'hh:mm').toDate(), toTime: dayjs('18:00', 'hh:mm').toDate(), isExcluded: false },
  { dayOfWeekNumber: 5, fromTime: dayjs('08:00', 'hh:mm').toDate(), toTime: dayjs('18:00', 'hh:mm').toDate(), isExcluded: false },
  { dayOfWeekNumber: 6, fromTime: dayjs('08:00', 'hh:mm').toDate(), toTime: dayjs('18:00', 'hh:mm').toDate(), isExcluded: false },
  { dayOfWeekNumber: 7, fromTime: dayjs('08:00', 'hh:mm').toDate(), toTime: dayjs('18:00', 'hh:mm').toDate(), isExcluded: false },
];


export const patientInformations = [
  { name: "currentAge", label: "start-age" },
  { name: "currentAge", label: "current-age" },
  { name: "occupationName", label: "occupation" },
  { name: "idType", label: "national-id-type" },
  { name: "documentType", label: "document-id1" },
  { name: "nationalityName", label: "nationality" },
  { name: "genderName", label: "gender" },
  { name: "telephone", label: "mobile" },
  { name: "address", label: "address" },
  { name: "patientLanguages", label: "language-known" },
]

export const partnerInformations = [
  { name: "husbandAge", label: "start-age" },
  { name: "husbandAge", label: "current-age" },
  { name: "husbandPatientOccupationName", label: "occupation" },
  { name: "idType", label: "national-id-type" },
  { name: "documentType", label: "document-id1" },
  { name: "husbandPatientNationalityName", label: "nationality" },
  { name: "husbandPatientGenderName", label: "gender" },
  { name: "husbandPatientTelephone", label: "mobile" },
  { name: "husbandPatientAddress", label: "address" },
  { name: "husbandPatientPatientLanguages", label: "language-known" },
]

export const patientChannelInformation = [
  { name: "payerInsuranceCompanyName", label: "payer" },
  { name: "sponsorInsuranceCompanyName", label: "sponsor" },
  { name: "tariffName", label: "network-plan-type" },
  { name: "planName", label: "plan-name" },
  { name: "insuranceNumber", label: "insurance-id" },
  { name: "insuranceValidFrom", label: "insurance-valid-from" },
  { name: "insuranceValidTo", label: "insurance-valid-to" },
  { name: "eligibilityAuthorizationStatus", label: "eligibility-authorization-status" },
  { name: "refereneNumber", label: "reference" },
  { name: "planLimit", label: "plan-limit" },
]

export const billsTableColumns = [
  // { name: "serviceDate", label: "service-date" },
  { name: "billingCode", label: "billing-code" },
  { name: "serviceItemName", label: "billing-service" },
  { name: "cptCode", label: "cpt-code" },
  { name: "serviceAmount", label: "rate" },
  { name: "quantity", label: "qty" },
  { name: "discountPerchantage", label: "discount-percent" },
  { name: "discountAmount", label: "discount-amount" },
  { name: "amount", label: "amount" },
  { name: "tax", label: "tax" },
  { name: "coPayment", label: "Co-payment" },
  { name: "deductableAmount", label: "deductable" },
  { name: "netAmount", label: "net-claimed-billed" },
]

export const billPaymentFields = [
  { name: "billAmount", label: "bill-amount" },
  { name: "discountAmount", label: "discount-amount" },
  { name: "patientPayableAmount", label: "patient-payable-amount" },
  { name: "totalDepositAmount", label: "total-deposit-amount" },
]

export const bedStatus = {
  "Vacant": 1,
  "PreOperativeArea": 2,
  "InOT": 3,
  "PostOT": 4,
  "BlockedforMaintenance": 5
}

export const transactionType = {
  "OPDeposit": 1,
  "OutPatientBill": 2,
  "PackageDeposit": 3,
  "PackageSettlement": 4,
  "OutPatientRefund": 5,
  "PackageCancel": 6,
  "DepositRefund": 7,
  "OPBillSettlement": 8
}

export const itemType = {
  "Consultation": 1,
  "Investigation": 2,
  "Pharmacy": 3,
  "Others": 4
}

export const transactionTypeList = [
  { label: "OutPatientDeposit", value: 1 },
  { label: "OutPatientBill", value: 2 },
  { label: "PackageDeposit", value: 3 },
  { label: "PackageSettlement", value: 4 },
  { label: "OutPatientRefund", value: 5 },
  { label: "PackageCancel", value: 6 }
]

export const cycleTypePCList = [
  { label: "MNC (Managed Natural Cycle)", value: "1" },
  { label: "PN (Pure Natural)", value: "2" },
  { label: "PN + LPS (Pure Natural + Luteal Phase Support)", value: "3" }
];

export const cycleTypeList = [
  { label: "Stimulated", value: "1" },
  { label: "Natural", value: "2" },
  { label: "HRT", value: "3" }
];

export const stimulationValidationConsentsList = [
  { value: 'isWrittenConsent', label: "Written Consent" },
  // { value: 'isKIRProtocol', label: "Medication" },
  { value: 'isPreoperative', label: "Pre Operative" },
  { value: 'isAdministration', label: "Administration" },
  { value: 'isMarriageCertificate', label: "Marriage Certificate" },
  { value: 'isAuthorization', label: "Authorization" },
]

export const stimulationValidationAuthorizationList = [
  { value: 'isOPU', label: "OPU" },
  { value: 'isDH', label: "DH" },
  { value: 'isPGT_A', label: "PGT-A" },
  { value: 'isET', label: "ET" },
  { value: 'isOthers', label: "Others" },
]

export const pgtDataList = [
  { value: 'isCaInotrope', label: "Ca Inotrope" },
  { value: 'isKIRProtocol', label: "KIR Protocol" },
  { value: 'isANAProtocol', label: "ANA protocol" },
  { value: 'isoPlannedPGT', label: "PGT Planned" },
]

export const pgtPlannedList = [
  { value: 'isPGTA', label: "PGT A" },
  { value: 'isPGTM', label: "PGT M" },
  { value: 'isPGTSR', label: "PGT-SR" },
  { value: 'iscfDNA', label: "cf DNA" },
]

export const evaluationTypeList = [
  { value: '1', label: "ERA" },
  { value: '2', label: "EMMA" },
  { value: '3', label: "ALICE" },
  { value: '4', label: "ENDOMETRIO" }
]

export const outcomeOfTestList = [
  { value: '1', label: "Pre-Receptive" },
  { value: '2', label: "Receptive" },
  { value: '3', label: "Post Receptive" },
]

export const PGTA_DiagnosisEpisodesList = [
  { value: 'isAdvancedMaternalAge', label: "Advanced maternal age" },
  { value: 'isFamilyBalancing', label: "Family balancing" },
  { value: 'isRecurrentImplantationFailure', label: "Recurrent implantation failure" },
  { value: 'isElective', label: "Elective" },
  { value: 'isRecurrentMiscarriage', label: "Recurrent miscarriage" },
  { value: 'isSexLinkedDisorder', label: "Sex linked disorder (medically indicated sex selection)" },
  { value: 'isPreviousAffected', label: "Previous affected/aneuploidy pregnancy" },
  { value: 'isConsanguinity', label: "Consanguinity" },
  { value: 'isAbnormalFISHResult', label: "Abnormal FISH result" },
  { value: 'isOtherIndication', label: "Other indication" },
  { value: 'isMaleFactor', label: "Male factor" },
  { value: 'isReproductiveFailure', label: "Reproductive failure/ unexplained infertility" },
  { value: 'isLowOvarianReserve', label: "Low ovarian reserve" },
]

export const PGTSR_DiagnosisEpisodesList = [
  { value: 'isAlteredKaryotype', label: "Altered Karyotype" },
  { value: 'isNumericalAbnormality', label: "Numerical Abnormality" },
  { value: 'isTranslocation', label: "Translocation" },
  { value: 'isInversion', label: "Inversion" },
]

export const PGTM_DiagnosisEpisodesList = [
  { value: 'isSpecify', label: "Specify the monogenic disease(s) and the gene(s) involved (one or multiple)" },
  { value: 'isMedically', label: "Medically indicated sex selection" },
]

export const slotConfigResources = [{
  fieldName: 'type',
  title: 'Type',
  instances: [
    { id: 'blocked', text: 'Blocked', color: 'grey' }
  ]
}];

export const acceptRejectOptions = [
  { label: "Pending", value: "1" },
  { label: "Accepted", value: "2" },
  { label: "Rejected", value: "3" }
]

export const testSourceOptions = [
  { label: "Internal", value: 1 },
  { label: "External", value: 2 },
  { label: "All", value: 3 }
]

export const emiSchemeOptions = [
  { label: "9 Months", value: 1 },
  { label: "8 Months", value: 2 }
]
export const resultTypeOptions = [
  { label: "NumericField", value: 1 },
  { label: "FreeText", value: 2 },
  { label: "ListOfValues", value: 3 },
  { label: "Formula", value: 4 },
  { label: "Template", value: 5 }
]

export const tableIconStyle = {
  height: "25px",
  width: "25px"
}

export const buttonIconStyle = {
  height: "18px",
  width: "18px"
}

export const referenceRangeConditionOptions = [
  { label: "Age", value: 1 },
  { label: "Gender", value: 2 },
  { label: "Both", value: 3 }
]

export const currencyOptions = [
  { label: "INR", value: 1 },
  { label: "Dhiram", value: 2 },
  { label: "Riyals", value: 3 },
  { label: "Dollar-US", value: 4 }
]

export const patientFolioStage = [
  { label: "Bill on Order", value: 1 },
  { label: "Bill on Complete", value: 2 }
]

export const componentMathmeticalOperatorOptions = [
  { label: "+", value: '+' },
  { label: "-", value: "-" },
  { label: "x", value: 'x' },
  { label: "/", value: '/' },
  { label: "%", value: '%' },
  { label: "=", value: '=' },
]

export const medicalStaffTypeOptions = [
  { label: "Doctor", value: '1' },
  { label: "Counselor", value: "2" },
  { label: "Nurse", value: '3' },
  { label: "Pharmacist", value: '4' }
]

export const testReportStatus = {
  NewOrder: 1,
  SampleCollected: 2,
  PartialSampleCollected: 3,
  SampleDispatched: 4,
  SampleAcknowledged: 5,
  Draft: 6,
  Released: 7,
  Verified: 8,
  PartialVerified: 9,
  Cancelled: 10
}

export const reSamplingReasonOptions = [
  { label: "Sample is not adequate", value: 1 }
]

export const consanguinityOptions = [
  { label: "0", value: 1 },
  { label: "1", value: 2 },
  { label: "2", value: 3 }
]

export const cycleOptions = [
  { label: "Regular", value: 1 },
  { label: "Irregular", value: 2 }
]

export const rightLeftOptions = [
  { label: "Right", value: 1 },
  { label: "Left", value: 2 },
  { label: "NA", value: 3 }
]

export const patientStateOptions = [
  { label: "Treated Solved", value: 1 },
  { label: "Treated Not Solved", value: 2 },
  { label: "Not Treated", value: 3 }
]

export const smokingDurationOptions = [
  { label: "Days", value: 1 },
  { label: "Weeks", value: 2 },
  { label: "Months", value: 3 },
  { label: "Years", value: 4 }
];

export const alcoholConsumptionOptions = [
  { label: "No", value: 1 },
  { label: "Occasional", value: 2 },
  { label: "Often", value: 3 },
  { label: "Ethylism", value: 4 },
  { label: "Discontinued", value: 5 }
]

export const smokingStatusOptions = [
  { label: "Yes Active", value: 1 },
  { label: "Yes Discontinued", value: 2 },
  { label: "No", value: 3 }
];

export const smokingStatus = {
  YesActive: 1,
  YesDiscontinued: 2,
  No: 3
};

export const penisEnum = {
  WithoutAnomaly: 1,
  Induration: 2,
  Phimosis: 3,
  FrenulumBreve: 4,
  Other: 5
}

export const investigationsEnum = {
  SpermAnalysis: 1,
  FSHTestosterone: 2,
  Karyotype: 3,
  YQdeletion: 4
}

export const suggestedTreatmentEnum = {
  HormonalTreatment: 1,
  FNA: 2,
  TESE: 3,
  MicroTESE: 4
}

export const testiclesPositionLeftRightOptions = [
  { label: "Scrotum", value: 1 },
  { label: "Inguinal Canal", value: 2 },
  { label: "Not Palpable", value: 3 }
];

export const testiclesSizeLeftRightOptions = [
  { label: "Normal", value: 1 },
  { label: "Mildly Reduced", value: 2 },
  { label: "Reduced", value: 3 },
  { label: "Very Reduced", value: 4 }
]

export const testiclesConsistencyLeftRightOptions = [
  { label: "Normal", value: 1 },
  { label: "Tenderd", value: 2 },
  { label: "Tough", value: 3 },
]

export const testiclesFeelingLeftRightOptions = [
  { label: "Normal", value: 1 },
  { label: "Increased", value: 2 }
]

export const testiclesVasDeferensLeftRightOptions = [
  { label: "Normal", value: 1 },
  { label: "Absent", value: 2 }
]

export const testiclesVericoceleLeftRightOptions = [
  { label: "No", value: 1 },
  { label: "G1", value: 2 },
  { label: "G2", value: 3 },
  { label: "G3", value: 4 },
]

export const epididymisConsistenceLeftRightOptions = [
  { label: "Normal", value: 1 },
  { label: "Induration", value: 2 }
]

export const epididymisDilatationLeftRightOptions = [
  { label: "Yes", value: 1 },
  { label: "No", value: 2 }
]

export const normalAbnomalOptions = [
  { label: "Normal", value: 1 },
  { label: "Abnormal", value: 2 }
]

export const pregnancyEndingOptions = [
  { label: "Ectopic", value: 1 },
  { label: "Biochemical", value: 2 },
  { label: "Early miscarriage(<12 weeks)", value: 3 },
  { label: "Late miscarriage(>12 weeks)", value: 4 },
  { label: "Birth preterm", value: 5 },
  { label: "Birth to term", value: 6 },
  { label: "Molar", value: 7 },
  { label: "Still Birth", value: 8 },
]

export const complementaryAnalyticBiochemistry = [
  { label: "Blood Glucose Fasting", bloodGlucoseFasting: 0, bloodGlucoseFastingDate: null },
  { label: "S-Urea", sUrea: 0, sUreaDate: null },
  { label: "S-Creatinine", sCreatinine: 0, sCreatinineDate: null },
  { label: "SGOT", sgot: 0, sgotDate: null },
  { label: "SGPT", sgpt: 0, sgptDate: null },
  { label: "ggt", ggt: 0, ggtDate: null },
  { label: "Alkaline Phosphatase", alkalinePhosphatase: 0, alkalinePhosphataseDate: null },
  { label: "Phosphorus", phosphorus: 0, phosphorusDate: null },
  { label: "Plasmatic Homocystine", plasmaticHomocystine: 0, plasmaticHomocystineDate: null },
  { label: "Total Protein Serum", totalProteinSerum: 0, totalProteinSerumDate: null },
  { label: "Vitamin D total", vitaminDTotal: 0, vitaminDTotalDate: null },
  { label: "PTOG 2h", ptoG2h: 0, ptoG2hDate: null },
  { label: "Blood Glucose Fasting GTT", bloodGlucoseFastingGTT: 0, bloodGlucoseFastingGTTDate: null },
  { label: "Blood Glucose 60 min GTT", bloodGlucose60minGTT: 0, bloodGlucose60minGTTDate: null },
  { label: "Blood Glucose 120 min GTT", bloodGlucose120MinGTT: 0, bloodGlucose120MinGTTDate: null },
];

export const booleanOptions = [
  { label: "Yes", value: 1 },
  { label: "No", value: 2 }
];

export const aboTypeOptions = [
  { label: "A", value: 1 },
  { label: "B", value: 2 },
  { label: "AB", value: 3 },
  { label: "O", value: 4 }
];

export const rhOptions = [
  { label: "Positive", value: 1 },
  { label: "Negative", value: 2 }
];

export const vaginismTypeOptions = {
  Anatomical: 1,
  Psychogenic: 2
}

export const cysticFibrosisOptions = [
  { label: "Positive", value: 1 },
  { label: "Negative", value: 2 },
  { label: "Not Done", value: 3 }
]

export const karyotypeOptions = [
  { label: "Normal", value: 1 },
  { label: "Abnormal", value: 2 },
  { label: "Not Done", value: 3 }
]

export const duchenneDystrophyOptions = [
  { label: "Positive", value: 1 },
  { label: "Negative", value: 2 },
  { label: "Not Done", value: 3 }
]

export const xFragileOptions = [
  { label: "Normal", value: 1 },
  { label: "Pathology", value: 2 },
  { label: "Not Done", value: 3 }
]

export const thrombophiliaOptions = [
  { label: "Normal", value: 1 },
  { label: "Abnormal", value: 2 },
  { label: "Not Done", value: 3 }
]

export const thalassemiaOptions = [
  { label: "Positive", value: 1 },
  { label: "Negative", value: 2 },
  { label: "Not Done", value: 3 }
]

export const hLACOptions = [
  { label: "C1/C1", value: 1 },
  { label: "C1/C2", value: 2 },
  { label: "C2/C2", value: 3 }
]

export const donorConditionOptions = [
  { label: "Positive", value: 1 },
  { label: "Negative", value: 2 },
  { label: "Not Done", value: 3 }
]

export const complimentaryAnalyticThrombophiliaOptions = [
  { label: "Yes", value: 1 },
  { label: "No", value: 2 },
  { label: "UnKnown", value: 3 }
]

export const testResultTypeOptions = [
  { label: "Positive", value: 1 },
  { label: "Negative", value: 2 },
  { label: "Intermediate", value: 3 }
]

export const positiveNegativeOptions = [
  { label: "Positive", value: 1 },
  { label: "Negative", value: 2 }
]

export const yesNoOptions = [
  { label: "Yes", value: 1 },
  { label: "No", value: 2 }
]

export const normalAbnormalOptions = [
  { label: "Normal", value: 1 },
  { label: "Abnormal", value: 2 },
]

export const vaginaPathologicalOptions = [
  { label: "Infection", value: 1 },
  { label: "Vaginal Septum", value: 2 }
]

export const fertilizationTypes = {
  IVF: 1,
  IUI: 2,
}

export const spermOriginType = {
  Ejaculation: 1,
  Testicle: 2,
}

export const spermOriginTypeOptions = [
  { label: "Ejaculation", value: 1 },
  { label: "Testicle", value: 2 }
]

export const cycleTypeOptions = [
  { label: "Stimulated", value: 1 },
  { label: "Natural", value: 2 },
  { label: "HRT", value: 3 },
]

export const pregnancyTypes = {
  Single: 1,
  Multiple: 2,
}

export const embryosDayOptions = [
  { label: "Two", value: 1 },
  { label: "Three", value: 2 },
  { label: "Blastos", value: 3 },
]

export const numberTransferredOptions = [
  { label: "One", value: 1 },
  { label: "Two", value: 2 },
  { label: "Three", value: 3 },
]

export const miscarriageTypes = {
  Spontaneous: 1,
  Induced: 2
}

export const miscarriageReasons =
{
  Genetic: 1,
  MaternalProposal: 2,
}

export const molarPregnancyTypes = {
  Partial: 1,
  Complete: 2,
}

export const ectopicStages = {
  Right: 1,
  Left: 2
}

export const weightUnitOptions = [
  { label: "KG", value: 1 },
  { label: "Pounds", value: 2 },
]

export const uterineTypeOptions = [
  { label: "Normal", value: 1 },
  { label: "Abnormal", value: 2 },
  { label: "Absent", value: 3 },
]

export const uterineTypes = {
  Normal: 1,
  Abnormal: 2,
  Absent: 3
}

export const uterineCavityTypeOptions = [
  { label: "Regular", value: 1 },
  { label: "Irregular", value: 2 }
]

export const adenomyosisTypeOptions = [
  { label: "Focal", value: 1 },
  { label: "Fuzzy", value: 2 }
]

export const adenomyosisTypes = {
  Focal: 1,
  Fuzzy: 2
}

export const cervixAngleOptions = [
  { label: "AnteFlexion", value: 1 },
  { label: "RetroFlexion", value: 2 },
  { label: "Indifferent", value: 3 }
]

export const endometrialInterlineOptions = [
  { label: "Linear", value: 1 },
  { label: "Non-Linear", value: 2 },
  { label: "Irregular", value: 3 },
  { label: "Not Defined", value: 4 }
]

export const endoMyometrialBorderOptions = [
  { label: "Visible normal", value: 1 },
  { label: "Visible ill-defined", value: 2 },
  { label: "Visible thickened", value: 3 },
  { label: "Not visible", value: 4 }
]

export const intraUterineDeviceOptions = [
  { label: "Yes", value: 1 },
  { label: "Normal Insertion", value: 2 },
  { label: "Yes Displaced", value: 3 },
  { label: "No", value: 4 }
]

export const azoospermiaOptions = [
  { label: "Hormonal Hyper", value: 1 },
  { label: "Hormonal Hypo", value: 2 },
  { label: "Obstructive", value: 3 },
  { label: "Non Obstructive", value: 4 }
]

export const azoospermiaTypes = {
  HormonalHyper: 1,
  HormonalHypo: 2,
  Obstructive: 3,
  NonObstructive: 4
}

export const yqdeletionTypes = {
  Normal: 1,
  Abnormal: 2,
  NotDone: 3
}

export const yqdeletionOptions = [
  { label: "Normal", value: 1 },
  { label: "Abnormal", value: 2 },
  { label: "Not Done", value: 3 }
]

export const karyotypeAbnormalOptions = [
  { label: "Klinefelter Syndrome", value: 1 },
  { label: "Translocation", value: 2 },
  { label: "Others", value: 3 }
]

export const azfABCDeletionOptions = [
  { label: "Complete", value: 1 },
  { label: "Partial", value: 2 }
]

export const testEndoTestTypes =
{
  Receptive: 1,
  NotResponsive: 2
}
export const complimentaryTestTypes = {
  Normal: 1,
  Pathological: 2
}

export const complimentaryTestDetailTypes = {
  BreastUltrasound: 1,
  Mammography: 2,
}

export const usgStatus = {
  Requested: 1,
  Cancelled: 2,
  Completed: 3,
  Verified: 4
}

export const usgStatusOptions = [
  { label: "Requested", value: 1 },
  { label: "Cancelled", value: 2 },
  { label: "Completed", value: 3 },
  { label: "Verified", value: 4 },
]

export const wauAvailablityOptions = [
  { label: "Present", value: 1 },
  { label: "Absent", value: 2 },
  { label: "NotVisible", value: 3 }
]

export const wauAvailablityTypes = {
  Present: 1,
  Absent: 2,
  NotVisible: 3
}

export const fallopianTubeStateOptions = [
  { label: "Not Visible", value: 1 },
  { label: "Pathological", value: 2 },
  { label: "Normal", value: 3 }
]

export const fallopianTubeStates = {
  NotVisible: 1,
  Pathological: 2,
  Normal: 3
}

export const ultrasoundAttachedItemTypes =
{
  RightOvary: 1,
  LeftOvary: 2,
  RightFallopianTube: 3,
  LeftFallopianTube: 4
}

export const rightLeftEnum = {
  Right: 1,
  Left: 2,
  NA: 3,
}


export const painRatingScaleOptions = [
  { label: "No Hurt", value: 1 },
  { label: "Hurts Little Bit", value: 2 },
  { label: "Hurts Little More", value: 3 },
  { label: "Hurts Even More", value: 4 },
  { label: "Hurts Whole Lot", value: 5 },
  { label: "Hurts Worst", value: 6 }
]


export const durationUnitOptions = [
  { label: "Day", value: 1 },
  { label: "Hours", value: 2 },
  { label: "Week", value: 3 },
  { label: "Month", value: 4 },
  { label: "Year", value: 5 }
]

export const diagnosisCategoryOptions = [

  { label: "Male Factor", value: 1 },
  { label: "Female Factor", value: 2 }
]

export const diagnosisStatusOptions = [

  { label: "Open", value: 1 },
  { label: "Closed", value: 2 }
]

export const diagnosisTypeOptions = [
  { label: "Primary", value: 1 },
  { label: "Secondary", value: 2 }
]

export const billOrderCompleteOptions = [
  { value: "1", label: "Bill on Order" },
  { value: "2", label: "Bill on Complete" },
];

export const packagesOptions = [
  { value: "1", label: "Donar Package" },
  { value: "2", label: "Patient Package" },
];

export const servicePackageColumn = [
  { label: "service", name: 'name' },
  { label: "qty", name: 'qty' },
  { label: "amount", name: 'amount' },
  { label: "action", name: 'action' },
];

export const ownerOptions = [
  { value: "1", label: "Patient" },
  { value: "2", label: "Partner" },
  { value: "3", label: "Both" },
];

export const documentUploadMockData = [
  {
    "id": 1,
    "filePath": "string",
    "documentName": "File Name 1",
    "keywords": "Test",
    "documentDate": "2021-12-24T10:01:38.838Z",
    "owner": 1,
    "observations": "Test 1",
    "patientId": 16,
    "clinicalDocumentTypeId": 1,
    "documentFile": "string"
  },
  {
    "id": 1,
    "filePath": "string",
    "documentName": "File Name 2",
    "keywords": "Test",
    "documentDate": "2021-12-24T10:01:38.838Z",
    "owner": 2,
    "observations": "Test 2",
    "patientId": 16,
    "clinicalDocumentTypeId": 1,
    "documentFile": "string"
  },
  {
    "id": 1,
    "filePath": "string",
    "documentName": "File Name 3",
    "keywords": "Test",
    "documentDate": "2021-12-24T10:01:38.838Z",
    "owner": 3,
    "observations": "Test 3",
    "patientId": 16,
    "clinicalDocumentTypeId": 2,
    "documentFile": "string"
  },
  {
    "id": 1,
    "filePath": "string",
    "documentName": "File Name 4",
    "keywords": "Test",
    "documentDate": "2021-12-24T10:01:38.838Z",
    "owner": 1,
    "observations": "Test 4",
    "patientId": 16,
    "clinicalDocumentTypeId": 2,
    "documentFile": "string"
  },
]

// export const calculationBehaviour = [
// 	{ value: "1", label: "Add" },
// 	{ value: "2", label: "Deduct" },
// ];

export const calculationBehaviour = [
  { label: 'Add', value: "1" },
  { label: 'Deduct', value: "2" },
];