import {
    GET_VITAL_LOOKUP_DATA_START,
    GET_VITAL_LOOKUP_DATA_SUCCESS,
    GET_VITAL_LOOKUP_DATA_FAIL,
} from "../actionTypes";
import { AnyAction, Dispatch } from 'redux';
import { services } from "utils/services";

export const getVitalLookUp = () => {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: GET_VITAL_LOOKUP_DATA_START });
        services.getVitalLookUp()
            .then((res) => {
                const { data, status } = res;
                if (status === 200) {
                    dispatch({ type: GET_VITAL_LOOKUP_DATA_SUCCESS, payload: data });
                } else {
                    dispatch({ type: GET_VITAL_LOOKUP_DATA_FAIL });
                }
            })
            .catch(() => {
                dispatch({ type: GET_VITAL_LOOKUP_DATA_FAIL });
            });
    };
};