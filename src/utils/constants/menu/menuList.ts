import { ReactComponent as LaboratoryIcon } from 'assets/images/icons/laboratory.svg';
import { ReactComponent as SecurityIcon } from 'assets/images/icons/security.svg';
import { ReactComponent as BillingIcon } from 'assets/images/icons/billing.svg';
import { ReactComponent as AppointmentIcon } from 'assets/images/icons/appointment-menu.svg';
import { ReactComponent as RegistrationIcon } from 'assets/images/icons/registration.svg';
import { ReactComponent as ADTIcon } from 'assets/images/icons/admission.svg';
import { ReactComponent as MasterIcon } from 'assets/images/icons/settings.svg';

import { masterSubMenu } from './masterSubMenu';

interface SubMenuState {
    label: string;
    to: string;
    icon?: any;
    subMenu?: SubMenuState[];
}

interface MenuState extends SubMenuState {
    subMenu?: SubMenuState[];
}

const registrationSubMenu: SubMenuState[] = [
    { label: "Patient", to: '/registration/patient' },
    { label: "Donor", to: '/registration/donor' },
    { label: "Patient Acknowledgement", to: '/registration/patient-acknowledgement' }
]

const appointmentSubMenu: SubMenuState[] = [
    { label: "Scheduling", to: '/appointment/scheduling' },
    { label: "Doctor Diary", to: '/appointment/doctor-diary' },
    { label: "OT Room Booking", to: '/appointment/ot-room' },
    { label: "Enquiry", to: '/appointment/enquiry' },
    { label: "Resource Slot Configuration", to: '/appointment/resource-slot-config' },
    { label: "Doctor Slot Block", to: '/appointment/doctor-slot-block' },
    { label: "OT Slot Configuration", to: '/appointment/ot-slot-config' },
    { label: "OT Slot Block", to: '/appointment/ot-slot-block' },
]

const billingSubMenu: SubMenuState[] = [
    { label: "Patient List", to: '/billing/patient' },
    { label: "All Bills", to: '/billing/bills' },
    { label: "Package Allocation", to: '/billing/package-allocation' },
    { label: "Refund List", to: '/billing/refund' },
    { label: "Billing Parameter", to: '/billing/billing-parameter' }
]

const adtSubMenu: SubMenuState[] = [
    { label: "Admission", to: '/adt/admission' },
    { label: "Bed Dashboard", to: '/adt/bed-dashboard' },
]

const securitySubMenu: SubMenuState[] = [
    { label: "User", to: '/security/user' },
    { label: "Clinical User Credentials Mapping", to: '/security/user-credentials-mapping' },
    { label: "Role/Permissions", to: '/security/role' }
]

const laboratoryInnerSubMenu: SubMenuState[] = [
    { label: "Sample Collection", to: '/lab/sample-collection' },
    { label: "Sample Dispatch", to: '/lab/sample-dispatch' },
]

const laboratorySubMenu: SubMenuState[] = [
    { label: "Phlebtomy", to: '', subMenu: laboratoryInnerSubMenu },
    { label: "Laboratory Worklist", to: '/lab/laboratory-worklist' }
]

export const menuList: MenuState[] = [
    { label: 'Registration', icon: RegistrationIcon, to: '', subMenu: registrationSubMenu },
    { label: 'Appointment', icon: AppointmentIcon, to: '', subMenu: appointmentSubMenu },
    { label: 'Billing', icon: BillingIcon, to: '', subMenu: billingSubMenu },
    { label: 'ADT', icon: ADTIcon, to: '', subMenu: adtSubMenu },
    { label: 'Security', icon: SecurityIcon, to: '', subMenu: securitySubMenu },
    { label: 'Laboratory', icon: LaboratoryIcon, to: '', subMenu: laboratorySubMenu },
    { label: 'Master', icon: MasterIcon, to: '', subMenu: masterSubMenu },
]
