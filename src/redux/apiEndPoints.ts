import { MASTER_API_ENDPOINTS } from "./masterApiEndpoints";
import { CLINICAL_API_ENDPOINTS } from "./clinicalApiEndPoints";

export const BASE_URI = process.env.REACT_APP_BASE_URI;
export const FILE_URI = process.env.REACT_APP_FILE_URI;

export const API_ENDPOINTS = {
	AUTH: `${BASE_URI}/api/Identity/Auth/Login`,
	REFRESH_TOKEN: `${BASE_URI}/api/Identity/Auth/RefreshToken`,
  LOGOUT: `${BASE_URI}/api/Identity/Auth/Logout`,
	// Registration
	GET_COUPLE: `${BASE_URI}/api/Registration/Couple/GetItemsPagination`,
	GET_PATIENT: `${BASE_URI}/api/Registration/Patient/GetItemsPagination`,
	GET_WIFE: `${BASE_URI}/api/Registration/Patient/SearchWifePagination`,
	GET_WIFE_WITH_PARTNER: `${BASE_URI}/api/Registration/Patient/SearchWifeWithPartnerPagination`,
	GET_PATIENT_BY_ID: `${BASE_URI}/api/Registration/Patient/GetItemById`,
	GET_PATIENT_WITH_PARTNER_BY_ID: `${BASE_URI}/api/Registration/Patient/SearchWifeWithPartnerById`,
	GET_PATIENT_LOOKUPS: `${BASE_URI}/api/Registration/Patient/GetAllPatientLookups`,
	CREATE_PATIENT: `${BASE_URI}/api/Registration/Patient/CreatePatient`,
	UPDATE_PATIENT: `${BASE_URI}/api/Registration/Patient/UpdatePatient`,
	CREATE_PARTNER: `${BASE_URI}/api/Registration/Patient/CreatePartner`,
	DE_LINK_COUPLE: `${BASE_URI}/api/Registration/Couple/DeLinkCouple`,

	CREATE_DONOR: `${BASE_URI}/api/Registration/Donor/CreatePatient`,
	GET_DONOR_BY_ID: `${BASE_URI}/api/Registration/Donor/GetItemById`,
	GET_DONOR: `${BASE_URI}/api/Registration/Donor/GetItemsPagination`,
	UPDATE_DONOR: `${BASE_URI}/api/Registration/Donor/UpdatePatient`,
	DELETE_DONOR: `${BASE_URI}/api/Registration/Donor/Delete`,

	// Appointment
	CREATE_APPOINTMENT: `${BASE_URI}/api/Appointment/Appointment/CreateEnquiryAppointment`,
	UPDATE_APPOINTMENT: `${BASE_URI}/api/Appointment/Appointment/UpdateEnquiry`,
	CREATE_EXISTING_PATINET_APPOINTMENT: `${BASE_URI}/api/Appointment/Appointment/CreateExistingPatientAppointment`,
	GET_APPOINTMENT_LOOKUPS: `${BASE_URI}/api/Appointment/Appointment/GetAllAppointmentLookups`,
	GET_ALL_APPOINTMENT: `${BASE_URI}/api/Appointment/Appointment/GetItemsPagination`,
	GET_ALL_RESOURCE_APPOINTMENT: `${BASE_URI}/api/Appointment/Appointment/GetAllAppointmentDairyPagination`,
	GET_APPOINTMENT_BY_DATE: `${BASE_URI}/api/Appointment/Appointment/GetAppointmentPagination`,
	RESCHEDULE_APPOINTMENT: `${BASE_URI}/api/Appointment/Appointment/Reschedule`,
	CANCEL_APPOINTMENT: `${BASE_URI}/api/Appointment/Appointment/Cancel`,
	CONFIRM_APPOINTMENT: `${BASE_URI}/api/Appointment/Appointment/Confirm`,
	MARK_PATIENT_ARRIVED: `${BASE_URI}/api/Appointment/Appointment/PatientArrived`,
	START_CONSULTATION: `${BASE_URI}/api/Appointment/Appointment/StartConsultation`,
	END_CONSULTATION: `${BASE_URI}/api/Appointment/Appointment/EndConsultation`,

	CREATE_TASK: `${BASE_URI}/api/Appointment/Task/Create`,
	UPDATE_TASK: `${BASE_URI}/api/Appointment/Task/Update`,
	GET_USER_ASSIGNED_TASK: `${BASE_URI}/api/Appointment/Task/GetTaskLinkedByUserPagination`,

	CREATE_OT_ROOM_APPOINTMENT: `${BASE_URI}/api/Appointment/OperatingTheatreAppointment/Create`,
	GET_OT_APPOINTMENT_BY_DATE: `${BASE_URI}/api/Appointment/OperatingTheatreAppointment/GetOperationTheatreAppointmentPagination`,
	RESCHEDULE_OT_APPOINTMENT: `${BASE_URI}/api/Appointment/OperatingTheatreAppointment/Reschedule`,

	CREATE_DOCTOR_SLOT_BLOCK: `${BASE_URI}/api/MasterData/DoctorSlotBlock/Create`,
	UPDATE_DOCTOR_SLOT_BLOCK: `${BASE_URI}/api/MasterData/DoctorSlotBlock/Update`,
	DELETE_DOCTOR_SLOT_BLOCK: `${BASE_URI}/api/MasterData/DoctorSlotBlock/Delete`,
	GET_DOCTOR_SLOT_BLOCK: `${BASE_URI}/api/MasterData/DoctorSlotBlock/GetItemsPagination`,
	GET_APPOINTMENT_DOCTOR_SLOT_BLOCK: `${BASE_URI}/api/MasterData/DoctorSlotBlock/GetAppointmentDoctorSlotBlockPagination`,

	CREATE_OT_SLOT_BLOCK: `${BASE_URI}/api/MasterData/OperationTheatreSlotBlock/Create`,
	UPDATE_OT_SLOT_BLOCK: `${BASE_URI}/api/MasterData/OperationTheatreSlotBlock/Update`,
	DELETE_OT_SLOT_BLOCK: `${BASE_URI}/api/MasterData/OperationTheatreSlotBlock/Delete`,
	GET_OT_SLOT_BLOCK: `${BASE_URI}/api/MasterData/OperationTheatreSlotBlock/GetItemsPagination`,
	GET_APPOINTMENT_OT_SLOT_BLOCK: `${BASE_URI}/api/MasterData/OperationTheatreSlotBlock/GetOperationTheatreAppointmentSlotBlockPagination`,
	//Tax
	// GET_ITEM_CHARGE: `${BASE_URI}/api/MasterData/ItemCharge/GetItemsPagination`,

	// Master Requests
	...MASTER_API_ENDPOINTS,

	//ADT Module Requests
	CREATE_ADMISSION: `${BASE_URI}/api/ADT/Admission/Create`,
	UPDATE_ADMISSION: `${BASE_URI}/api/ADT/Admission/Update`,
	GET_ADMITTED_PATIENTS: `${BASE_URI}/api/ADT/Admission/GetAdmissionsPagination`,
	DISCHARGE_ADMITTED_PATIENT: `${BASE_URI}/api/ADT/Admission/DischargePatient`,

	PATIENT_BED_MOVEMENT: `${BASE_URI}/api/ADT/Admission/PatientBedMovement`,

	GET_PATIENT_FOR_ADMISSION_SEARCH: `${BASE_URI}/api/Registration/Patient/GetPatientsForAdmissionPagination`,
	GET_PATNER_BY_Patient_ID: `${BASE_URI}/api/Registration/Couple/GetLinkedCouplesByPatientPagination`,

	// Security Module Requests
	GET_USER_LOOKUPS: `${BASE_URI}/api/Identity/User/GetAllUserLookups`,
	CHANGE_PASSWORD: `${BASE_URI}/api/Identity/Auth/ChangePassword`,
	FORGOT_PASSWORD: `${BASE_URI}/api/Identity/Auth/ForgotPassword`,
	CHANGE_PASSWORD_BY_CODE: `${BASE_URI}/api/Identity/Auth/ChangePasswordByCode`,
	GET_ROLE_PERMISSION_BY_ROLE_ID: `${BASE_URI}/api/Identity/Role/GetRolePermissions`,
	UPDATE_ROLE_PERMISSION: `${BASE_URI}/api/Identity/Role/UpdateRolePermissions`,

	GET_MEDICAL_STAFF: `${BASE_URI}/api/MasterData/MedicalStaff/GetItemsPagination`,
	GET_MEDICAL_STAFF_BY_ID: `${BASE_URI}/api/MasterData/MedicalStaff/GetItemById`,
	CREATE_MEDICAL_STAFF: `${BASE_URI}/api/MasterData/MedicalStaff/Create`,
	UPDATE_MEDICAL_STAFF: `${BASE_URI}/api/MasterData/MedicalStaff/Update`,
	DELETE_MEDICAL_STAFF: `${BASE_URI}/api/MasterData/MedicalStaff/Delete`,

	// Billing & Lab Module Requests
	GET_BILLING_TEST_ORDER: `${BASE_URI}/api/Billing/TestOrderDetail/GetTestOrderDetailPagination`,
	UPDATE_SAMPLE_COLLECTION: `${BASE_URI}/api/Billing/TestOrderDetail/UpdateSampleCollection`,

	GET_BILLING_TEST_ORDER_DISPATCH: `${BASE_URI}/api/Billing/TestOrderDetail/GetTestOrderDetailDispatchPagination`,
	UPDATE_SAMPLE_DISPATCH: `${BASE_URI}/api/Billing/TestOrderDetail/UpdateDispatchSample`,

	GET_BILLING_TEST_ORDER_ACKNOWLEDGE: `${BASE_URI}/api/Billing/TestOrderDetail/GetTestOrderDetailForAcknowledgementPagination`,
	ACKNOWLEDGE_SAMPLE: `${BASE_URI}/api/Billing/TestOrderDetail/AcknowledgeSample`,

	GET_RESULT_ENTRY_BY_TEST_ORDER_DETAIL_ID: `${BASE_URI}/api/Billing/TestOrderDetail/GetResultEntryByTestOrderDetailId`,

	CHECK_OP_BILL_MAX_DISCOUNT: `${BASE_URI}/api/MasterData/DiscountAuthorityMatrix/GetMaxDiscountAmountPer`,

	SAVE_RESULT_ENTRY: `${BASE_URI}/api/Billing/TestOrderDetail/SaveTestResult`,
	SAVE_RELEASE_RESULT_ENTRY: `${BASE_URI}/api/Billing/TestOrderDetail/ReleaseReport`,
	AUTHORIZE_TEST_RESULT: `${BASE_URI}​/api/Billing/TestOrderDetail/AuthorizeTestResult`,
	RESAMPLING_RESULT: `${BASE_URI}/api/Billing/TestOrderDetail/ReSamplingTest`,

	// Billing Requests
	GET_ALL_BILLS: `${BASE_URI}/api/Billing/OutPatientBilling/GetOPBillsPagination`,
	CREATE_PACKAGE_BILL: `${BASE_URI}/api/Billing/InPatientPackageAllocation/Create`,
	UPDATE_PACKAGE_BILL: `${BASE_URI}/api/Billing/InPatientPackageAllocation/Update`,
	GET_PACKAGE_BILL: `${BASE_URI}/api/Billing/InPatientPackageAllocation/GetPackageAlocationPagination`,
	GET_PACKAGE_BILL_BY_ID: `${BASE_URI}/api/Billing/InPatientPackageAllocation/GetItemById`,
	GET_PACKAGE_DEPOSIT_BY_PATIENT_ID: `${BASE_URI}/api/Billing/InPatientPackageAllocation/GetPackageDepositByPatientId`,

	CREATE_OP_BILL: `${BASE_URI}/api/Billing/OutPatientBilling/CreateBill`,
	UPDATE_OP_BILL: `${BASE_URI}/api/Billing/OutPatientBilling/UpdateBill`,
	UPDATE_OP_BILL_STATUS: `${BASE_URI}/api/Billing/OutPatientBilling/UpdateBillStatus`,
	GET_OP_BILL_BY_BILL_ID: `${BASE_URI}/api/Billing/OutPatientBilling/GetPatientBillingByBillId`,
	GET_OP_BILLING_ITEM_PRICE: `${BASE_URI}/api/Billing/OutPatientBilling/GetItemPrice`,
	GET_BILLING_LOOKUP: `${BASE_URI}/api/Billing/OutPatientBilling/GetBillingLookups`,
	GET_OP_BILL_DETAIL_BY_PATIENT_ID: `${BASE_URI}/api/Registration/Patient/GetPatientByBilling`,
	SETTLE_CASH_OP_BILL: `${BASE_URI}/api/Billing/OutPatientBilling/SettlementBill`,
	REFUND_OP_BILL: `${BASE_URI}/api/Billing/OutPatientBillingRefund/Create`,
	CREATE_OP_DEPOSIT: `${BASE_URI}/api/Billing/OutPatientdeposit/CreateDeposit`,
	CREATE_OP_REFUND: `${BASE_URI}/api/Billing/OutPatientRefund/Create`,

	CREATE_PACKAGE_DEPOSIT: `${BASE_URI}/api/Billing/InPatientPackageDeposit/Create`,

	GET_PACKAGE_FOLIO_BY_PATIENT_ID: `${BASE_URI}/api/Billing/InPatientPackageFolio/GetPackageByPatientId`,

	CREATE_PACKAGE_FOLIO: `${BASE_URI}/api/Billing/InPatientPackageFolio/Create`,
	GET_FOLIO_SERVICE_AMOUNT: `${BASE_URI}/api/Billing/InPatientPackageFolio/GetFolioServiceAmount`,
	GET_FOLIO_DOCTOR_FEE: `${BASE_URI}/api/Billing/InPatientPackageFolio/GetFolioDoctorFee`,

	GET_OP_DEPOSIT_REFUND_LIST: `${BASE_URI}/api/Billing/OutPatientRefund/GetItemsPagination`,
	GET_OP_BILLING_REFUND_LIST: `${BASE_URI}/api/Billing/OutPatientBillingRefund/GetItemsPagination`,
	GET_IN_PATIENT_PACKAGE_CANCELLATION_LIST: `${BASE_URI}/api/Billing/InpatientPackageCancellation/GetItemsPagination`,

	CREATE_INPATIENT_PACKAGE_SETTLEMENT: `${BASE_URI}/api/Billing/InPatientPackageSettlement/Create`,
	GET_PACKAGE_SETTLEMENT_BY_PACKAGE_ID: `${BASE_URI}/api/Billing/InPatientPackageSettlement/GetItemById`,
	GET_PACKAGE_SETTLEMENT_BY_PATIENT_ID: `${BASE_URI}/api/Billing/InPatientPackageSettlement/GetPackageByPatientId`,

	GET_INPATIENT_REFUND_AMOUNT: `${BASE_URI}/api/Billing/InpatientPackageCancellation/GetRefundAmount`,
	CREATE_INPATIENT_PACKAGE_CANCELLATION: `${BASE_URI}/api/Billing/InpatientPackageCancellation/Create`,

	GET_ALL_REFUND_APPROVAL_LIST: `${BASE_URI}/api/RefundApproval/RefundApproval/GetItemsPagination`,
	UPDATE_REFUND_APPROVAL_REJECT: `${BASE_URI}/api/RefundApproval/RefundApproval/Update`,

	CREATE_BOOK_CONSUMPTION: `${BASE_URI}/api/Billing/InPatientPharmacy/BookConsumption`,
	//
	GET_BATCH_STORE: `${BASE_URI}/api/Inventory/BatchStore/GetItemsPagination`,
	GET_DRUG_BATCH_STORE: `${BASE_URI}/api/Inventory/BatchStore/GetDrugItemsPagination`,
	GET_CONSUMABLE_BATCH_STORE: `${BASE_URI}/api/Inventory/BatchStore/GetConsumableItemsPagination`,

	// Clinical Module Requests
	...CLINICAL_API_ENDPOINTS,
};
