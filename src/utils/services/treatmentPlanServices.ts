import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any
}

export const treatmentPlanServices = {
  createTreatmentProcess: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TREATMENT_PROCESS, body),
  getAllTreatmentProcess: ({ patientId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TREATMENT_PROCESS + `?patientId=${patientId}`, body),
  getTreatmentPlanLookup: (): AxiosPromise => axios.get(API_ENDPOINTS.GET_TREATMENT_PLAN_LOOKUP),

  getAllIndication: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TREATMENT_INDICATION, body),
  getAllDiagnosis: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TREATMENT_DIAGNOSIS, body),

  createPlannedCoitus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PLANNED_COITUS, body),
  updatePlannedCoitus: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PLANNED_COITUS, body),
  getPlannedCoitusById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_PLANNED_COITUS_BY_ID, { params }),

  createIntraUterineInsemination: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_INTRA_UTERINE_INSEMINATION, body),
  updateIntraUterineInsemination: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_INTRA_UTERINE_INSEMINATION, body),
  getIntraUterineInseminationById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_INTRA_UTERINE_INSEMINATION_BY_ID, { params }),

  createOocyteVitrification: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_OOCYTE_VITRIFICATION, body),
  updateOocyteVitrification: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_OOCYTE_VITRIFICATION, body),
  getOocyteVitrificationById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_OOCYTE_VITRIFICATION_BY_ID, { params }),

  createInVitroFertilization: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_INVITRO_FERTILIZATION, body),
  updateInVitroFertilization: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_INVITRO_FERTILIZATION, body),
  getInVitroFertilizationById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_INVITRO_FERTILIZATION_BY_ID, { params }),

  createThawEmbryoTransfer: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_THAW_EMBRYO_TRANSFER, body),
  updateThawEmbryoTransfer: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_THAW_EMBRYO_TRANSFER, body),
  getThawEmbryoTransferById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_THAW_EMBRYO_TRANSFER_BY_ID, { params }),

  createEvaluationCycle: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_EVALUATION_CYCLE, body),
  updateEvaluationCycle: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_EVALUATION_CYCLE, body),
  getEvaluationCycleById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_EVALUATION_CYCLE_BY_ID, { params }),


  // Stimulation Services
  cancelStimulationSheet: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.CANCEL_STIMULATION_SHEET, body),
  createStimulationEra: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_STIMULATION_ERA, body),
  updateStimulationEra: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_STIMULATION_ERA, body),
  getStimulationLookup: (): AxiosPromise => axios.get(API_ENDPOINTS.GET_STIMULATION_LOOKUP),

  // IVF Lab Services
  getAllIVFLabAndrologyLabRequest: ({ patientId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_IVF_LAB_ANDROLOFY_LAB_REQUEST, body),
}