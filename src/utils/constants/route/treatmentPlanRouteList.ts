
import CreateTreatment from 'pages/clinical/treatmentPlan/CreateTreatment';
import EvaluationCycle from 'pages/clinical/treatmentPlan/EvaluationCycle';
import IntraUterineInsemination from 'pages/clinical/treatmentPlan/IntraUterineInsemination';
import InVitroFertilization from 'pages/clinical/treatmentPlan/InVitroFertilization';
import OocyteVitrification from 'pages/clinical/treatmentPlan/OocyteVitrification';
import PlannedCoitus from 'pages/clinical/treatmentPlan/PlannedCoitus';
import ThawEmbryoTransfer from 'pages/clinical/treatmentPlan/ThawEmbryoTransfer';
import TreatmentPlanSummary from 'pages/clinical/treatmentPlan/TreatmentPlanSummary';

export const treatmentPlanRouteList = [
  {
    exact: true,
    path: '/summary',
    component: TreatmentPlanSummary,
  },
  {
    exact: true,
    path: '/planned-coitus',
    component: PlannedCoitus,
  },
  {
    exact: true,
    path: '/intra-uterine-insemination',
    component: IntraUterineInsemination,
  },
  {
    exact: true,
    path: '/oocyte-vitrification',
    component: OocyteVitrification,
  },
  {
    exact: true,
    path: '/in-vitro-fertilization',
    component: InVitroFertilization,
  },
  {
    exact: true,
    path: '/thaw-embryo-transfer',
    component: ThawEmbryoTransfer,
  },
  {
    exact: true,
    path: '/evaluation-cycle',
    component: EvaluationCycle,
  },
  {
    exact: true,
    path: '/create-treatment',
    component: CreateTreatment,
  }
];