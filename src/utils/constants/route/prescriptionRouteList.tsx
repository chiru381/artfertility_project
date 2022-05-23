
import PrescriptionSummary from 'pages/clinical/prescription/Summary';
import PrescriptionAllMedicationView from 'pages/clinical/prescription/AllMedicationView';
import PrescriptionPatient from 'pages/clinical/prescription/newPrescription/Patient';
import PrescriptionPartner from 'pages/clinical/prescription/newPrescription/Partner';

export const prescriptionRouteList = [
  {
    exact: true,
    path: '/summary',
    component: PrescriptionSummary,
  },
  {
    exact: true,
    path: '/new-prescription/patient',
    component: PrescriptionPatient,
  },

  {
    exact: true,
    path: '/new-prescription/partner',
    component: PrescriptionPartner,
  },

  {
    exact: true,
    path: '/all-medication-view',
    component: PrescriptionAllMedicationView,
  },

];