import dayjs from 'dayjs';
import { BooleanIcon } from 'components';
import { GridCellExpand } from 'components/table/GridCellExpand';
import { acceptRejectOptions, blockTypeList, calculationBehaviour } from 'utils/constants';
import { filterTypes, genderList, resultTypeOptions, testSourceOptions } from './default';
import { SelectOptionsState } from 'utils/types';

import Chip from '@material-ui/core/Chip';
import Clear from '@material-ui/icons/Clear';
import Check from '@material-ui/icons/Check';
import Autorenew from '@material-ui/icons/Autorenew';



const dateOptions = {
	hideGlobalSearchFilter: true,
	options: {
		customBodyRender: (value: string) => {
			return <span>{value ? dayjs(value).format("DD-MM-YYYY") : ""}</span>;
		},
	},
	type: filterTypes.date,
};

const timeOptions = {
	options: {
		customBodyRender: (value: string) => {
			return (
				<span>{value ? dayjs(value, "hh:mm:ss").format("hh:mm A") : ""}</span>
			);
		},
	},
	hideGlobalSearchFilter: true,
	disableFilter: true,
};

const genderOptions = {
	name: "genderName",
	primaryColumnName: "Gender.Name",
	hideGlobalSearchFilter: true,
	type: filterTypes.select,
	selectOptions: [
		{ label: "Female", value: "female" },
		{ label: "Male", value: "male" },
	],
};

const genderApplicabilityOptions = {
	hideGlobalSearchFilter: true,
	type: filterTypes.select,
	selectOptions: genderList,
	options: {
		customBodyRender: (value: string) => {
			const object = genderList.find(
				(item: any) => item.value == value
			);
			return <span>{object?.label}</span>;
		},
	},
};

const BooleanIconOption = {
	options: {
		customBodyRender: (value: boolean) => <BooleanIcon value={value} />,
	},
	hideGlobalSearchFilter: true,
	type: filterTypes.boolean,
	selectOptions: [
		{ label: "Yes", value: "true" },
		{ label: "No", value: "false" },
	],
};

const CustomDropDownOptions = (options: SelectOptionsState[]) => ({
	options: {
		customBodyRender: (value: boolean) =>
			options.find((item) => String(item.value) === String(value))?.label,
	},
	hideGlobalSearchFilter: true,
	type: filterTypes.boolean,
	selectOptions: options,
});

const numberOptions = {
	type: filterTypes.number,
	hideGlobalSearchFilter: true
}

const RefundStatus = {
	options: {
		customBodyRender: (value: number) => {
			let chipColor = value === 1 ? "orange" : value === 2 ? "#008000" : "#FF0000";
			let icon = (value === 1 ? <Autorenew htmlColor={chipColor} /> : value === 2 ? <Check htmlColor={chipColor} /> : <Clear htmlColor={chipColor} />);

			return (
				<Chip
					size="small"
					variant="outlined"
					style={{ color: chipColor, borderColor: chipColor }}
					icon={icon}
					label={acceptRejectOptions.find((item: any) => String(item.value) === String(value))?.label}
				/>
			)
		}
	},
	hideGlobalSearchFilter: true,
	type: filterTypes.boolean,
	selectOptions: acceptRejectOptions
};

const cellExpandOption = (width: number = 130) => ({
	options: {
		customBodyRender: (value: string) => {
			return <GridCellExpand value={value} width={width} />;
		},
	},
});

const booleanOptions = {
	type: filterTypes.boolean,
	hideGlobalSearchFilter: true,
	selectOptions: [
		{ label: "Yes", value: "true" },
		{ label: "No", value: "false" },
	],
};

export const clinicColumns = (formatMessage: any) => {
	return [
		{
			name: "name",
			label: formatMessage({ id: "clinic-name" }),
			type: filterTypes.text,
		},
		{
			name: "address",
			label: formatMessage({ id: "address" }),
			type: filterTypes.text,
		},
		{
			name: "header",
			label: formatMessage({ id: "header" }),
			type: filterTypes.text,
		},
		{
			name: "footer",
			label: formatMessage({ id: "footer" }),
			type: filterTypes.text,
		},
		{
			name: "taxIdentificationNumber",
			label: formatMessage({ id: "tax-id-no" }),
			type: filterTypes.text,
		},
		{
			name: "chnPrefix",
			label: formatMessage({ id: "chn-prefix" }),
			type: filterTypes.text,
		},
		{
			name: "telephone",
			label: formatMessage({ id: "telephone" }),
			type: filterTypes.text,
		},
		{
			name: "email",
			label: formatMessage({ id: "email" }),
			type: filterTypes.text,
		},
	];
};

export const patientColumns = (formatMessage: any) => {
	return [
		{
			name: "fullNameWithTitle",
			label: formatMessage({ id: "patient-name" }),
			primaryColumnName: "fullName",
		},
		{
			name: "partnerfullName",
			label: formatMessage({ id: "partner-name" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "partnerfullName",
		},
		{ name: "uhid", label: formatMessage({ id: "patient-uhid" }) },
		{
			name: "partnerPatientUHID",
			label: formatMessage({ id: "partner-uhid" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "partner.Patient.UHID",
		},
		{ name: "telephone", label: formatMessage({ id: "phone-number" }) },
		{
			name: "address",
			label: formatMessage({ id: "address" }),
			...cellExpandOption(),
		},
		{ name: "zipCode", label: formatMessage({ id: "zip-code" }) },
		{
			name: "cityProvinceCountryName",
			label: formatMessage({ id: "country" }),
			primaryColumnName: "city.Province.Country.Name",
		},
		{
			name: "doctorUserDisplayName",
			label: formatMessage({ id: "registration-doctor" }),
			primaryColumnName: "Doctor.User.DisplayName",
		},
		{
			name: "birthDate",
			label: formatMessage({ id: "birth-date" }),
			...dateOptions,
		},
		{ ...genderOptions, label: formatMessage({ id: "gender" }) },
	];
};

export const donorColumns = (formatMessage: any) => {
	return [
		{ name: "uhid", label: formatMessage({ id: "donor-id" }) },
		{
			name: "donorName",
			label: formatMessage({ id: "donor-name" }),
			extendedColumns: [
				{ label: "First Name", name: "firstName" },
				{ label: "Last Name", name: "lastName" },
			],
			primaryColumnName: "firstName",
		},
		{ name: "address", label: formatMessage({ id: "address" }) },
		{
			name: "cityName",
			label: formatMessage({ id: "city" }),
			primaryColumnName: "City.Name",
		},
		{ name: "zipCode", label: formatMessage({ id: "zip-code" }) },
		{
			name: "cityProvinceCountryName",
			label: formatMessage({ id: "country" }),
			primaryColumnName: "city.Province.Country.Name",
		},
		{
			name: "doctorUserDisplayName",
			label: formatMessage({ id: "associated-doctor" }),
			primaryColumnName: "Doctor.User.DisplayName",
		},
		{
			name: "birthDate",
			label: formatMessage({ id: "birth-date" }),
			...dateOptions,
		},
		{ ...genderOptions, label: formatMessage({ id: "gender" }) },
	];
};

export const patientDataAcknowledgementColumn = (formatMessage: any) => {
	return [
		{ name: "clinicName", label: formatMessage({ id: "clinic" }) },
		{ name: "uhid", label: formatMessage({ id: "patient-uhid" }) },
		{ name: "uhid", label: formatMessage({ id: "patient-name" }) },
		{ name: "uhid", label: formatMessage({ id: "partner-uhid" }) },
		{ name: "uhid", label: formatMessage({ id: "partner-name" }) },
		{ name: "uhid", label: formatMessage({ id: "patient-mobile-no" }) },
		{ name: "uhid", label: formatMessage({ id: "requested-by" }) },
		{ name: "uhid", label: formatMessage({ id: "transfer-reason" }) },
	];
};

export const billsColumn = (formatMessage: any) => {
	return [
		{ name: 'invoiceNumber', label: formatMessage({ id: "bill-no" }) },
		{
			name: 'createdDateTime',
			label: formatMessage({ id: "bill-date" }),
			...dateOptions
		},
		{ name: 'billAmount', label: formatMessage({ id: "bill-amount" }), type: filterTypes.number, hideGlobalSearchFilter: true },
		{ name: 'discountAmount', label: formatMessage({ id: "discount-amount" }), type: filterTypes.number, hideGlobalSearchFilter: true },
		{ name: 'visitNumber', label: formatMessage({ id: "visit-no" }) },
		{ ...dateOptions, name: 'visitDateTime', label: formatMessage({ id: "visit-date" }) },
		{ name: 'patientName', label: formatMessage({ id: "patient-name" }) },
		{ name: 'uhid', label: formatMessage({ id: "patient-uhid" }) },
		{ name: 'partnerName', label: formatMessage({ id: "partner-name" }), },
		{ name: 'partnerUHID', label: formatMessage({ id: "partner-uhid" }), hideGlobalSearchFilter: true, primaryColumnName: "partner.uhid" },
		{ name: 'chnId', label: formatMessage({ id: "chn" }) },
		{ name: 'telephone', label: formatMessage({ id: "phone-number" }) },
		{ name: 'payerInsuranceCompanyName', label: formatMessage({ id: "payer" }), primaryColumnName: 'payerInsuranceCompany.Name' },
		{ name: 'registeringDoctor', label: formatMessage({ id: "registration-doctor" }) },
		{ name: 'patientAddress', label: formatMessage({ id: "address" }), primaryColumnName: "patient.Address" },
		{
			name: 'patientBirthDate',
			label: formatMessage({ id: "birth-date" }),
			...dateOptions,
			primaryColumnName: "patient.BirthDate"
		},
		{
			...genderOptions,
			label: formatMessage({ id: "gender" }),
			primaryColumnName: "genderName"
		}
	]
}

export const packageAllocationColumn = (formatMessage: any) => {
	return [
		{
			name: "patientUHID",
			label: formatMessage({ id: "patient-uhid" }),
			primaryColumnName: "patient.UHID",
		},
		{
			name: "patientFullName",
			label: formatMessage({ id: "patient-name" }),
			primaryColumnName: "patient.FullName",
		},
		{
			name: "coupleCHNId",
			label: formatMessage({ id: "chn" }),
			primaryColumnName: "couple.CHNId",
		},
		{
			name: "coupleHusbandPatientFullName",
			label: formatMessage({ id: "partner-name" }),
			primaryColumnName: "couple.HusbandPatient.FullName",
		},
		{
			name: "packageName",
			label: formatMessage({ id: "package-name" }),
			primaryColumnName: "package.Name",
			...cellExpandOption(),
		},
		{
			name: "isPackageSettled",
			label: formatMessage({ id: "package-settled" }),
			...BooleanIconOption,
		},
		{
			name: "isPackageCancel",
			label: formatMessage({ id: "package-cancelled" }),
			...BooleanIconOption,
		},
		// { name: 'isActive', label: formatMessage({ id: "package-status" }) },
		{
			name: "facilitatorName",
			label: formatMessage({ id: "facilitator" }),
			primaryColumnName: "facilitator.Name",
		},
		{
			name: "merchantName",
			label: formatMessage({ id: "merchant" }),
			primaryColumnName: "merchant.Name",
		},
		{
			name: "treatingDoctorUserDisplayName",
			label: formatMessage({ id: "associated-doctor" }),
			primaryColumnName: "treatingDoctor.User.DisplayName",
		},
		// { name: 'mobile', label: formatMessage({ id: "phone-number" }) },
		{
			name: "patientAddress",
			label: formatMessage({ id: "address" }),
			primaryColumnName: "patient.Address",
		},
		{
			...dateOptions,
			name: "patientBirthDate",
			label: formatMessage({ id: "birth-date" }),
			primaryColumnName: "patient.BirthDate",
		},
		{
			...genderOptions,
			name: "genderName",
			label: formatMessage({ id: "gender" }),
		},
	];
};

export const refundListColumn = (formatMessage: any) => {
	return [
		{ ...dateOptions, name: 'createdDateTime', label: formatMessage({ id: "refund-date" }) },
		{ name: 'refundReceiptNumber', label: formatMessage({ id: "refund" }) + " #" },
		{ name: 'refundAmount', label: formatMessage({ id: "refund-amount" }), ...numberOptions },
		{ name: 'refundStatus', label: formatMessage({ id: "refund-status" }), ...RefundStatus },
		{ name: 'patientUHID', label: formatMessage({ id: "patient-uhid" }), primaryColumnName: 'patient.uhid' },
		{ name: 'patientFullName', label: formatMessage({ id: "patient-name" }), primaryColumnName: 'patient.fullname' },
		{ name: 'partnerName', label: formatMessage({ id: "partner-name" }), hideGlobalSearchFilter: true },
		{ name: 'partnerUHID', label: formatMessage({ id: "partner-uhid" }), hideGlobalSearchFilter: true },
		{ name: 'patientDoctorUserDisplayName', label: formatMessage({ id: "registration-doctor" }), primaryColumnName: 'patient.doctor.user.displayname' },
		{ name: 'patientTelephone', label: formatMessage({ id: "phone-number" }), primaryColumnName: 'patient.Telephone' },
		{ name: 'patientAddress', label: formatMessage({ id: "address" }), primaryColumnName: 'patient.address' },
		{ ...dateOptions, name: 'patientBirthDate', label: formatMessage({ id: "birth-date" }), primaryColumnName: 'patient.BirthDate' },
		{ ...genderOptions, name: 'patientGenderName', label: formatMessage({ id: "gender" }), primaryColumnName: 'patient.Gender.Name' }
	]
}

export const OPBillingRefundListColumn = (formatMessage: any) => {
	return [
		// { ...dateOptions, name: 'createdDateTime', label: formatMessage({ id: "refund-date" }) },
		{
			name: "outPatientBillRefundReceiptNumber",
			label: formatMessage({ id: "refund" }) + " #",
		},
		{
			name: "refundAmount",
			label: formatMessage({ id: "refund-amount" }),
			type: filterTypes.number,
		},
		{
			name: "outPatientBillingUHID",
			label: formatMessage({ id: "patient-uhid" }),
		},
		{
			name: "outPatientBillingPatientName",
			label: formatMessage({ id: "patient-name" }),
		},
		// { name: 'chnId', label: formatMessage({ id: "chn" }) },
		// { name: 'partnerName', label: formatMessage({ id: "partner-name" }) },
		// { name: 'partnerUHID', label: formatMessage({ id: "partner-uhid" }) },
		// { name: 'refundType', label: formatMessage({ id: "refund-type" }) },
		{
			name: "outPatientBillingRegisteringDoctor",
			label: formatMessage({ id: "associated-doctor" }),
		},
		{
			name: "outPatientBillingTelephone",
			label: formatMessage({ id: "phone-number" }),
		},
		// { name: 'patientAddress', label: formatMessage({ id: "address" }) },
		{
			...dateOptions,
			name: "outPatientBillingBirthDate",
			label: formatMessage({ id: "birth-date" }),
		},
		{
			...genderOptions,
			name: "outPatientBillingGenderName",
			label: formatMessage({ id: "gender" }),
		},
	];
};

export const resourceColumns = (formatMessage: any) => {
	return [
		{ name: "name", label: formatMessage({ id: "resource" }) },
		{ name: "colorCode", label: formatMessage({ id: "color-code" }) },
		{
			name: "isVisibleInAppointment",
			label: formatMessage({ id: "visible-in-appointment" }),
			...BooleanIconOption,
		},
	];
};

export const enquiryColumns = (formatMessage: any) => {
	return [
		{
			name: "appointmentNumber",
			label: "#" + formatMessage({ id: "enquiry" }),
		},
		{
			name: "patientFullName",
			label: formatMessage({ id: "full-name" }),
			hideGlobalSearchFilter: true,
		},
		{ name: "email", label: formatMessage({ id: "email" }) },
		{ name: "telephone", label: formatMessage({ id: "telephone" }) },
		{
			...dateOptions,
			name: "birthDate",
			label: formatMessage({ id: "birth-date" }),
		},
		{
			name: "genderName",
			label: formatMessage({ id: "gender" }),
			primaryColumnName: "gender.Name",
		},
		{
			name: "leadSource1Name",
			label: formatMessage({ id: "lead-source-1" }),
			primaryColumnName: "leadSource1.Name",
		},
		{
			name: "leadSource2Name",
			label: formatMessage({ id: "lead-source-2" }),
			primaryColumnName: "leadSource2.Name",
		},
		{
			name: "leadSource3Name",
			label: formatMessage({ id: "lead-source-3" }),
			primaryColumnName: "leadSource3.Name",
		},
		{
			name: "paymentTypeName",
			label: formatMessage({ id: "client-type" }),
			primaryColumnName: "paymentType.Name",
		},
		{
			name: "resourceName",
			label: formatMessage({ id: "resource" }),
			primaryColumnName: "resource.Name",
		},
	];
};

export const appointmentColumns = (formatMessage: any) => {
	return [
		{
			name: "appointmentNumber",
			label: "#" + formatMessage({ id: "appointment" }),
		},
		{
			...dateOptions,
			name: "appointmentDateTime",
			label: formatMessage({ id: "appointment-date" }),
		},
		{
			name: "estimatedAppointmentFromTime",
			label: formatMessage({ id: "from-time" }),
			...timeOptions,
			disableSort: true,
		},
		{
			name: "estimatedAppointmentToTime",
			label: formatMessage({ id: "to-time" }),
			...timeOptions,
			disableSort: true,
		},
		{
			name: "patientUHID",
			label: formatMessage({ id: "uhid" }),
			primaryColumnName: "patient.UHID",
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "patientFullName",
			label: formatMessage({ id: "full-name" }),
			primaryColumnName: "patient.fullName",
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "email",
			label: formatMessage({ id: "email" }),
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "telephone",
			label: formatMessage({ id: "telephone" }),
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			...dateOptions,
			name: "birthDate",
			label: formatMessage({ id: "birth-date" }),
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "genderName",
			label: formatMessage({ id: "gender" }),
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "leadSource1Name",
			label: formatMessage({ id: "lead-source-1" }),
			primaryColumnName: "leadSource1.Name",
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "leadSource2Name",
			label: formatMessage({ id: "lead-source-2" }),
			primaryColumnName: "leadSource2.Name",
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "leadSource3Name",
			label: formatMessage({ id: "lead-source-3" }),
			primaryColumnName: "leadSource3.Name",
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "paymentTypeName",
			label: formatMessage({ id: "client-type" }),
			primaryColumnName: "paymentType.Name",
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "visitTypeName",
			label: formatMessage({ id: "visit-type" }),
			primaryColumnName: "visitType.Name",
			disableFilter: true,
			disableSort: true,
			hideGlobalSearchFilter: true,
		},
		{
			name: "medicalStaffUserDisplayName",
			label: formatMessage({ id: "doctor" }),
			primaryColumnName: "medicalStaff.User.DisplayName",
		},
		{
			name: "resourceName",
			label: formatMessage({ id: "resource" }),
			primaryColumnName: "resource.Name",
		},
	];
};

export const countryColumns = (formatMessage: any) => {
	return [{ name: "name", label: formatMessage({ id: "country-name" }) }];
};

export const doctorSlotBlockColumn = (formatMessage: any) => {
	return [
		// { name: 'clinicName', label: formatMessage({ id: "clinic" }), primaryColumnName: 'Clinic.Name' },
		{
			name: "medicalStaffUserDisplayName",
			label: formatMessage({ id: "doctor" }),
			primaryColumnName: "medicalStaff.User.DisplayName",
		},
		{
			name: "blockTypeId",
			label: formatMessage({ id: "block-type" }),
			options: {
				customBodyRender: (value: string) => {
					return (
						<span>
							{blockTypeList.find((type) => +type.value === +value)?.label}
						</span>
					);
				},
			},
			hideGlobalSearchFilter: true,
			type: filterTypes.select,
			selectOptions: blockTypeList,
		},
		{
			name: "fromDate",
			label: formatMessage({ id: "from-date" }),
			...dateOptions,
		},
		{
			name: "toDate",
			label: formatMessage({ id: "to-date" }),
			...dateOptions,
		},
		{
			name: "fromTime",
			label: formatMessage({ id: "from-time" }),
			...timeOptions,
		},
		{ name: "toTime", label: formatMessage({ id: "to-time" }), ...timeOptions },
		// { name: 'blockReasonName', label: formatMessage({ id: "reason" }), primaryColumnName: 'BlockReason.Name' },
	];
};

export const otSlotBlockColumn = (formatMessage: any) => {
	return [
		// { name: 'clinicName', label: formatMessage({ id: "clinic" }), primaryColumnName: 'Clinic.Name' },
		{
			name: "operatingTheatreName",
			label: formatMessage({ id: "operation-theatre" }),
			primaryColumnName: "OperatingTheatre.Name",
		},
		{
			name: "blockTypeId",
			label: formatMessage({ id: "block-type" }),
			options: {
				customBodyRender: (value: string) => {
					return (
						<span>
							{blockTypeList.find((type) => +type.value === +value)?.label}
						</span>
					);
				},
			},
			hideGlobalSearchFilter: true,
			type: filterTypes.select,
			selectOptions: blockTypeList,
		},
		{
			name: "fromDate",
			label: formatMessage({ id: "from-date" }),
			...dateOptions,
		},
		{ name: "toDate", label: formatMessage({ id: "to-date" }), ...dateOptions },
		{
			name: "fromTime",
			label: formatMessage({ id: "from-time" }),
			...timeOptions,
		},
		{ name: "toTime", label: formatMessage({ id: "to-time" }), ...timeOptions },
		// { name: 'blockReasonName', label: formatMessage({ id: "reason" }), primaryColumnName: 'BlockReason.Name' },
	];
};

export const medicalstaffColumns = (formatMessage: any) => {
	return [
		{
			name: "designationName",
			label: formatMessage({ id: "designation-name" }),
		},
	];
};

export const admittedPatientColumns = (formatMessage: any) => {
	return [
		{
			name: "inPatientNumber",
			label: formatMessage({ id: "ip-number" }),
			type: filterTypes.number,
		},
		{
			name: "patientUHID",
			label: formatMessage({ id: "patient-uhid" }),
			primaryColumnName: "Patient.UHID",
		},
		{
			name: "patientFullNameWithTitle",
			label: formatMessage({ id: "patient-name" }),
			extendedColumns: [
				{ label: "First Name", name: "Patient.FirstName" },
				{ label: "Middle Name", name: "Patient.MiddleName" },
				{ label: "Last Name", name: "Patient.LastName" },
			],
			primaryColumnName: "Patient.FirstName",
		},
		{
			name: "coupleCHNId",
			label: formatMessage({ id: "patient-chn" }),
			hideGlobalSearchFilter: true,
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? value : "-"}</span>;
				},
			},
		},
		{
			name: "partnerUHID",
			label: formatMessage({ id: "partner-uhid" }),
			hideGlobalSearchFilter: true,
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? value : "-"}</span>;
				},
			},
		},
		{
			name: "partnerName",
			label: formatMessage({ id: "partner-name" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Partner.Name",
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? value : "-"}</span>;
				},
			},
		},
		{
			name: "patientAgeInYear",
			label: formatMessage({ id: "age" }),
			hideGlobalSearchFilter: true,
			type: filterTypes.number,
		},
		{
			...genderOptions,
			label: formatMessage({ id: "gender" }),
			name: "patientGenderName",
			primaryColumnName: "Patient.Gender.Name",
		},
		{
			name: "inPatientPackageAllocationPayerInsuranceCompanyName",
			label: formatMessage({ id: "payer" }),
			primaryColumnName:
				"InPatientPackageAllocation.PayerInsuranceCompany.Name",
			hideGlobalSearchFilter: true,
		},
		{
			name: "isDischarged",
			label: formatMessage({ id: "admission-status" }),
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? "Discharged" : "Admitted"}</span>;
				},
			},
			hideGlobalSearchFilter: true,
			type: filterTypes.boolean,
			selectOptions: [
				{ label: "Admitted", value: "false" },
				{ label: "Discharged", value: "true" },
			],
		},
	];
};

export const resourceSlotConfigColumns = (formatMessage: any) => [
	{
		name: "durationMinutes",
		label: formatMessage({ id: "slot-duration" }),
		type: filterTypes.number,
		hideGlobalSearchFilter: true,
	},
	{
		name: "fromDate",
		label: formatMessage({ id: "from-date" }),
		...dateOptions,
	},
	{
		name: "toDate",
		label: formatMessage({ id: "to-date" }),
		...dateOptions,
	},
	{
		name: "excludedDays",
		label: formatMessage({ id: "excluded-days" }),
		hideGlobalSearchFilter: true,
		disableSort: true,
	},
	{
		name: "isOverlappingAllowed",
		label: formatMessage({ id: "overlapping-appointment" }),
		options: {
			customBodyRender: (value: boolean) => <BooleanIcon value={value} />,
		},
		hideGlobalSearchFilter: true,
		type: filterTypes.boolean,
		selectOptions: [
			{ label: "Allowed", value: "true" },
			{ label: "Not Allowed", value: "false" },
		],
	},
	// { name: 'clinicName', label: formatMessage({ id: "clinic" }), primaryColumnName: "Clinic.Name" },
	{
		name: "resourceName",
		label: formatMessage({ id: "resource" }),
		primaryColumnName: "Resource.Name",
	},
	{
		name: "doctorUserDisplayName",
		label: formatMessage({ id: "doctor" }),
		primaryColumnName: "doctor.User.DisplayName",
	},
];

export const otSlotConfigColumns = (formatMessage: any) => [
	// { name: 'clinicName', label: formatMessage({ id: "clinic" }), primaryColumnName: "Clinic.Name", },
	{
		name: "operatingTheatreName",
		label: formatMessage({ id: "operation-theatre" }),
		primaryColumnName: "OperatingTheatre.Name",
	},
	{
		name: "surgeryName",
		label: formatMessage({ id: "surgery-type" }),
		primaryColumnName: "Surgery.Name",
	},
	{
		name: "fromDate",
		label: formatMessage({ id: "from-date" }),
		...dateOptions,
	},
	{
		name: "toDate",
		label: formatMessage({ id: "to-date" }),
		...dateOptions,
	},
	{
		name: "durationMinutes",
		label: formatMessage({ id: "slot-duration" }),
		hideGlobalSearchFilter: true,
		type: filterTypes.number,
	},
	{
		name: "excludedDays",
		label: formatMessage({ id: "excluded-days" }),
		hideGlobalSearchFilter: true,
		disableSort: true,
	},
	{
		name: "isOverlappingAllowed",
		label: formatMessage({ id: "overlapping-appointment" }),
		options: {
			customBodyRender: (value: boolean) => <BooleanIcon value={value} />,
		},
		...booleanOptions,
		selectOptions: [
			{ label: "Allowed", value: "true" },
			{ label: "Not Allowed", value: "false" },
		],
	},
];

export const patientPopupColumns = (formatMessage: any) => [
	{ label: formatMessage({ id: "uhid" }), name: "uhid" },
	{ label: formatMessage({ id: "full-name" }), name: "fullName" },
	{ label: formatMessage({ id: "telephone" }), name: "telephone" },
];

export const servicePopupColumns = (formatMessage: any) => [
	{ label: formatMessage({ id: "service" }), name: "name" },
	{ label: formatMessage({ id: "category" }), name: "serviceCategoryName" },
	{ label: formatMessage({ id: "sub-department" }), name: "subDepartmentName" },
];

export const zipCodePopupColumns = (formatMessage: any) => [
	{ label: formatMessage({ id: "zip-code" }), name: "zipCode" },
	{ label: formatMessage({ id: "locality" }), name: "localityName" },
	{ label: formatMessage({ id: "city" }), name: "localityCityName" },
	{
		label: formatMessage({ id: "province" }),
		name: "localityCityProvinceName",
	},
	{
		label: formatMessage({ id: "country" }),
		name: "localityCityProvinceCountryName",
	},
];

export const appointmentIdPopupColumns = (formatMessage: any) => [
	{ label: formatMessage({ id: "appointment-id" }), name: "appointmentNumber" },
	{ label: formatMessage({ id: "full-name" }), name: "patientFullName" },
	{ label: formatMessage({ id: "telephone" }), name: "telephone" },
];

export const contactIdPopupColumns = (formatMessage: any) => [
	{ label: formatMessage({ id: "contact-id" }), name: "appointmentNumber" },
	{ label: formatMessage({ id: "full-name" }), name: "patientFullName" },
	{ label: formatMessage({ id: "telephone" }), name: "telephone" },
];

export const treatmentProcessColumns = [
	{ label: "cycle-id", name: "id" },
	// { label: "type-of-cycle", name: "cycleType" },
	{ label: "treatment", name: "treatmentTypeName" },
	{ label: "protocol", name: "medicalStaffStimulationProtocolName" },
	// { label: "date", name: "createdDateTime" },
	// { label: "doctor", name: "doctor" },
	// { label: "technique", name: "technique" },
	// { label: "oocyte-source", name: "oocyteSource" },
	// { label: "status-of-cycle", name: "cycleStatus" },
	{ label: "action", name: "action" },
];

export const ivfLabAndrologyColumns = [
	{ label: "date", name: "date" },
	{ label: "patient-name", name: "name" },
	{ label: "patient-uhid", name: "uhid" },
	{ label: "test-ordered", name: "testOrderedId" },
];

export const vitalSummaryColumns = [
	{ label: "order-date", name: "vitalCapturingDate" },
	{ label: "time", name: "time" },
	{ label: "professional", name: "professionalUserDisplayName" },
	{ label: "height", name: "vitalHeight" },
	{ label: "weight(kg)", name: "vitalWeight" },
	{ label: "BMI", name: "vitalBMI" },
	{ label: "t-f", name: "vitalTemperatureF" },
	{ label: "bp(mmHg)", name: "vitalBP" },
	{ label: "hr", name: "vitalHR" },
	{ label: "rr", name: "vitalRR" },
	{ label: "pain-scale", name: "painRatingScale" },
	{ label: "created-by", name: "createdBy" },
	{ label: "action", name: "action" },
];

export const prescriptionSummaryColumns = [
	{ label: "order-date", name: "orderDate" },
	{ label: "order-no", name: "orderNumber" },
	{ label: "professional", name: "professionalId" },
	{ label: "order-status", name: "orderStatus" },
	{ label: "medication-count", name: "medicationCount" },
	{ label: "action", name: "action" },
	{ label: "email", name: "email" },
];

export const diagnosisProcessColumns = [
	{ label: "date", name: "diagnosisDate" },
	{ label: "status", name: "diagnosisStatus" },
	{ label: "ICD-10-code", name: "icD10Id" },
	{ label: "diagnosis", name: "addICDDiagnosisName" },
	{ label: "type", name: "addICDDiagnosisCode" },
	{ label: "created-by", name: "createdBy" },
	{ label: "action", name: "action" },
];

export const diagnosisPatientProcessColumn = [
	{ label: "code", name: "code" },
	{ label: "diagnosis", name: "diagnosis" },
	{ label: "type", name: "type" },
	{ label: "entered-by", name: "enteredby" },
	{ label: "date", name: "date" },
	{ label: "modified-by", name: "modifiedby" },
	{ label: "date", name: "date" },
	{ label: "action", name: "action" },
];
// export const addDiagnosistProcessColumn = [
//   { label: "code", name: "code" },
//   { label: "diagnosis", name: "diagnosis" },
//   { label: "type", name: "type" },
//   { label: "select", name: "select" },
//   { label: "action", name: "action" },
// ]

export const userColumns = (formatMessage: any) => {
	return [
		{
			name: `displayName`,
			label: formatMessage({ id: "employee-name" }),
			primaryColumnName: "displayName",
		},
		{ name: "phoneNumber", label: formatMessage({ id: "mobile-number" }) },
		{ name: "email", label: formatMessage({ id: "email" }) },
		{ name: "userName", label: formatMessage({ id: "login-id" }) },
		{
			name: "hasPasswordExpiry",
			label: formatMessage({ id: "is-password-expiry" }),
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? "Yes" : "No"}</span>;
				},
			},
			type: filterTypes.boolean,
			hideGlobalSearchFilter: true,
			selectOptions: [
				{ label: "Yes", value: "true" },
				{ label: "No", value: "false" },
			],
		},
		{
			name: "isEnabled",
			label: formatMessage({ id: "is-active" }),
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? "Yes" : "No"}</span>;
				},
			},
			hideGlobalSearchFilter: true,
			type: filterTypes.boolean,
			selectOptions: [
				{ label: "Enable", value: "true" },
				{ label: "Disable", value: "false" },
			],
		},
		{ ...genderOptions, label: formatMessage({ id: "gender" }) },
	];
};

export const clinicalUserCrendentialsMappingColumns = (formatMessage: any) => {
	return [
		{
			name: `userDisplayName`,
			label: formatMessage({ id: "user-name" }),
			extendedColumns: [
				{ label: "First Name", name: "firstName" },
				{ label: "Last Name", name: "lastName" },
			],
			primaryColumnName: "userName",
		},
		{
			name: "smsReceivingNumber",
			label: formatMessage({ id: "sms-receiving-number" }),
		},
		{
			name: "userDesignationName",
			label: formatMessage({ id: "designation" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "User.Designation.Name",
		},
	];
};

export const labTestColumns = (
	formatMessage: any,
	billingServiceOptions: any
) => {
	return [
		{
			name: "name",
			label: formatMessage({ id: "display-name" }),
			type: filterTypes.text,
		},
		{
			name: "testShortname",
			label: formatMessage({ id: "test-short-name" }),
			type: filterTypes.text,
		},
		{
			name: "testLongname",
			label: formatMessage({ id: "test-long-name" }),
			type: filterTypes.text,
		},
		{
			name: "testCode",
			label: formatMessage({ id: "test-code" }),
			type: filterTypes.text,
		},
		{
			name: "cptCode",
			label: formatMessage({ id: "cpt-code" }),
			type: filterTypes.text,
		},
		{
			name: "testSource",
			label: formatMessage({ id: "test-source" }),
			type: filterTypes.select,
			selectOptions: testSourceOptions ?? [],
			hideGlobalSearchFilter: true,
			primaryColumnName: "TestSource",
			secondaryColumnName: "testSource",
			options: {
				customBodyRender: (value: string) => {
					{
						const object = testSourceOptions.find(
							(item: any) => item.value == value
						);
						return <span>{object?.label}</span>;
					}
				},
			},
		},
		{
			name: "billingServiceName",
			label: formatMessage({ id: "billing-service" }),
			type: filterTypes.select,
			selectOptions: billingServiceOptions ?? [],
			hideGlobalSearchFilter: true,
			primaryColumnName: "Service.Name",
			secondaryColumnName: "billingServiceId",
		},
		{
			name: "subDepartmentName",
			label: formatMessage({ id: "sub-department" }),
			type: filterTypes.text,
		},
		{
			name: "isCulture",
			label: formatMessage({ id: "is-culture" }),
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? "Yes" : "No"}</span>;
				},
			},
			type: filterTypes.boolean,
			hideGlobalSearchFilter: true,
			selectOptions: [
				{ label: "Yes", value: "true" },
				{ label: "No", value: "false" },
			],
		},
		{
			name: "equipmentName",
			label: formatMessage({ id: "equipment" }),
			hideGlobalSearchFilter: true,
			type: filterTypes.select,
		},
		{
			name: "tatInMinutes",
			label: formatMessage({ id: "tat-in-minutes" }),
			type: filterTypes.number,
		},
		{
			name: "isCumulative",
			label: formatMessage({ id: "is-cumulative" }),
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? "Yes" : "No"}</span>;
				},
			},
			type: filterTypes.boolean,
			hideGlobalSearchFilter: true,
			selectOptions: [
				{ label: "Yes", value: "true" },
				{ label: "No", value: "false" },
			],
		},
		{
			name: "cumulativeDays",
			label: formatMessage({ id: "cumulative-days" }),
			type: filterTypes.number,
		},
		{
			name: "fontName",
			label: formatMessage({ id: "font-name" }),
			type: filterTypes.text,
		},
		{
			name: "fontSize",
			label: formatMessage({ id: "font-size" }),
			type: filterTypes.number,
		},
		{
			name: "testNote",
			label: formatMessage({ id: "test-note" }),
			type: filterTypes.text,
		},
	];
};

export const bankColumns = (formatMessage: any) => [
	{
		name: "name",
		label: formatMessage({ id: "bank-name" }),
		type: filterTypes.text,
	},
	{
		name: "address",
		label: formatMessage({ id: "branch-address" }),
		type: filterTypes.text,
	},
	{
		name: "contactPerson",
		label: formatMessage({ id: "branch-contact-person" }),
		type: filterTypes.text,
	},
	{
		name: "telephone",
		label: formatMessage({ id: "branch-contact" }),
		type: filterTypes.text,
	},
	{
		name: "ifsc",
		label: formatMessage({ id: "ifsc-code" }),
		type: filterTypes.text,
	},
];

export const discountTypeColumns = (formatMessage: any) => [
	{
		name: "name",
		label: formatMessage({ id: "name" }),
		type: filterTypes.text,
	},
];

export const doctorfeeColumns = (formatMessage: any) => [
	{
		name: "medicalStaffName",
		label: formatMessage({ id: "doctor" }),
		type: filterTypes.text,
	},
	{
		name: "clinicName",
		label: formatMessage({ id: "clinic" }),
		type: filterTypes.text,
	},
	{
		name: "visitTypeName",
		label: formatMessage({ id: "visit" }),
		type: filterTypes.text,
	},
	// { name: 'payer', label: formatMessage({ id: "payer" }), type: filterTypes.text },
	{
		name: "tariffName",
		label: formatMessage({ id: "tariff-version" }),
		type: filterTypes.text,
	},
	{
		name: "price",
		label: formatMessage({ id: "fee" }),
		type: filterTypes.text,
	},
	{
		name: "markupPer",
		label: formatMessage({ id: "mark-up" }),
		type: filterTypes.text,
	},
	{
		name: "effectiveFrom",
		label: formatMessage({ id: "effective-form" }),
		type: filterTypes.text,
	},
];

export const facilitatorColumns = (formatMessage: any) => [
	{
		name: "name",
		label: formatMessage({ id: "facilitator-name" }),
		type: filterTypes.text,
	},
	{
		name: "facilitatorPercentage",
		label: formatMessage({ id: "facilitator" }) + " %",
		type: filterTypes.text,
	},
	{
		name: "facilitatorAmount",
		label: formatMessage({ id: "facilitator-amount" }),
		type: filterTypes.text,
	},
];

export const merchantColumns = (formatMessage: any) => [
	{
		name: "name",
		label: formatMessage({ id: "merchant-name" }),
		type: filterTypes.text,
	},
	{
		name: "telephone",
		label: formatMessage({ id: "merchant-contact" }),
		type: filterTypes.text,
	},
	{
		name: "address",
		label: formatMessage({ id: "merchant-address" }),
		type: filterTypes.text,
	},
	{
		name: "emiSchemeId",
		label: formatMessage({ id: "emi-scheme" }),
		type: filterTypes.text,
	},
	{
		name: "subventionCharges",
		label: formatMessage({ id: "subvention-charges" }),
		type: filterTypes.text,
	},
];

export const packageColumns = (formatMessage: any) => [
	{
		name: "name",
		label: formatMessage({ id: "package-name" }),
	},
	{
		name: "isDonorPackage",
		label: formatMessage({ id: "donor-package" }),
		...BooleanIconOption,
	},
	{
		name: "durationInDay",
		label: formatMessage({ id: "package-duration" }),
	},
	{
		name: "packageStartDate",
		label: formatMessage({ id: "package-start-date" }),
		...dateOptions,
	},
	{
		name: "packageEndDate",
		label: formatMessage({ id: "package-end-date" }),
		...dateOptions,
	},
	{
		name: "stageName",
		label: formatMessage({ id: "treatment-package-stage" }),
		primaryColumnName: "Stage.Name",
	},
	{
		name: "isMultipleVisitAllowed",
		label: formatMessage({ id: "multiple-visit-allow" }),
		...BooleanIconOption,
	},
	{
		name: "maximumNumberOfVisits",
		label: formatMessage({ id: "no-of-visit-allowed" }),
	},
	{
		name: "maximumVisitAmount",
		label: formatMessage({ id: "visit-amount" }),
		hideGlobalSearchFilter: true,
	},
	{
		name: "maximumDrugsAmount",
		label: formatMessage({ id: "drug" }),
		hideGlobalSearchFilter: true,
	},
	{
		name: "maximumConsumablesAmount",
		label: formatMessage({ id: "consumable" }),
		hideGlobalSearchFilter: true,
	},
	{
		name: "maximumInvestigationAmount",
		label: formatMessage({ id: "investigation-amount" }),
		hideGlobalSearchFilter: true,
	},
	{
		name: "packageCost",
		label: formatMessage({ id: "total-package-cost" }),
	},
	{
		name: "isSubventionPackage",
		label: formatMessage({ id: "subvention-package" }),
		...BooleanIconOption,
	},
];

export const testComponentColumns = (formatMessage: any) => {
	return [
		{
			name: "name",
			label: formatMessage({ id: "component-name" }),
			type: filterTypes.text,
		},
		{
			name: "decimalUpto",
			label: formatMessage({ id: "decimal-upto" }),
			type: filterTypes.text,
		},
		{
			name: "equipmentTestCode",
			label: formatMessage({ id: "equipment-test-code" }),
			type: filterTypes.text,
		},
		{
			name: "minimumRange",
			label: formatMessage({ id: "minimum-range" }),
			type: filterTypes.number,
		},
		{
			name: "maximumRange",
			label: formatMessage({ id: "maximum-range" }),
			type: filterTypes.number,
		},
		{
			name: "lowPanicValue",
			label: formatMessage({ id: "low-panic-value" }),
			type: filterTypes.number,
		},
		{
			name: "highPanicValue",
			label: formatMessage({ id: "high-panic-value" }),
			type: filterTypes.number,
		},
		{
			name: "textReferenceRange",
			label: formatMessage({ id: "text-reference-range" }),
			type: filterTypes.text,
		},
		{
			name: "isRoudingOff",
			label: formatMessage({ id: "is-rounding-off" }),
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? "Yes" : "No"}</span>;
				},
			},
			type: filterTypes.boolean,
			hideGlobalSearchFilter: true,
			selectOptions: [
				{ label: "Yes", value: "true" },
				{ label: "No", value: "false" },
			],
		},
		{
			name: "integrationId",
			label: formatMessage({ id: "integration-id" }),
			type: filterTypes.number,
		},
		{
			name: "resultType",
			label: formatMessage({ id: "result-type" }),
			selectOptions: resultTypeOptions ?? [],
			hideGlobalSearchFilter: true,
			type: filterTypes.select,
			primaryColumnName: "ResultType",
			options: {
				customBodyRender: (value: string) => {
					const object = resultTypeOptions.find(
						(item: any) => item.value == value
					);
					return <span>{object?.label}</span>;
				},
			},
		},
	];
};

export const serviceColumns = (formatMessage: any) => [
	{
		name: "name",
		label: formatMessage({ id: "service-name" }),
	},
	{
		name: "cptCode",
		label: formatMessage({ id: "cpt-code" }),
	},
	{
		name: "serviceCategoryName",
		label: formatMessage({ id: "service-category" }),
		primaryColumnName: "ServiceCategory.Name",
	},
	{
		name: "subDepartmentName",
		label: formatMessage({ id: "sub-department" }),
		primaryColumnName: "SubDepartment.Name",
	},
	{
		name: "genderType",
		label: formatMessage({ id: "gender-applicability" }),
		...genderApplicabilityOptions,
	},
	{
		name: "isPriceEditable",
		label: formatMessage({ id: "price-editible" }),
		...BooleanIconOption,
	},
	{
		name: "isTaxApplicability",
		label: formatMessage({ id: "tax-applicability" }),
		...BooleanIconOption,
	},
	{
		name: "isPerformingDoctorRequired",
		label: formatMessage({ id: "performing-doctor-required" }),
		...BooleanIconOption,
	},
	{
		name: "isBillable",
		label: formatMessage({ id: "billable" }),
		...BooleanIconOption,
	},
	{
		name: "isSerologyTest",
		label: formatMessage({ id: "serology-test" }),
		...BooleanIconOption,
	},
	{
		name: "isPreOperativeTest",
		label: formatMessage({ id: "pre-operative-test" }),
		...BooleanIconOption,
	},
	{
		name: "isAllowZeroClaimBilling",
		label: formatMessage({ id: "allow-zero-claim-billing" }),
		...BooleanIconOption,
	},
	{
		name: "isBillOnOrderOrComlete",
		label: formatMessage({ id: "bill-on-order" }),
		...BooleanIconOption,
	},
];

export const tariffItemColumns = (formatMessage: any) => [
	{
		name: "tariffId",
		label: formatMessage({ id: "tariff" }),
		type: filterTypes.text,
	},
	{
		name: "clinicId",
		label: formatMessage({ id: "clinic" }),
		type: filterTypes.text,
	},
	{
		name: "serviceCategoryName",
		label: formatMessage({ id: "service-category" }),
		type: filterTypes.text,
	},
	{
		name: "serviceItemName",
		label: formatMessage({ id: "service" }),
		type: filterTypes.text,
	},
	{
		name: "effectiveFrom",
		label: formatMessage({ id: "effective-form" }),
		type: filterTypes.text,
	},
	{
		name: "price",
		label: formatMessage({ id: "price" }),
		type: filterTypes.text,
	},
	{
		name: "markupPer",
		label: formatMessage({ id: "mark-up" }),
		type: filterTypes.text,
	},
];

export const discountAuthorityMatrixColumns = (formatMessage: any) => [
	{
		name: "userRoleName",
		label: formatMessage({ id: "role" }),
		type: filterTypes.text,
	},
	{
		name: "discountTypeName",
		label: formatMessage({ id: "discount-type" }),
		type: filterTypes.text,
	},
	{
		name: "discountReasonName",
		label: formatMessage({ id: "discount-reason" }),
		type: filterTypes.text,
	},
	{
		name: "maxDiscountPer",
		label: formatMessage({ id: "max-discount" }),
		type: filterTypes.text,
	},
	{
		name: "discountLimit",
		label: formatMessage({ id: "discount-limit-amt" }),
		type: filterTypes.text,
	},
];

export const refundDepositLogicColumns = (formatMessage: any) => [
	{
		name: "stageName",
		label: formatMessage({ id: "stage" }),
		type: filterTypes.text,
		primaryColumnName: "Stage.Name",
	},
	// { name: 'cycleName', label: formatMessage({ id: "cycle" }), type: filterTypes.text },
	{
		name: "advancePercentage",
		label: formatMessage({ id: "advance" }),
		type: filterTypes.text,
	},
	{
		name: "refundPercentage",
		label: formatMessage({ id: "refund" }),
		type: filterTypes.text,
	},
	{
		name: "effectivefrom",
		label: formatMessage({ id: "effective-from" }),
		type: filterTypes.text,
		hideGlobalSearchFilter: true,
	},
];

export const seriesColumns = (formatMessage: any) => {
	return [
		{
			name: "clinicName",
			label: formatMessage({ id: "clinic" }),
			type: filterTypes.text,
		},
		{
			name: "transactionTypeName",
			label: formatMessage({ id: "transaction-type" }),
			type: filterTypes.text,
		},
		// {
		//   name: 'financialYearType', label: formatMessage({ id: "financial-year-type" }),
		//   type: filterTypes.boolean,
		//   options: {
		//     customBodyRender: (value: any) => {
		//       return <span>{value ? formatMessage({ id: "January To December" }) : formatMessage({ id: "April To March" })}</span>
		//     }
		//   },
		// },

		// { name: 'year', label: formatMessage({ id: "year" }), type: filterTypes.text },
		{
			name: "prefix",
			label: formatMessage({ id: "prefix" }),
			type: filterTypes.text,
		},
		{
			name: "sequence",
			label: formatMessage({ id: "sequence" }),
			type: filterTypes.number,
		},
		// {
		//   name: 'counterResetOnFinancialYear', label: formatMessage({ id: "counter-reset" }),
		//   options: {
		//     customBodyRender: (value: string) => {
		//       return <span>{value ? "Yes" : "No"}</span>
		//     }
		//   },
		//   type: filterTypes.select,
		//   hideGlobalSearchFilter: true,
		// },
	];
};



export const stageColumns = (formatMessage: any) => [
	{
		name: "name",
		label: formatMessage({ id: "stage" }),
		type: filterTypes.text,
	},
	{
		name: "cycleName",
		label: formatMessage({ id: "cycle" }),
		type: filterTypes.text,
	},
];

export const serviceCategoryColumns = (formatMessage: any) => [
	{ name: 'name', label: formatMessage({ id: "service-category" }), type: filterTypes.text },
]

export const serviceCategoryTypeColumns = (formatMessage: any) => [
	{ name: 'name', label: formatMessage({ id: "service-category-type" }), type: filterTypes.text },
]

export const sampleCollectionColumns = (formatMessage: any) => {
	return [
		{
			name: "testOrderPatientUHID",
			label: formatMessage({ id: "patient-uhid" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "labNumber",
			label: formatMessage({ id: "lab-number" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "partnerUHID",
			label: formatMessage({ id: "partner-uhid" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "partnerName",
			label: formatMessage({ id: "partner-name" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "testOrderPatientFullName",
			label: formatMessage({ id: "patient-name" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Test.Status.Name",
			secondaryColumnName: "testStatusId",
		},
		{
			name: "testOrderPatientIsVIP",
			label: formatMessage({ id: "vip" }),
			options: {
				customBodyRender: (value: string) => {
					return <span>{value ? "Yes" : "No"}</span>;
				},
			},
			hideGlobalSearchFilter: true,
		},
		{
			name: "testOrderPatientBirthDate",
			label: formatMessage({ id: "dob" }),
			...dateOptions,
		},
		{
			name: "patientAgeInYear",
			label: formatMessage({ id: "age" }),
			hideGlobalSearchFilter: true,
		},
		{
			...genderOptions,
			name: "testOrderPatientGenderName",
			label: formatMessage({ id: "gender" }),
			primaryColumnName: "Test.Order.Patient.Gender.Name",
			secondaryColumnName: "testOrderPatientGenderId",
		},
		{
			name: "testOrderPatientDoctorUserDisplayName",
			label: formatMessage({ id: "treating-doctor" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Test.Order.Patient.Doctor.Name",
			secondaryColumnName: "testOrderPatientDoctorId",
		},
		{
			name: "collectedByUserUserDisplayName",
			label: formatMessage({ id: "collected-by" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Name",
			secondaryColumnName: "collectedById",
		},
		{
			name: "dispatchByUserUserDisplayName",
			label: formatMessage({ id: "dispatched-by" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Name",
			secondaryColumnName: "dispatchById",
		},
		{
			name: "acknowledgeByUserUserDisplayName",
			label: formatMessage({ id: "acknowledged-by" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Name",
			secondaryColumnName: "acknowledgeById",
		},
		{
			name: "testStatusName",
			label: formatMessage({ id: "test-status" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Test.Status.Name",
			secondaryColumnName: "testStatusId",
		},
		{
			name: "testSampleName",
			label: formatMessage({ id: "test-sample-name" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Test.Sample.Name",
			secondaryColumnName: "testSampleId",
		},
		{
			name: "reSamplingReason",
			label: formatMessage({ id: "re-sampling-reason" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "profileName",
			label: formatMessage({ id: "profile-name" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Profile.Name",
			secondaryColumnName: "profileId",
		},
		{
			name: "testName",
			label: formatMessage({ id: "test-name" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Test.Name",
			secondaryColumnName: "testId",
		},
		{
			name: "priorityName",
			label: formatMessage({ id: "priority" }),
			hideGlobalSearchFilter: true,
			primaryColumnName: "Priority.Name",
			secondaryColumnName: "PriorityId",
		},
		{
			name: "acknowledgeDate",
			label: formatMessage({ id: "acknowledge-date" }),
			...dateOptions,
		},
		{
			name: "dispatchDate",
			label: formatMessage({ id: "dispatch-date" }),
			...dateOptions,
		},
		{
			name: "collectionDate",
			label: formatMessage({ id: "sample-collection-date" }),
			...dateOptions,
		},
		{
			name: "createdDateTime",
			label: formatMessage({ id: "created-date" }),
			...dateOptions,
		},
	];
};

export const sampleDispatchColumns = (formatMessage: any) => {
	return [
		{
			name: "testOrderPatientUHID",
			label: formatMessage({ id: "patient-uhid" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "labNumber",
			label: formatMessage({ id: "lab-number" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "partnerUHID",
			label: formatMessage({ id: "partner-uhid" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "partnerName",
			label: formatMessage({ id: "partner-name" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "testOrderPatientFullName",
			label: formatMessage({ id: "patient-name" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "testOrderPatientBirthDate",
			label: formatMessage({ id: "dob" }),
			...dateOptions,
		},
		{
			name: "patientAgeInYear",
			label: formatMessage({ id: "age" }),
			hideGlobalSearchFilter: true,
		},
		{
			label: formatMessage({ id: "gender" }),
			...genderOptions,
			name: "testOrderPatientGenderName",
		},
		{
			name: "testOrderPatientDoctorUserDisplayName",
			label: formatMessage({ id: "treating-doctor" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "testName",
			label: formatMessage({ id: "test-name" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "orderDateTime",
			label: formatMessage({ id: "order-date" }),
			...dateOptions,
		},
		{
			name: "collectionDate",
			label: formatMessage({ id: "sample-collection-date" }),
			...dateOptions,
		},
		{
			name: "testSampleName",
			label: formatMessage({ id: "sample-type" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "sampleContainerName",
			label: formatMessage({ id: "sample-container" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "priorityName",
			label: formatMessage({ id: "priority" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "testStatusName",
			label: formatMessage({ id: "sample-status" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "dispatchByUserUserDisplayName",
			label: formatMessage({ id: "dispatched-by" }),
			hideGlobalSearchFilter: true,
		},
		{
			name: "dispatchDate",
			label: formatMessage({ id: "dispatch-date" }),
			...dateOptions,
		},
	];
};

export const laboratoryWorklistColumns = (formatMessage: any) => {
	return [
		{ name: 'dispatchClinicName', label: formatMessage({ id: "clinic-location" }), hideGlobalSearchFilter: true },
		{ name: 'testOrderPatientUHID', label: formatMessage({ id: "patient-uhid" }), hideGlobalSearchFilter: true },
		{ name: 'testOrderCoupleCHNId', label: formatMessage({ id: "chn" }), hideGlobalSearchFilter: true },
		{ name: 'labNumber', label: formatMessage({ id: "lab-number" }), hideGlobalSearchFilter: true },
		{ name: 'partnerName', label: formatMessage({ id: "partner-name" }), hideGlobalSearchFilter: true },
		{ name: 'partnerUHID', label: formatMessage({ id: "partner-uhid" }), hideGlobalSearchFilter: true },
		{ name: 'testOrderPatientFullName', label: formatMessage({ id: "patient-name" }), hideGlobalSearchFilter: true },
		{ name: 'patientAgeInYear', label: formatMessage({ id: "age" }), hideGlobalSearchFilter: true },
		{ ...genderOptions, name: 'testOrderPatientGenderName', label: formatMessage({ id: "gender" }) },
		{ name: 'testOrderPatientDoctorUserDisplayName', label: formatMessage({ id: "treating-doctor" }), hideGlobalSearchFilter: true },
		{ name: 'profileName', label: formatMessage({ id: "profile-name" }), hideGlobalSearchFilter: true },
		{ name: 'testName', label: formatMessage({ id: "test-name" }), hideGlobalSearchFilter: true },
		{
			name: 'orderDateTime',
			label: formatMessage({ id: "order-date" }),
			...dateOptions
		},
		{
			name: 'collectionDate',
			label: formatMessage({ id: "sample-collection-date" }),
			...dateOptions
		},
		{ name: 'testSampleName', label: formatMessage({ id: "sample-type" }), hideGlobalSearchFilter: true },
		{ name: 'sampleContainerName', label: formatMessage({ id: "sample-container" }), hideGlobalSearchFilter: true },
		{ name: 'priorityName', label: formatMessage({ id: "priority" }), hideGlobalSearchFilter: true },
		{
			name: 'testStatusName',
			label: formatMessage({ id: "sample-status" }),
			hideGlobalSearchFilter: true
		},
		{ name: 'acknowledgeByUserUserDisplayName', label: formatMessage({ id: "acknowledged-by" }), hideGlobalSearchFilter: true },
		{
			name: 'acknowledgeDate',
			label: formatMessage({ id: "acknowledge-date" }),
			...dateOptions
		}
	]
}

export const ultrasoundSummaryColumns = (formatMessage: any) => [
	{ name: 'createdDateTime', label: formatMessage({ id: "date" }) },
	{ name: 'doctorUserDisplayName', label: formatMessage({ id: "performed-by" }) },
	{ name: 'clinicName', label: formatMessage({ id: "clinic-name" }) },
	{ name: 'ultrasoundTypeName', label: formatMessage({ id: "type-of-usg" }) },
	{ name: 'ultrasoundMethodName', label: formatMessage({ id: "method" }) },
	{ name: 'endometrialThickness', label: formatMessage({ id: "endo-thickness" }) },
	{ name: 'folliclesRight', label: formatMessage({ id: "FNRO" }) },
	{ name: 'folliclesLeft', label: formatMessage({ id: "FNLO" }) },
	{ name: 'notes', label: formatMessage({ id: "observations" }) },
	{ name: 'usgStatus', label: formatMessage({ id: "status" }) },
	{ name: 'verifiedByUserDisplayName', label: formatMessage({ id: "verified-by" }) },
	{ name: "action", label: formatMessage({ id: "action" }) }
]

export const batchStorePopupColumns = (formatMessage: any) => [
	{ label: formatMessage({ id: "medication-name" }), name: "itemItemLongName" },
	{ label: formatMessage({ id: "batch-number" }), name: "batchNumber" },
	{ label: formatMessage({ id: "expiry-date" }), name: "expiryDate" },
	{ label: formatMessage({ id: "quantity" }), name: "quantity" },
]

export const userPopupColumns = (formatMessage: any) => [
	{ label: formatMessage({ id: "name" }), name: "displayName" },
	{ label: formatMessage({ id: "user-id" }), name: "userName" },
];

export const requestAndResultSummaryColumns = (formatMessage: any) => [
	{
		name: "createdDateTime",
		label: formatMessage({ id: "date" }),
		...dateOptions,
	},
	{
		name: "testName",
		label: formatMessage({ id: "test-name" }),
	},
	{
		name: "clinicName",
		label: formatMessage({ id: "clinic-name" }),
	},
	{
		name: "requestedDate",
		label: formatMessage({ id: "requested-date" }),
		...dateOptions,
	},
	{
		name: "resultDate",
		label: formatMessage({ id: "result-date" }),
		...dateOptions,
	},
	{
		name: "status",
		label: formatMessage({ id: "status" }),
	},
	{
		name: "observations",
		label: formatMessage({ id: "observations" }),
	},
];

export const bloodLabSummaryColumns = (formatMessage: any) => [
	{
		name: "createdDateTime",
		label: formatMessage({ id: "date" }),
		...dateOptions,
	},
	{ name: "testName", label: formatMessage({ id: "request-no" }) },
	{ name: "clinicName", label: formatMessage({ id: "professional" }) },
	{ name: "requestedDate", label: formatMessage({ id: "test-profile" }) },
	{ name: "resultDate", label: formatMessage({ id: "clinic" }) },
	{ name: "status", label: formatMessage({ id: "status" }) },
	{ name: "observations", label: formatMessage({ id: "in-house-external" }) },
	{ name: "action", label: formatMessage({ id: "action" }) },
];


export const documentUploadColumns = [
	{ label: "Document Name", name: "documentName" },
	{ label: "Uploaded on", name: "Uploaded on" },
	{ label: "Owner", name: "owner" },
	{ label: "Remarks", name: "observations" },
	// { label: "View", name: "action" },
	{ label: "Edit", name: "action" },
	{ label: "Delete", name: "action" },
];


export const itemChargeColumns = (formatMessage: any) => [
  { name: 'chargeCode', label: formatMessage({ id: "charge-code" }), type: filterTypes.text },
  { name: 'itemValue', label: formatMessage({ id: "charge-percentage" }), type: filterTypes.text },
  {
	name: "isCalculationOnGross",
	label: formatMessage({ id: "calculate-on-gross" }),
	options: {
		customBodyRender: (value: string) => {
			return <span>{value ? "Yes" : "No"}</span>;
		},
	},
	type: filterTypes.boolean,
	hideGlobalSearchFilter: true,
	selectOptions: [
		{ label: "Yes", value: "true" },
		{ label: "No", value: "false" },
	],
},
  { name: 'calculationBehaviour', label: formatMessage({ id: "calculate-on-behaviour" }), type: filterTypes.text,
  options: {
	customBodyRender: (value: string) => {
		return (
			<span>
				{calculationBehaviour.find((type) => +type.value === +value)?.label}
			</span>
		);
	},
}, },
];