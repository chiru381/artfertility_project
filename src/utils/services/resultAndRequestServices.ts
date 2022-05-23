import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any
}

export const requestAndResultServices = {
  createFirstUltrasoundGeneral: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_FIRST_ULTRASOUND_GENERAL, body),
  updateFirstUltrasoundGeneral: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_FIRST_ULTRASOUND_GENERAL, body),
  deleteFirstUltrasoundGeneral: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_FIRST_ULTRASOUND_GENERAL, { params }),
  getFirstUltrasoundGeneralById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_FIRST_ULTRASOUND_GENERAL_BY_ID, { params }),
  getAllFirstUltrasoundGeneral: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_FIRST_ULTRASOUND_GENERAL, body),

  getPatientUltrasoundSummary: ({ patientId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ULTRASOUND_REQEUST_BY_PATIENT_ID + `?patientId=${patientId}`, body),

  createUltrasoundRequest: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ULTRASOUND_REQUEST, body),
  updateUltrasoundRequest: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ULTRASOUND_REQUEST, body),
  getUltrasoundRequestById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_ULTRASOUND_REQUEST_BY_ID, { params }),
  deleteUltrasoundRequest: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ULTRASOUND_REQUEST, { params }),

  createUltrasoundGeneral: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ULTRASOUND_GENERAL, body),
  updateUltrasoundGeneral: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ULTRASOUND_GENERAL, body),
  getUltrasoundGeneralById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_ULTRASOUND_GENERAL_BY_ID, { params }),
  deleteUltrasoundGeneral: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ULTRASOUND_GENERAL, { params }),

  createUltrasoundGeneralDocument: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ULTRASOUND_GENERAL_DOCUMENT, body),

  getPatientBloodLabSummary: ({ patientId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BLOOD_LAB_BY_PATIENT_ID + `?patientId=${patientId}`, body),
  deleteBloodLabRequest: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_BLOOD_LAB_REQEUST, { params }),
  createBloodLabRequest: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_BLOOD_LAB_REQEUST, body),
  GetResultEntryByInvestigationRequestId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_RESULT_ENTRY_BY_REQUEST_ID, { params }),
  getAllUltrasoundGeneralLookup: (): AxiosPromise => axios.get(API_ENDPOINTS.GET_ULTRASOUND_GENERAL_LOOKUPS),
}