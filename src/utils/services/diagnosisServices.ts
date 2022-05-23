import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any
}

export const diagnosisServices = {
  createDiagnosis: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DIAGNOSIS, body),
  updateDiagnosis: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DIAGNOSIS, body),
  deleteDiagnosis: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DIAGNOSIS, { params }),
  getDiagnosisById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_DIAGNOSIS_BY_ID, { params }),
  
  getDiagnosis: ({ patientId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DIAGNOSIS+ `?patientId=${patientId}`, body),
 
}