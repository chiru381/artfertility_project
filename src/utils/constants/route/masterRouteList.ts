import {
  Clinic,
  Country,
  Province,
  SurgeryType,
  City,
  Department,
  Designation,
  MedicalStaff,
  DocumentType,
  DressCode,
  BedStatus,
  EmployeeType,
  Gender,
  Sponsor,
  Language,
  Locality,
  ZipCode,
  MaritalStatus,
  Nationality,
  Occupation,
  PaymentMode,
  PaymentType,
  Qualification,
  ReferringDoctor,
  Religion,
  SkinColor,
  Title,
  VipReason,
  VisaStatus,
  Station,
  Bed,
  BlockType,
  BlockReason,
  CancelReason,
  ContactType,
  Resource,
  AppointmentType,
  RescheduleReason,
  ClinicalComplicationType,
  EmployeeCategory,
  Surgery,
  Series,
  VisitType,
  Equipment,
  Sample,
  SampleContainer,
  UnitOfMeasure,
  Profile,
  Bank,
  DiscountType,
  DoctorFee,
  Facilitator,
  Merchant,
  SampleStatus,
  ResultTemplate,
  LabTest,
  Package,
  ResultValue,
  TestComponent,
  Service,
  TariffItem,
  DiscountAuthorityMatrix,
  RefundDepositLogic,
  Stage,
  Tariff,
  ServiceCategory,
  LeadSource,
  DiscountReason,
  RefundReason,
  Currency,
  Denial,
  DiagnosticCode,
  EncounterTypeCode,
  EncounterStartType,
  EncounterEndType,
  Visit,
  ServiceCategoryType,
  ClinicalDocumentType,
  ItemCharge
} from 'pages';


export const masterRouteList = [
  {
    exact: true,
    path: '/master/clinic',
    component: Clinic,
  },
  {
    exact: true,
    path: '/master/country',
    component: Country,
  },
  {
    exact: true,
    path: '/master/province',
    component: Province,
  },
  {
    exact: true,
    path: '/master/surgerytype',
    component: SurgeryType,
  },
  {
    exact: true,
    path: '/master/lead-source',
    component: LeadSource,
  },
  {
    exact: true,
    path: '/master/city',
    component: City
  },
  {
    exact: true,
    path: '/master/department',
    component: Department,
  },
  {
    exact: true,
    path: '/master/designation',
    component: Designation,
  },
  {
    exact: true,
    path: '/master/medical-staff',
    component: MedicalStaff,
  },
  {
    exact: true,
    path: '/master/document-type',
    component: DocumentType,
  },
  {
    exact: true,
    path: '/master/dress-code',
    component: DressCode,
  }, {
    exact: true,
    path: '/master/employee-type',
    component: EmployeeType,
  },
  {
    exact: true,
    path: '/master/gender',
    component: Gender,
  },
  {
    exact: true,
    path: '/master/sponsor',
    component: Sponsor,
  }, {
    exact: true,
    path: '/master/bed-status',
    component: BedStatus,
  }
  , {
    exact: true,
    path: '/master/language',
    component: Language,
  }, {
    exact: true,
    path: '/master/locality',
    component: Locality,
  }, {
    exact: true,
    path: '/master/zipcode',
    component: ZipCode,
  }
  , {
    exact: true,
    path: '/master/marital-status',
    component: MaritalStatus,
  }, {
    exact: true,
    path: '/master/nationality',
    component: Nationality,
  }, {
    exact: true,
    path: '/master/occupation',
    component: Occupation,
  }, {
    exact: true,
    path: '/master/paymentmode',
    component: PaymentMode,
  }, {
    exact: true,
    path: '/master/paymenttype',
    component: PaymentType,
  }, {
    exact: true,
    path: '/master/qualification',
    component: Qualification,
  }, {
    exact: true,
    path: '/master/referring-doctor',
    component: ReferringDoctor,
  }, {
    exact: true,
    path: '/master/religion',
    component: Religion,
  }, {
    exact: true,
    path: '/master/skincolor',
    component: SkinColor,
  }, {
    exact: true,
    path: '/master/title',
    component: Title,
  }, {
    exact: true,
    path: '/master/vipreason',
    component: VipReason,
  }, {
    exact: true,
    path: '/master/visastatus',
    component: VisaStatus,
  }, {
    exact: true,
    path: '/master/station',
    component: Station,
  }, {
    exact: true,
    path: '/master/bed',
    component: Bed,
  }, {
    exact: true,
    path: '/master/block-type',
    component: BlockType,
  }, {
    exact: true,
    path: '/master/block-reason',
    component: BlockReason,
  }, {
    exact: true,
    path: '/master/cancel-reason',
    component: CancelReason,
  }, {
    exact: true,
    path: '/master/contact-type',
    component: ContactType,
  }, {
    exact: true,
    path: '/master/resource',
    component: Resource,
  }, {
    exact: true,
    path: '/master/appointment-type',
    component: AppointmentType,
  }, {
    exact: true,
    path: '/master/reschedule-reason',
    component: RescheduleReason,
  }, {
    exact: true,
    path: '/master/clinical-complication-type',
    component: ClinicalComplicationType,
  }, {
    exact: true,
    path: '/master/employee-category',
    component: EmployeeCategory,
  }, {
    exact: true,
    path: '/master/Surgery',
    component: Surgery,
  }
  , {
    exact: true,
    path: '/master/series',
    component: Series,
  }, {
    exact: true,
    path: '/master/visit-type',
    component: VisitType,
  }, {
    exact: true,
    path: '/master/equipment',
    component: Equipment,
  }, {
    exact: true,
    path: '/master/sample',
    component: Sample,
  }, {
    exact: true,
    path: '/master/sample-container',
    component: SampleContainer,
  }, {
    exact: true,
    path: '/master/measurement-unit',
    component: UnitOfMeasure,
  }, {
    exact: true,
    path: '/master/profile',
    component: Profile,
  }, {
    exact: true,
    path: '/master/bank',
    component: Bank,
  }, {
    exact: true,
    path: '/master/discount-type',
    component: DiscountType,
  }, {
    exact: true,
    path: '/master/doctor-fee',
    component: DoctorFee,
  }, {
    exact: true,
    path: '/master/facilitator',
    component: Facilitator,
  }, {
    exact: true,
    path: '/master/merchant',
    component: Merchant,
  }, {
    exact: true,
    path: '/master/sample-status',
    component: SampleStatus,
  }, {
    exact: true,
    path: '/master/result-template',
    component: ResultTemplate,
  }, {
    exact: true,
    path: '/master/lab-test',
    component: LabTest,
  }, {
    exact: true,
    path: '/master/package',
    component: Package,
  }, {
    exact: true,
    path: '/master/result-value',
    component: ResultValue,
  }, {
    exact: true,
    path: '/master/test-component',
    component: TestComponent,
  }, {
    exact: true,
    path: '/master/service',
    component: Service,
  }, {
    exact: true,
    path: '/master/tariffitem',
    component: TariffItem,
  }, {
    exact: true,
    path: '/master/tariff',
    component: Tariff,
  }, {
    exact: true,
    path: '/master/discount-authority-matrix',
    component: DiscountAuthorityMatrix,
  }, {
    exact: true,
    path: '/master/refund-deposit-logic',
    component: RefundDepositLogic,
  }, {
    exact: true,
    path: '/master/Stage',
    component: Stage,
  }, {
    exact: true,
    path: '/master/service-category',
    component: ServiceCategory,
  }, {
    exact: true,
    path: '/master/discount-reason',
    component: DiscountReason,
  }, {
    exact: true,
    path: '/master/refund-reason',
    component: RefundReason,
  }, {
    exact: true,
    path: '/master/currency',
    component: Currency,
  },
  {
	exact: true,
	path: '/master/denial',
	component: Denial,
}, {
	exact: true,
	path: '/master/diagnostic-code',
	component: DiagnosticCode,
}, {
    exact: true,	
    path: '/master/encounter-type-code',
    component: EncounterTypeCode,
  }, {
    exact: true,
    path: '/master/encounter-start-type',
    component: EncounterStartType
  }, {
    exact: true,
    path: '/master/encounter-end-type',
    component: EncounterEndType
  }, {
    exact: true,
    path: '/master/visit',
    component: Visit
  }, 
  {
    exact: true,
    path: '/master/service-category-type',
    component: ServiceCategoryType
  },
  {
    exact: true,
    path: '/master/clinical-document-type',
    component: ClinicalDocumentType
  }, {
    exact: true,
    path: '/master/item-charge',
    component: ItemCharge
  }
];



