import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any
}

export const prescriptionServices = {
  createPrescription: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PRESCRIPTION, body),
  updatePrescription: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PRESCRIPTION, body),
 
  deletePrescription: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PRESCRIPTION, { params }),
  getPrescriptionById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS. GET_PRESCRIPTION_GET_ITEMS, { params }),

  getPatientPrescriptionById: (params: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PATIENT_PRESCRIPTION_BY_ID, params.body, { params: params.params }),
  getPrescriptionLookUp: (): AxiosPromise => axios.get(API_ENDPOINTS.GET_PRESCRIPTION_LOOK_UP),

  getAllPrescriptionProcess: ({ patientId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PRESCRIPTION+ `?patientId=${patientId}`, body),


}