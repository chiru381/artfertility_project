import axios, { AxiosPromise } from "axios";
import { API_ENDPOINTS } from "redux/apiEndPoints";

interface ParamsState {
  [key: string]: any
}

export const securityServices = {

  logoutUser: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.LOGOUT, { params }),

  getUserById: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_USER_BY_ID, { params }),
  deleteUser: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_USER, { params }),
  createUser: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_USER, body),
  updateUser: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_USER, body),

  changePassword: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CHANGE_PASSWORD, body),
  changePasswordByCode: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CHANGE_PASSWORD_BY_CODE, body),
  forgotPassword: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.FORGOT_PASSWORD, body),
  getRolePermissionByRoleId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_ROLE_PERMISSION_BY_ROLE_ID, { params }),
  updateRolePermission: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.UPDATE_ROLE_PERMISSION, body),

  getMedicalStaffId: (params: ParamsState): AxiosPromise => axios.get(API_ENDPOINTS.GET_MEDICAL_STAFF_BY_ID, { params }),
  createMedicalStaff: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_MEDICAL_STAFF, body),
  updateMedicalStaff: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_MEDICAL_STAFF, body),
  deleteMedicalStaff: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_MEDICAL_STAFF, { params }),

}