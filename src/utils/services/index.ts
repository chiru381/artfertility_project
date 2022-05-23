import { masterServices } from "./masterServices";
import { adtServices } from './adtServices';
import { registrationServices } from "./registrationServices";
import { appointmentServices } from "./appointmentServices";
import { securityServices } from "./securityServices";
import { laboratoryServices } from "./laboratoryServices";
import { billingServices } from "./billingServices";
import { anamneesisServices } from "./anamnesisServices";
import { treatmentPlanServices } from "./treatmentPlanServices";
import { requestAndResultServices } from "./resultAndRequestServices";

import { vitalsServices } from "./vitalsServices";
import { prescriptionServices } from "./prescriptionServices";
import { diagnosisServices } from "./diagnosisServices";
import { inventoryServices } from "./inventoryServices"
import { documentUploadServices } from "./documentUploadServices"

export const services = {
  ...appointmentServices,
  ...masterServices,
  ...adtServices,
  ...registrationServices,
  ...securityServices,
  ...laboratoryServices,
  ...billingServices,
  ...anamneesisServices,
  ...treatmentPlanServices,
  ...requestAndResultServices,
  ...vitalsServices,
  ...prescriptionServices,
  ...diagnosisServices,
  ...inventoryServices,
  ...documentUploadServices
}