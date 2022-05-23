
import SurgicalInvestigationsSummary from 'pages/clinical/surgery/Summary';
import PreOperativeCheckup from 'pages/clinical/surgery/PreOperativeCheckUp';
import PreOperativeCheckupForm from 'pages/clinical/surgery/PreOperativeCheckupForm';
import PreOperativeAssessment from 'pages/clinical/surgery/PreOperativeAssessment';
import SurgeryGeneral from 'pages/clinical/surgery/SurgeryGeneral';
import SurgeryOperativeNote from 'pages/clinical/surgery/OperativeNote';
import SurgeryDischargeSummery from 'pages/clinical/surgery/DischargeSummery';
import SurgeryDischargeInstruction from 'pages/clinical/surgery/DischargeInstruction';
import SurgeryAnesthesiaDetails from 'pages/clinical/surgery/AnesthesiaDetails';
import SpecialForms from 'pages/clinical/surgery/SpecialForms';
// check list page pending

export const surgeryRouteList = [
  {
    exact: true,
    path: '/surgical-investigations-summary',
    component: SurgicalInvestigationsSummary
  }, {
    exact: true,
    path: '/pre-operative-checkup/patient',
    component: PreOperativeCheckup
  }, {
    exact: true,
    path: '/pre-operative-checkup-list/partner',
    component: PreOperativeCheckup
  }, {
    exact: true,
    path: '/pre-operative-checkup/patient/create',
    component: PreOperativeCheckupForm
  }, {
    exact: true,
    path: '/pre-operative-checkup/partner/create',
    component: PreOperativeCheckupForm
  }, {
    exact: true,
    path: '/pre-operative-assessment',
    component: PreOperativeAssessment
  }, {
    exact: true,
    path: '/surgery-general',
    component: SurgeryGeneral
  }, {
    exact: true,
    path: '/surgery-operative-note',
    component: SurgeryOperativeNote
  }, {
    exact: true,
    path: '/surgery-discharge-summary',
    component: SurgeryDischargeSummery
  },{
    exact: true,
    path: '/surgery-discharge-instructions',
    component: SurgeryDischargeInstruction
  },{
    exact: true,
    path: '/surgery-anesthesia-detail',
    component: SurgeryAnesthesiaDetails
  },{
    exact: true,
    path: '/surgery-special-form',
    component: SpecialForms
  }
];