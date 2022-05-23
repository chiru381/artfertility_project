import DiagnosisList from 'pages/clinical/diagnosis/DiagnosisList';
import DiagnosisPatient from 'pages/clinical/diagnosis/newDiagnosis/Patient';
import DiagnosisPartner from 'pages/clinical/diagnosis/newDiagnosis/Partner';
import AddNewDiagnosis from 'pages/clinical/diagnosis/AddDiagnosis'

export const diagnosisRouteList = [
  {
    exact: true,
    path: '/diagnosis-list',
    component: DiagnosisList,
  },
  {
    exact: true,
    path: '/new-diagnosis/patient',
    component: DiagnosisPatient,
  },
  {
    exact: true,
    path: '/new-diagnosis/partner',
    component: DiagnosisPartner,
  },
  {
    exact: true,
    path: '/all-new-diagnosis',
    component: AddNewDiagnosis,
  },


];