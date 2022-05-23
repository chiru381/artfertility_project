import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
    [key: string]: any
}

export const adtServices = {
    createAdmission: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ADMISSION, body),
    updateAdmission: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ADMISSION, body),
    getAllAdmittedPatients: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ADMITTED_PATIENTS, body),
    
    dischargeAdmittedPatient: (params: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.DISCHARGE_ADMITTED_PATIENT, null, { params }),
    patientBedMovement: (params: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.PATIENT_BED_MOVEMENT, null, { params }),

    getAllPatientForAdmissionSearch: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PATIENT_FOR_ADMISSION_SEARCH, body),
    getPartnerByPatientId: (params: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PATNER_BY_Patient_ID, params.body, { params: params.params }),
}