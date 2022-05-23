import { useState, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Appointments,
    AppointmentTooltip,
    WeekView,
    DayView,
    MonthView,
    Toolbar,
    ViewSwitcher,
    DateNavigator,
    CurrentTimeIndicator,
    Resources,
    TodayButton
} from '@devexpress/dx-react-scheduler-material-ui';

import Box from '@material-ui/core/Box';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import Today from '@material-ui/icons/Today';


import { clinicalInitialRoutePath, masterPaginationServices } from "utils/constants";
import { RootReducerState } from 'utils/types';
import { HoverLoader } from 'components';
import { LayoutComponent } from './LayoutComponent';

import { getAppointmentLookup, getMasterPaginationData } from 'redux/actions';
import { useGetMedicalStaffAndResourceId, useHandleDoctorDiaryResourceService, useToastMessage } from 'utils/hooks';
import { endConsultation, startConsultation } from '../scheduling/appointmentActionServices';
import { SecondaryButton } from 'components/button';
import { DayScaleCell, TimeLabel } from "./TimeTableSubComponent";
import DoctorDiaryControllerPanel from './DoctorDiaryControllerPanel';
import CreateTaskReasonModal from './createTaskModal';
import { getAppointmentFromToDate } from 'utils/global';
import AppointmentHistoryModal from '../scheduling/AppointmentHistoryModal';
import { useSchedulerStyles } from 'assets/styles/mui';
import { checkIsTimeSlotBlocked } from '../scheduling/checkTimeSlotAvailability';

interface Props {

}

const DoctorDiary = (props: Props) => {
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useSchedulerStyles();

    const [schedulerDate, setSchedulerDate] = useState(new Date());
    const [appointment, setAppointment] = useState([]);
    const [appointmentType, setAppointmentType] = useState<{ label: string, value: string | number, checked: boolean }[]>([]);
    const [currentViewName, setCurrentViewName] = useState<string>("Week");
    const [serviceLoading, setServiceLoading] = useState(false);
    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
    const [appointmentHistoryModalOpen, setAppointmentHistoryModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<null | number>(null);


    const { appointmentByDateLoading, appointmentByDateData, resourceData, resourceDataLoading, appointmentLookupData, appointmentLookupDataLoading,
        visitTypeData, resourceAppointmentSlotData, resourceAppointmentLoading, doctorSlotBlockData, doctorSlotBlockLoading } = useSelector(
            ({ masterPaginationReducer, appointmentLookupReducer }: RootReducerState) => ({
                resourceAppointmentSlotData: masterPaginationReducer[masterPaginationServices.resourceSlotAppointmentConfig].data,
                resourceAppointmentLoading: masterPaginationReducer[masterPaginationServices.resourceSlotAppointmentConfig].loading,

                doctorSlotBlockData: masterPaginationReducer[masterPaginationServices.appointmentDoctorSlotBlock].data,
                doctorSlotBlockLoading: masterPaginationReducer[masterPaginationServices.appointmentDoctorSlotBlock].loading,

                appointmentLookupData: appointmentLookupReducer.data,
                appointmentLookupDataLoading: appointmentLookupReducer.loading,
                resourceData: masterPaginationReducer[masterPaginationServices.resource].data,
                resourceDataLoading: masterPaginationReducer[masterPaginationServices.resource].loading,
                visitTypeData: masterPaginationReducer[masterPaginationServices.visitType].data,
                appointmentByDateData: masterPaginationReducer[masterPaginationServices.resourceAppointment].data,
                appointmentByDateLoading: masterPaginationReducer[masterPaginationServices.resourceAppointment].loading
            }),
            shallowEqual
        );
    let resourceSlotData = resourceAppointmentSlotData.modelItems;
    let doctorSlotBlock = doctorSlotBlockData.modelItems;
    let initialDataFetchingLoading = resourceDataLoading || appointmentLookupDataLoading;
    let loading = initialDataFetchingLoading || appointmentByDateLoading || serviceLoading || resourceAppointmentLoading || doctorSlotBlockLoading;

    let colorInstances = useMemo(() => {
        return [
            ...visitTypeData.modelItems.map((visit: any) => ({ id: `V${visit.id}`, text: visit.name, color: visit.colorCode })),
            ...resourceData.modelItems.filter((resource: any) => (resource.id !== 1)).map((resource: any) => ({ id: resource.id, text: resource.name, color: resource.colorCode })),
        ]
    }, [resourceData.modelItems, visitTypeData.modelItems])

    let resources = [
        {
            fieldName: 'colourId',
            title: 'Resource',
            instances: colorInstances,
        },
    ];

    let params = useMemo(() => {
        let resourceList = appointmentType.filter(type => (type.checked && !String(type.value).includes("M"))).map((type: any) => type.value);
        let medicalStaffList = appointmentType.filter(type => (type.checked && String(type.value).includes("M"))).map((type: any) => String(type.value).replace('M', ''));
        const { fromDateTime, toDateTime } = getAppointmentFromToDate(schedulerDate, currentViewName);
        return ({
            fromDateTime, toDateTime,
            appointmentCallTypeId: 2,
            resourceId: (medicalStaffList.length ? '1,' : '') + resourceList.toString(),
            medicalStaffId: medicalStaffList.toString()
        })
    }, [schedulerDate, currentViewName, appointmentType]);

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.resource, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.visitType, {}));
        dispatch(getAppointmentLookup());
    }, []);

    useHandleDoctorDiaryResourceService(appointmentType, schedulerDate, currentViewName);
    let { resourceId: selectedResourceId } = useGetMedicalStaffAndResourceId(appointmentType);

    useEffect(() => {
        if (appointmentType.length) {
            onAppointmentApiCall();
        }
    }, [appointmentType, currentViewName]);

    function onAppointmentApiCall() {
        dispatch(getMasterPaginationData(masterPaginationServices.resourceAppointment, params));
    }

    useEffect(() => {
        let data = appointmentByDateData.modelItems.map((appointment: any) => {
            let selectedResource = resourceData.modelItems.find((resource: any) => (resource.id === appointment.resourceId) || (appointment.resourceId === 0 && resource.id === 6));
            let otTittle = `${selectedResource?.name} - ${appointment?.operatingTheatreName} - ${appointment?.surgeryName}`;
            let medicalStaffTitle = `Dr. ${appointment?.medicalStaffUserDisplayName} - ${appointment?.visitTypeName ?? ""} - ${appointment?.patientFullName}`;
            let otherResourceTitle = `${selectedResource?.name} - ${appointment?.patientFullName}`
            return ({
                title: selectedResource?.id === 6 ? otTittle : appointment?.resourceId === 1 ? medicalStaffTitle: otherResourceTitle,
                startDate: dayjs(appointment.appointmentDateTime).toDate(),
                endDate: dayjs(appointment.appointmentDateTime).add(appointment.estimatedDurationMinutes, 'minute').toDate(),
                doctorId: appointment.medicalStaffId ?? null,
                isArrived: appointment.isArrived,
                isCancelled: appointment.isCancelled,
                isConfirmed: appointment.isConfirmed,
                isConsultationStart: appointment.startDate ? true : false,
                isConsultationEnd: appointment.endDate ? true : false,
                id: `${selectedResource?.id === 6 ? 'OT' : ''}${appointment?.id}`,
                colourId: +appointment?.resourceId === 1 ? `V${appointment?.visitTypeId}` : selectedResource?.id
            })
        });
        setAppointment(data);
    }, [appointmentByDateData.modelItems]);

    useEffect(() => {
        if (resourceData.modelItems.length && initialDataFetchingLoading === false) {
            let medicalStaffOptions = appointmentLookupData?.medicalStaffs?.map((staff: any) => ({ label: `Dr. ${staff.text}`, value: `M${staff.value}`, checked: true }));
            let resourceOptions = resourceData.modelItems.filter((resource: any) => (resource.id !== 1)).map((resource: any) => ({ label: resource.name, value: resource.id, checked: true }));
            if (medicalStaffOptions?.length) {
                resourceOptions = [...medicalStaffOptions, ...resourceOptions];
            }
            setAppointmentType(resourceOptions);
        }
    }, [resourceData.modelItems, appointmentLookupData?.medicalStaffs, initialDataFetchingLoading])

    function onCurrentDateChange(currentDate: any) {
        const { selectedDate, fromDateTime, toDateTime } = getAppointmentFromToDate(currentDate, currentViewName);

        if (dayjs(selectedDate).format('DD-MM-YYYY') !== dayjs(schedulerDate).format('DD-MM-YYYY')) {
            setSchedulerDate(selectedDate);
            let updatedParams = { ...params, fromDateTime, toDateTime };
            dispatch(getMasterPaginationData(masterPaginationServices.resourceAppointment, updatedParams));
        }
    }

    function onAppointmentTypeToggle(value: string | number) {
        setAppointmentType(appointmentType.map((option: any) => ({ ...option, checked: option.value === value ? !option.checked : option.checked })));
    }

    function onSelectAppointmentAction(option: null | number, appointment: any) {
        const params = {
            appointmentId: appointment.id,
            resourceId: appointment.resourceId,
            clinicId: appointment.clinicId
        }

        if (option === 1) {
            startConsultation(params, setServiceLoading, toastMessage, formatMessage, onAppointmentApiCall);
        } else if (option === 2) {
            endConsultation(params, setServiceLoading, toastMessage, formatMessage, onAppointmentApiCall);
        } else if (option === 3) {
            history.push(`/${clinicalInitialRoutePath}/${appointment.patientId}`);
        } else if (option === 4) {
            setAppointmentHistoryModalOpen(true);
            setSelectedPatient(appointment.patientId);
        }
    }

    function onSelectAll(isChecked: boolean) {
        setAppointmentType(appointmentType.map((option: any) => ({ ...option, checked: isChecked })));
    }

    const TimeTableCell = (props: any) => useMemo(() => {
        if (loading === false && selectedResourceId && currentViewName !== "Month" && resourceSlotData.length) {
            const { startDate, endDate } = props;
            let isSlotBlocked = checkIsTimeSlotBlocked(startDate, endDate, resourceSlotData, doctorSlotBlock, selectedResourceId);

            if (isSlotBlocked) {
                return <WeekView.TimeTableCell {...props} className={classes.timeTableBlockedCell} />;
            } return <WeekView.TimeTableCell {...props} className={classes.timeTableCell} />;
        } else {
            return <WeekView.TimeTableCell {...props} className={classes.timeTableCell} />;
        }
    }, [loading, selectedResourceId]);

    return (
        <>
            <Box style={{ height: "calc(100vh - 64px)", background: "white" }} className={` ${currentViewName === "Month" ? "" : "scheduler-table"}`}>

                <div style={{ height: "100%", display: "flex" }}>

                    <DoctorDiaryControllerPanel
                        appointmentType={appointmentType}
                        colorInstances={colorInstances}
                        onAppointmentTypeToggle={onAppointmentTypeToggle}
                        setCreateTaskModalOpen={setCreateTaskModalOpen}
                        onSelectAll={onSelectAll}
                    />

                    <div className="scroll-root-body" style={{ width: "100%", height: "100%" }}>
                        <Scheduler
                            data={appointment}
                            firstDayOfWeek={dayjs().get('day')}
                        >
                            <ViewState
                                currentDate={schedulerDate}
                                onCurrentDateChange={onCurrentDateChange}
                                currentViewName={currentViewName}
                                onCurrentViewNameChange={viewName => setCurrentViewName(viewName)}
                            />

                            <DayView
                                startDayHour={8}
                                endDayHour={22}
                                timeTableCellComponent={TimeTableCell}
                                dayScaleCellComponent={DayScaleCell}
                                timeScaleLabelComponent={TimeLabel}
                                cellDuration={10}
                            />

                            <WeekView
                                startDayHour={8}
                                endDayHour={22}
                                timeTableCellComponent={TimeTableCell}
                                dayScaleCellComponent={DayScaleCell}
                                timeScaleLabelComponent={TimeLabel}
                                cellDuration={10}
                            />
                            <MonthView />

                            <Appointments />
                            <Toolbar />
                            <ViewSwitcher />
                            <DateNavigator
                                openButtonComponent={props => (
                                    <SecondaryButton
                                        onClick={props.onVisibilityToggle}
                                        label={props.text}
                                        endIcon={<Today />}
                                        color="default" />
                                )}
                            />
                            <TodayButton />

                            <CurrentTimeIndicator />
                            <Resources
                                data={resources}
                                mainResourceName="colourId"
                            />

                            <AppointmentTooltip
                                layoutComponent={(props) => {
                                    return (
                                        <AppointmentTooltip.Layout
                                            {...props}
                                            contentComponent={contentProps => (
                                                <LayoutComponent
                                                    {...contentProps}
                                                    appointmentByDateData={appointmentByDateData.modelItems}
                                                    onSelectAppointmentAction={onSelectAppointmentAction}
                                                    onHide={props.onHide}
                                                />
                                            )}
                                        />
                                    )
                                }}
                            />

                        </Scheduler>
                    </div>

                </div>
            </Box>

            {createTaskModalOpen && (
                <CreateTaskReasonModal
                    closeModal={() => setCreateTaskModalOpen(false)}
                />
            )}

            {appointmentHistoryModalOpen && (
                <AppointmentHistoryModal
                    closeModal={() => {
                        setAppointmentHistoryModalOpen(false);
                        setSelectedPatient(null);
                    }}
                    patientId={selectedPatient}
                />
            )}

            {loading && <HoverLoader />}
        </>
    )
}

export default DoctorDiary;