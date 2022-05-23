import { DefaultActionObjectType, utilityReducerState } from "utils/types";
import { UPDATE_UTILITY } from "../actionTypes";

const initialState: utilityReducerState = {
    selectedClinic: ''
}

export function utilityReducer(state = initialState, action: DefaultActionObjectType) {
    switch (action.type) {
        case UPDATE_UTILITY:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}