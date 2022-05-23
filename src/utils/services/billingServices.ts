import axios, { AxiosPromise } from "axios";
import { ParamsState } from "utils/types";
import { API_ENDPOINTS } from "redux/apiEndPoints";

export const billingServices = {
  getAllBills: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ALL_BILLS, body),
  createPackageBill: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PACKAGE_BILL, body),
  updatePackageBill: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PACKAGE_BILL, body),
  getPackageBill: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PACKAGE_BILL, body),
  getPackageBillById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_PACKAGE_BILL_BY_ID, { params }),
  getPackageDepositByPatientId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_PACKAGE_DEPOSIT_BY_PATIENT_ID, { params }),
  createPackageDeposit: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PACKAGE_DEPOSIT, body),

  checkOPBillMaxDiscount: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.CHECK_OP_BILL_MAX_DISCOUNT, { params }),

  createOPBill: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_OP_BILL, body),
  updateOPBill: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_OP_BILL, body),
  updateOPBillStatus: ({ EncounterEndTypeId, Flag, OutPatientBillId }: ParamsState): AxiosPromise => axios.put(`${API_ENDPOINTS.UPDATE_OP_BILL_STATUS}?OutPatientBillId=${OutPatientBillId}&Flag=${Flag}&EncounterEndTypeId=${EncounterEndTypeId}`),
  getOPBillByBillId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_OP_BILL_BY_BILL_ID, { params }),
  getOPBillingItemPrice: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OP_BILLING_ITEM_PRICE, body),
  getOPBillDetailByPatientId: (params: ParamsState): AxiosPromise => axios.post(`${API_ENDPOINTS.GET_OP_BILL_DETAIL_BY_PATIENT_ID}?patientId=${params.patientId}`, {}),
  getBillingLookup: (): AxiosPromise => axios.get(API_ENDPOINTS.GET_BILLING_LOOKUP),
  settleCashOPBill: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.SETTLE_CASH_OP_BILL, body),
  refundOPBill: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.REFUND_OP_BILL, body),
  createOPDeposit: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_OP_DEPOSIT, body),
  createOPRefund: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_OP_REFUND, body),

  createPackageFolio: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PACKAGE_FOLIO, body),
  getPackageFolioByPatientId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_PACKAGE_FOLIO_BY_PATIENT_ID, { params }),
  getPackageFolioServiceAmount: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_FOLIO_SERVICE_AMOUNT, body),
  getPackageFolioDoctorFee: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_FOLIO_DOCTOR_FEE, body),

  createInPatientPackageSettlement: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_INPATIENT_PACKAGE_SETTLEMENT, body),
  getPackageSettlementByPackageId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_PACKAGE_SETTLEMENT_BY_PACKAGE_ID, { params }),
  getPackageSettlementByPatientId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_PACKAGE_SETTLEMENT_BY_PATIENT_ID, { params }),

  getOPDepositRefundList: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OP_DEPOSIT_REFUND_LIST, body),
  getOPBillingRefundList: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OP_BILLING_REFUND_LIST, body),
  getInPatientPackageCancellationList: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_IN_PATIENT_PACKAGE_CANCELLATION_LIST, body),

  getInPatientRefundAmount: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_INPATIENT_REFUND_AMOUNT, { params }),
  createInPatientPackageCancellation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_INPATIENT_PACKAGE_CANCELLATION, body),

  updateRefundApprovalReject: ({ refundType, refundFlag, refundId, remarks }: ParamsState): AxiosPromise => axios.put(`${API_ENDPOINTS.UPDATE_REFUND_APPROVAL_REJECT}?RefundType=${refundType}&RequestId=${refundId}&ApproverRemarks=${remarks}&Flag=${refundFlag}`),
  getALLRefundApprovalList: ({ refundType, ...body }: ParamsState): AxiosPromise => axios.post(`${API_ENDPOINTS.GET_ALL_REFUND_APPROVAL_LIST}?RefundType=${refundType}`, body),

  createBookConsumption: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_BOOK_CONSUMPTION, body),

}