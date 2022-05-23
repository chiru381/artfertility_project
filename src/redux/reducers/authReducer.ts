import { AuthObjectState } from "utils/constants";
import { AuthActionObjectType, AuthReducerObjectType } from "utils/types";
import {
    AUTH_START,
    AUTH_SUCCESS,
    AUTH_FAIL,
    AUTH_RESET,
    RESET_TOKEN,
    AUTH_DUBLICATE_RESET
} from "../actionTypes";

const initialState = AuthObjectState;

export const authReducer = (state = initialState, action: AuthActionObjectType): AuthReducerObjectType => {
    switch (action.type) {
        case AUTH_START:
            return {
                ...state,
                loading: true,
                error: false,
                data: {},
                status: 0
            };
        case AUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case AUTH_FAIL:
            return {
                ...state,
                loading: false,
                error: true
            };
        case AUTH_RESET:
            return AuthObjectState;
        case AUTH_DUBLICATE_RESET:
            return {
                ...state,
                status: action.status
            };
        case RESET_TOKEN:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.payload
                }
            };
        default:
            return state;
    }
};