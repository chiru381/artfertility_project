import {
  Home,
} from 'pages';
import { masterRouteList } from "./masterRouteList";
import { registrationRouteList } from "./registrationRouteList";
import { adtRouteList } from "./adtRouteList";
import { appointmentRouteList } from "./appointmentRouteList";
import { securityRouteList } from './securityRouteList';
import { billingRouteList } from './billingRouteList';
import { laboratoryRouteList } from './laboratoryRouteList';
import { surgeryRouteList } from './surgeryRouteList';


export const routeList = [
  {
    exact: true,
    path: '/',
    component: Home,
  },
  ...registrationRouteList,
  ...adtRouteList,
  ...masterRouteList,
  ...appointmentRouteList,
  ...securityRouteList,
  ...billingRouteList,
  ...laboratoryRouteList,
  ...surgeryRouteList
];