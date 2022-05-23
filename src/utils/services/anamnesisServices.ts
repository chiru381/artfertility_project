import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any
}

export const anamneesisServices = {
  createClinicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CLINICAL_HISTORY, body),
  updateClinicalHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CLINICAL_HISTORY, body),
  deleteClinicalHistory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CLINICAL_HISTORY, { params }),
  getClinicalHistoryById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_CLINICAL_HISTORY_BY_ID, { params }),
  getAllClinicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CLINICAL_HISTORY, body),

  createFamilyHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_FAMILY_HISTORY, body),
  updateFamilyHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_FAMILY_HISTORY, body),
  deleteFamilyHistory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_FAMILY_HISTORY, { params }),
  getFamilyHistoryById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_FAMILY_HISTORY_BY_ID, { params }),
  getAllFamilyHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_FAMILY_HISTORY, body),

  createSurgicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SURGICAL_HISTORY, body),
  updateSurgicalHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SURGICAL_HISTORY, body),
  deleteSurgicalHistory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SURGICAL_HISTORY, { params }),
  getSurgicalHistoryById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_SURGICAL_HISTORY_BY_ID, { params }),
  getAllSurgicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SURGICAL_HISTORY, body),

  upsertObstetricHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPSERT_OBSTETRIC_HISTORY, body),
  createObstetricHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_OBSTETRIC_HISTORY, body),
  updateObstetricHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_OBSTETRIC_HISTORY, body),
  deleteObstetricHistory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_OBSTETRIC_HISTORY, { params }),
  deleteObstetricHistoryItem: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_OBSTETRIC_HISTORY_ITEM, { params }),
  getObstetricHistoryById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_OBSTETRIC_HISTORY_BY_ID, { params }),
  getAllObstetricHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OBSTETRIC_HISTORY, body),

  createMedicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MEDICAL_HISTORY, body),
  updateMedicalHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MEDICAL_HISTORY, body),
  deleteMedicalHistory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MEDICAL_HISTORY, { params }),
  getMedicalHistoryById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_MEDICAL_HISTORY_BY_ID, { params }),
  getAllMedicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MEDICAL_HISTORY, body),

  createMedicationHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MEDICATION_HISTORY, body),
  updateMedicationHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MEDICATION_HISTORY, body),
  deleteMedicationHistory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MEDICATION_HISTORY, { params }),
  getMedicationHistoryById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_MEDICATION_HISTORY_BY_ID, { params }),
  getAllMedicationHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MEDICATION_HISTORY, body),

  /// Previous examination
  createComplimentoryTest: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_COMPLIMENTARY_TEST, body),
  updateComplimentoryTest: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_COMPLIMENTARY_TEST, body),
  deleteComplimentoryTest: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_COMPLIMENTARY_TEST, { params }),
  getComplimentoryTestByTestId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_COMPLIMENTARY_TEST_BY_TEST_ID, { params }),
  getAllComplimentoryTest: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_COMPLIMENTARY_TEST, body),

  createHormoneDetermination: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_HORMONE_DETERMINATION, body),
  updateHormoneDetermination: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_HORMONE_DETERMINATION, body),
  deleteHormoneDetermination: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_HORMONE_DETERMINATION, { params }),
  getHormoneDeterminationById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_HORMONE_DETERMINATION_BY_ID, { params }),
  getAllHormoneDetermination: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_HORMONE_DETERMINATION, body),

  createComplimentoryAnalytic: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_COMPLIMENTARY_ANALYTIC, body),
  updateComplimentoryAnalytic: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_COMPLIMENTARY_ANALYTIC, body),
  deleteComplimentoryAnalytic: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_COMPLIMENTARY_ANALYTIC, { params }),
  getComplimentoryAnalyticByAnalyticId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_COMPLIMENTARY_ANALYTIC_BY_ANALYTIC_ID, { params }),
  getAllComplimentoryAnalytic: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_COMPLIMENTARY_ANALYTIC, body),

  createGeneticTest: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_GENETIC_TEST, body),
  updateGeneticTest: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_GENETIC_TEST, body),
  deleteGeneticTest: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_GENETIC_TEST, { params }),
  getGeneticTestByTestId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_GENETIC_TEST_BY_ID, { params }),
  getAllGeneticTest: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_GENETIC_TEST, body),

  /// Previous Treatment
  createPreviousTreatment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PREVIOUS_TREATMENT, body),
  upsertPreviousTreatment: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPSERT_PREVIOUS_TREATMENT, body),
  updatePreviousTreatment: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PREVIOUS_TREATMENT, body),
  deletePreviousTreatment: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PREVIOUS_TREATMENT, { params }),
  getPreviousTreatmentById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_PREVIOUS_TREATMENT_BY_ID, { params }),
  getAllPreviousTreatment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PREVIOUS_TREATMENT, body),

  // Male Assessment
  createPreviousExaminationOfTheMan: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PREVIOUS_EXAMINATION_OF_THE_MAN, body),
  updatePreviousExaminationOfTheMan: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PREVIOUS_EXAMINATION_OF_THE_MAN, body),
  deletePreviousExaminationOfTheMan: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PREVIOUS_EXAMINATION_OF_THE_MAN, { params }),
  getPreviousExaminationOfTheManById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_PREVIOUS_EXAMINATION_OF_THE_MAN_BY_ID, { params }),
  getAllPreviousExaminationOfTheMan: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PREVIOUS_EXAMINATION_OF_THE_MAN, body),

  createCurrentExaminationOfTheMan: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CURRENT_EXAMINATION_OF_THE_MAN, body),
  updateCurrentExaminationOfTheMan: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CURRENT_EXAMINATION_OF_THE_MAN, body),
  deleteCurrentExaminationOfTheMan: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CURRENT_EXAMINATION_OF_THE_MAN, { params }),
  getCurrentExaminationOfTheManById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_CURRENT_EXAMINATION_OF_THE_MAN_BY_ID, { params }),
  getAllCurrentExaminationOfTheMan: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CURRENT_EXAMINATION_OF_THE_MAN, body),

  createManMedicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MAN_MEDICAL_HISTORY, body),
  updateManMedicalHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MAN_MEDICAL_HISTORY, body),
  deleteManMedicalHistory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MAN_MEDICAL_HISTORY, { params }),
  getManMedicalHistoryById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_MAN_MEDICAL_HISTORY_BY_ID, { params }),
  getAllManMedicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MAN_MEDICAL_HISTORY, body),

  createManMedicationHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MAN_MEDICATION_HISTORY, body),
  updateManMedicationHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MAN_MEDICATION_HISTORY, body),
  deleteManMedicationHistory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MAN_MEDICATION_HISTORY, { params }),
  getManMedicationHistoryById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_MAN_MEDICATION_HISTORY_BY_ID, { params }),
  getAllManMedicationHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MAN_MEDICATION_HISTORY, body),

  createManSurgicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MAN_SURGICAL_HISTORY, body),
  updateManSurgicalHistory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MAN_SURGICAL_HISTORY, body),
  deleteManSurgicalHistory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MAN_SURGICAL_HISTORY, { params }),
  getManSurgicalHistoryById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_MAN_SURGICAL_HISTORY_BY_ID, { params }),
  getAllManSurgicalHistory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MAN_SURGICAL_HISTORY, body),

  /// Woman Assessment
  createGeneralGynecologicalExamination: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_GENERAL_GYNECOLOGICAL_EXAMINATION, body),
  updateGeneralGynecologicalExamination: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_GENERAL_GYNECOLOGICAL_EXAMINATION, body),
  deleteGeneralGynecologicalExamination: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_GENERAL_GYNECOLOGICAL_EXAMINATION, { params }),
  getGeneralGynecologicalExaminationById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_GENERAL_GYNECOLOGICAL_EXAMINATION_BY_ID, { params }),
  getAllGeneralGynecologicalExamination: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_GENERAL_GYNECOLOGICAL_EXAMINATION, body),
  
}