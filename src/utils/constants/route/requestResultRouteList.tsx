
import General from 'pages/clinical/requestAndResult/ultrasoundScan/General';
import UltrasoundSummary from 'pages/clinical/requestAndResult/ultrasoundScan';

import RequestAndResultSummary from 'pages/clinical/requestAndResult/Summary';
import BloodLabRequest from 'pages/clinical/requestAndResult/bloodLab/Request';
import BloodLabNewRequest from 'pages/clinical/requestAndResult/bloodLab/NewRequest';
import BloodLabInvestigation from 'pages/clinical/requestAndResult/bloodLab/Investigation';
import BloodLabSerology from 'pages/clinical/requestAndResult/bloodLab/Serology';
import BloodLabFind from 'pages/clinical/requestAndResult/bloodLab/Find';

export const requestResultRouteList = [
  {
    exact: true,
    path: '/summary',
    component: RequestAndResultSummary,
  }, {
    exact: true,
    path: '/ultrasound-scan',
    component: UltrasoundSummary,
  }, {
    exact: true,
    path: '/ultrasound-scan-general',
    component: General,
  }, {
    exact: true,
    path: '/blood-lab/request',
    component: BloodLabRequest,
  }, {
    exact: true,
    path: '/blood-lab/new-request',
    component: BloodLabNewRequest,
  }, {
    exact: true,
    path: '/blood-lab/investigation/patient',
    component: BloodLabInvestigation,
  }, {
    exact: true,
    path: '/blood-lab/investigation/partner',
    component: BloodLabInvestigation,
  }, {
    exact: true,
    path: '/blood-lab/serology/patient',
    component: BloodLabSerology,
  }, {
    exact: true,
    path: '/blood-lab/serology/partner',
    component: BloodLabSerology,
  }, {
    exact: true,
    path: '/blood-lab/find',
    component: BloodLabFind,
  }
];