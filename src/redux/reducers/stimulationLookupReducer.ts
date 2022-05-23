import { defaultObjectState } from "utils/constants";
import { DefaultActionObjectType, DefaultReducerObjectType } from "utils/types";
import {
    GET_STIMULATION_LOOKUP_DATA_START,
    GET_STIMULATION_LOOKUP_DATA_SUCCESS,
    GET_STIMULATION_LOOKUP_DATA_FAIL
} from "../actionTypes";

const initialState = defaultObjectState;

export const stimulationLookupReducer = (state = initialState, action: DefaultActionObjectType): DefaultReducerObjectType => {
    switch (action.type) {
        case GET_STIMULATION_LOOKUP_DATA_START:
            return {
                ...state,
                loading: true,
                error: false
            };
        case GET_STIMULATION_LOOKUP_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case GET_STIMULATION_LOOKUP_DATA_FAIL:
            return {
                ...state,
                loading: false,
                error: true
            };
        default:
            return state;
    }
};