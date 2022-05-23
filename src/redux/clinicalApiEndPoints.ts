export const BASE_URI = process.env.REACT_APP_BASE_URI;

export const CLINICAL_API_ENDPOINTS = {
  // Anamnesis Requests 
  CREATE_CLINICAL_HISTORY: `${BASE_URI}/api/Infertility/Clinicalhistory/Create`,
  UPDATE_CLINICAL_HISTORY: `${BASE_URI}/api/Infertility/Clinicalhistory/Update`,
  GET_CLINICAL_HISTORY_BY_ID: `${BASE_URI}/api/Infertility/Clinicalhistory/GetItemById`,
  GET_CLINICAL_HISTORY: `${BASE_URI}/api/Infertility/Clinicalhistory/GetItemsPagination`,
  DELETE_CLINICAL_HISTORY: `${BASE_URI}/api/Infertility/Clinicalhistory/Delete`,

  CREATE_FAMILY_HISTORY: `${BASE_URI}/api/Infertility/Familyhistory/Create`,
  UPDATE_FAMILY_HISTORY: `${BASE_URI}/api/Infertility/Familyhistory/Update`,
  GET_FAMILY_HISTORY_BY_ID: `${BASE_URI}/api/Infertility/Familyhistory/GetItemById`,
  GET_FAMILY_HISTORY: `${BASE_URI}/api/Infertility/Familyhistory/GetItemsPagination`,
  DELETE_FAMILY_HISTORY: `${BASE_URI}/api/Infertility/Familyhistory/Delete`,

  CREATE_SURGICAL_HISTORY: `${BASE_URI}/api/Infertility/SurgicalHistory/Create`,
  UPDATE_SURGICAL_HISTORY: `${BASE_URI}/api/Infertility/SurgicalHistory/Update`,
  GET_SURGICAL_HISTORY_BY_ID: `${BASE_URI}/api/Infertility/SurgicalHistory/GetItemById`,
  GET_SURGICAL_HISTORY: `${BASE_URI}/api/Infertility/SurgicalHistory/GetItemsPagination`,
  DELETE_SURGICAL_HISTORY: `${BASE_URI}/api/Infertility/SurgicalHistory/Delete`,

  UPSERT_OBSTETRIC_HISTORY: `${BASE_URI}/api/Infertility/ObstetricHistory/Upsert`,
  CREATE_OBSTETRIC_HISTORY: `${BASE_URI}/api/Infertility/ObstetricHistory/Create`,
  UPDATE_OBSTETRIC_HISTORY: `${BASE_URI}/api/Infertility/ObstetricHistory/Update`,
  GET_OBSTETRIC_HISTORY_BY_ID: `${BASE_URI}/api/Infertility/ObstetricHistory/GetItemById`,
  GET_OBSTETRIC_HISTORY: `${BASE_URI}/api/Infertility/ObstetricHistory/GetItemsPagination`,
  DELETE_OBSTETRIC_HISTORY: `${BASE_URI}/api/Infertility/ObstetricHistory/Delete`,
  DELETE_OBSTETRIC_HISTORY_ITEM: `${BASE_URI}/api/Infertility/ObstetricHistory/DeleteObstetricHistoryItem`,

  CREATE_MEDICAL_HISTORY: `${BASE_URI}/api/Infertility/GynecologicalHistory/Create`,
  UPDATE_MEDICAL_HISTORY: `${BASE_URI}/api/Infertility/GynecologicalHistory/Update`,
  GET_MEDICAL_HISTORY_BY_ID: `${BASE_URI}/api/Infertility/GynecologicalHistory/GetItemById`,
  GET_MEDICAL_HISTORY: `${BASE_URI}/api/Infertility/GynecologicalHistory/GetItemsPagination`,
  DELETE_MEDICAL_HISTORY: `${BASE_URI}/api/Infertility/GynecologicalHistory/Delete`,

  CREATE_MEDICATION_HISTORY: `${BASE_URI}/api/Infertility/MedicationHistory/Create`,
  UPDATE_MEDICATION_HISTORY: `${BASE_URI}/api/Infertility/MedicationHistory/Update`,
  GET_MEDICATION_HISTORY_BY_ID: `${BASE_URI}/api/Infertility/MedicationHistory/GetItemById`,
  GET_MEDICATION_HISTORY: `${BASE_URI}/api/Infertility/MedicationHistory/GetItemsPagination`,
  DELETE_MEDICATION_HISTORY: `${BASE_URI}/api/Infertility/MedicationHistory/Delete`,

  CREATE_COMPLIMENTARY_TEST: `${BASE_URI}/api/Infertility/ComplimentaryTest/Create`,
  UPDATE_COMPLIMENTARY_TEST: `${BASE_URI}/api/Infertility/ComplimentaryTest/Update`,
  GET_COMPLIMENTARY_TEST_BY_TEST_ID: `${BASE_URI}/api/Infertility/ComplimentaryTest/GetItemById`,
  GET_COMPLIMENTARY_TEST: `${BASE_URI}/api/Infertility/ComplimentaryTest/GetItemsPagination`,
  DELETE_COMPLIMENTARY_TEST: `${BASE_URI}/api/Infertility/ComplimentaryTest/Delete`,

  CREATE_HORMONE_DETERMINATION: `${BASE_URI}/api/Infertility/HormoneDetermination/Create`,
  UPDATE_HORMONE_DETERMINATION: `${BASE_URI}/api/Infertility/HormoneDetermination/Update`,
  GET_HORMONE_DETERMINATION_BY_ID: `${BASE_URI}/api/Infertility/HormoneDetermination/GetItemById`,
  GET_HORMONE_DETERMINATION: `${BASE_URI}/api/Infertility/HormoneDetermination/GetItemsPagination`,
  DELETE_HORMONE_DETERMINATION: `${BASE_URI}/api/Infertility/HormoneDetermination/Delete`,

  CREATE_PREVIOUS_TREATMENT: `${BASE_URI}/api/Infertility/PreviousTreatment/Create`,
  UPSERT_PREVIOUS_TREATMENT: `${BASE_URI}/api/Infertility/PreviousTreatment/Upsert`,
  UPDATE_PREVIOUS_TREATMENT: `${BASE_URI}/api/Infertility/PreviousTreatment/Update`,
  GET_PREVIOUS_TREATMENT_BY_ID: `${BASE_URI}/api/Infertility/PreviousTreatment/GetItemById`,
  GET_PREVIOUS_TREATMENT: `${BASE_URI}/api/Infertility/PreviousTreatment/GetItemsPagination`,
  DELETE_PREVIOUS_TREATMENT: `${BASE_URI}/api/Infertility/PreviousTreatment/Delete`,

  CREATE_CURRENT_EXAMINATION_OF_THE_MAN: `${BASE_URI}/api/ManHealthUnit/CurrentExaminationOfTheMan/Create`,
  UPDATE_CURRENT_EXAMINATION_OF_THE_MAN: `${BASE_URI}/api/ManHealthUnit/CurrentExaminationOfTheMan/Update`,
  GET_CURRENT_EXAMINATION_OF_THE_MAN_BY_ID: `${BASE_URI}/api/ManHealthUnit/CurrentExaminationOfTheMan/GetItemById`,
  GET_CURRENT_EXAMINATION_OF_THE_MAN: `${BASE_URI}/api/ManHealthUnit/CurrentExaminationOfTheMan/GetItemsPagination`,
  DELETE_CURRENT_EXAMINATION_OF_THE_MAN: `${BASE_URI}/api/ManHealthUnit/CurrentExaminationOfTheMan/Delete`,

  CREATE_COMPLIMENTARY_ANALYTIC: `${BASE_URI}/api/Infertility/ComplementaryAnalytic/Create`,
  UPDATE_COMPLIMENTARY_ANALYTIC: `${BASE_URI}/api/Infertility/ComplementaryAnalytic/Update`,
  GET_COMPLIMENTARY_ANALYTIC_BY_ANALYTIC_ID: `${BASE_URI}/api/Infertility/ComplementaryAnalytic/GetItemById`,
  GET_COMPLIMENTARY_ANALYTIC: `${BASE_URI}/api/Infertility/ComplementaryAnalytic/GetItemsPagination`,
  DELETE_COMPLIMENTARY_ANALYTIC: `${BASE_URI}/api/Infertility/ComplementaryAnalytic/Delete`,

  CREATE_GENERAL_GYNECOLOGICAL_EXAMINATION: `${BASE_URI}/api/Infertility/GeneralGynecologicalExamination/Create`,
  UPDATE_GENERAL_GYNECOLOGICAL_EXAMINATION: `${BASE_URI}/api/Infertility/GeneralGynecologicalExamination/Update`,
  GET_GENERAL_GYNECOLOGICAL_EXAMINATION_BY_ID: `${BASE_URI}/api/Infertility/GeneralGynecologicalExamination/GetItemById`,
  GET_GENERAL_GYNECOLOGICAL_EXAMINATION: `${BASE_URI}/api/Infertility/GeneralGynecologicalExamination/GetItemsPagination`,
  DELETE_GENERAL_GYNECOLOGICAL_EXAMINATION: `${BASE_URI}/api/Infertility/GeneralGynecologicalExamination/Delete`,

  CREATE_FIRST_ULTRASOUND_GENERAL: `${BASE_URI}/api/Infertility/UltrasoundGeneral/Create`,
  UPDATE_FIRST_ULTRASOUND_GENERAL: `${BASE_URI}/api/Infertility/UltrasoundGeneral/Update`,
  GET_FIRST_ULTRASOUND_GENERAL_BY_ID: `${BASE_URI}/api/Infertility/UltrasoundGeneral/GetItemById`,
  GET_FIRST_ULTRASOUND_GENERAL: `${BASE_URI}/api/Infertility/UltrasoundGeneral/GetItemsPagination`,
  DELETE_FIRST_ULTRASOUND_GENERAL: `${BASE_URI}/api/Infertility/UltrasoundGeneral/Delete`,
  GET_ULTRASOUND_REQEUST_BY_PATIENT_ID: `${BASE_URI}/api/Infertility/UltrasoundRequest/GetPatientUltrasoundRequestPagination`,

  CREATE_PREVIOUS_EXAMINATION_OF_THE_MAN: `${BASE_URI}/api/ManHealthUnit/PreviousExaminationoftheMan/Create`,
  UPDATE_PREVIOUS_EXAMINATION_OF_THE_MAN: `${BASE_URI}/api/ManHealthUnit/PreviousExaminationoftheMan/Update`,
  GET_PREVIOUS_EXAMINATION_OF_THE_MAN_BY_ID: `${BASE_URI}/api/ManHealthUnit/PreviousExaminationoftheMan/GetItemById`,
  GET_PREVIOUS_EXAMINATION_OF_THE_MAN: `${BASE_URI}/api/ManHealthUnit/PreviousExaminationoftheMan/GetItemsPagination`,
  DELETE_PREVIOUS_EXAMINATION_OF_THE_MAN: `${BASE_URI}/api/ManHealthUnit/PreviousExaminationoftheMan/Delete`,

  CREATE_MAN_MEDICAL_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManMedicalHistory/Create`,
  UPDATE_MAN_MEDICAL_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManMedicalHistory/Update`,
  GET_MAN_MEDICAL_HISTORY_BY_ID: `${BASE_URI}/api/ManHealthUnit/ManMedicalHistory/GetItemById`,
  GET_MAN_MEDICAL_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManMedicalHistory/GetItemsPagination`,
  DELETE_MAN_MEDICAL_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManMedicalHistory/Delete`,

  CREATE_MAN_MEDICATION_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManMedicationHistory/Create`,
  UPDATE_MAN_MEDICATION_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManMedicationHistory/Update`,
  GET_MAN_MEDICATION_HISTORY_BY_ID: `${BASE_URI}/api/ManHealthUnit/ManMedicationHistory/GetItemById`,
  GET_MAN_MEDICATION_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManMedicationHistory/GetItemsPagination`,
  DELETE_MAN_MEDICATION_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManMedicationHistory/Delete`,

  CREATE_MAN_SURGICAL_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManSurgicalHistory/Create`,
  UPDATE_MAN_SURGICAL_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManSurgicalHistory/Update`,
  GET_MAN_SURGICAL_HISTORY_BY_ID: `${BASE_URI}/api/ManHealthUnit/ManSurgicalHistory/GetItemById`,
  GET_MAN_SURGICAL_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManSurgicalHistory/GetItemsPagination`,
  DELETE_MAN_SURGICAL_HISTORY: `${BASE_URI}/api/ManHealthUnit/ManSurgicalHistory/Delete`,

  CREATE_GENETIC_TEST: `${BASE_URI}/api/Infertility/GeneticTest/Create`,
  UPDATE_GENETIC_TEST: `${BASE_URI}/api/Infertility/GeneticTest/Update`,
  GET_GENETIC_TEST_BY_ID: `${BASE_URI}/api/Infertility/GeneticTest/GetItemById`,
  GET_GENETIC_TEST: `${BASE_URI}/api/Infertility/GeneticTest/GetItemsPagination`,
  DELETE_GENETIC_TEST: `${BASE_URI}/api/Infertility/GeneticTest/Delete`,

  CREATE_ULTRASOUND_GENERAL: `${BASE_URI}/api/Infertility/UltrasoundGeneral/Create`,
  UPDATE_ULTRASOUND_GENERAL: `${BASE_URI}/api/Infertility/UltrasoundGeneral/Update`,
  GET_ULTRASOUND_GENERAL_BY_ID: `${BASE_URI}/api/Infertility/UltrasoundGeneral/GetItemById`,
  GET_ULTRASOUND_GENERAL: `${BASE_URI}/api/Infertility/UltrasoundGeneral/GetItemsPagination`,
  DELETE_ULTRASOUND_GENERAL: `${BASE_URI}/api/Infertility/UltrasoundGeneral/Delete`,
  GET_ULTRASOUND_GENERAL_BY_PATIENT_ID: `${BASE_URI}/api/Infertility/UltrasoundGeneral/GetPatientUltrasoundGeneralPagination`,

  //vital
  CREATE_VITAL: `${BASE_URI}/api/Vitals/VitalCapturing/Create`,
  UPDATE_VITAL: `${BASE_URI}/api/Vitals/VitalCapturing/Update`,
  GET_VITAl_BY_ID: `${BASE_URI}/api/Vitals/VitalCapturing/GetItemById`,
  GET_PATIENT_VITAL_BY_ID: `${BASE_URI}/api/Vitals/VitalCapturing/GetPatientUltrasoundGeneralPagination`,
  DELETE_VITAL: `${BASE_URI}/api/Vitals/VitalCapturing/Delete`,
  GET_VITAL_LOOK_UP: `${BASE_URI}/api/Vitals/VitalCapturing/GetAllVitalCapturingLookups`,




  // Treatment Plan
  CREATE_TREATMENT_PROCESS: `${BASE_URI}/api/Treatments/TreatmentProcess/Create`,
  GET_TREATMENT_PROCESS: `${BASE_URI}/api/Treatments/TreatmentProcess/GetItemsPaginationbyPatient`,
  GET_TREATMENT_PLAN_LOOKUP: `${BASE_URI}/api/Treatments/TreatmentProcess/GetAllTreatmentLookups`,

  CREATE_PLANNED_COITUS: `${BASE_URI}/api/Treatments/PlannedCoitusTimedIntercourse/Create`,
  UPDATE_PLANNED_COITUS: `${BASE_URI}/api/Treatments/PlannedCoitusTimedIntercourse/Update`,
  GET_PLANNED_COITUS_BY_ID: `${BASE_URI}/api/Treatments/PlannedCoitusTimedIntercourse/GetItemById`,

  CREATE_INTRA_UTERINE_INSEMINATION: `${BASE_URI}/api/Treatments/IntraUterineInsemination/Create`,
  UPDATE_INTRA_UTERINE_INSEMINATION: `${BASE_URI}/api/Treatments/IntraUterineInsemination/Update`,
  GET_INTRA_UTERINE_INSEMINATION_BY_ID: `${BASE_URI}/api/Treatments/IntraUterineInsemination/GetItemById`,

  CREATE_OOCYTE_VITRIFICATION: `${BASE_URI}/api/Treatments/OocyteVitrification/Create`,
  UPDATE_OOCYTE_VITRIFICATION: `${BASE_URI}/api/Treatments/OocyteVitrification/Update`,
  GET_OOCYTE_VITRIFICATION_BY_ID: `${BASE_URI}/api/Treatments/OocyteVitrification/GetItemById`,

  CREATE_INVITRO_FERTILIZATION: `${BASE_URI}/api/Treatments/InVitroFertilization/Create`,
  UPDATE_INVITRO_FERTILIZATION: `${BASE_URI}/api/Treatments/InVitroFertilization/Update`,
  GET_INVITRO_FERTILIZATION_BY_ID: `${BASE_URI}/api/Treatments/InVitroFertilization/GetItemById`,

  CREATE_THAW_EMBRYO_TRANSFER: `${BASE_URI}/api/Treatments/ThawEmbryoTransfer/Create`,
  UPDATE_THAW_EMBRYO_TRANSFER: `${BASE_URI}/api/Treatments/ThawEmbryoTransfer/Update`,
  GET_THAW_EMBRYO_TRANSFER_BY_ID: `${BASE_URI}/api/Treatments/ThawEmbryoTransfer/GetItemById`,

  CREATE_EVALUATION_CYCLE: `${BASE_URI}/api/Treatments/EvaluationCycle/Create`,
  UPDATE_EVALUATION_CYCLE: `${BASE_URI}/api/Treatments/EvaluationCycle/Update`,
  GET_EVALUATION_CYCLE_BY_ID: `${BASE_URI}/api/Treatments/EvaluationCycle/GetItemById`,

  // Stimulation
  CANCEL_STIMULATION_SHEET: `${BASE_URI}/api/StimulationSheet/Cancelled/Update`,
  CREATE_STIMULATION_ERA: `${BASE_URI}/api/StimulationSheet/ERA/Create`,
  UPDATE_STIMULATION_ERA: `${BASE_URI}/api/StimulationSheet/ERA/Update`,
  GET_STIMULATION_LOOKUP: `${BASE_URI}/api/Treatments/TreatmentProcess/GetAllTreatmentLookups`,

  // IVF Lab-Andrology
  GET_IVF_LAB_ANDROLOFY_LAB_REQUEST: `${BASE_URI}/api/Treatments/TreatmentProcess/GetItemsPaginationbyPatient`,



  CREATE_PRESCRIPTION: `${BASE_URI}/api/Prescription/PrescriptionScreen/Create`,
  UPDATE_PRESCRIPTION: `${BASE_URI}/api/Prescription/PrescriptionScreen/Update`,
  GET_PRESCRIPTION_GET_ITEMS: `${BASE_URI}/api/Prescription/PrescriptionScreen/GetItemsPagination`,
  GET_PATIENT_PRESCRIPTION_BY_ID: `${BASE_URI}/api/Prescription/PrescriptionScreen/GetItemById`,
  DELETE_PRESCRIPTION: `${BASE_URI}/api/Prescription/PrescriptionScreen/Delete`,
  GET_PRESCRIPTION_LOOK_UP: `${BASE_URI}/api/Prescription/PrescriptionScreen/GetAllPrescriptionLookups`,


  CREATE_ULTRASOUND_REQUEST: `${BASE_URI}/api/Infertility/UltrasoundRequest/Create`,
  UPDATE_ULTRASOUND_REQUEST: `${BASE_URI}/api/Infertility/UltrasoundRequest/Update`,
  GET_ULTRASOUND_REQUEST_BY_ID: `${BASE_URI}/api/Infertility/UltrasoundRequest/GetItemById`,
  DELETE_ULTRASOUND_REQUEST: `${BASE_URI}/api/Infertility/UltrasoundRequest/Delete`,

  CREATE_ULTRASOUND_GENERAL_DOCUMENT: `${BASE_URI}/api/Infertility/UltrasoundGeneralDocument/Create`,


  // diagnosis
  CREATE_DIAGNOSIS: `${BASE_URI}/api/Diagnosis/PatientDiagnosis/Create`,
  DELETE_DIAGNOSIS: `${BASE_URI}/api/Diagnosis/PatientDiagnosis/Delete`,
  UPDATE_DIAGNOSIS: `${BASE_URI}/api/Diagnosis/PatientDiagnosis/Update`,
  GET_DIAGNOSIS: `${BASE_URI}​/api/Diagnosis/PatientDiagnosis/GetItemsPagination`,
  GET_DIAGNOSIS_BY_ID: `${BASE_URI}/api/Diagnosis/PatientDiagnosis/GetItemById`,


  //vital patient id
  GET_PRESCRIPTION: `${BASE_URI}/api/Prescription/PrescriptionScreen/GetItemsPagination`,
  GET_VITAL: `${BASE_URI}/api/Vitals/VitalCapturing/GetPatientUltrasoundGeneralPagination`,


  // blood lab
  GET_BLOOD_LAB_BY_PATIENT_ID: `${BASE_URI}/api/RequestandResult/InvestigationRequest/GetItemsPagination`,
  DELETE_BLOOD_LAB_REQEUST: `${BASE_URI}/api/RequestandResult/InvestigationRequest/Delete`,
  CREATE_BLOOD_LAB_REQEUST: `${BASE_URI}/api/RequestandResult/InvestigationRequest/Create`,
  GET_RESULT_ENTRY_BY_REQUEST_ID: `${BASE_URI}/api/RequestandResult/InvestigationRequest/GetResultEntryByInvestigationRequestId`,

  GET_ULTRASOUND_GENERAL_LOOKUPS: `${BASE_URI}/api/Infertility/UltrasoundGeneral/GetUltrasoundGeneralLookups`,
  
  //Clinical Document Type
  CREATE_CLINICAL_DOCUMENT_TYPE: `${BASE_URI}/api/MasterData/ClinicalDocumentType/Create`,
  UPDATE_CLINICAL_DOCUMENT_TYPE: `${BASE_URI}/api/MasterData/ClinicalDocumentType/Update`,
  GET_CLINICAL_DOCUMENT_TYPE_BY_ID: `${BASE_URI}/api/MasterData/ClinicalDocumentType/GetItemById`,
  GET_CLINICAL_DOCUMENT_TYPE: `${BASE_URI}/api/MasterData/ClinicalDocumentType/GetItemsPagination`,
  DELETE_CLINICAL_DOCUMENT_TYPE: `${BASE_URI}/api/MasterData/ClinicalDocumentType/Delete`,

  //Clinical Document Type
  CREATE_CLINICAL_DOCUMENT_UPLOAD: `${BASE_URI}/api/DocumentUpload/DocumentUpload/Create`,
  UPDATE_CLINICAL_DOCUMENT_UPLOAD: `${BASE_URI}/api/DocumentUpload/DocumentUpload/Update`,
  GET_CLINICAL_DOCUMENT_UPLOAD_BY_ID: `${BASE_URI}/api/DocumentUpload/DocumentUpload/GetItemById`,
  GET_CLINICAL_DOCUMENT_UPLOAD: `${BASE_URI}/api/DocumentUpload/DocumentUpload/GetItemsPagination`,
  DELETE_CLINICAL_DOCUMENT_UPLOAD: `${BASE_URI}/api/DocumentUpload/DocumentUpload/Delete`,
};