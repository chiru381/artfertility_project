import {
    GET_STIMULATION_LOOKUP_DATA_START,
    GET_STIMULATION_LOOKUP_DATA_SUCCESS,
    GET_STIMULATION_LOOKUP_DATA_FAIL,
} from "../actionTypes";
import { AnyAction, Dispatch } from 'redux';
import { services } from "utils/services";

export const getStimulationLookup = () => {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: GET_STIMULATION_LOOKUP_DATA_START });
        services.getStimulationLookup()
            .then((res) => {
                const { data, status } = res;
                if (status === 200) {
                    dispatch({ type: GET_STIMULATION_LOOKUP_DATA_SUCCESS, payload: data });
                } else {
                    dispatch({ type: GET_STIMULATION_LOOKUP_DATA_FAIL });
                }
            })
            .catch(() => {
                dispatch({ type: GET_STIMULATION_LOOKUP_DATA_FAIL });
            });
    };
};