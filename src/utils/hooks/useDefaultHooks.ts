import { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getMasterPaginationData } from "redux/actions";
import { masterPaginationServices } from "utils/constants";
import { getAppointmentFromToDate } from "utils/global";
import { RootReducerState } from "utils/types";

export function useCalculateOPBillServiceItem(serviceItem: { [key: string]: any }[]) {
    let data = useMemo(() => {
        let totalDiscount = 0;
        let totalAmount = 0;
        let netAmount = 0;
        serviceItem.map(service => {
            totalDiscount += service.discountAmount ?? 0;
            totalAmount += service.quantity * service.serviceAmount;
            netAmount += service.serviceAmount - service.discountAmount - service?.coPayment - service?.deductableAmount;
        });
        return { totalDiscount, totalAmount, netAmount }
    }, [serviceItem]);

    return data;
}

export function useCalculateFolioServiceItem(serviceItem: { [key: string]: any }[]) {
    let data = useMemo(() => {
        let totalDiscount = 0;
        let totalServiceAmount = 0;
        let totalNetAmount = 0;
        serviceItem.map(service => {
            totalDiscount += service.discountAmount ?? 0;
            totalServiceAmount += service.serviceAmount;
            totalNetAmount += service.serviceAmount - service.discountAmount;
        });
        return { totalDiscount, totalServiceAmount, totalNetAmount }
    }, [serviceItem]);

    return data;
}

export function useGetOngoingTreatmentProcessId() {
    const { treatmentProcessData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                treatmentProcessData: masterPaginationReducer[masterPaginationServices.treatmentProcess].data,
            })
        },
        shallowEqual
    );

    let treatProcessId = useMemo(() => {
        let selectedItem = treatmentProcessData.modelItems.find((item: any) => item.id === 1);
        return selectedItem?.id ?? null;
    }, [treatmentProcessData.modelItems?.length]);

    return treatProcessId;
}

export function useGetClinicalUrlFirstRoute() {
    const location = useLocation();

    return location.pathname.split('/')?.[1] ?? "";
}

export function useGetPatientId() {
    let { patientId } = useParams<{ patientId: string }>();

    return patientId ? +patientId : null
}

export function useHandleDoctorDiaryResourceService(appointmentType: { label: string, value: string | number, checked: boolean }[], schedulerDate: any, currentViewName: string) {
    const dispatch = useDispatch();
    let { medicalStaffId, resourceId } = useGetMedicalStaffAndResourceId(appointmentType);

    useEffect(() => {
        if (appointmentType.length && resourceId) {

            if ((medicalStaffId || resourceId) && currentViewName !== "Month") {
                const { fromDateTime, toDateTime } = getAppointmentFromToDate(schedulerDate, currentViewName);
                let params = {
                    fromDateTime, toDateTime,
                    appointmentCallTypeId: 2,
                    medicalStaffId: null
                }
                if (medicalStaffId) {
                    let modifiedParams = {
                        ...params,
                        medicalStaffId, resourceId
                    }
                    dispatch(getMasterPaginationData(masterPaginationServices.resourceSlotAppointmentConfig, modifiedParams));
                    dispatch(getMasterPaginationData(masterPaginationServices.appointmentDoctorSlotBlock, modifiedParams));
                } else if (resourceId) {
                    let modifiedParams = {
                        ...params,
                        resourceId
                    }
                    dispatch(getMasterPaginationData(masterPaginationServices.resourceSlotAppointmentConfig, modifiedParams));
                }

            }
        }
    }, [appointmentType, resourceId]);

    return null;
}

export function useGetMedicalStaffAndResourceId(appointmentType: { label: string, value: string | number, checked: boolean }[]) {
    let response = useMemo(() => {
        let params: { medicalStaffId: null | number, resourceId: null | number } = {
            medicalStaffId: null,
            resourceId: null
        }
        let filterAppointment = appointmentType.filter(appointment => appointment?.checked);
        if (filterAppointment.length === 1) {
            let isMedicalStaff = String(filterAppointment[0].value).includes('M');
            if (isMedicalStaff) {
                let medicalStaffId = +String(filterAppointment[0].value).replace('M', '');
                params = {
                    ...params,
                    medicalStaffId,
                    resourceId: 1
                }
            } else if (filterAppointment?.[0]?.value <= 6) {
                let resourceId = +filterAppointment?.[0]?.value;
                params = {
                    ...params,
                    resourceId
                }
            }
        }

        return params;
    }, [appointmentType]);

    return response;
}