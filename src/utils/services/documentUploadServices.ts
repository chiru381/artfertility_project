import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any
}

export const documentUploadServices = {
  createDocumentUpload: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CLINICAL_DOCUMENT_UPLOAD, body),
  updateDocumentUpload: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CLINICAL_DOCUMENT_UPLOAD, body),
  deleteDocumentUpload: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CLINICAL_DOCUMENT_UPLOAD, { params }),
  getDocumentUploadById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_CLINICAL_DOCUMENT_UPLOAD_BY_ID, { params }),
  
  getDocumentUpload: ({ patientId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CLINICAL_DOCUMENT_UPLOAD+ `?patientId=${patientId}`, body),
 
}