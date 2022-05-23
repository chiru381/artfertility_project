import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
    [key: string]: any
}

export const laboratoryServices = {
    getAllTestOrder: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BILLING_TEST_ORDER, body),
    updateSampleCollection: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SAMPLE_COLLECTION, body),

    getAllTestOrderDispatch: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BILLING_TEST_ORDER_DISPATCH, body),
    updateSampleDispatch: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_SAMPLE_DISPATCH, body),

    getAllTestOrderAcknowledge: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BILLING_TEST_ORDER_ACKNOWLEDGE, body),
    updateSampleAcknowledge: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.ACKNOWLEDGE_SAMPLE, body),

    getResultEntryByTestOrderDetailId: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_RESULT_ENTRY_BY_TEST_ORDER_DETAIL_ID, body),
    createResultEntry: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.SAVE_RESULT_ENTRY, body),
    createAndReleaseResultEntry: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.SAVE_RELEASE_RESULT_ENTRY, body),
    authorizeResultEntry: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.AUTHORIZE_TEST_RESULT, body),
    reSamplingTestResult: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.RESAMPLING_RESULT, body)
}