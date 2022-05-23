import { defaultObjectState } from "utils/constants";
import { DefaultActionObjectType, DefaultReducerObjectType } from "utils/types";
import {
    GET_PRESCRIPTION_LOOKUP_DATA_START,
    GET_PRESCRIPTION_LOOKUP_DATA_SUCCESS,
    GET_PRESCRIPTION_LOOKUP_DATA_FAIL
} from "../actionTypes";

const initialState = defaultObjectState;

export const prescriptionLookupReducer = (state = initialState, action: DefaultActionObjectType): DefaultReducerObjectType => {
    switch (action.type) {
        case GET_PRESCRIPTION_LOOKUP_DATA_START:
            return {
                ...state,
                loading: true,
                error: false
            };
        case GET_PRESCRIPTION_LOOKUP_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case GET_PRESCRIPTION_LOOKUP_DATA_FAIL:
            return {
                ...state,
                loading: false,
                error: true
            };
        default:
            return state;
    }
};