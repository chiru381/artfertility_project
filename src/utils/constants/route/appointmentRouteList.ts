import {
	AppointmentScheduling,
	OTRoomBooking,
	ResourceSlotConfig,
	DoctorSlotBlock,
	OTSlotConfiguration,
	OTSlotBlock,
	DoctorDiary,
	Enquiry
} from 'pages';

export const appointmentRouteList = [
	{
		exact: true,
		path: '/appointment/scheduling',
		component: AppointmentScheduling,
	},
	{
		exact: true,
		path: '/appointment/doctor-diary',
		component: DoctorDiary,
	},
	{
		exact: true,
		path: '/appointment/ot-room',
		component: OTRoomBooking,
	},
	{
		exact: true,
		path: '/appointment/enquiry',
		component: Enquiry,
	},
	{
		exact: true,
		path: '/appointment/resource-slot-config',
		component: ResourceSlotConfig,
	},
	{
		exact: true,
		path: '/appointment/doctor-slot-block',
		component: DoctorSlotBlock,
	},
	{
		exact: true,
		path: '/appointment/ot-slot-config',
		component: OTSlotConfiguration,
	},
	{
		exact: true,
		path: '/appointment/ot-slot-block',
		component: OTSlotBlock,
	}
];