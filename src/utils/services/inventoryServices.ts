import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any
}

export const inventoryServices = {
  getAllBatchStore: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_BATCH_STORE, body),
  getAllDrugBatchStore: ({ storeId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DRUG_BATCH_STORE+ `?storeId=${storeId}`, body),
  getAllConsumableBatchStore: ({ storeId, ...body }: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_CONSUMABLE_BATCH_STORE+ `?storeId=${storeId}`, body),
}