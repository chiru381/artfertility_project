import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any;
}

export const masterServices = {
  createCountry: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_COUNTRY, body),
  updateCountry: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_COUNTRY, body),
  getAllCountry: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_COUNTRY, body),
  deleteCountry: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_COUNTRY, { params }),

  getAllInsuranceCompany: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_INSURANCE_COMPANY, body),

  getAllGender: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_GENDER, body),
  deleteGender: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_GENDER, { params }),
  createGender: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_GENDER, body),
  updateGender: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_GENDER, body),

  createCity: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CITY, body),
  updateCity: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CITY, body),
  getAllCity: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CITY, body),
  deleteCity: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CITY, { params }),

  getAllBed: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BED, body),
  createBed: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_BED, body),
  updateBed: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_BED, body),
  deleteBed: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_BED, { params }),
  getAllBedWithAdmission: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BED_WITH_ADMISSION, body),

  getAllMedicalStaff: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MEDICAL_STAFF, body),
  getAllClinicMedicalStaff: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ALL_CLINIC_MEDICAL_STAFF, body),
  GetZipCodeLookup: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ZIP_CODE_LOOKUP, body),

  createLeadSource: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_LEADSOURCE, body),
  updateLeadSource: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_LEADSOURCE, body),
  getAllLeadSource: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_LEADSOURCE, body),
  deleteLeadSource: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_LEADSOURCE, { params }),

  getAllPriority: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PRIORITY, body),

  createResourceSlotConfig: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_RESOURCE_SLOT_CONFIG, body),
  updateResourceSlotConfig: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_RESOURCE_SLOT_CONFIG, body),
  getAllResourceSlotConfig: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_RESOURCE_SLOT_CONFIG, body),
  deleteResourceSlotConfig: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_RESOURCE_SLOT_CONFIG, { params }),
  getResourceSlotAppointmentConfig: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_RESOURCE_SLOT_APPOINTMENT_CONFIG, body),

  createOTSlotConfig: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_OT_SLOT_CONFIG, body),
  updateOTSlotConfig: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_OT_SLOT_CONFIG, body),
  getAllOTSlotConfig: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OT_SLOT_CONFIG, body),
  getOTSlotConfigById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_OT_SLOT_CONFIG_BY_ID, { params }),
  deleteOTSlotConfig: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_OT_SLOT_CONFIG, { params }),
  getOTSlotAppointmentConfig: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OT_SLOT_APPOINTMENT_CONFIG, body),

  getOperatingTheatreRoom: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OPERATING_THEATRE, body),

  createClinic: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CLINIC, body),
  updateClinic: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CLINIC, body),
  getAllClinic: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CLINIC, body),
  deleteClinic: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CLINIC, { params }),


  createProvince: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PROVINCE, body),
  updateProvince: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PROVINCE, body),
  getAllProvince: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PROVINCE, body),
  deleteProvince: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PROVINCE, { params }),

  createSurgeryType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SURGERYTYPE, body),
  updateSurgeryType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SURGERYTYPE, body),
  getAllSurgeryType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SURGERYTYPE, body),
  deleteSurgeryType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SURGERYTYPE, { params }),

  createCityType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CITYTYPE, body),
  updateCityType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CITYTYPE, body),
  getAllCityType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CITYTYPE, body),
  deleteCityType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CITYTYPE, { params }),

  createBlockReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_BLOCK_REASON, body),
  updateBlockReason: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_BLOCK_REASON, body),
  getAllBlockReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BLOCK_REASON, body),
  deleteBlockReason: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_BLOCK_REASON, { params }),

  createCancelReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CANCEL_REASON, body),
  updateCancelReason: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CANCEL_REASON, body),
  getAllCancelReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CANCEL_REASON, body),
  deleteCancelReason: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CANCEL_REASON, { params }),

  createDepartment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DEPARTMENT, body),
  updateDepartment: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DEPARTMENT, body),
  getAllDepartment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DEPARTMENT, body),
  deleteDepartment: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DEPARTMENT, { params }),

  createDesignation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DESIGNATION, body),
  updateDesignation: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DESIGNATION, body),
  getAllDesignation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DESIGNATION, body),
  deleteDesignation: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DESIGNATION, { params }),

  getAllDressCode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DRESS_CODE, body),
  deleteDressCode: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DRESS_CODE, { params }),
  createDressCode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DRESS_CODE, body),
  updateDressCode: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DRESS_CODE, body),

  getAllDocumentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DOCUMENT_TYPE, body),
  deleteDocumentType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DOCUMENT_TYPE, { params }),
  createDocumentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DOCUMENT_TYPE, body),
  updateDocumentType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DOCUMENT_TYPE, body),

  getAllBedStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BED_STATUS, body),
  deleteBedStatus: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_BED_STATUS, { params }),
  createBedStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_BED_STATUS, body),
  updateBedStatus: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_BED_STATUS, body),

  getAllEmployeeType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_EMPLOYEE_TYPE, body),
  deleteEmployeeType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_EMPLOYEE_TYPE, { params }),
  createEmployeeType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_EMPLOYEE_TYPE, body),
  updateEmployeeType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_EMPLOYEE_TYPE, body),

  getAllSponsor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SPONSOR, body),
  deleteSponsor: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SPONSOR, { params }),
  createSponsor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SPONSOR, body),
  updateSponsor: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SPONSOR, body),

  getAllLanguage: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_LANGUAGE, body),
  deleteLanguage: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_LANGUAGE, { params }),
  createLanguage: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_LANGUAGE, body),
  updateLanguage: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_LANGUAGE, body),

  getAllLocality: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_LOCALITY, body),
  deleteLocality: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_LOCALITY, { params }),
  createLocality: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_LOCALITY, body),
  updateLocality: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_LOCALITY, body),

  getAllMaritalStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MARITALSTATUS, body),
  deleteMaritalStatus: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MARITALSTATUS, { params }),
  createMaritalStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MARITALSTATUS, body),
  updateMaritalStatus: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MARITALSTATUS, body),

  getAllNationality: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_NATIONALLITY, body),
  deleteNationality: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_NATIONALLITY, { params }),
  createNationality: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_NATIONALLITY, body),
  updateNationality: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_NATIONALLITY, body),


  getAllOccupation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OCCUPATION, body),
  deleteOccupation: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_OCCUPATION, { params }),
  createOccupation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_OCCUPATION, body),
  updateOccupation: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_OCCUPATION, body),

  getAllPaymentMode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PAYMENTMODE, body),
  deletePaymentMode: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PAYMENTMODE, { params }),
  createPaymentMode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PAYMENTMODE, body),
  updatePaymentMode: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PAYMENTMODE, body),

  getAllPaymentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PAYMENTTYPE, body),
  deletePaymentType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PAYMENTTYPE, { params }),
  createPaymentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PAYMENTTYPE, body),
  updatePaymentType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PAYMENTTYPE, body),

  getAllQualification: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_QUALIFICATION, body),
  deleteQualification: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_QUALIFICATION, { params }),
  createQualification: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_QUALIFICATION, body),
  updateQualification: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_QUALIFICATION, body),

  getAllReferringDoctor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_REFERRINGDOCTOR, body),
  deleteReferringDoctor: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_REFERRINGDOCTOR, { params }),
  createReferringDoctor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_REFERRINGDOCTOR, body),
  updateReferringDoctor: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_REFERRINGDOCTOR, body),

  getAllReligion: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_RELIGION, body),
  deleteReligion: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_RELIGION, { params }),
  createReligion: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_RELIGION, body),
  updateReligion: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_RELIGION, body),

  getAllSkinColor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SKINCOLOR, body),
  deleteSkinColor: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SKINCOLOR, { params }),
  createSkinColor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SKINCOLOR, body),
  updateSkinColor: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SKINCOLOR, body),

  getAllTitle: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TITLE, body),
  deleteTitle: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_TITLE, { params }),
  createTitle: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TITLE, body),
  updateTitle: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_TITLE, body),

  getAllVipReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_VIPREASON, body),
  deleteVipReason: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_VIPREASON, { params }),
  createVipReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_VIPREASON, body),
  updateVipReason: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_VIPREASON, body),

  getAllVisaStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_VISASTATUS, body),
  deleteVisaStatus: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_VISASTATUS, { params }),
  createVisaStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_VISASTATUS, body),
  updateVisaStatus: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_VISASTATUS, body),

  getAllZipCode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ZIPCODE, body),
  createZipCode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ZIPCODE, body),
  updateZipCode: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ZIPCODE, body),

  getAllStation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_STATION, body),
  deleteStation: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_STATION, { params }),
  createStation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_STATION, body),
  updateStation: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_STATION, body),

  getAllRole: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ROLE, body),
  deleteRole: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ROLE, { params }),
  createRole: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ROLE, body),
  updateRole: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ROLE, body),

  getAllBlockType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BLOCK_TYPE, body),
  deleteBlockType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_BLOCK_TYPE, { params }),
  createBlockType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_BLOCK_TYPE, body),
  updateBlockType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_BLOCK_TYPE, body),

  bedBlockAndUnblock: (params: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.BED_BLOCK_AND_UNBLOCK, null, { params }),

  getAllContactType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CONTACT_TYPE, body),
  deleteContactType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CONTACT_TYPE, { params }),
  createContactType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CONTACT_TYPE, body),
  updateContactType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CONTACT_TYPE, body),

  getAllResource: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_RESOURCE, body),
  deleteResource: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_RESOURCE, { params }),
  createResource: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_RESOURCE, body),
  updateResource: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_RESOURCE, body),

  getAllAppointmentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_APPOINTMENT_TYPE, body),
  deleteAppointmentType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_APPOINTMENT_TYPE, { params }),
  createAppointmentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_APPOINTMENT_TYPE, body),
  updateAppointmentType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_APPOINTMENT_TYPE, body),

  getAllRescheduleReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_RESCHEDULE_REASON, body),
  deleteRescheduleReason: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_RESCHEDULE_REASON, { params }),
  createRescheduleReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_RESCHEDULE_REASON, body),
  updateRescheduleReason: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_RESCHEDULE_REASON, body),

  getAllClinicalComplicationType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CLINICAL_COMPLICATION_TYPE, body),
  deleteClinicalComplicationType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CLINICAL_COMPLICATION_TYPE, { params }),
  createClinicalComplicationType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CLINICAL_COMPLICATION_TYPE, body),
  updateClinicalComplicationType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CLINICAL_COMPLICATION_TYPE, body),

  getAllEmployeeCategory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_EMPLOYEE_CATEGORY, body),
  deleteEmployeeCategory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_EMPLOYEE_CATEGORY, { params }),
  createEmployeeCategory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_EMPLOYEE_CATEGORY, body),
  updateEmployeeCategory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_EMPLOYEE_CATEGORY, body),

  getAllSurgery: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SURGERY, body),
  deleteSurgery: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SURGERY, { params }),
  createSurgery: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SURGERY, body),
  updateSurgery: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SURGERY, body),

  getAllSeries: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SERIES, body),
  deleteSeries: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SERIES, { params }),
  createSeries: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SERIES, body),
  updateSeries: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SERIES, body),


  getAllVisitType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_VISIT_TYPE, body),
  deleteVisitType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_VISIT_TYPE, { params }),
  createVisitType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_VISIT_TYPE, body),
  updateVisitType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_VISIT_TYPE, body),

  getAllEquipment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_EQUIPMENT, body),
  deleteEquipment: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_EQUIPMENT, { params }),
  createEquipment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_EQUIPMENT, body),
  updateEquipment: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_EQUIPMENT, body),

  getAllUser: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_USER, body),

  getAllSample: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SAMPLE, body),
  deleteSample: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SAMPLE, { params }),
  createSample: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SAMPLE, body),
  updateSample: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SAMPLE, body),

  getAllUnitOfMeasure: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_UNIT_OF_MEASURE, body),
  deleteUnitOfMeasure: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_UNIT_OF_MEASURE, { params }),
  createUnitOfMeasure: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_UNIT_OF_MEASURE, body),
  updateUnitOfMeasure: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_UNIT_OF_MEASURE, body),

  getAllSampleContainer: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SAMPLE_CONTAINER, body),
  deleteSampleContainer: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SAMPLE_CONTAINER, { params }),
  createSampleContainer: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SAMPLE_CONTAINER, body),
  updateSampleContainer: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SAMPLE_CONTAINER, body),

  getAllProfile: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PROFILE, body),
  deleteProfile: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PROFILE, { params }),
  createProfile: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PROFILE, body),
  updateProfile: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PROFILE, body),


  getAllBankDetail: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BANK_DETAIL, body),
  deleteBankDetail: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_BANK_DETAIL, { params }),
  createBankDetail: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_BANK_DETAIL, body),
  updateBankDetail: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_BANK_DETAIL, body),

  getAllDiscountType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DISCOUNT_TYPE, body),
  deleteDiscountType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DISCOUNT_TYPE, { params }),
  createDiscountType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DISCOUNT_TYPE, body),
  updateDiscountType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DISCOUNT_TYPE, body),

  getAllDoctorFee: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DOCTOR_FEE, body),
  deleteDoctorFee: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DOCTOR_FEE, { params }),
  createDoctorFee: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DOCTOR_FEE, body),
  updateDoctorFee: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DOCTOR_FEE, body),

  getAllFacilitator: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_FACILITATOR, body),
  deleteFacilitator: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_FACILITATOR, { params }),
  createFacilitator: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_FACILITATOR, body),
  updateFacilitator: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_FACILITATOR, body),

  getAllMerchant: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MERCHANT, body),
  deleteMerchant: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MERCHANT, { params }),
  createMerchant: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MERCHANT, body),
  updateMerchant: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MERCHANT, body),


  getAllService: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SERVICE, body),
  createService: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SERVICE, body),
  updateService: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SERVICE, body),
  deleteService: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SERVICE, { params }),

  getAllSampleStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SAMPLE_STATUS, body),
  createSampleStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SAMPLE_STATUS, body),
  updateSampleStatus: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SAMPLE_STATUS, body),
  deleteSampleStatus: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SAMPLE_STATUS, { params }),

  getAllTest: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TEST, body),
  createTest: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TEST, body),
  updateTest: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_TEST, body),
  deleteTest: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_TEST, { params }),

  getAllResultTemplate: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_RESULT_TEMPALTE, body),
  createResultTemplate: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_RESULT_TEMPALTE, body),
  updateResultTemplate: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_RESULT_TEMPALTE, body),
  deleteResultTemplate: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_RESULT_TEMPALTE, { params }),

  getAllComponent: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_COMPONENT, body),
  createComponent: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_COMPONENT, body),
  updateComponent: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_COMPONENT, body),
  deleteComponent: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_COMPONENT, { params }),

  getAllPackage: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PACKAGE, body),
  createPackage: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PACKAGE, body),
  updatePackage: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PACKAGE, body),
  deletePackage: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PACKAGE, { params }),

  getAllEmiScheme: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_EMI_SCHEME, body),

  getAllResultValue: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_RESULT_VALUE, body),
  createResultValue: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_RESULT_VALUE, body),
  updateResultValue: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_RESULT_VALUE, body),
  deleteResultValue: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_RESULT_VALUE, { params }),


  getAllLocation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_LOCATION, body),
  createLocation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_LOCATION, body),
  updateLocation: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_LOCATION, body),
  deleteLocation: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_LOCATION, { params }),



  getAllTariff: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TARIFF, body),
  createTariff: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TARIFF, body),
  updateTariff: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_TARIFF, body),
  deleteTariff: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_TARIFF, { params }),



  getAllTariffItem: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TARIFFITEM, body),
  createTariffItem: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TARIFFITEM, body),
  updateTariffItem: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_TARIFFITEM, body),
  deleteTariffItem: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_TARIFFITEM, { params }),

  getAllDiscountAuthorityMatrix: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DISCOUNTAUTHORITYMATRIX, body),
  createDiscountAuthorityMatrix: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DISCOUNTAUTHORITYMATRIX, body),
  updateDiscountAuthorityMatrix: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DISCOUNTAUTHORITYMATRIX, body),
  deleteDiscountAuthorityMatrix: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DISCOUNTAUTHORITYMATRIX, { params }),

  getAllRefundDepositLogic: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_REFUNDDEPOSITLOGIC, body),
  createRefundDepositLogic: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_REFUNDDEPOSITLOGIC, body),
  updateRefundDepositLogic: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_REFUNDDEPOSITLOGIC, body),
  deleteRefundDepositLogic: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_REFUNDDEPOSITLOGIC, { params }),

  getAllServiceCategory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SERVICEGATEGORY, body),
  createServiceCategory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SERVICEGATEGORY, body),
  updateServiceCategory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SERVICEGATEGORY, body),
  deleteServiceCategory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SERVICEGATEGORY, { params }),


  getAllStage: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_STAGE, body),
  createStage: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_STAGE, body),
  updateStage: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_STAGE, body),
  deleteStage: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_STAGE, { params }),

  getAllCycle: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CYCLE, body),
  creatCycle: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CYCLE, body),
  updateCycle: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CYCLE, body),
  deleteCycle: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CYCLE, { params }),


  getAllDepositRefundLogic: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DEPOSITREFUNDLOGIC, body),
  creatDepositRefundLogic: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DEPOSITREFUNDLOGIC, body),
  updateDepositRefundLogic: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DEPOSITREFUNDLOGIC, body),
  deleteDepositRefundLogic: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DEPOSITREFUNDLOGIC, { params }),

  getAllDiscountReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DISCOUNTREASON, body),
  creatDiscountReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DISCOUNTREASON, body),
  updateDiscountReason: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DISCOUNTREASON, body),
  deleteDiscountReason: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DISCOUNTREASON, { params }),

  getAllSubDepartment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SUBDEPARTMENT, body),
  creatSubDepartment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SUBDEPARTMENT, body),
  updateSubDepartment: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SUBDEPARTMENT, body),
  deleteSubDepartment: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SUBDEPARTMENT, { params }),


  getAllGenderApplicability: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_GENDERAPPLICABILITY, body),
  creatGenderApplicability: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_GENDERAPPLICABILITY, body),
  updateGenderApplicability: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_GENDERAPPLICABILITY, body),
  deleteGenderApplicability: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_GENDERAPPLICABILITY, { params }),

  getAllTransactionType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TRANSACTIONTYPE, body),
  creatTransactionType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TRANSACTIONTYPE, body),
  updateTransactionType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_TRANSACTIONTYPE, body),
  deleteTransactionType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_TRANSACTIONTYPE, { params }),

  getAllBedBlockReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BED_BLOCK_REASON, body),
  createBedBlockReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_BED_BLOCK_REASON, body),
  updateBedBlockReason: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_BED_BLOCK_REASON, body),
  deleteBedBlockReason: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_BED_BLOCK_REASON, { params }),

  getAllSpeciality: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SPECIALITY, body),
  createSpeciality: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SPECIALITY, body),
  updateSpeciality: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SPECIALITY, body),
  deleteSpeciality: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SPECIALITY, { params }),

  getUserLookup: (): AxiosPromise => axios.get(API_ENDPOINTS.GET_USER_LOOKUPS),

  getAllTaskReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TASK_REASON, body),

  //Clinical requests
  getAllConsultationReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CONSULTATION_REASON, body),
  createConsultationReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CONSULTATION_REASON, body),
  updateConsultationReason: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CONSULTATION_REASON, body),
  deleteConsultationReason: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CONSULTATION_REASON, { params }),

  getAllDysmenorrhea: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DYSMENORRHEA_REASON, body),
  createDysmenorrhea: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DYSMENORRHEA_REASON, body),
  updateDysmenorrhea: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DYSMENORRHEA_REASON, body),
  deleteDysmenorrhea: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DYSMENORRHEA_REASON, { params }),

  getAllCoupleConsanguinity: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_COUPLE_CONSANGUINITY_REASON, body),
  createCoupleConsanguinity: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_COUPLE_CONSANGUINITY_REASON, body),
  updateCoupleConsanguinity: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_COUPLE_CONSANGUINITY_REASON, body),
  deleteCoupleConsanguinity: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_COUPLE_CONSANGUINITY_REASON, { params }),

  getAllContraceptiveMethod: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CONTRACEPTIVE_METHOD_REASON, body),
  createContraceptiveMethod: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CONTRACEPTIVE_METHOD_REASON, body),
  updateContraceptiveMethod: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CONTRACEPTIVE_METHOD_REASON, body),
  deleteContraceptiveMethod: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CONTRACEPTIVE_METHOD_REASON, { params }),

  getAllTranslator: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TRANSLATOR, body),
  createTranslator: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TRANSLATOR, body),
  updateTranslator: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_TRANSLATOR, body),
  deleteTranslator: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_TRANSLATOR, { params }),

  getAllSurgeryIndication: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SURGERY_INDICATION, body),
  createSurgeryIndication: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SURGERY_INDICATION, body),
  updateSurgeryIndication: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SURGERY_INDICATION, body),
  deleteSurgeryIndication: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SURGERY_INDICATION, { params }),

  getAllSurgeryTechnique: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SURGERY_TECHNIQUE, body),
  createSurgeryTechnique: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SURGERY_TECHNIQUE, body),
  updateSurgeryTechnique: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SURGERY_TECHNIQUE, body),
  deleteSurgeryTechnique: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SURGERY_TECHNIQUE, { params }),

  getAllSurgicalHistorySurgeryType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SURGICAL_HISTORY_SURGERY_TYPE, body),
  createSurgicalHistorySurgeryType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SURGICAL_HISTORY_SURGERY_TYPE, body),
  updateSurgicalHistorySurgeryType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SURGICAL_HISTORY_SURGERY_TYPE, body),
  deleteSurgicalHistorySurgeryType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SURGICAL_HISTORY_SURGERY_TYPE, { params }),

  getAllDisorder: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DISORDER, body),
  createDisorder: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DISORDER, body),
  updateDisorder: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DISORDER, body),
  deleteDisorder: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DISORDER, { params }),

  getAllDisorderCategory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DISORDER_CATEGORY, body),
  createDisorderCategory: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DISORDER_CATEGORY, body),
  updateDisorderCategory: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DISORDER_CATEGORY, body),
  deleteDisorderCategory: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DISORDER_CATEGORY, { params }),

  getAllTakingBloodThinner: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TAKING_BLOOD_THINNER, body),
  createTakingBloodThinner: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TAKING_BLOOD_THINNER, body),
  updateTakingBloodThinner: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_TAKING_BLOOD_THINNER, body),
  deleteTakingBloodThinner: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_TAKING_BLOOD_THINNER, { params }),

  getAllDrug: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DRUG, body),
  createDrug: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DRUG, body),
  updateDrug: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DRUG, body),
  deleteDrug: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DRUG, { params }),

  getAllMedicationFrequency: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MEDICATION_FREQUENCY, body),
  createMedicationFrequency: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MEDICATION_FREQUENCY, body),
  updateMedicationFrequency: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MEDICATION_FREQUENCY, body),
  deleteMedicationFrequency: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MEDICATION_FREQUENCY, { params }),

  getAllMedicationRoute: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MEDICATION_ROUTE, body),
  createMedicationRoute: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MEDICATION_ROUTE, body),
  updateMedicationRoute: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MEDICATION_ROUTE, body),
  deleteMedicationRoute: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MEDICATION_ROUTE, { params }),

  getAllDrugAllergy: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DRUG_ALLERGY, body),
  createDrugAllergy: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DRUG_ALLERGY, body),
  updateDrugAllergy: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DRUG_ALLERGY, body),
  deleteDrugAllergy: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DRUG_ALLERGY, { params }),

  getAllCalendarYear: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CALENDAR_YEAR, body),
  createCalendarYear: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CALENDAR_YEAR, body),
  updateCalendarYear: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CALENDAR_YEAR, body),
  deleteCalendarYear: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CALENDAR_YEAR, { params }),

  getAllGestationType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_GESTATION_TYPE, body),

  getAllPregnancyEndingType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PREGNANCY_ENDING_TYPE, body),
  createPregnancyEndingType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PREGNANCY_ENDING_TYPE, body),
  updatePregnancyEndingType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PREGNANCY_ENDING_TYPE, body),
  deletePregnancyEndingType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PREGNANCY_ENDING_TYPE, { params }),

  getAllHirsutism: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_HIRSUTISM, body),
  createHirsutism: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_HIRSUTISM, body),
  updateHirsutism: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_HIRSUTISM, body),
  deleteHirsutism: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_HIRSUTISM, { params }),

  getAllGalactorrhea: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_GALACTORRHEA, body),
  createGalactorrhea: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_GALACTORRHEA, body),
  updateGalactorrhea: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_GALACTORRHEA, body),
  deleteGalactorrhea: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_GALACTORRHEA, { params }),

  getAllVagina: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_VAGINA, body),
  createVagina: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_VAGINA, body),
  updateVagina: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_VAGINA, body),
  deleteVagina: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_VAGINA, { params }),

  getAllCervixPathological: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CERVIX_PATHOLOGICAL, body),
  createCervixPathological: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CERVIX_PATHOLOGICAL, body),
  updateCervixPathological: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CERVIX_PATHOLOGICAL, body),
  deleteCervixPathological: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CERVIX_PATHOLOGICAL, { params }),

  getAllTreatmentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TREATMENT_TYPE, body),
  createTreatmentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TREATMENT_TYPE, body),
  updateTreatmentType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_TREATMENT_TYPE, body),
  deleteTreatmentType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_TREATMENT_TYPE, { params }),

  getAllProtocol: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PROTOCOL, body),
  createProtocol: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PROTOCOL, body),
  updateProtocol: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PROTOCOL, body),
  deleteProtocol: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PROTOCOL, { params }),

  getAllPregnancyResult: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PREGNANCY_RESULT, body),
  createPregnancyResult: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_PREGNANCY_RESULT, body),
  updatePregnancyResult: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_PREGNANCY_RESULT, body),
  deletePregnancyResult: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_PREGNANCY_RESULT, { params }),

  getAllCycleComplication: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CYCLE_COMPLICATION, body),
  createCycleComplication: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CYCLE_COMPLICATION, body),
  updateCycleComplication: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CYCLE_COMPLICATION, body),
  deleteCycleComplication: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CYCLE_COMPLICATION, { params }),

  getAllUltrasoundType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ULTRASOUND_TYPE, body),
  createUltrasoundType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ULTRASOUND_TYPE, body),
  updateUltrasoundType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ULTRASOUND_TYPE, body),
  deleteUltrasoundType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ULTRASOUND_TYPE, { params }),

  getAllUltrasoundMethod: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ULTRASOUND_METHOD, body),
  createUltrasoundMethod: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ULTRASOUND_METHOD, body),
  updateUltrasoundMethod: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ULTRASOUND_METHOD, body),
  deleteUltrasoundMethod: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ULTRASOUND_METHOD, { params }),

  getAllRaceType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_RACE_TYPE, body),
  createRaceType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_RACE_TYPE, body),
  updateRaceType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_RACE_TYPE, body),
  deleteRaceType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_RACE_TYPE, { params }),

  getAllHairType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_HAIR_TYPE, body),
  createHairType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_HAIR_TYPE, body),
  updateHairType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_HAIR_TYPE, body),
  deleteHairType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_HAIR_TYPE, { params }),

  getAllHairColor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_HAIR_COLOR, body),
  createHairColor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_HAIR_COLOR, body),
  updateHairColor: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_HAIR_COLOR, body),
  deleteHairColor: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_HAIR_COLOR, { params }),

  getAllEyeColor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_EYE_COLOR, body),
  createEyeColor: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_EYE_COLOR, body),
  updateEyeColor: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_EYE_COLOR, body),
  deleteEyeColor: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_EYE_COLOR, { params }),

  getAllUterineCavity: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_UTERINE_CAVITY, body),
  createUterineCavity: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_UTERINE_CAVITY, body),
  updateUterineCavity: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_UTERINE_CAVITY, body),
  deleteUterineCavity: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_UTERINE_CAVITY, { params }),

  getAllFallopianTubeStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_FALLOPIAN_TUBE_STATUS, body),
  createFallopianTubeStatus: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_FALLOPIAN_TUBE_STATUS, body),
  updateFallopianTubeStatus: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_FALLOPIAN_TUBE_STATUS, body),
  deleteFallopianTubeStatus: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_FALLOPIAN_TUBE_STATUS, { params }),

  getAllTransferredQuality: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TRANSFERRED_QUALITY, body),

  ////
  getAllMyomaType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MYOMA_TYPE, body),

  getAllMyomaLocation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MYOMA_LOCATION, body),
  getAllMyomaHeight: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MYOMA_HEIGHT, body),
  getAllAppearance: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_APPEARANCE, body),
  getAllAdenomyosisLocation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ADENOMYOSIS_LOCATION, body),
  getAllAdenomyosisHeight: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ADENOMYOSIS_HEIGHT, body),
  getAllEndometrialPolypAppearance: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ENDOMETRIAL_POLYP_APPEARANCE, body),
  getAllEndometrialPolypHeight: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ENDOMETRIAL_POLYP_HEIGHT, body),

  getAllEndometrialAppearance: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ENDOMETRIAL_APPEARANCE, body),

  getAllEndometrialEcogenity: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ENDOMETRIAL_ECOGENITY, body),

  getAllEndometrialLiquid: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ENDOMETRIAL_LIQUID, body),
  getAllUltrasoundAttachedLocation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ULTRASOUND_ATTACHED_LOCATION, body),

  getAllUltrasoundEssure: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ULTRASOUND_ESSURE, body),
  getAllMalformation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_MALFORMATION, body),
  getAllCervicalPathology: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CERVICAL_PATHOLOGY, body),

  getAllPuerperalPathology: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PUERPERAL_PATHOLOGY, body),
  getAllObstetricPathology: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OBSTETRIC_PATHOLOGY, body),
  getAllDeliveryMode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DELIVERY_MODE, body),

  getAllTreatmentIndication: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TREATMENT_INDICATION, body),
  getAllTreatmentDiagnosis: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_TREATMENT_DIAGNOSIS, body),
  getAllAbnormality: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ABNORMALITY, body),
  getAllPathalogical: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PATHOLOGICAL, body),
  getAllComplimentaryTestDetail: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_COMPLIMENTARY_TEST_DETAIL, body),

  getAllUltrasoundAttachedType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ULTRASOUND_ATTACHED_TYPE, body),
  getAllUltrasoundAttachedContent: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ULTRASOUND_ATTACHED_CONTENT, body),
  getAllUltrasoundAttachedImpDiagnosis: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ULTRASOUND_ATTACHED_IMP_DIAGNOSIS, body),

  getAllKITTemplate: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_KIT_TEMPLATE, body),
  getKITTemplateById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_KIT_TEMPLATE_BY_ID, { params }),

  getAllPainLocation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PAINLOCATION, body),
  getAllPainFrequency: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PAINFREQUENCY, body),
  getAllPainDescription: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PAINDESCRIPTION, body),
  getAllCovidVaccination: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_COVID_VACCINATION, body),

  getAllVitalProcess: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_VITAL, body),
  getAllPrescriptionProcess: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_PRESCRIPTION, body),

  //Refund Reason
  getAllRefundReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_REFUND_REASON, body),
  createRefundReason: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_REFUND_REASON, body),
  updateRefundReason: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_REFUND_REASON, body),
  deleteRefundReason: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_REFUND_REASON, { params }),

  // currency
  getAllCurrency: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CURRENCY, body),
  createCurrency: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CURRENCY, body),
  updateCurrency: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CURRENCY, body),
  deleteCurrency: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CURRENCY, { params }),

  // currency
  getAllIcd10CodeDiagnosis: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ICD10_CODEDIAGNOSIS, body),
  createIcd10CodeDiagnosis: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ICD10_CODEDIAGNOSIS, body),
  updateIcd10CodeDiagnosis: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ICD10_CODEDIAGNOSIS, body),
  deleteIcd10CodeDiagnosis: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ICD10_CODEDIAGNOSIS, { params }),
  // diagnostic code
  getAllDiagnosisCode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DIAGNOSTIC_CODE, body),
  createDiagnosisCode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DIAGNOSTIC_CODE, body),
  updateDiagnosisCode: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DIAGNOSTIC_CODE, body),
  deleteDiagnosisCode: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DIAGNOSTIC_CODE, { params }),

  getAllEncounterTypesCode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ENCOUNTER_TYPE_CODE, body),
  createEncounterTypesCode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ENCOUNTER_TYPE_CODE, body),
  updateEncounterTypesCode: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ENCOUNTER_TYPE_CODE, body),
  deleteEncounterTypesCode: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ENCOUNTER_TYPE_CODE, { params }),

  getAllEncounterStartTypes: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ENCOUNTER_START_TYPE, body),
  createEncounterStartTypes: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ENCOUNTER_START_TYPE, body),
  updateEncounterStartTypes: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ENCOUNTER_START_TYPE, body),
  deleteEncounterStartTypes: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ENCOUNTER_START_TYPE, { params }),

  getAllEncounterEndTypes: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ENCOUNTER_END_TYPE, body),
  createEncounterEndTypes: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ENCOUNTER_END_TYPE, body),
  updateEncounterEndTypes: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ENCOUNTER_END_TYPE, body),
  deleteEncounterEndTypes: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ENCOUNTER_END_TYPE, { params }),
  //select category type
  getAllServiceCategoryType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_SERVICE_CATEGORY_TYPE, body),
  createServiceCategoryType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_SERVICE_CATEGORY_TYPE, body),
  updateServiceCategoryType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SERVICE_CATEGORY_TYPE, body),
  deleteServiceCategoryType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_SERVICE_CATEGORY_TYPE, { params }),

  //tax
  getItemCharge: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ITEM_CHARGE, body),

  //clinical document type
  getAllClinicalDocumentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CLINICAL_DOCUMENT_TYPE, body),
  createClinicalDocumentType: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_CLINICAL_DOCUMENT_TYPE, body),
  updateClinicalDocumentType: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_CLINICAL_DOCUMENT_TYPE, body),
  deleteClinicalDocumentType: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_CLINICAL_DOCUMENT_TYPE, { params }),
  //item charge
  getAllItemCharge: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ITEM_CHARGE, body),
  createItemCharge: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_ITEM_CHARGE, body),
  updateItemCharge: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_ITEM_CHARGE, body),
  deleteItemCharge: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_ITEM_CHARGE, { params }),

};
