import {
    AUTH_START,
    AUTH_SUCCESS,
    AUTH_FAIL,
    AUTH_RESET,
    RESET_TOKEN,
    AUTH_DUBLICATE_RESET
} from "../actionTypes";
import { AnyAction, Dispatch } from 'redux';
import Axios from 'axios';
import { API_ENDPOINTS } from "redux/apiEndPoints";
import { setAuthHeader } from "utils/global";
import { updateUtility } from "./utilityAction";

export const login = (payload: any, toastMessage: any) => {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: AUTH_START });
        Axios.post(`${API_ENDPOINTS.AUTH}`, payload)
            .then((res) => {
                console.log(res);
                const { data, status } = res;
                if (status === 200) {
                    let selectedClinic = data.clinics.find((clinic: any) => clinic.isDefault);
                    setAuthHeader(data.access_token, selectedClinic?.clinicId ?? "1");
                    dispatch({ type: AUTH_SUCCESS, payload: data });
                    dispatch(updateUtility({ selectedClinic: String(selectedClinic?.clinicId ?? 1) }));
                } else {
                    toastMessage("Something went wrong. Please try again", 'error');
                    dispatch({ type: AUTH_FAIL });
                }
            })
            .catch((err) => {
                dispatch({ type: AUTH_FAIL });
                if (err?.response?.status === 404) {
                    toastMessage("Incorrect username or password", 'error');
                } else if (err?.response?.status === 470) {
                    dispatch({ type: AUTH_DUBLICATE_RESET, status: 470 });
                } else {
                    toastMessage("Network Problem. Please try again", 'error');
                }
            });
    };
};

export function authReset() {
    return {
        type: AUTH_RESET
    }
}

export function resetToken(payload: any) {
    return {
        type: RESET_TOKEN,
        payload
    }
}