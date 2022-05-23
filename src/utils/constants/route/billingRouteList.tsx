import {
	OPBillsList,
	PackageAllocation,
	BillRefund,
	BillingPatient,
	BillingParameters
} from 'pages';

export const billingRouteList = [
	{
		exact: true,
		path: '/billing/patient',
		component: BillingPatient,
	},
	{
		exact: true,
		path: '/billing/bills',
		component: OPBillsList,
	},
	{
		exact: true,
		path: '/billing/package-allocation',
		component: PackageAllocation,
	},
	{
		exact: true,
		path: '/billing/refund',
		component: BillRefund,
	},
	{
		exact: true,
		path: '/billing/billing-parameter',
		component: BillingParameters,
	}
];