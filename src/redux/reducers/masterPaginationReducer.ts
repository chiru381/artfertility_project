import { defaultPaginationState } from "utils/constants";
import { masterPaginationServices } from "utils/constants";
import { PaginationReducerType, PaginationActionType } from "utils/types";
import {
    GET_MASTER_PAGINATION_DATA_START,
    GET_MASTER_PAGINATION_DATA_SUCCESS,
    GET_MASTER_PAGINATION_DATA_FAIL,
    RESET_MASTER_PAGINATION_DATA
} from "../actionTypes";

const initialState: { [key: string]: PaginationReducerType } = Object.values(masterPaginationServices).reduce((acc: any, curr) => (acc[curr] = defaultPaginationState, acc), {});

export const masterPaginationReducer = (state = initialState, action: PaginationActionType): { [key: string]: PaginationReducerType } => {
    switch (action.type) {
        case GET_MASTER_PAGINATION_DATA_START:
            return {
                ...state,
                [action.serviceType]: {
                    ...state[action.serviceType],
                    loading: true,
                    error: false
                }
            }
        case GET_MASTER_PAGINATION_DATA_SUCCESS:
            return {
                ...state,
                [action.serviceType]: {
                    ...state[action.serviceType],
                    loading: false,
                    data: action.payload
                }
            }
        case GET_MASTER_PAGINATION_DATA_FAIL:
            return {
                ...state,
                [action.serviceType]: {
                    ...state[action.serviceType],
                    loading: false,
                    error: true
                }
            }
        case RESET_MASTER_PAGINATION_DATA:
            return initialState

        default:
            return state;
    }
};