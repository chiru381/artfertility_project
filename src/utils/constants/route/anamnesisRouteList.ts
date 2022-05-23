
import InfertilitySummary from 'pages/clinical/anamnesis/infertlitySummary';

import GeneralHistory from 'pages/clinical/anamnesis/clinicalHistory/GeneralHistory';
import MedicalHistory from 'pages/clinical/anamnesis/clinicalHistory/MedicalHistory';
import SurgicalHistory from 'pages/clinical/anamnesis/clinicalHistory/SurgicalHistory';
import ObstetricHistory from 'pages/clinical/anamnesis/clinicalHistory/obstetricHistory/ObstetricHistory';
import MedicationHistory from 'pages/clinical/anamnesis/clinicalHistory/MedicationHistory';
import FamilyHistory from 'pages/clinical/anamnesis/clinicalHistory/FamilyHistory';

import PreviousTreatment from 'pages/clinical/anamnesis/previousTreatment';

import ComplimentaryTest from 'pages/clinical/anamnesis/previousExamination/ComplimentaryTest';
import HormonalDetermination from 'pages/clinical/anamnesis/previousExamination/HormonalDetermination';
import GeneticTests from 'pages/clinical/anamnesis/previousExamination/GeneticTests';
import ComplimentaryAnalytics from 'pages/clinical/anamnesis/previousExamination/ComplimentaryAnalytics';

import FirstUltrasoundScan from 'pages/clinical/anamnesis/womanAssessment/FirstUltrasoundScan';
import GeneralGynaecologicalExamination from 'pages/clinical/anamnesis/womanAssessment/GeneralGynaecologicalExamination';

import CurrentExamination from 'pages/clinical/anamnesis/maleAssessment/CurrentExamination';
import PreviousExamination from 'pages/clinical/anamnesis/maleAssessment/PreviousExamination';

export const anamnesisRouteList = [
  {
    exact: true,
    path: '/clinical-history/infertility-summary',
    component: InfertilitySummary,
  },
  {
    exact: true,
    path: '/clinical-history/general',
    component: GeneralHistory,
  },
  {
    exact: true,
    path: '/clinical-history/medical',
    component: MedicalHistory,
  }, {
    exact: true,
    path: '/clinical-history/surgical',
    component: SurgicalHistory,
  }, {
    exact: true,
    path: '/clinical-history/obstetric',
    component: ObstetricHistory,
  }, {
    exact: true,
    path: '/clinical-history/medication',
    component: MedicationHistory,
  }, {
    exact: true,
    path: '/clinical-history/family',
    component: FamilyHistory,
  },
  {
    exact: true,
    path: '/clinical-history/previous-treatment',
    component: PreviousTreatment,
  },
  {
    exact: true,
    path: '/previous-examination/complimentary-tests',
    component: ComplimentaryTest,
  }, {
    exact: true,
    path: '/previous-examination/hormonal-determination',
    component: HormonalDetermination,
  }, {
    exact: true,
    path: '/previous-examination/genetic-tests',
    component: GeneticTests,
  }, {
    exact: true,
    path: '/previous-examination/complimentary-analytics',
    component: ComplimentaryAnalytics,
  }, {
    exact: true,
    path: '/woman-assessment/first-ultrasound-scan',
    component: FirstUltrasoundScan,
  }, {
    exact: true,
    path: '/woman-assessment/general-gynaecological-examination',
    component: GeneralGynaecologicalExamination,
  },
  {
    exact: true,
    path: '/male-assessment/previous-examination',
    component: PreviousExamination,
  },
  {
    exact: true,
    path: '/male-assessment/medical-history',
    component: MedicalHistory,
  },
  {
    exact: true,
    path: '/male-assessment/surgical-history',
    component: SurgicalHistory,
  },
  {
    exact: true,
    path: '/male-assessment/medication-history',
    component: MedicationHistory,
  },
  {
    exact: true,
    path: '/male-assessment/current-examination',
    component: CurrentExamination,
  }
];