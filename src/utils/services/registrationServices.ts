import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
    [key: string]: any
}

export const registrationServices = {
    getAllCouple: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_COUPLE, body),
    getAllPatients: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PATIENT, body),
    getAllWife: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_WIFE, body),
    getAllWifeWithPartner: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_WIFE_WITH_PARTNER, body),
    getPatientById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_PATIENT_BY_ID, { params }),
    getPatientWithPartnerById: (params: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PATIENT_WITH_PARTNER_BY_ID + `?patientId=${params.patientId}`),
    getAllPatinetLookup: (): AxiosPromise => axios.get(API_ENDPOINTS.GET_PATIENT_LOOKUPS),
    createPatient: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PATIENT, body),
    updatePatient: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PATIENT, body),
    createPartner: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PARTNER, body),
    delinkCouple: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DE_LINK_COUPLE, { params }),

    getAllDonor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DONOR, body),
    createDonor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DONOR, body),
    updateDonor: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DONOR, body),
    getDonorById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_DONOR_BY_ID, { params }),
    deleteDonor: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DONOR, { params }),
}