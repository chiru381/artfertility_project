interface SubMenuState {
  label: string;
  to: string;
  icon?: any;
  subMenu?: SubMenuState[];
}

interface MenuState extends SubMenuState {
  subMenu?: SubMenuState[];
}

const billingMasterSubMenu: SubMenuState[] = [
  { label: "Bank", to: '/master/bank' },
  { label: "Department", to: '/master/department' },
  { label: "Package", to: '/master/package' },
  { label: "Service", to: '/master/service' },
  { label: "Tariff", to: '/master/tariff' },
  { label: "Tariff Item", to: '/master/tariffItem' },
  { label: "Discount Authority Matrix", to: '/master/discount-authority-matrix' },
  { label: "Payment Mode", to: '/master/paymentmode' },
  { label: "Payment Type", to: '/master/paymenttype' },
  { label: "Sponsor", to: '/master/sponsor' },
  { label: "Discount Type", to: '/master/discount-type' },
  { label: "Doctor Fee", to: '/master/doctor-fee' },
  { label: "Facilitator", to: '/master/facilitator' },
  { label: "Merchant", to: '/master/merchant' },
  { label: "Refund Deposit Logic", to: '/master/refund-deposit-logic' },
  { label: "Stage", to: '/master/stage' },
  { label: "Service Category", to: '/master/service-category' },
  { label: "Discount Reason", to: '/master/discount-reason' },
  { label: "Refund Reason", to: '/master/refund-reason' },
  { label: "Currency", to: '/master/currency' },
  { label: "Encounter Type Code", to: '/master/encounter-type-code' },
  { label: "Encounter Start Type", to: '/master/encounter-start-type' },
  { label: "Encounter End Type", to: '/master/encounter-end-type' }
]

const adtMasterSubMenu: SubMenuState[] = [
  { label: "Bed", to: '/master/bed' },
  { label: "Bed Status", to: '/master/bed-status' },
  { label: "Station", to: '/master/station' }
]

const registrationMasterSubMenu: SubMenuState[] = [
  { label: "Country", to: '/master/country' },
  { label: "Province", to: '/master/province' },
  { label: "City", to: '/master/city' },
  { label: "Gender", to: '/master/gender' },
  { label: "Language", to: '/master/language' },
  { label: "Locality", to: '/master/locality' },
  { label: "ZipCode", to: '/master/zipcode' },
  { label: "Marital Status", to: '/master/marital-status' },
  { label: "Nationality", to: '/master/nationality' },
  { label: "Occupation", to: '/master/occupation' },
  { label: "Contact Type", to: '/master/contact-type' },
  { label: "Title", to: '/master/title' },
  { label: "Referring Doctor", to: '/master/referring-doctor' },
  { label: "Visa Status", to: '/master/visastatus' },
  { label: "Dress Code", to: '/master/dress-code' },
  { label: "Religion", to: '/master/religion' },
  { label: "Skin Color", to: '/master/skincolor' },
]

const appointmentMasterSubMenu: SubMenuState[] = [
  { label: "Appointment Type", to: '/master/appointment-type' },
  { label: "Reschedule Reason", to: '/master/reschedule-reason' },
  { label: "Resource", to: '/master/resource' },
  { label: "Lead Source", to: '/master/lead-source' },
]

const mmsMasterSubMenu: SubMenuState[] = [
]

const laboratoryMasterSubMenu: SubMenuState[] = [
  { label: "Test Component", to: '/master/test-component' },
  { label: "Result Value", to: '/master/result-value' },
  { label: "Equipment", to: '/master/equipment' },
  { label: "Sample", to: '/master/sample' },
  { label: "Sample Container", to: '/master/sample-container' },
  { label: "Measurement Unit", to: '/master/measurement-unit' },
  { label: "Profile", to: '/master/profile' },
  { label: "Sample Status", to: '/master/sample-status' },
  { label: "Result Template", to: '/master/result-template' },
  { label: "Lab Test", to: '/master/lab-test' },
]

const securityMasterSubMenu: SubMenuState[] = [
  { label: "Department", to: '/master/department' },
  { label: "Designation", to: '/master/designation' },
  { label: "Clinic", to: '/master/clinic' },
  { label: "Qualification", to: '/master/qualification' },
]

export const masterSubMenu: MenuState[] = [
  { label: 'Registration', to: '', subMenu: registrationMasterSubMenu },
  { label: 'Appointment', to: '', subMenu: appointmentMasterSubMenu },
  { label: 'ADT', to: '', subMenu: adtMasterSubMenu },
  { label: 'Billing', to: '', subMenu: billingMasterSubMenu },
  { label: 'Laboratory', to: '', subMenu: laboratoryMasterSubMenu },
  { label: 'Security', to: '', subMenu: securityMasterSubMenu },
  // { label: 'MMS Master', to: '', subMenu: mmsMasterSubMenu },

  { label: "Document Type", to: '/master/document-type' },
  { label: "Employee Type", to: '/master/employee-type' },
  { label: "Employee Category", to: '/master/employee-category' },
  { label: "VIP Reason", to: '/master/vipreason' },
  { label: "Block Type", to: '/master/block-type' },
  { label: "Block Reason", to: '/master/block-reason' },
  { label: "Cancel Reason", to: '/master/cancel-reason' },
  { label: "Clinical Complication Type", to: '/master/clinical-complication-type' },
  { label: "Surgery Type", to: '/master/surgerytype' },
  { label: "Surgery", to: '/master/surgery' },
  { label: "Denial", to: '/master/denial' },
  { label: "Diagnostic Code", to: '/master/diagnostic-code' },
  { label: "Visit", to: '/master/visit' },
  { label: "Service Category Type", to: '/master/service-category-type' },
  { label: "Clinical Document Type", to: '/master/clinical-document-type' },
  { label: "Item Charge", to: '/master/item-charge' },
]