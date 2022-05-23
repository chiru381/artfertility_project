import { AnyAction, Dispatch } from 'redux';
import { services } from "utils/services";
import { ParamsState, ServiceState } from 'utils/types';
import {
    GET_MASTER_PAGINATION_DATA_START,
    GET_MASTER_PAGINATION_DATA_SUCCESS,
    GET_MASTER_PAGINATION_DATA_FAIL,
    RESET_MASTER_PAGINATION_DATA
} from "../actionTypes";

// getMasterPaginationData is only for those api which have paginated data
// with custom filters
export function getMasterPaginationData(serviceType: keyof typeof services, payload: ParamsState) {
    return (dispatch: Dispatch<AnyAction>) => {
        let actionService = services as ServiceState;

        if (actionService[serviceType]) {
            dispatch({ type: GET_MASTER_PAGINATION_DATA_START, serviceType });
            actionService[serviceType](payload)
                .then(res => {
                    const { data, status } = res;
                    if (status === 200) {
                        dispatch({ type: GET_MASTER_PAGINATION_DATA_SUCCESS, payload: data?.modelItems ? data : { modelItems: [], totalRecord: 0 }, serviceType });
                    } else {
                        dispatch({ type: GET_MASTER_PAGINATION_DATA_FAIL, serviceType });
                    }
                })
                .catch(() => {
                    dispatch({ type: GET_MASTER_PAGINATION_DATA_FAIL, serviceType });
                });
        }
    };
}

export function resetMasterPaginationData() {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: RESET_MASTER_PAGINATION_DATA });
    };
}