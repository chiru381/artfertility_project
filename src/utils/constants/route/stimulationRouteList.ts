
import Stimulation from 'pages/clinical/stimulation/Stimulation';
import StimulationCancelCycle from 'pages/clinical/stimulation/StimulationCancelCycle';
import StimulationERA from 'pages/clinical/stimulation/StimulationERA';
import StimulationValidation from 'pages/clinical/stimulation/StimulationValidation';

export const stimulationRouteList = [
  {
    exact: true,
    path: '/stimulation',
    component: Stimulation,
  },
  {
    exact: true,
    path: '/cancel-cycle',
    component: StimulationCancelCycle,
  },
  {
    exact: true,
    path: '/era',
    component: StimulationERA,
  },
  {
    exact: true,
    path: '/validation',
    component: StimulationValidation,
  },
];