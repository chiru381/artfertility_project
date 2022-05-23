import { AuthReducerObjectType, utilityReducerState } from ".";
import { DefaultReducerObjectType, PaginationReducerType } from "./reducer.type";

export interface RootReducerState {
    intl: any;
    auth: AuthReducerObjectType;
    masterPaginationReducer: { [key: string]: PaginationReducerType };
    patientLookupReducer: DefaultReducerObjectType;
    billingLookupReducer: DefaultReducerObjectType;
    appointmentLookupReducer: DefaultReducerObjectType;
    utilityReducer: utilityReducerState;
    userLookupReducer: DefaultReducerObjectType;
    treatmentPlanLookupReducer: DefaultReducerObjectType;
    stimulationLookupReducer: DefaultReducerObjectType;
    vitalLookupReducer: DefaultReducerObjectType;
    prescriptionLookupReducer: DefaultReducerObjectType;
    usgLookupReducer: DefaultReducerObjectType;
};