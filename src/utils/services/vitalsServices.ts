import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any
}

export const vitalsServices = {
  createVital: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_VITAL, body),
  updateVital: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_VITAL, body),
  deleteVital: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_VITAL, { params }),
  getVitalById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_VITAl_BY_ID, { params }),

 
  getVitalLookUp: (): AxiosPromise => axios.get(API_ENDPOINTS.GET_VITAL_LOOK_UP),

  getAllVital: ({ patientId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_VITAL+ `?patientId=${patientId}`, body),
}