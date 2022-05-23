import {
	Patient,
	Donor,
	PatientDataAcknowledgement,
} from 'pages';

export const registrationRouteList = [
	{
		exact: true,
		path: '/registration/patient',
		component: Patient,
	},
	{
		exact: true,
		path: '/registration/donor',
		component: Donor,
	},
	{
		exact: true,
		path: '/registration/patient-acknowledgement',
		component: PatientDataAcknowledgement,
	},
];