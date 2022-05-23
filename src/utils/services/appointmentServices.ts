import axios, { AxiosPromise } from "axios";
import { ParamsState } from "utils/types";
import { API_ENDPOINTS } from "redux/apiEndPoints";

export const appointmentServices = {
    createAppointment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_APPOINTMENT, body),
    updateAppointment: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_APPOINTMENT, body),
    createExistingPatientAppointment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_EXISTING_PATINET_APPOINTMENT, body),
    getAllAppointment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ALL_APPOINTMENT, body),
    getAllResourceAppointment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_ALL_RESOURCE_APPOINTMENT, body),
    getAppointmentByDate: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_APPOINTMENT_BY_DATE, body),
    getAppointmentLookup: (): AxiosPromise => axios.get(API_ENDPOINTS.GET_APPOINTMENT_LOOKUPS),
    rescheduleAppointment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.RESCHEDULE_APPOINTMENT, body),
    cancelAppointment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CANCEL_APPOINTMENT, body),
    confirmAppointment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CONFIRM_APPOINTMENT, body),
    markPatientArrived: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.MARK_PATIENT_ARRIVED, body),
    startConsultation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.START_CONSULTATION, body),
    endConsultation: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.END_CONSULTATION, body),
    
    createTask: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_TASK, body),
    updateTask: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_TASK, body),
    getUserAssignedTask: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_USER_ASSIGNED_TASK, body),
    
    getOTAppointmentByDate: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OT_APPOINTMENT_BY_DATE, body),
    createOTRoomAppointment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_OT_ROOM_APPOINTMENT, body),
    rescheduleOTAppointment: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.RESCHEDULE_OT_APPOINTMENT, body),

    createDoctorSlotBlock: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_DOCTOR_SLOT_BLOCK, body),
    updateDoctorSlotBlock: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_DOCTOR_SLOT_BLOCK, body),
    deleteDoctorSlotBlock: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_DOCTOR_SLOT_BLOCK, { params }),
    getAllDoctorSlotBlock: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_DOCTOR_SLOT_BLOCK, body),
    getAllAppointmentDoctorSlotBlock: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_APPOINTMENT_DOCTOR_SLOT_BLOCK, body),
    
    createOTSlotBlock: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.CREATE_OT_SLOT_BLOCK, body),
    updateOTSlotBlock: (body: ParamsState): AxiosPromise => axios.put(API_ENDPOINTS.UPDATE_OT_SLOT_BLOCK, body),
    deleteOTSlotBlock: (params: ParamsState): AxiosPromise => axios.delete(API_ENDPOINTS.DELETE_OT_SLOT_BLOCK, { params }),
    getAllOTSlotBlock: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_OT_SLOT_BLOCK, body),
    getAllAppointmentOTSlotBlock: (body: ParamsState): AxiosPromise => axios.post(API_ENDPOINTS.GET_APPOINTMENT_OT_SLOT_BLOCK, body),
}