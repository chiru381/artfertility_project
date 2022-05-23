import { combineReducers } from 'redux';
import { RootReducerState } from 'utils/types/rootReducer.type';

import {
  intlReducer,
  authReducer,
  masterPaginationReducer,
  patientLookupReducer,
  appointmentLookupReducer,
  utilityReducer,
  userLookupReducer,
  billingLookupReducer,
  treatmentPlanLookupReducer,
  stimulationLookupReducer,
  vitalLookupReducer,
  prescriptionLookupReducer,
  usgLookupReducer
} from './reducers';

export const rootReducers = combineReducers<RootReducerState>({
  intl: intlReducer,
  auth: authReducer,
  masterPaginationReducer,
  patientLookupReducer,
  appointmentLookupReducer,
  userLookupReducer,
  utilityReducer,
  billingLookupReducer,
  treatmentPlanLookupReducer,
  stimulationLookupReducer,
  vitalLookupReducer,
  prescriptionLookupReducer,
  usgLookupReducer
});