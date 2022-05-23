import { UPDATE_UTILITY } from "../actionTypes";

export function updateUtility(data: { [key: string]: any }) {
    return {
        type: UPDATE_UTILITY,
        payload: data
    }
}