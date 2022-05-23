import {
  ClinicalOverview,
  Diagnosis,
  TreatmentPlan,
  Anamnesis,
  VitalsSummary,
  RequestAndResult,
  Prescription,
  SurgeryIndex,
  Stimulation,
  IVFLabAndrology,
  IVFLabAndrologySpermiogram,
  IVFLabAndrologyTesticularBiopsy,
  DocumentUpload,
  CreateDocumentUploadForm,
  UpdateDocumentUploadForm
} from 'pages';

import { vitalsRouteList } from './vitalsRouteList';


export const clinicalSubRouteList = [
  {
    exact: true,
    path: '/overview',
    component: ClinicalOverview,
  },
  {
    exact: false,
    path: '/vitals/summary',
    component: VitalsSummary,
  },
  ...vitalsRouteList,
  {
    exact: false,
    path: '/anamnesis',
    component: Anamnesis,
  }, {
    exact: false,
    path: '/request-result',
    component: RequestAndResult,
  },
  {
    exact: false,
    path: '/diagnosis',
    component: Diagnosis,
  },
  {
    exact: false,
    path: '/prescription',
    component: Prescription,
  },
  {
    exact: false,
    path: '/treatment-plan',
    component: TreatmentPlan,
  },
  {
    exact: false,
    path: '/stimulation',
    component: Stimulation,
  },
  {
    exact: true,
    path: '/ivf-lab',
    component: IVFLabAndrology,
  },
  {
    exact: true,
    path: '/ivf-lab/spermiogram',
    component: IVFLabAndrologySpermiogram,
  },
  {
    exact: true,
    path: '/ivf-lab/testicular-biopsy',
    component: IVFLabAndrologyTesticularBiopsy,
  },
  {
    exact: false,
    path: '/surgery',
    component: SurgeryIndex,
  },
  {
    exact: true,
    path: '/add-new-diagnosis',
    component: SurgeryIndex,
  },
  {
    exact: true,
    path: '/document-upload',
    component: DocumentUpload,
  },
  {
    exact: true,
    path: '/document-upload/create',
    component: CreateDocumentUploadForm,
  },
  {
    exact: true,
    path: '/document-upload/edit/:id(\\d+)',
    component: UpdateDocumentUploadForm,
  }
];