import {
	DaycareAdmission,
	BedDashboard,
	AdmittedPatients
} from 'pages';

export const adtRouteList = [
	{
		exact: true,
		path: '/adt/patient/admission',
		component: DaycareAdmission,
	},
	{
		exact: true,
		path: '/adt/bed-dashboard',
		component: BedDashboard,
	},
	{
		exact: true,
		path: '/adt/admission',
		component: AdmittedPatients,
	}
];