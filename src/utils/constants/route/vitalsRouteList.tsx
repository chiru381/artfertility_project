
import {
  PatientNewVitals,
  PartnerNewVitals,
  GraphAndTrends,
  VitalsSummary
} from 'pages';

export const vitalsRouteList = [

  {
    exact: true,
    path: '/vitals/patient',
    component: PatientNewVitals,
  },
  {
    exact: false,
    path: '/vitals/partner',
    component: PartnerNewVitals,
  }, {
    exact: true,
    path: '/vitals/graph-and-trends',
    component: GraphAndTrends,
  }
];