export const BASE_URI = process.env.REACT_APP_BASE_URI;

export const MASTER_API_ENDPOINTS = {
  // Master Requests
  CREATE_COUNTRY: `${BASE_URI}/api/MasterData/Country/Create`,
  UPDATE_COUNTRY: `${BASE_URI}/api/MasterData/Country/Update`,
  GET_COUNTRY: `${BASE_URI}/api/MasterData/Country/GetItemsPagination`,
  DELETE_COUNTRY: `${BASE_URI}/api/MasterData/Country/Delete`,

  GET_MARITAL_STATUS: `${BASE_URI}/api/MasterData/MaritalStatus/GetItemsPagination`,

  GET_INSURANCE_COMPANY: `${BASE_URI}/api/MasterData/InsuranceCompany/GetItemsPagination`,

  CREATE_CITY: `${BASE_URI}/api/MasterData/City/Create`,
  UPDATE_CITY: `${BASE_URI}/api/MasterData/City/Update`,
  GET_CITY: `${BASE_URI}/api/MasterData/City/GetItemsPagination`,
  DELETE_CITY: `${BASE_URI}/api/MasterData/City/Delete`,

  GET_BED: `${BASE_URI}/api/MasterData/Bed/GetItemsPagination`,
  CREATE_BED: `${BASE_URI}/api/MasterData/Bed/Create`,
  UPDATE_BED: `${BASE_URI}/api/MasterData/Bed/Update`,
  DELETE_BED: `${BASE_URI}/api/MasterData/Bed/Delete`,
  GET_BED_WITH_ADMISSION: `${BASE_URI}/api/MasterData/Bed/GetBedWithAdmissionsPagination`,

  GET_TASK_REASON: `${BASE_URI}/api/MasterData/TaskReason/GetItemsPagination`,

  GET_ZIP_CODE_LOOKUP: `${BASE_URI}/api/MasterData/LocalityZIP/GetLookupItems`,

  CREATE_LEADSOURCE: `${BASE_URI}/api/MasterData/LeadSource/Create`,
  UPDATE_LEADSOURCE: `${BASE_URI}/api/MasterData/LeadSource/Update`,
  GET_LEADSOURCE: `${BASE_URI}/api/MasterData/LeadSource/GetItemsPagination`,
  DELETE_LEADSOURCE: `${BASE_URI}/api/MasterData/LeadSource/Delete`,

  GET_PRIORITY: `${BASE_URI}/api/MasterData/Priority/GetItemsPagination`,

  CREATE_RESOURCE_SLOT_CONFIG: `${BASE_URI}/api/MasterData/ResourceSlotConfig/Create`,
  UPDATE_RESOURCE_SLOT_CONFIG: `${BASE_URI}/api/MasterData/ResourceSlotConfig/Update`,
  GET_RESOURCE_SLOT_CONFIG: `${BASE_URI}/api/MasterData/ResourceSlotConfig/GetItemsPagination`,
  DELETE_RESOURCE_SLOT_CONFIG: `${BASE_URI}/api/MasterData/ResourceSlotConfig/Delete`,
  GET_RESOURCE_SLOT_APPOINTMENT_CONFIG: `${BASE_URI}/api/MasterData/ResourceSlotConfig/GetResourceAppointmentPagination`,

  CREATE_OT_SLOT_CONFIG: `${BASE_URI}/api/MasterData/OperatingTheatreSlotConfig/Create`,
  UPDATE_OT_SLOT_CONFIG: `${BASE_URI}/api/MasterData/OperatingTheatreSlotConfig/Update`,
  GET_OT_SLOT_CONFIG: `${BASE_URI}/api/MasterData/OperatingTheatreSlotConfig/GetItemsPagination`,
  GET_OT_SLOT_CONFIG_BY_ID: `${BASE_URI}/api/MasterData/OperatingTheatreSlotConfig/GetItemById`,
  DELETE_OT_SLOT_CONFIG: `${BASE_URI}/api/MasterData/OperatingTheatreSlotConfig/Delete`,
  GET_OT_SLOT_APPOINTMENT_CONFIG: `${BASE_URI}/api/MasterData/OperatingTheatreSlotConfig/GetOperationTheatreSlotConfigPagination`,

  GET_OPERATING_THEATRE: `${BASE_URI}/api/MasterData/OperatingTheatre/GetItemsPagination`,

  CREATE_CLINIC: `${BASE_URI}/api/MasterData/Clinic/Create`,
  UPDATE_CLINIC: `${BASE_URI}/api/MasterData/Clinic/Update`,
  GET_CLINIC: `${BASE_URI}/api/MasterData/Clinic/GetItemsPagination`,
  DELETE_CLINIC: `${BASE_URI}/api/MasterData/Clinic/Delete`,

  CREATE_PROVINCE: `${BASE_URI}/api/MasterData/Province/Create`,
  UPDATE_PROVINCE: `${BASE_URI}/api/MasterData/Province/Update`,
  GET_PROVINCE: `${BASE_URI}/api/MasterData/Province/GetItemsPagination`,
  DELETE_PROVINCE: `${BASE_URI}/api/MasterData/Province/Delete`,

  CREATE_SURGERYTYPE: `${BASE_URI}/api/MasterData/SurgeryType/Create`,
  UPDATE_SURGERYTYPE: `${BASE_URI}/api/MasterData/SurgeryType/Update`,
  GET_SURGERYTYPE: `${BASE_URI}/api/MasterData/SurgeryType/GetItemsPagination`,
  DELETE_SURGERYTYPE: `${BASE_URI}/api/MasterData/SurgeryType/Delete`,

  CREATE_CITYTYPE: `${BASE_URI}/api/MasterData/City/Create`,
  UPDATE_CITYTYPE: `${BASE_URI}/api/MasterData/City/Update`,
  GET_CITYTYPE: `${BASE_URI}/api/MasterData/City/GetItemsPagination`,
  DELETE_CITYTYPE: `${BASE_URI}/api/MasterData/City/Delete`,

  CREATE_BLOCK_REASON: `${BASE_URI}/api/MasterData/BlockReason/Create`,
  UPDATE_BLOCK_REASON: `${BASE_URI}/api/MasterData/BlockReason/Update`,
  GET_BLOCK_REASON: `${BASE_URI}/api/MasterData/BlockReason/GetItemsPagination`,
  DELETE_BLOCK_REASON: `${BASE_URI}/api/MasterData/BlockReason/Delete`,

  CREATE_CANCEL_REASON: `${BASE_URI}/api/MasterData/CancelReason/Create`,
  UPDATE_CANCEL_REASON: `${BASE_URI}/api/MasterData/CancelReason/Update`,
  GET_CANCEL_REASON: `${BASE_URI}/api/MasterData/CancelReason/GetItemsPagination`,
  DELETE_CANCEL_REASON: `${BASE_URI}/api/MasterData/CancelReason/Delete`,

  CREATE_DEPARTMENT: `${BASE_URI}/api/MasterData/Department/Create`,
  UPDATE_DEPARTMENT: `${BASE_URI}/api/MasterData/Department/Update`,
  GET_DEPARTMENT: `${BASE_URI}/api/MasterData/Department/GetItemsPagination`,
  DELETE_DEPARTMENT: `${BASE_URI}/api/MasterData/Department/Delete`,

  CREATE_DESIGNATION: `${BASE_URI}/api/MasterData/Designation/Create`,
  UPDATE_DESIGNATION: `${BASE_URI}/api/MasterData/Designation/Update`,
  GET_DESIGNATION: `${BASE_URI}/api/MasterData/Designation/GetItemsPagination`,
  DELETE_DESIGNATION: `${BASE_URI}/api/MasterData/Designation/Delete`,

  GET_DRESS_CODE: `${BASE_URI}/api/MasterData/DressCode/GetItemsPagination`,
  DELETE_DRESS_CODE: `${BASE_URI}/api/MasterData/DressCode/Delete`,
  CREATE_DRESS_CODE: `${BASE_URI}/api/MasterData/DressCode/Create`,
  UPDATE_DRESS_CODE: `${BASE_URI}/api/MasterData/DressCode/Update`,

  GET_DOCUMENT_TYPE: `${BASE_URI}/api/MasterData/DocumentType/GetItemsPagination`,
  DELETE_DOCUMENT_TYPE: `${BASE_URI}/api/MasterData/DocumentType/Delete`,
  CREATE_DOCUMENT_TYPE: `${BASE_URI}/api/MasterData/DocumentType/Create`,
  UPDATE_DOCUMENT_TYPE: `${BASE_URI}/api/MasterData/DocumentType/Update`,

  GET_BED_STATUS: `${BASE_URI}/api/MasterData/BedStatus/GetItemsPagination`,
  DELETE_BED_STATUS: `${BASE_URI}/api/MasterData/BedStatus/Delete`,
  CREATE_BED_STATUS: `${BASE_URI}/api/MasterData/BedStatus/Create`,
  UPDATE_BED_STATUS: `${BASE_URI}/api/MasterData/BedStatus/Update`,

  GET_EMPLOYEE_TYPE: `${BASE_URI}/api/MasterData/EmployeeType/GetItemsPagination`,
  DELETE_EMPLOYEE_TYPE: `${BASE_URI}/api/MasterData/EmployeeType/Delete`,
  CREATE_EMPLOYEE_TYPE: `${BASE_URI}/api/MasterData/EmployeeType/Create`,
  UPDATE_EMPLOYEE_TYPE: `${BASE_URI}/api/MasterData/EmployeeType/Update`,

  GET_GENDER: `${BASE_URI}/api/MasterData/Gender/GetItemsPagination`,
  CREATE_GENDER: `${BASE_URI}/api/MasterData/Gender/Create`,
  UPDATE_GENDER: `${BASE_URI}/api/MasterData/Gender/Update`,
  DELETE_GENDER: `${BASE_URI}/api/MasterData/Gender/Delete`,

  GET_SPONSOR: `${BASE_URI}/api/MasterData/InsuranceCompany/GetItemsPagination`,
  CREATE_SPONSOR: `${BASE_URI}/api/MasterData/InsuranceCompany/Create`,
  UPDATE_SPONSOR: `${BASE_URI}/api/MasterData/InsuranceCompany/Update`,
  DELETE_SPONSOR: `${BASE_URI}/api/MasterData/InsuranceCompany/Delete`,

  GET_LANGUAGE: `${BASE_URI}/api/MasterData/Language/GetItemsPagination`,
  CREATE_LANGUAGE: `${BASE_URI}/api/MasterData/Language/Create`,
  UPDATE_LANGUAGE: `${BASE_URI}/api/MasterData/Language/Update`,
  DELETE_LANGUAGE: `${BASE_URI}/api/MasterData/Language/Delete`,

  GET_LOCALITY: `${BASE_URI}/api/MasterData/Locality/GetItemsPagination`,
  CREATE_LOCALITY: `${BASE_URI}/api/MasterData/Locality/Create`,
  UPDATE_LOCALITY: `${BASE_URI}/api/MasterData/Locality/Update`,
  DELETE_LOCALITY: `${BASE_URI}/api/MasterData/Locality/Delete`,

  GET_ZIPCODE: `${BASE_URI}/api/MasterData/LocalityZIP/GetItemsPagination`,
  CREATE_ZIPCODE: `${BASE_URI}/api/MasterData/Locality/Create`,
  UPDATE_ZIPCODE: `${BASE_URI}/api/MasterData/Locality/Update`,

  GET_MARITALSTATUS: `${BASE_URI}/api/MasterData/MaritalStatus/GetItemsPagination`,
  CREATE_MARITALSTATUS: `${BASE_URI}/api/MasterData/MaritalStatus/Create`,
  UPDATE_MARITALSTATUS: `${BASE_URI}/api/MasterData/MaritalStatus/Update`,
  DELETE_MARITALSTATUS: `${BASE_URI}/api/MasterData/MaritalStatus/Delete`,

  GET_NATIONALLITY: `${BASE_URI}/api/MasterData/Nationality/GetItemsPagination`,
  CREATE_NATIONALLITY: `${BASE_URI}/api/MasterData/Nationality/Create`,
  UPDATE_NATIONALLITY: `${BASE_URI}/api/MasterData/Nationality/Update`,
  DELETE_NATIONALLITY: `${BASE_URI}/api/MasterData/Nationality/Delete`,

  GET_OCCUPATION: `${BASE_URI}/api/MasterData/Occupation/GetItemsPagination`,
  CREATE_OCCUPATION: `${BASE_URI}/api/MasterData/Occupation/Create`,
  UPDATE_OCCUPATION: `${BASE_URI}/api/MasterData/Occupation/Update`,
  DELETE_OCCUPATION: `${BASE_URI}/api/MasterData/Occupation/Delete`,

  GET_PAYMENTMODE: `${BASE_URI}/api/MasterData/PaymentMode/GetItemsPagination`,
  CREATE_PAYMENTMODE: `${BASE_URI}/api/MasterData/PaymentMode/Create`,
  UPDATE_PAYMENTMODE: `${BASE_URI}/api/MasterData/PaymentMode/Update`,
  DELETE_PAYMENTMODE: `${BASE_URI}/api/MasterData/PaymentMode/Delete`,

  GET_PAYMENTTYPE: `${BASE_URI}/api/MasterData/PaymentType/GetItemsPagination`,
  CREATE_PAYMENTTYPE: `${BASE_URI}/api/MasterData/PaymentType/Create`,
  UPDATE_PAYMENTTYPE: `${BASE_URI}/api/MasterData/PaymentType/Update`,
  DELETE_PAYMENTTYPE: `${BASE_URI}/api/MasterData/PaymentType/Delete`,

  GET_QUALIFICATION: `${BASE_URI}/api/MasterData/Qualification/GetItemsPagination`,
  CREATE_QUALIFICATION: `${BASE_URI}/api/MasterData/Qualification/Create`,
  UPDATE_QUALIFICATION: `${BASE_URI}/api/MasterData/Qualification/Update`,
  DELETE_QUALIFICATION: `${BASE_URI}/api/MasterData/Qualification/Delete`,

  GET_REFERRINGDOCTOR: `${BASE_URI}/api/MasterData/ReferringDoctor/GetItemsPagination`,
  CREATE_REFERRINGDOCTOR: `${BASE_URI}/api/MasterData/ReferringDoctor/Create`,
  UPDATE_REFERRINGDOCTOR: `${BASE_URI}/api/MasterData/ReferringDoctor/Update`,
  DELETE_REFERRINGDOCTOR: `${BASE_URI}/api/MasterData/ReferringDoctor/Delete`,

  GET_RELIGION: `${BASE_URI}/api/MasterData/Religion/GetItemsPagination`,
  CREATE_RELIGION: `${BASE_URI}/api/MasterData/Religion/Create`,
  UPDATE_RELIGION: `${BASE_URI}/api/MasterData/Religion/Update`,
  DELETE_RELIGION: `${BASE_URI}/api/MasterData/Religion/Delete`,

  GET_SKINCOLOR: `${BASE_URI}/api/MasterData/SkinColor/GetItemsPagination`,
  CREATE_SKINCOLOR: `${BASE_URI}/api/MasterData/SkinColor/Create`,
  UPDATE_SKINCOLOR: `${BASE_URI}/api/MasterData/SkinColor/Update`,
  DELETE_SKINCOLOR: `${BASE_URI}/api/MasterData/SkinColor/Delete`,

  GET_TITLE: `${BASE_URI}/api/MasterData/Title/GetItemsPagination`,
  CREATE_TITLE: `${BASE_URI}/api/MasterData/Title/Create`,
  UPDATE_TITLE: `${BASE_URI}/api/MasterData/Title/Update`,
  DELETE_TITLE: `${BASE_URI}/api/MasterData/Title/Delete`,

  GET_VIPREASON: `${BASE_URI}/api/MasterData/VIPReason/GetItemsPagination`,
  CREATE_VIPREASON: `${BASE_URI}/api/MasterData/VIPReason/Create`,
  UPDATE_VIPREASON: `${BASE_URI}/api/MasterData/VIPReason/Update`,
  DELETE_VIPREASON: `${BASE_URI}/api/MasterData/VIPReason/Delete`,

  GET_VISASTATUS: `${BASE_URI}/api/MasterData/VisaStatus/GetItemsPagination`,
  CREATE_VISASTATUS: `${BASE_URI}/api/MasterData/VisaStatus/Create`,
  UPDATE_VISASTATUS: `${BASE_URI}/api/MasterData/VisaStatus/Update`,
  DELETE_VISASTATUS: `${BASE_URI}/api/MasterData/VisaStatus/Delete`,

  GET_STATION: `${BASE_URI}/api/MasterData/Station/GetItemsPagination`,
  CREATE_STATION: `${BASE_URI}/api/MasterData/Station/Create`,
  UPDATE_STATION: `${BASE_URI}/api/MasterData/Station/Update`,
  DELETE_STATION: `${BASE_URI}/api/MasterData/Station/Delete`,

  GET_ROLE: `${BASE_URI}/api/Identity/Role/GetItemsPagination`,
  CREATE_ROLE: `${BASE_URI}/api/Identity/Role/Create`,
  UPDATE_ROLE: `${BASE_URI}/api/Identity/Role/Update`,
  DELETE_ROLE: `${BASE_URI}/api/Identity/Role/Delete`,

  GET_BLOCK_TYPE: `${BASE_URI}/api/MasterData/BlockType/GetItemsPagination`,
  CREATE_BLOCK_TYPE: `${BASE_URI}/api/MasterData/BlockType/Create`,
  UPDATE_BLOCK_TYPE: `${BASE_URI}/api/MasterData/BlockType/Update`,
  DELETE_BLOCK_TYPE: `${BASE_URI}/api/MasterData/BlockType/Delete`,

  BED_BLOCK_AND_UNBLOCK: `${BASE_URI}/api/MasterData/Bed/UpdateBedMaintenanceStatus`,

  GET_CONTACT_TYPE: `${BASE_URI}/api/MasterData/ContactType/GetItemsPagination`,
  CREATE_CONTACT_TYPE: `${BASE_URI}/api/MasterData/ContactType/Create`,
  UPDATE_CONTACT_TYPE: `${BASE_URI}/api/MasterData/ContactType/Update`,
  DELETE_CONTACT_TYPE: `${BASE_URI}/api/MasterData/ContactType/Delete`,

  GET_RESOURCE: `${BASE_URI}/api/MasterData/Resource/GetItemsPagination`,
  CREATE_RESOURCE: `${BASE_URI}/api/MasterData/Resource/Create`,
  UPDATE_RESOURCE: `${BASE_URI}/api/MasterData/Resource/Update`,
  DELETE_RESOURCE: `${BASE_URI}/api/MasterData/Resource/Delete`,

  GET_APPOINTMENT_TYPE: `${BASE_URI}/api/MasterData/AppointmentType/GetItemsPagination`,
  CREATE_APPOINTMENT_TYPE: `${BASE_URI}/api/MasterData/AppointmentType/Create`,
  UPDATE_APPOINTMENT_TYPE: `${BASE_URI}/api/MasterData/AppointmentType/Update`,
  DELETE_APPOINTMENT_TYPE: `${BASE_URI}/api/MasterData/AppointmentType/Delete`,

  GET_RESCHEDULE_REASON: `${BASE_URI}/api/MasterData/RescheduleReason/GetItemsPagination`,
  CREATE_RESCHEDULE_REASON: `${BASE_URI}/api/MasterData/RescheduleReason/Create`,
  UPDATE_RESCHEDULE_REASON: `${BASE_URI}/api/MasterData/RescheduleReason/Update`,
  DELETE_RESCHEDULE_REASON: `${BASE_URI}/api/MasterData/RescheduleReason/Delete`,

  GET_CLINICAL_COMPLICATION_TYPE: `${BASE_URI}/api/MasterData/ClinicalComplicationType/GetItemsPagination`,
  CREATE_CLINICAL_COMPLICATION_TYPE: `${BASE_URI}/api/MasterData/ClinicalComplicationType/Create`,
  UPDATE_CLINICAL_COMPLICATION_TYPE: `${BASE_URI}/api/MasterData/ClinicalComplicationType/Update`,
  DELETE_CLINICAL_COMPLICATION_TYPE: `${BASE_URI}/api/MasterData/ClinicalComplicationType/Delete`,

  GET_EMPLOYEE_CATEGORY: `${BASE_URI}/api/MasterData/EmployeeCategory/GetItemsPagination`,
  CREATE_EMPLOYEE_CATEGORY: `${BASE_URI}/api/MasterData/EmployeeCategory/Create`,
  UPDATE_EMPLOYEE_CATEGORY: `${BASE_URI}/api/MasterData/EmployeeCategory/Update`,
  DELETE_EMPLOYEE_CATEGORY: `${BASE_URI}/api/MasterData/EmployeeCategory/Delete`,


  GET_SURGERY: `${BASE_URI}/api/MasterData/Surgery/GetItemsPagination`,
  CREATE_SURGERY: `${BASE_URI}/api/MasterData/Surgery/Create`,
  UPDATE_SURGERY: `${BASE_URI}/api/MasterData/Surgery/Update`,
  DELETE_SURGERY: `${BASE_URI}/api/MasterData/Surgery/Delete`,

  GET_SERIES: `${BASE_URI}/api/MasterData/Series/GetItemsPagination `,
  CREATE_SERIES: `${BASE_URI}/api/MasterData/Series/Create`,
  UPDATE_SERIES: `${BASE_URI}/api/MasterData/Series/Update`,
  DELETE_SERIES: `${BASE_URI}/api/MasterData/Series/Delete`,

  GET_VISIT_TYPE: `${BASE_URI}/api/MasterData/VisitType/GetItemsPagination`,
  CREATE_VISIT_TYPE: `${BASE_URI}/api/MasterData/VisitType/Create`,
  UPDATE_VISIT_TYPE: `${BASE_URI}/api/MasterData/VisitType/Update`,
  DELETE_VISIT_TYPE: `${BASE_URI}/api/MasterData/VisitType/Delete`,

  GET_EQUIPMENT: `${BASE_URI}/api/MasterData/Equipment/GetItemsPagination`,
  CREATE_EQUIPMENT: `${BASE_URI}/api/MasterData/Equipment/Create`,
  UPDATE_EQUIPMENT: `${BASE_URI}/api/MasterData/Equipment/Update`,
  DELETE_EQUIPMENT: `${BASE_URI}/api/MasterData/Equipment/Delete`,


  GET_USER: `${BASE_URI}/api/Identity/User/GetItemsPagination`,
  GET_USER_BY_ID: `${BASE_URI}/api/Identity/User/GetItemById`,
  CREATE_USER: `${BASE_URI}/api/Identity/User/Create`,
  UPDATE_USER: `${BASE_URI}/api/Identity/User/Update`,
  DELETE_USER: `${BASE_URI}/api/Identity/User/Delete`,

  GET_SAMPLE: `${BASE_URI}/api/MasterData/Sample/GetItemsPagination`,
  CREATE_SAMPLE: `${BASE_URI}/api/MasterData/Sample/Create`,
  UPDATE_SAMPLE: `${BASE_URI}/api/MasterData/Sample/Update`,
  DELETE_SAMPLE: `${BASE_URI}/api/MasterData/Sample/Delete`,

  GET_UNIT_OF_MEASURE: `${BASE_URI}/api/MasterData/UnitOfMeasure/GetItemsPagination`,
  CREATE_UNIT_OF_MEASURE: `${BASE_URI}/api/MasterData/UnitOfMeasure/Create`,
  UPDATE_UNIT_OF_MEASURE: `${BASE_URI}/api/MasterData/UnitOfMeasure/Update`,
  DELETE_UNIT_OF_MEASURE: `${BASE_URI}/api/MasterData/UnitOfMeasure/Delete`,

  GET_SAMPLE_CONTAINER: `${BASE_URI}/api/MasterData/SampleContainer/GetItemsPagination`,
  CREATE_SAMPLE_CONTAINER: `${BASE_URI}/api/MasterData/SampleContainer/Create`,
  UPDATE_SAMPLE_CONTAINER: `${BASE_URI}/api/MasterData/SampleContainer/Update`,
  DELETE_SAMPLE_CONTAINER: `${BASE_URI}/api/MasterData/SampleContainer/Delete`,

  GET_PROFILE: `${BASE_URI}/api/MasterData/ProfileTest/GetItemsPagination`,
  CREATE_PROFILE: `${BASE_URI}/api/MasterData/ProfileTest/Create`,
  UPDATE_PROFILE: `${BASE_URI}/api/MasterData/ProfileTest/Update`,
  DELETE_PROFILE: `${BASE_URI}/api/MasterData/ProfileTest/Delete`,

  GET_SERVICE: `${BASE_URI}/api/MasterData/ServiceItem/GetItemsPagination`,
  CREATE_SERVICE: `${BASE_URI}/api/MasterData/ServiceItem/Create`,
  UPDATE_SERVICE: `${BASE_URI}/api/MasterData/ServiceItem/Update`,
  DELETE_SERVICE: `${BASE_URI}/api/MasterData/ServiceItem/Delete`,

  GET_SAMPLE_STATUS: `${BASE_URI}/api/MasterData/TestStatus/GetItemsPagination`,
  CREATE_SAMPLE_STATUS: `${BASE_URI}/api/MasterData/TestStatus/Create`,
  UPDATE_SAMPLE_STATUS: `${BASE_URI}/api/MasterData/TestStatus/Update`,
  DELETE_SAMPLE_STATUS: `${BASE_URI}/api/MasterData/TestStatus/Delete`,

  GET_TEST: `${BASE_URI}/api/MasterData/Test/GetItemsPagination`,
  CREATE_TEST: `${BASE_URI}/api/MasterData/Test/Create`,
  UPDATE_TEST: `${BASE_URI}/api/MasterData/Test/Update`,
  DELETE_TEST: `${BASE_URI}/api/MasterData/Test/Delete`,

  GET_BANK_DETAIL: `${BASE_URI}/api/MasterData/BankDetail/GetItemsPagination`,
  CREATE_BANK_DETAIL: `${BASE_URI}/api/MasterData/BankDetail/Create`,
  UPDATE_BANK_DETAIL: `${BASE_URI}/api/MasterData/BankDetail/Update`,
  DELETE_BANK_DETAIL: `${BASE_URI}/api/MasterData/BankDetail/Delete`,

  GET_DISCOUNT_TYPE: `${BASE_URI}/api/MasterData/DiscountType/GetItemsPagination`,
  CREATE_DISCOUNT_TYPE: `${BASE_URI}/api/MasterData/DiscountType/Create`,
  UPDATE_DISCOUNT_TYPE: `${BASE_URI}/api/MasterData/DiscountType/Update`,
  DELETE_DISCOUNT_TYPE: `${BASE_URI}/api/MasterData/DiscountType/Delete`,

  GET_DOCTOR_FEE: `${BASE_URI}/api/MasterData/DoctorFee/GetItemsPagination`,
  CREATE_DOCTOR_FEE: `${BASE_URI}/api/MasterData/DoctorFee/Create`,
  UPDATE_DOCTOR_FEE: `${BASE_URI}/api/MasterData/DoctorFee/Update`,
  DELETE_DOCTOR_FEE: `${BASE_URI}/api/MasterData/DoctorFee/Delete`,

  GET_FACILITATOR: `${BASE_URI}/api/MasterData/Facilitator/GetItemsPagination`,
  CREATE_FACILITATOR: `${BASE_URI}/api/MasterData/Facilitator/Create`,
  UPDATE_FACILITATOR: `${BASE_URI}/api/MasterData/Facilitator/Update`,
  DELETE_FACILITATOR: `${BASE_URI}/api/MasterData/Facilitator/Delete`,

  GET_MERCHANT: `${BASE_URI}/api/MasterData/Merchant/GetItemsPagination`,
  CREATE_MERCHANT: `${BASE_URI}/api/MasterData/Merchant/Create`,
  UPDATE_MERCHANT: `${BASE_URI}/api/MasterData/Merchant/Update`,
  DELETE_MERCHANT: `${BASE_URI}/api/MasterData/Merchant/Delete`,

  GET_RESULT_TEMPALTE: `${BASE_URI}/api/MasterData/ResultTemplate/GetItemsPagination`,
  CREATE_RESULT_TEMPALTE: `${BASE_URI}/api/MasterData/ResultTemplate/Create`,
  UPDATE_RESULT_TEMPALTE: `${BASE_URI}/api/MasterData/ResultTemplate/Update`,
  DELETE_RESULT_TEMPALTE: `${BASE_URI}/api/MasterData/ResultTemplate/Delete`,

  GET_COMPONENT: `${BASE_URI}/api/MasterData/Component/GetItemsPagination`,
  CREATE_COMPONENT: `${BASE_URI}/api/MasterData/Component/Create`,
  UPDATE_COMPONENT: `${BASE_URI}/api/MasterData/Component/Update`,
  DELETE_COMPONENT: `${BASE_URI}/api/MasterData/Component/Delete`,

  GET_PACKAGE: `${BASE_URI}/api/MasterData/Package/GetItemsPagination`,
  CREATE_PACKAGE: `${BASE_URI}/api/MasterData/Package/Create`,
  UPDATE_PACKAGE: `${BASE_URI}/api/MasterData/Package/Update`,
  DELETE_PACKAGE: `${BASE_URI}/api/MasterData/Package/Delete`,

  GET_EMI_SCHEME: `${BASE_URI}/api/MasterData/EMIScheme/GetItemsPagination`,

  GET_RESULT_VALUE: `${BASE_URI}/api/MasterData/ResultValue/GetItemsPagination`,
  CREATE_RESULT_VALUE: `${BASE_URI}/api/MasterData/ResultValue/Create`,
  UPDATE_RESULT_VALUE: `${BASE_URI}/api/MasterData/ResultValue/Update`,
  DELETE_RESULT_VALUE: `${BASE_URI}/api/MasterData/ResultValue/Delete`,


  GET_LOCATION: `${BASE_URI}/api/MasterData/Location/GetItemsPagination`,
  CREATE_LOCATION: `${BASE_URI}/api/MasterData/Location/Create`,
  UPDATE_LOCATION: `${BASE_URI}/api/MasterData/Location/Update`,
  DELETE_LOCATION: `${BASE_URI}/api/MasterData/Location/Delete`,


  GET_TARIFF: `${BASE_URI}/api/MasterData/Tariff/GetItemsPagination`,
  CREATE_TARIFF: `${BASE_URI}/api/MasterData/Tariff/Create`,
  UPDATE_TARIFF: `${BASE_URI}/api/MasterData/Tariff/Update`,
  DELETE_TARIFF: `${BASE_URI}/api/MasterData/Tariff/Delete`,

  GET_TARIFFITEM: `${BASE_URI}/api/MasterData/TariffItem/GetItemsPagination`,
  CREATE_TARIFFITEM: `${BASE_URI}/api/MasterData/TariffItem/Create`,
  UPDATE_TARIFFITEM: `${BASE_URI}/api/MasterData/TariffItem/Update`,
  DELETE_TARIFFITEM: `${BASE_URI}/api/MasterData/TariffItem/Delete`,

  GET_DISCOUNTAUTHORITYMATRIX: `${BASE_URI}/api/MasterData/DiscountAuthorityMatrix/GetItemsPagination`,
  CREATE_DISCOUNTAUTHORITYMATRIX: `${BASE_URI}/api/MasterData/DiscountAuthorityMatrix/Create`,
  UPDATE_DISCOUNTAUTHORITYMATRIX: `${BASE_URI}/api/MasterData/DiscountAuthorityMatrix/Update`,
  DELETE_DISCOUNTAUTHORITYMATRIX: `${BASE_URI}/api/MasterData/DiscountAuthorityMatrix/Delete`,

  GET_REFUNDDEPOSITLOGIC: `${BASE_URI}/api/MasterData/DepositRefundLogic/GetItemsPagination`,
  CREATE_REFUNDDEPOSITLOGIC: `${BASE_URI}/api/MasterData/DepositRefundLogic/Create`,
  UPDATE_REFUNDDEPOSITLOGIC: `${BASE_URI}/api/MasterData/DepositRefundLogic/Update`,
  DELETE_REFUNDDEPOSITLOGIC: `${BASE_URI}/api/MasterData/DepositRefundLogic/Delete`,

  GET_SERVICEGATEGORY: `${BASE_URI}/api/MasterData/ServiceCategory/GetItemsPagination`,
  CREATE_SERVICEGATEGORY: `${BASE_URI}/api/MasterData/ServiceCategory/Create`,
  UPDATE_SERVICEGATEGORY: `${BASE_URI}/api/MasterData/ServiceCategory/Update`,
  DELETE_SERVICEGATEGORY: `${BASE_URI}/api/MasterData/ServiceCategory/Delete`,


  GET_STAGE: `${BASE_URI}/api/MasterData/Stage/GetItemsPagination`,
  CREATE_STAGE: `${BASE_URI}/api/MasterData/Stage/Create`,
  UPDATE_STAGE: `${BASE_URI}/api/MasterData/Stage/Update`,
  DELETE_STAGE: `${BASE_URI}/api/MasterData/Stage/Delete`,


  GET_CYCLE: `${BASE_URI}/api/MasterData/Cycle/GetItemsPagination`,
  CREATE_CYCLE: `${BASE_URI}/api/MasterData/Cycle/Create`,
  UPDATE_CYCLE: `${BASE_URI}/api/MasterData/Cycle/Update`,
  DELETE_CYCLE: `${BASE_URI}/api/MasterData/Cycle/Delete`,

  GET_DEPOSITREFUNDLOGIC: `${BASE_URI}/api/MasterData/DepositRefundLogic/GetItemsPagination`,
  CREATE_DEPOSITREFUNDLOGIC: `${BASE_URI}/api/MasterData/DepositRefundLogic/Create`,
  UPDATE_DEPOSITREFUNDLOGIC: `${BASE_URI}/api/MasterData/DepositRefundLogic/Update`,
  DELETE_DEPOSITREFUNDLOGIC: `${BASE_URI}/api/MasterData/DepositRefundLogic/Delete`,

  GET_DISCOUNTREASON: `${BASE_URI}/api/MasterData/DiscountReason/GetItemsPagination`,
  CREATE_DISCOUNTREASON: `${BASE_URI}/api/MasterData/DiscountReason/Create`,
  UPDATE_DISCOUNTREASON: `${BASE_URI}/api/MasterData/DiscountReason/Update`,
  DELETE_DISCOUNTREASON: `${BASE_URI}/api/MasterData/DiscountReason/Delete`,

  GET_SUBDEPARTMENT: `${BASE_URI}/api/MasterData/SubDepartment/GetItemsPagination`,
  CREATE_SUBDEPARTMENT: `${BASE_URI}/api/MasterData/SubDepartment/Create`,
  UPDATE_SUBDEPARTMENT: `${BASE_URI}/api/MasterData/SubDepartment/Update`,
  DELETE_SUBDEPARTMENT: `${BASE_URI}/api/MasterData/SubDepartment/Delete`,

  GET_GENDERAPPLICABILITY: `${BASE_URI}/api/MasterData/GenderApplicability/GetItemsPagination`,
  CREATE_GENDERAPPLICABILITY: `${BASE_URI}/api/MasterData/GenderApplicability/Create`,
  UPDATE_GENDERAPPLICABILITY: `${BASE_URI}/api/MasterData/GenderApplicability/Update`,
  DELETE_GENDERAPPLICABILITY: `${BASE_URI}/api/MasterData/GenderApplicability/Delete`,

  GET_TRANSACTIONTYPE: `${BASE_URI}/api/MasterData/TransactionType/GetItemsPagination`,
  CREATE_TRANSACTIONTYPE: `${BASE_URI}/api/MasterData/TransactionType/Create`,
  UPDATE_TRANSACTIONTYPE: `${BASE_URI}/api/MasterData/TransactionType/Update`,
  DELETE_TRANSACTIONTYPE: `${BASE_URI}/api/MasterData/TransactionType/Delete`,

  GET_BED_BLOCK_REASON: `${BASE_URI}/api/MasterData/BedBlockReason/GetItemsPagination`,
  CREATE_BED_BLOCK_REASON: `${BASE_URI}/api/MasterData/BedBlockReason/Create`,
  UPDATE_BED_BLOCK_REASON: `${BASE_URI}/api/MasterData/BedBlockReason/Update`,
  DELETE_BED_BLOCK_REASON: `${BASE_URI}/api/MasterData/BedBlockReason/Delete`,

  GET_SPECIALITY: `${BASE_URI}/api/MasterData/Speciality/GetItemsPagination`,
  CREATE_SPECIALITY: `${BASE_URI}/api/MasterData/Speciality/Create`,
  UPDATE_SPECIALITY: `${BASE_URI}/api/MasterData/Speciality/Update`,
  DELETE_SPECIALITY: `${BASE_URI}/api/MasterData/Speciality/Delete`,

  // Clinical masters
  GET_CONSULTATION_REASON: `${BASE_URI}/api/MasterData/ConsultationReason/GetItemsPagination`,
  CREATE_CONSULTATION_REASON: `${BASE_URI}/api/MasterData/ConsultationReason/Create`,
  UPDATE_CONSULTATION_REASON: `${BASE_URI}/api/MasterData/ConsultationReason/Update`,
  DELETE_CONSULTATION_REASON: `${BASE_URI}/api/MasterData/ConsultationReason/Delete`,

  GET_DYSMENORRHEA_REASON: `${BASE_URI}/api/MasterData/Dysmenorrhea/GetItemsPagination`,
  CREATE_DYSMENORRHEA_REASON: `${BASE_URI}/api/MasterData/Dysmenorrhea/Create`,
  UPDATE_DYSMENORRHEA_REASON: `${BASE_URI}/api/MasterData/Dysmenorrhea/Update`,
  DELETE_DYSMENORRHEA_REASON: `${BASE_URI}/api/MasterData/Dysmenorrhea/Delete`,

  GET_COUPLE_CONSANGUINITY_REASON: `${BASE_URI}/api/MasterData/CoupleConsanguinity/GetItemsPagination`,
  CREATE_COUPLE_CONSANGUINITY_REASON: `${BASE_URI}/api/MasterData/CoupleConsanguinity/Create`,
  UPDATE_COUPLE_CONSANGUINITY_REASON: `${BASE_URI}/api/MasterData/CoupleConsanguinity/Update`,
  DELETE_COUPLE_CONSANGUINITY_REASON: `${BASE_URI}/api/MasterData/CoupleConsanguinity/Delete`,

  GET_CONTRACEPTIVE_METHOD_REASON: `${BASE_URI}/api/MasterData/ContraceptiveMethod/GetItemsPagination`,
  CREATE_CONTRACEPTIVE_METHOD_REASON: `${BASE_URI}/api/MasterData/ContraceptiveMethod/Create`,
  UPDATE_CONTRACEPTIVE_METHOD_REASON: `${BASE_URI}/api/MasterData/ContraceptiveMethod/Update`,
  DELETE_CONTRACEPTIVE_METHOD_REASON: `${BASE_URI}/api/MasterData/ContraceptiveMethod/Delete`,

  GET_TRANSLATOR: `${BASE_URI}/api/MasterData/Translator/GetItemsPagination`,
  CREATE_TRANSLATOR: `${BASE_URI}/api/MasterData/Translator/Create`,
  UPDATE_TRANSLATOR: `${BASE_URI}/api/MasterData/Translator/Update`,
  DELETE_TRANSLATOR: `${BASE_URI}/api/MasterData/Translator/Delete`,

  GET_SURGERY_INDICATION: `${BASE_URI}/api/MasterData/SurgeryIndication/GetItemsPagination`,
  CREATE_SURGERY_INDICATION: `${BASE_URI}/api/MasterData/SurgeryIndication/Create`,
  UPDATE_SURGERY_INDICATION: `${BASE_URI}/api/MasterData/SurgeryIndication/Update`,
  DELETE_SURGERY_INDICATION: `${BASE_URI}/api/MasterData/SurgeryIndication/Delete`,

  GET_SURGERY_TECHNIQUE: `${BASE_URI}/api/MasterData/SurgeryTechnique/GetItemsPagination`,
  CREATE_SURGERY_TECHNIQUE: `${BASE_URI}/api/MasterData/SurgeryTechnique/Create`,
  UPDATE_SURGERY_TECHNIQUE: `${BASE_URI}/api/MasterData/SurgeryTechnique/Update`,
  DELETE_SURGERY_TECHNIQUE: `${BASE_URI}/api/MasterData/SurgeryTechnique/Delete`,

  GET_SURGICAL_HISTORY_SURGERY_TYPE: `${BASE_URI}/api/MasterData/SurgicalHistorySurgeryType/GetItemsPagination`,
  CREATE_SURGICAL_HISTORY_SURGERY_TYPE: `${BASE_URI}/api/MasterData/SurgicalHistorySurgeryType/Create`,
  UPDATE_SURGICAL_HISTORY_SURGERY_TYPE: `${BASE_URI}/api/MasterData/SurgicalHistorySurgeryType/Update`,
  DELETE_SURGICAL_HISTORY_SURGERY_TYPE: `${BASE_URI}/api/MasterData/SurgicalHistorySurgeryType/Delete`,

  GET_DISORDER: `${BASE_URI}/api/MasterData/Disorder/GetItemsPagination`,
  CREATE_DISORDER: `${BASE_URI}/api/MasterData/Disorder/Create`,
  UPDATE_DISORDER: `${BASE_URI}/api/MasterData/Disorder/Update`,
  DELETE_DISORDER: `${BASE_URI}/api/MasterData/Disorder/Delete`,

  GET_DISORDER_CATEGORY: `${BASE_URI}/api/MasterData/DisorderCategory/GetItemsPagination`,
  CREATE_DISORDER_CATEGORY: `${BASE_URI}/api/MasterData/DisorderCategory/Create`,
  UPDATE_DISORDER_CATEGORY: `${BASE_URI}/api/MasterData/DisorderCategory/Update`,
  DELETE_DISORDER_CATEGORY: `${BASE_URI}/api/MasterData/DisorderCategory/Delete`,

  GET_TAKING_BLOOD_THINNER: `${BASE_URI}/api/MasterData/TakingBloodThinner/GetItemsPagination`,
  CREATE_TAKING_BLOOD_THINNER: `${BASE_URI}/api/MasterData/TakingBloodThinner/Create`,
  UPDATE_TAKING_BLOOD_THINNER: `${BASE_URI}/api/MasterData/TakingBloodThinner/Update`,
  DELETE_TAKING_BLOOD_THINNER: `${BASE_URI}/api/MasterData/TakingBloodThinner/Delete`,

  GET_DRUG: `${BASE_URI}/api/MasterData/Drug/GetItemsPagination`,
  CREATE_DRUG: `${BASE_URI}/api/MasterData/Drug/Create`,
  UPDATE_DRUG: `${BASE_URI}/api/MasterData/Drug/Update`,
  DELETE_DRUG: `${BASE_URI}/api/MasterData/Drug/Delete`,

  GET_MEDICATION_FREQUENCY: `${BASE_URI}/api/MasterData/MedicationFrequency/GetItemsPagination`,
  CREATE_MEDICATION_FREQUENCY: `${BASE_URI}/api/MasterData/MedicationFrequency/Create`,
  UPDATE_MEDICATION_FREQUENCY: `${BASE_URI}/api/MasterData/MedicationFrequency/Update`,
  DELETE_MEDICATION_FREQUENCY: `${BASE_URI}/api/MasterData/MedicationFrequency/Delete`,

  GET_MEDICATION_ROUTE: `${BASE_URI}/api/MasterData/MedicationRoute/GetItemsPagination`,
  CREATE_MEDICATION_ROUTE: `${BASE_URI}/api/MasterData/MedicationRoute/Create`,
  UPDATE_MEDICATION_ROUTE: `${BASE_URI}/api/MasterData/MedicationRoute/Update`,
  DELETE_MEDICATION_ROUTE: `${BASE_URI}/api/MasterData/MedicationRoute/Delete`,

  GET_DRUG_ALLERGY: `${BASE_URI}/api/MasterData/DrugsAllergy/GetItemsPagination`,
  CREATE_DRUG_ALLERGY: `${BASE_URI}/api/MasterData/DrugsAllergy/Create`,
  UPDATE_DRUG_ALLERGY: `${BASE_URI}/api/MasterData/DrugsAllergy/Update`,
  DELETE_DRUG_ALLERGY: `${BASE_URI}/api/MasterData/DrugsAllergy/Delete`,

  GET_CALENDAR_YEAR: `${BASE_URI}/api/MasterData/CalendarYear/GetItemsPagination`,
  CREATE_CALENDAR_YEAR: `${BASE_URI}/api/MasterData/CalendarYear/Create`,
  UPDATE_CALENDAR_YEAR: `${BASE_URI}/api/MasterData/CalendarYear/Update`,
  DELETE_CALENDAR_YEAR: `${BASE_URI}/api/MasterData/CalendarYear/Delete`,

  GET_PREGNANCY_ENDING_TYPE: `${BASE_URI}/api/MasterData/PregnancyEndingType/GetItemsPagination`,
  CREATE_PREGNANCY_ENDING_TYPE: `${BASE_URI}/api/MasterData/PregnancyEndingType/Create`,
  UPDATE_PREGNANCY_ENDING_TYPE: `${BASE_URI}/api/MasterData/PregnancyEndingType/Update`,
  DELETE_PREGNANCY_ENDING_TYPE: `${BASE_URI}/api/MasterData/PregnancyEndingType/Delete`,

  GET_GESTATION_TYPE: `${BASE_URI}/api/MasterData/GestationType/GetItemsPagination`,

  GET_HIRSUTISM: `${BASE_URI}/api/MasterData/Hirsutism/GetItemsPagination`,
  CREATE_HIRSUTISM: `${BASE_URI}/api/MasterData/Hirsutism/Create`,
  UPDATE_HIRSUTISM: `${BASE_URI}/api/MasterData/Hirsutism/Update`,
  DELETE_HIRSUTISM: `${BASE_URI}/api/MasterData/Hirsutism/Delete`,

  GET_GALACTORRHEA: `${BASE_URI}/api/MasterData/Galactorrhea/GetItemsPagination`,
  CREATE_GALACTORRHEA: `${BASE_URI}/api/MasterData/Galactorrhea/Create`,
  UPDATE_GALACTORRHEA: `${BASE_URI}/api/MasterData/Galactorrhea/Update`,
  DELETE_GALACTORRHEA: `${BASE_URI}/api/MasterData/Galactorrhea/Delete`,

  GET_VAGINA: `${BASE_URI}/api/MasterData/Vagina/GetItemsPagination`,
  CREATE_VAGINA: `${BASE_URI}/api/MasterData/Vagina/Create`,
  UPDATE_VAGINA: `${BASE_URI}/api/MasterData/Vagina/Update`,
  DELETE_VAGINA: `${BASE_URI}/api/MasterData/Vagina/Delete`,

  GET_CERVIX_PATHOLOGICAL: `${BASE_URI}/api/MasterData/CervixPathological/GetItemsPagination`,
  CREATE_CERVIX_PATHOLOGICAL: `${BASE_URI}/api/MasterData/CervixPathological/Create`,
  UPDATE_CERVIX_PATHOLOGICAL: `${BASE_URI}/api/MasterData/CervixPathological/Update`,
  DELETE_CERVIX_PATHOLOGICAL: `${BASE_URI}/api/MasterData/CervixPathological/Delete`,

  GET_TREATMENT_TYPE: `${BASE_URI}/api/MasterData/TreatmentType/GetItemsPagination`,
  CREATE_TREATMENT_TYPE: `${BASE_URI}/api/MasterData/TreatmentType/Create`,
  UPDATE_TREATMENT_TYPE: `${BASE_URI}/api/MasterData/TreatmentType/Update`,
  DELETE_TREATMENT_TYPE: `${BASE_URI}/api/MasterData/TreatmentType/Delete`,

  GET_PROTOCOL: `${BASE_URI}/api/MasterData/Protocol/GetItemsPagination`,
  CREATE_PROTOCOL: `${BASE_URI}/api/MasterData/Protocol/Create`,
  UPDATE_PROTOCOL: `${BASE_URI}/api/MasterData/Protocol/Update`,
  DELETE_PROTOCOL: `${BASE_URI}/api/MasterData/Protocol/Delete`,

  GET_PREGNANCY_RESULT: `${BASE_URI}/api/MasterData/PregnancyResult/GetItemsPagination`,
  CREATE_PREGNANCY_RESULT: `${BASE_URI}/api/MasterData/PregnancyResult/Create`,
  UPDATE_PREGNANCY_RESULT: `${BASE_URI}/api/MasterData/PregnancyResult/Update`,
  DELETE_PREGNANCY_RESULT: `${BASE_URI}/api/MasterData/PregnancyResult/Delete`,

  GET_CYCLE_COMPLICATION: `${BASE_URI}/api/MasterData/CycleComplication/GetItemsPagination`,
  CREATE_CYCLE_COMPLICATION: `${BASE_URI}/api/MasterData/CycleComplication/Create`,
  UPDATE_CYCLE_COMPLICATION: `${BASE_URI}/api/MasterData/CycleComplication/Update`,
  DELETE_CYCLE_COMPLICATION: `${BASE_URI}/api/MasterData/CycleComplication/Delete`,

  GET_ULTRASOUND_TYPE: `${BASE_URI}/api/MasterData/TypeOfUltrasound/GetItemsPagination`,
  CREATE_ULTRASOUND_TYPE: `${BASE_URI}/api/MasterData/TypeOfUltrasound/Create`,
  UPDATE_ULTRASOUND_TYPE: `${BASE_URI}/api/MasterData/TypeOfUltrasound/Update`,
  DELETE_ULTRASOUND_TYPE: `${BASE_URI}/api/MasterData/TypeOfUltrasound/Delete`,

  GET_ULTRASOUND_METHOD: `${BASE_URI}/api/MasterData/MethodOfUltrasound/GetItemsPagination`,
  CREATE_ULTRASOUND_METHOD: `${BASE_URI}/api/MasterData/MethodOfUltrasound/Create`,
  UPDATE_ULTRASOUND_METHOD: `${BASE_URI}/api/MasterData/MethodOfUltrasound/Update`,
  DELETE_ULTRASOUND_METHOD: `${BASE_URI}/api/MasterData/MethodOfUltrasound/Delete`,

  GET_RACE_TYPE: `${BASE_URI}/api/MasterData/Race/GetItemsPagination`,
  CREATE_RACE_TYPE: `${BASE_URI}/api/MasterData/Race/Create`,
  UPDATE_RACE_TYPE: `${BASE_URI}/api/MasterData/Race/Update`,
  DELETE_RACE_TYPE: `${BASE_URI}/api/MasterData/Race/Delete`,

  GET_HAIR_TYPE: `${BASE_URI}/api/MasterData/HairType/GetItemsPagination`,
  CREATE_HAIR_TYPE: `${BASE_URI}/api/MasterData/HairType/Create`,
  UPDATE_HAIR_TYPE: `${BASE_URI}/api/MasterData/HairType/Update`,
  DELETE_HAIR_TYPE: `${BASE_URI}/api/MasterData/HairType/Delete`,

  GET_HAIR_COLOR: `${BASE_URI}/api/MasterData/HairColor/GetItemsPagination`,
  CREATE_HAIR_COLOR: `${BASE_URI}/api/MasterData/HairColor/Create`,
  UPDATE_HAIR_COLOR: `${BASE_URI}/api/MasterData/HairColor/Update`,
  DELETE_HAIR_COLOR: `${BASE_URI}/api/MasterData/HairColor/Delete`,

  GET_EYE_COLOR: `${BASE_URI}/api/MasterData/EyeColor/GetItemsPagination`,
  CREATE_EYE_COLOR: `${BASE_URI}/api/MasterData/EyeColor/Create`,
  UPDATE_EYE_COLOR: `${BASE_URI}/api/MasterData/EyeColor/Update`,
  DELETE_EYE_COLOR: `${BASE_URI}/api/MasterData/EyeColor/Delete`,

  GET_UTERINE_CAVITY: `${BASE_URI}/api/MasterData/UterineCavity/GetItemsPagination`,
  CREATE_UTERINE_CAVITY: `${BASE_URI}/api/MasterData/UterineCavity/Create`,
  UPDATE_UTERINE_CAVITY: `${BASE_URI}/api/MasterData/UterineCavity/Update`,
  DELETE_UTERINE_CAVITY: `${BASE_URI}/api/MasterData/UterineCavity/Delete`,

  GET_FALLOPIAN_TUBE_STATUS: `${BASE_URI}/api/MasterData/FallopianTubeStatus/GetItemsPagination`,
  CREATE_FALLOPIAN_TUBE_STATUS: `${BASE_URI}/api/MasterData/FallopianTubeStatus​/Create`,
  UPDATE_FALLOPIAN_TUBE_STATUS: `${BASE_URI}/api/MasterData/FallopianTubeStatus​/Update`,
  DELETE_FALLOPIAN_TUBE_STATUS: `${BASE_URI}/api/MasterData/FallopianTubeStatus​/Delete`,

  GET_TRANSFERRED_QUALITY: `${BASE_URI}/api/MasterData/TransferredQuality/GetItemsPagination`,

  GET_MYOMA_TYPE: `${BASE_URI}/api/MasterData/MyomaType/GetItemsPagination`,
  GET_MYOMA_LOCATION: `${BASE_URI}/api/MasterData/MyomaLocation/GetItemsPagination`,
  GET_MYOMA_HEIGHT: `${BASE_URI}/api/MasterData/MyomaHeight/GetItemsPagination`,

  GET_APPEARANCE: `${BASE_URI}/api/MasterData/Appearance/GetItemsPagination`,
  GET_ADENOMYOSIS_LOCATION: `${BASE_URI}/api/MasterData/AdenomyosisLocation/GetItemsPagination`,
  GET_ADENOMYOSIS_HEIGHT: `${BASE_URI}/api/MasterData/AdenomyosisHeight/GetItemsPagination`,
  GET_ENDOMETRIAL_POLYP_APPEARANCE: `${BASE_URI}/api/MasterData/EndometrialPolypAppearance/GetItemsPagination`,

  GET_ENDOMETRIAL_POLYP_HEIGHT: `${BASE_URI}/api/MasterData/EndometrialPolypHeight/GetItemsPagination`,

  GET_ENDOMETRIAL_ECOGENITY: `${BASE_URI}/api/MasterData/EndometrialEcogenity/GetItemsPagination`,

  GET_ENDOMETRIAL_LIQUID: `${BASE_URI}/api/MasterData/EndometrialLiquid/GetItemsPagination`,

  GET_ULTRASOUND_ATTACHED_LOCATION: `${BASE_URI}/api/MasterData/UltrasoundAttachedLocation/GetItemsPagination`,

  GET_ULTRASOUND_ESSURE: `${BASE_URI}/api/MasterData/UltrasoundEssure/GetItemsPagination`,
  GET_ENDOMETRIAL_APPEARANCE: `${BASE_URI}/api/MasterData/EndometrialAppearance/GetItemsPagination`,
  GET_MALFORMATION: `${BASE_URI}/api/MasterData/Malformation/GetItemsPagination`,
  GET_CERVICAL_PATHOLOGY: `${BASE_URI}/api/MasterData/CervicalPathology/GetItemsPagination`,

  GET_PUERPERAL_PATHOLOGY: `${BASE_URI}/api/MasterData/PuerperalPathology/GetItemsPagination`,
  GET_OBSTETRIC_PATHOLOGY: `${BASE_URI}/api/MasterData/ObstetricPathology/GetItemsPagination`,
  GET_DELIVERY_MODE: `${BASE_URI}/api/MasterData/DeliveryMode/GetItemsPagination`,

  GET_TREATMENT_INDICATION: `${BASE_URI}/api/MasterData/TreatmentIndication/GetItemsPagination`,
  GET_TREATMENT_DIAGNOSIS: `${BASE_URI}/api/MasterData/TreatmentDiagnosis/GetItemsPagination`,
  GET_ABNORMALITY: `${BASE_URI}/api/MasterData/Abnormality/GetItemsPagination`,
  GET_PATHOLOGICAL: `${BASE_URI}/api/MasterData/Pathological/GetItemsPagination`,
  GET_COMPLIMENTARY_TEST_DETAIL: `${BASE_URI}/api/MasterData/ComplimentaryTestDetail/GetItemsPagination`,

  GET_ULTRASOUND_ATTACHED_TYPE: `${BASE_URI}/api/MasterData/UltrasoundAttachedType/GetItemsPagination`,
  GET_ULTRASOUND_ATTACHED_CONTENT: `${BASE_URI}/api/MasterData/UltrasoundAttachedContent/GetItemsPagination`,
  GET_ULTRASOUND_ATTACHED_IMP_DIAGNOSIS: `${BASE_URI}/api/MasterData/UltrasoundAttachedImpDiagnosis/GetItemsPagination`,

  GET_ALL_CLINIC_MEDICAL_STAFF: `${BASE_URI}/api/MasterData/MedicalStaff/GetMedicalStaffPagination`,
  GET_KIT_TEMPLATE: `${BASE_URI}/api/MasterData/KITTemplate/GetItemsPagination`,
  GET_KIT_TEMPLATE_BY_ID: `${BASE_URI}/api/MasterData/KITTemplate/GetItemById`,

  GET_PAINLOCATION: `${BASE_URI}/api/MasterData/PainLocation/GetItemsPagination`,
  GET_PAINFREQUENCY: `${BASE_URI}/api/MasterData/PainFrequency/GetItemsPagination`,
  GET_PAINDESCRIPTION: `${BASE_URI}/api/MasterData/PainDescription/GetItemsPagination`,
  GET_COVID_VACCINATION: `${BASE_URI}/api/MasterData/COVIDVaccination/GetItemsPagination`,

  //refund Reason
  GET_REFUND_REASON: `${BASE_URI}/api/MasterData/RefundReason/GetItemsPagination`,
  CREATE_REFUND_REASON: `${BASE_URI}/api/MasterData/RefundReason/Create`,
  UPDATE_REFUND_REASON: `${BASE_URI}/api/MasterData/RefundReason/Update`,
  DELETE_REFUND_REASON: `${BASE_URI}/api/MasterData/RefundReason/Delete`,
  GET_REFUND_REASON_BY_ID: `${BASE_URI}/api/MasterData/RefundReason/GetItemById`,

  //currency
  GET_CURRENCY: `${BASE_URI}/api/MasterData/Currency/GetItemsPagination`,
  CREATE_CURRENCY: `${BASE_URI}/api/MasterData/Currency/Create`,
  UPDATE_CURRENCY: `${BASE_URI}/api/MasterData/Currency/Update`,
  DELETE_CURRENCY: `${BASE_URI}/api/MasterData/Currency/Delete`,
  GET_CURRENCY_BY_ID: `${BASE_URI}/api/MasterData/Currency/GetItemById`,

  //all new diagnosis screen ( ICD10 code diagnosis)
  GET_ICD10_CODEDIAGNOSIS: `${BASE_URI}/api/MasterData/ICD10CodeDiagnosis/GetItemsPagination`,
  CREATE_ICD10_CODEDIAGNOSIS: `${BASE_URI}/api/MasterData/ICD10CodeDiagnosis/Create`,
  UPDATE_ICD10_CODEDIAGNOSIS: `${BASE_URI}/api/MasterData/ICD10CodeDiagnosis/Update`,
  DELETE_ICD10_CODEDIAGNOSIS: `${BASE_URI}/api/MasterData/ICD10CodeDiagnosis/Delete`,
  GET_ICD10_CODEDIAGNOSIS_BY_ID: `${BASE_URI}/api/MasterData/ICD10CodeDiagnosis/GetItemById`,

  //diagnostic code
  GET_DIAGNOSTIC_CODE: `${BASE_URI}/api/MasterData/DiagnosticCode/GetItemsPagination`,
  CREATE_DIAGNOSTIC_CODE: `${BASE_URI}/api/MasterData/DiagnosticCode/Create`,
  UPDATE_DIAGNOSTIC_CODE: `${BASE_URI}/api/MasterData/DiagnosticCode/Update`,
  DELETE_DIAGNOSTIC_CODE: `${BASE_URI}/api/MasterData/DiagnosticCode/Delete`,
  GET_DIAGNOSTIC_CODE_BY_ID: `${BASE_URI}/api/MasterData/DiagnosticCode/GetItemById`,

  GET_ENCOUNTER_TYPE_CODE: `${BASE_URI}/api/MasterData/EncounterTypesCodes/GetItemsPagination`,
  CREATE_ENCOUNTER_TYPE_CODE: `${BASE_URI}/api/MasterData/EncounterTypesCodes/Create`,
  UPDATE_ENCOUNTER_TYPE_CODE: `${BASE_URI}/api/MasterData/EncounterTypesCodes/Update`,
  DELETE_ENCOUNTER_TYPE_CODE: `${BASE_URI}/api/MasterData/EncounterTypesCodes/Delete`,
  GET_ENCOUNTER_TYPE_CODE_BY_ID: `${BASE_URI}/api/MasterData/EncounterTypesCodes/GetItemById`,

  GET_ENCOUNTER_START_TYPE: `${BASE_URI}/api/MasterData/EncounterStartTypes/GetItemsPagination`,
  CREATE_ENCOUNTER_START_TYPE: `${BASE_URI}/api/MasterData/EncounterStartTypes/Create`,
  UPDATE_ENCOUNTER_START_TYPE: `${BASE_URI}/api/MasterData/EncounterStartTypes/Update`,
  DELETE_ENCOUNTER_START_TYPE: `${BASE_URI}/api/MasterData/EncounterStartTypes/Delete`,
  GET_ENCOUNTER_START_TYPE_BY_ID: `${BASE_URI}/api/MasterData/EncounterStartTypes/GetItemById`,

  GET_ENCOUNTER_END_TYPE: `${BASE_URI}/api/MasterData/EncounterEndTypes/GetItemsPagination`,
  CREATE_ENCOUNTER_END_TYPE: `${BASE_URI}/api/MasterData/EncounterEndTypes/Create`,
  UPDATE_ENCOUNTER_END_TYPE: `${BASE_URI}/api/MasterData/EncounterEndTypes/Update`,
  DELETE_ENCOUNTER_END_TYPE: `${BASE_URI}/api/MasterData/EncounterEndTypes/Delete`,
  GET_ENCOUNTER_END_TYPE_BY_ID: `${BASE_URI}/api/MasterData/EncounterEndTypes/GetItemById`,
  //visit
  GET_VISIT: `${BASE_URI}/api/MasterData/EncounterEndTypes/GetItemsPagination`,
  CREATE_VISIT: `${BASE_URI}/api/MasterData/EncounterEndTypes/Create`,
  UPDATE_VISIT: `${BASE_URI}/api/MasterData/EncounterEndTypes/Update`,
  DELETE_VISIT: `${BASE_URI}/api/MasterData/EncounterEndTypes/Delete`,
  GET_VISIT_BY_ID: `${BASE_URI}/api/MasterData/EncounterEndTypes/GetItemById`,

  //service category type
  GET_SERVICE_CATEGORY_TYPE: `${BASE_URI}/api/MasterData/ServiceCategoryType/GetItemsPagination`,
  CREATE_SERVICE_CATEGORY_TYPE: `${BASE_URI}/api/MasterData/ServiceCategoryType/Create`,
  UPDATE_SERVICE_CATEGORY_TYPE: `${BASE_URI}/api/MasterData/ServiceCategoryType/Update`,
  DELETE_SERVICE_CATEGORY_TYPE: `${BASE_URI}/api/MasterData/ServiceCategoryType/Delete`,
  GET_SERVICE_CATEGORY_TYPE_BY_ID: `${BASE_URI}/api/MasterData/ServiceCategoryType/GetItemById`,

  //item charge
  GET_ITEM_CHARGE: `${BASE_URI}/api/MasterData/ItemCharge/GetItemsPagination`,
  CREATE_ITEM_CHARGE: `${BASE_URI}/api/MasterData/ItemCharge/Create`,
  UPDATE_ITEM_CHARGE: `${BASE_URI}/api/MasterData/ItemCharge/Update`,
  DELETE_ITEM_CHARGE: `${BASE_URI}/api/MasterData/ItemCharge/Delete`,
  GET_ITEM_CHARGE_BY_ID: `${BASE_URI}/api/MasterData/ItemCharge/GetItemById`,

};
