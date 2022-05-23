export { default as Auth } from 'pages/auth';
export { default as Home } from 'pages/home';

// Registration Module
export { default as Patient } from 'pages/registration/patient';
export { default as Donor } from 'pages/registration/donor';
export { default as PatientDataAcknowledgement } from 'pages/registration/patientAcknowledgement';

// Appointment Module
export { default as AppointmentScheduling } from 'pages/appointment/scheduling';
export { default as OTRoomBooking } from 'pages/appointment/otRoomBooking';
export { default as DoctorDiary } from 'pages/appointment/doctorDiary';
export { default as ResourceSlotConfig } from 'pages/appointment/resourceSlotConfig';
export { default as OTSlotConfiguration } from 'pages/appointment/otSlotConfig';
export { default as DoctorSlotBlock } from 'pages/appointment/doctorSlotBlock';
export { default as OTSlotBlock } from 'pages/appointment/otSlotBlock';
export { default as Enquiry } from 'pages/appointment/enquiry';

// Billing Module
export { default as BillingPatient } from 'pages/billing/billingPatient';
export { default as OPBillsList } from 'pages/billing/OutPatientBill';
export { default as PackageAllocation } from 'pages/billing/packageAllocation';
export { default as BillRefund } from 'pages/billing/refund';
export { default as BillingParameters } from 'pages/billing/billingParameters';

// ADT Module
export { default as DaycareAdmission } from 'pages/adt/DaycareAdmission';
export { default as BedDashboard } from 'pages/adt/bedDashboard/BedDashboard';
export { default as AdmittedPatients } from 'pages/adt/AdmittedPatients';

// Security Module: 
export { default as User } from 'pages/security/user';
export { default as CreateUser } from 'pages/security/user/CreateUser';
export { default as UpdateUser } from 'pages/security/user/UpdateUser';
export { default as ChangePassword } from 'pages/security/user/ChangePassword';
export { default as ClinicalUserCrendentialsMapping } from 'pages/security/clinicalUserCredentialsMapping';
export { default as CreateClinicalUserCrendentialsMapping } from 'pages/security/clinicalUserCredentialsMapping/CreateClinicalUserCredentialsModal';
export { default as UpdateClinicalUserCrendentialsMapping } from 'pages/security/clinicalUserCredentialsMapping/UpdateClinicalUserCredentialsModal';
export { default as Role } from 'pages/security/role';
export { default as RolePermission } from 'pages/security/rolePermission';
export { default as ChangePasswordByCode } from 'pages/auth/ChangePasswordByCode';


// Lab Module :
export { default as SampleCollection } from 'pages/laboratory/SampleCollection';
export { default as SampleDispatch } from 'pages/laboratory/SampleDispatch';
export { default as LaboratoryWorkList } from 'pages/laboratory/LaboratoryWorkList';
export { default as ResultEntry } from 'pages/laboratory/ResultEntry';

// Master Module
export { default as Clinic } from 'pages/master/clinic';
export { default as Country } from 'pages/master/country';
export { default as Province } from 'pages/master/province';
export { default as SurgeryType } from 'pages/master/surgeryType';
export { default as City } from 'pages/master/city';
export { default as Department } from 'pages/master/department';
export { default as Designation } from 'pages/master/designation';
export { default as MedicalStaff } from 'pages/master/medicalStaff';
export { default as DocumentType } from 'pages/master/documentType';
export { default as DressCode } from 'pages/master/dressCode';
export { default as BedStatus } from 'pages/master/bedStatus';
export { default as EmployeeType } from 'pages/master/employeeType';
export { default as Gender } from 'pages/master/gender';
export { default as Language } from 'pages/master/language';
export { default as LeadSource } from 'pages/master/leadSoure';
export { default as Sponsor } from 'pages/master/sponsor';
export { default as Locality } from 'pages/master/locality';
export { default as ZipCode } from 'pages/master/zipCode';
export { default as MaritalStatus } from 'pages/master/maritalStatus';
export { default as Nationality } from 'pages/master/nationality';
export { default as Occupation } from 'pages/master/occupation';
export { default as PaymentMode } from 'pages/master/paymentMode';
export { default as PaymentType } from 'pages/master/paymentType';
export { default as Qualification } from 'pages/master/qualification';
export { default as ReferringDoctor } from 'pages/master/referringDoctor';
export { default as Religion } from 'pages/master/religion';
export { default as SkinColor } from 'pages/master/skinColor';
export { default as Title } from 'pages/master/title';
export { default as VipReason } from 'pages/master/vipReason';
export { default as VisaStatus } from 'pages/master/visaStatus';
export { default as Station } from 'pages/master/station';
export { default as Bed } from 'pages/master/bed';
export { default as BlockType } from 'pages/master/blockType';
export { default as BlockReason } from 'pages/master/blockReason';
export { default as CancelReason } from 'pages/master/cancelReason';
export { default as ContactType } from 'pages/master/contactType';
export { default as Resource } from 'pages/master/resource';
export { default as AppointmentType } from 'pages/master/appointmentType';
export { default as RescheduleReason } from 'pages/master/rescheduleReason';
export { default as ClinicalComplicationType } from 'pages/master/clinicalComplicationType';
export { default as EmployeeCategory } from 'pages/master/employeeCategory';
export { default as Surgery } from 'pages/master/surgery';
export { default as Series } from 'pages/master/series';
export { default as VisitType } from 'pages/master/visitType';
export { default as Equipment } from 'pages/master/equipment';

export { default as Sample } from 'pages/master/sample';
export { default as SampleContainer } from 'pages/master/sampleContainer';
export { default as UnitOfMeasure } from 'pages/master/unitOfMeasure';
export { default as Profile } from 'pages/master/profile';
export { default as SampleStatus } from 'pages/master/sampleStatus';
export { default as ResultTemplate } from 'pages/master/resultTemplate';
export { default as LabTest } from 'pages/master/labTest';

export { default as Bank } from 'pages/master/bank';
export { default as DiscountType } from 'pages/master/discountType';
export { default as DoctorFee } from 'pages/master/doctorFee';
export { default as Facilitator } from 'pages/master/facilitator';
export { default as Merchant } from 'pages/master/merchant';
export { default as Package } from 'pages/master/package';

export { default as ResultValue } from 'pages/master/resultValue';
export { default as TestComponent } from 'pages/master/testComponent';
export { default as Service } from 'pages/master/service';
export { default as Tariff } from 'pages/master/tariff';
export { default as TariffItem } from 'pages/master/tariffItem';
export { default as DiscountAuthorityMatrix } from 'pages/master/discountAuthorityMatrix';
export { default as RefundDepositLogic } from 'pages/master/refundDepositLogic';
export { default as Stage } from 'pages/master/stage';
export { default as ServiceCategory } from 'pages/master/serviceCategory';
export { default as DiscountReason } from 'pages/master/discountReason';

export { default as EncounterTypeCode } from 'pages/master/encounterTypeCode';
export { default as EncounterStartType } from 'pages/master/encounterStartType';
export { default as EncounterEndType } from 'pages/master/encounterEndType';
export { default as ClinicalDocumentType } from 'pages/master/clinicalDocumentType';

// Clinical Module
export { default as Clinical } from 'pages/clinical';
export { default as ClinicalOverview } from 'pages/clinical/overview';
export { default as Diagnosis } from 'pages/clinical/diagnosis';
export { default as TreatmentPlan } from 'pages/clinical/treatmentPlan';
export { default as Stimulation } from 'pages/clinical/stimulation';
export { default as Anamnesis } from 'pages/clinical/anamnesis';
export { default as RequestAndResult } from 'pages/clinical/requestAndResult';
export { default as IVFLabAndrology } from 'pages/clinical/ivfLab';
export { default as IVFLabAndrologySpermiogram } from 'pages/clinical/ivfLab/spermiogram';
export { default as IVFLabAndrologyTesticularBiopsy } from 'pages/clinical/ivfLab/testicularBiopsy';

export { default as VitalsSummary } from 'pages/clinical/vitals/Summary';
export { default as PatientNewVitals } from 'pages/clinical/vitals/newVitals/Patient';
export { default as PartnerNewVitals } from 'pages/clinical/vitals/newVitals/Partner';
export { default as GraphAndTrends } from 'pages/clinical/vitals/GraphAndTrends';
export { default as Prescription } from 'pages/clinical/prescription';
export { default as SurgeryIndex } from 'pages/clinical/surgery';
export { default as DocumentUpload } from 'pages/clinical/documentUpload';
export { default as CreateDocumentUploadForm } from 'pages/clinical/documentUpload/CreateDocumentUpload';
export { default as UpdateDocumentUploadForm } from 'pages/clinical/documentUpload/UpdateDocumentUpload';

//Diagnosis
export { default as AddNewDiagnosis } from 'pages/clinical/diagnosis/AddDiagnosis';
export { default as RefundReason } from 'pages/master/refundReason';
export { default as Currency } from 'pages/master/currency';
export { default as Denial } from 'pages/master/denial';
export { default as DiagnosticCode } from 'pages/master/diagnosticCode';
export { default as Visit } from 'pages/master/visit';
export { default as ServiceCategoryType } from 'pages/master/serviceCategoryType';
export { default as ItemCharge } from 'pages/master/itemCharge';
