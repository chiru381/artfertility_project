import { useState, useEffect, useMemo, memo, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
    ViewState
} from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Appointments,
    AppointmentTooltip,
    WeekView,
    DayView,
    Toolbar,
    ViewSwitcher,
    DateNavigator,
    CurrentTimeIndicator,
    TodayButton,
    Resources
} from '@devexpress/dx-react-scheduler-material-ui';
import Box from '@material-ui/core/Box';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import Today from '@material-ui/icons/Today';

import { clinicalInitialRoutePath, masterPaginationServices } from "utils/constants";
import BookAppointmentModal from './BookAppointmentModal';
import { RootReducerState } from 'utils/types';
import { HoverLoader } from 'components';
import CancelAppointmentModal from './CancelAppointmentModal';
import RescheduleAppointmentModal from './RescheduleAppointmentModal';
import { LayoutComponent } from './LayoutComponent';

import { getAppointmentLookup, getMasterPaginationData } from 'redux/actions';
import { useSchedulerStyles } from 'assets/styles/mui';
import { checkIsTimeSlotBlocked, checkOverlappedSlot } from './checkTimeSlotAvailability';
import { useCreateLookupOptions, useSchedulerIndicator, useToastMessage } from 'utils/hooks';
import { confirmAppointment, endConsultation, markPatientArrived, startConsultation } from './appointmentActionServices';
import { SecondaryButton } from 'components/button';
import ScheulingControllerPanel from './ScheulingControllerPanel';
import { getAppointmentFromToDate } from 'utils/global';
import { DayScaleCell, TimeLabel } from '../doctorDiary/TimeTableSubComponent';
import AppointmentHistoryModal from './AppointmentHistoryModal';

interface Props {

}


const AppointmentScheduling = memo((props: Props) => {
    const classes = useSchedulerStyles();
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();
    const { toastMessage } = useToastMessage();
    const indicatorRef: any = useRef(null);

    const [selectedCallType, setSelectedCallType] = useState<any>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const [currentViewName, setCurrentViewName] = useState<string>("Day");
    const [bookAppointmentModalOpen, setBookAppointmentModalOpen] = useState(false);
    const [timeSlotData, setTimeSlotData] = useState({});
    const [schedulerStartEndTime, setSchedulerStartEndTime] = useState({
        startDayHour: 8,
        endDayHour: 18
    });
    const [appointment, setAppointment] = useState([]);
    const [schedulerDate, setSchedulerDate] = useState(new Date());

    const [rescheduleModalOpen, setReschedulemodalOpen] = useState(false);
    const [appointmentHistoryModalOpen, setAppointmentHistoryModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<null | number>(null);
    const [selectedAppointment, setSelectedAppointment] = useState({});
    const [selectedOptions, setSelectedOptions] = useState<null | number>(null);
    const [serviceLoading, setServiceLoading] = useState(false);
    const [indicatorInitialization, setIndicatorInitialization] = useState(false);

    let params = useMemo(() => {
        const { fromDateTime, toDateTime } = getAppointmentFromToDate(schedulerDate, currentViewName);
        return ({
            fromDateTime, toDateTime,
            appointmentCallTypeId: 2,
            resourceId: +selectedResource?.value,
            medicalStaffId: selectedResource?.value === "1" ? +selectedDoctor?.value : null
        })
    }, [schedulerDate, selectedResource, currentViewName, selectedDoctor]);

    const { resourceAppointmentSlotData, resourceAppointmentLoading, doctorSlotBlockLoading, appointmentByDateLoading,
        doctorSlotBlockData, appointmentByDateData, appointmentLookupData, visitTypeData } = useSelector(
            ({ masterPaginationReducer, appointmentLookupReducer }: RootReducerState) => ({
                appointmentLookupData: appointmentLookupReducer.data,
                resourceAppointmentSlotData: masterPaginationReducer[masterPaginationServices.resourceSlotAppointmentConfig].data,
                resourceAppointmentLoading: masterPaginationReducer[masterPaginationServices.resourceSlotAppointmentConfig].loading,

                doctorSlotBlockData: masterPaginationReducer[masterPaginationServices.appointmentDoctorSlotBlock].data,
                doctorSlotBlockLoading: masterPaginationReducer[masterPaginationServices.appointmentDoctorSlotBlock].loading,

                appointmentByDateData: masterPaginationReducer[masterPaginationServices.appointmentByDate].data,
                appointmentByDateLoading: masterPaginationReducer[masterPaginationServices.appointmentByDate].loading,
                visitTypeData: masterPaginationReducer[masterPaginationServices.visitType].data,
            }),
            shallowEqual
        );
    let loading = (resourceAppointmentLoading || doctorSlotBlockLoading || appointmentByDateLoading || serviceLoading);
    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(appointmentLookupData);
    let resourceSlotData = resourceAppointmentSlotData.modelItems;
    let appointmentData = appointmentByDateData.modelItems;
    let doctorSlotBlock = doctorSlotBlockData.modelItems;

    let resources = useMemo(() => ([{
        fieldName: 'visitTypeId',
        title: 'Resource',
        instances: visitTypeData.modelItems.map((visit: any) => ({ id: visit.id, text: visit.name, color: visit.colorCode })),
    }]), [visitTypeData.modelItems]);

    useEffect(() => {
        dispatch(getAppointmentLookup());
        dispatch(getMasterPaginationData(masterPaginationServices.visitType, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.leadSource, {}));
    }, [])

    useEffect(() => {
        if (selectedResource?.value === "1", selectOptions?.medicalStaffs?.length) {
            setSelectedDoctor(selectOptions?.medicalStaffs?.[0] ?? null);
        }
    }, [selectedResource?.value, selectOptions?.medicalStaffs])

    useEffect(() => {
        if (selectedResource?.value === "1" ? selectedDoctor?.value : selectedResource?.value) {
            if (selectedResource.value === "1") {
                dispatch(getMasterPaginationData(masterPaginationServices.appointmentDoctorSlotBlock, params));
            }
            dispatch(getMasterPaginationData(masterPaginationServices.resourceSlotAppointmentConfig, params));
            onAppointmentByDateApiCall();
        }
    }, [selectedResource?.value, selectedDoctor?.value]);

    useEffect(() => {
        if(selectOptions?.resources?.length){
            setSelectedResource(selectOptions?.resources.find((resource: any) => resource.value === "1"));
        }
    }, [selectOptions?.resources])

    useEffect(() => {
        let data = appointmentData.map((appointment: any) => {
            return {
                title: `${appointment.patientFullName} - ${appointment.visitTypeName ?? ""}`,
                startDate: dayjs(appointment.appointmentDateTime).toDate(),
                endDate: dayjs(appointment.appointmentDateTime).add(appointment.estimatedDurationMinutes, 'minute').toDate(),
                doctorId: appointment.medicalStaffId ?? null,
                isArrived: appointment.isArrived,
                isCancelled: appointment.isCancelled,
                isConfirmed: appointment.isConfirmed,
                isConsultationStart: appointment.startDate ? true : false,
                isConsultationEnd: appointment.endDate ? true : false,
                id: appointment.id,
                visitTypeId: appointment.visitTypeId
            }
        });
        setAppointment(data);
    }, [appointmentData]);

    useEffect(() => {
        if (resourceSlotData.length) {
            let startDayHour: any = null;
            let endDayHour = 0;

            resourceSlotData.map((item: any) => {
                item?.resourceSlotConfigDetails?.map((subItem: any) => {
                    let fromTime = dayjs(subItem.fromTime, 'hh:mm:ss').format('HH');
                    let toTime = dayjs(subItem.toTime, 'hh:mm:ss').format('HH');

                    if (+toTime > endDayHour) {
                        endDayHour = +toTime;
                    }

                    if (startDayHour === null) {
                        startDayHour = +fromTime;
                    } else if (fromTime < startDayHour) {
                        startDayHour = +fromTime;
                    }
                })
            });

            setSchedulerStartEndTime({
                startDayHour: startDayHour ? startDayHour : 8,
                endDayHour: endDayHour ? endDayHour : 18
            });
        }
    }, [resourceAppointmentSlotData]);

    function onCurrentDateChange(currentDate: any) {
        const { selectedDate, fromDateTime, toDateTime } = getAppointmentFromToDate(currentDate, currentViewName);

        if (dayjs(selectedDate).format('DD-MM-YYYY') !== dayjs(schedulerDate).format('DD-MM-YYYY')) {
            setSchedulerDate(selectedDate);
            let modifiedParams = { ...params, fromDateTime, toDateTime };
            dispatch(getMasterPaginationData(masterPaginationServices.appointmentByDate, modifiedParams));
            if (selectedResource.value === "1") {
                dispatch(getMasterPaginationData(masterPaginationServices.appointmentDoctorSlotBlock, modifiedParams));
            }
        }
    }

    function onViewChange(viewName: any) {
        const { selectedDate, fromDateTime, toDateTime } = getAppointmentFromToDate(params.fromDateTime, viewName);

        let modifiedParams = { ...params, fromDateTime, toDateTime };
        setSchedulerDate(selectedDate);
        dispatch(getMasterPaginationData(masterPaginationServices.appointmentByDate, modifiedParams));
        if (selectedResource.value === "1") {
            dispatch(getMasterPaginationData(masterPaginationServices.appointmentDoctorSlotBlock, modifiedParams));
        }
        setIndicatorInitialization(false);
    }

    function onAppointmentByDateApiCall() {
        dispatch(getMasterPaginationData(masterPaginationServices.appointmentByDate, params));
    }

    function onSelectAppointmentAction(option: null | number, appointment: any) {
        setSelectedAppointment(appointment);
        const params = {
            appointmentId: appointment.id,
            resourceId: appointment.resourceId,
            clinicId: appointment.clinicId
        }
        if (option === 1) {
            confirmAppointment(params, setServiceLoading, toastMessage, formatMessage, onAppointmentByDateApiCall);
        } else if (option === 3) {
            markPatientArrived(params, setServiceLoading, toastMessage, formatMessage, onAppointmentByDateApiCall);
        } else if (option === 4) {
            startConsultation(params, setServiceLoading, toastMessage, formatMessage, onAppointmentByDateApiCall);
        } else if (option === 5) {
            endConsultation(params, setServiceLoading, toastMessage, formatMessage, onAppointmentByDateApiCall);
        } else if (option === 6) {
            setReschedulemodalOpen(true);
            setSelectedOptions(option);
        } else if (option === 7) {
            history.push(`/${clinicalInitialRoutePath}/${appointment.patientId}`);
        } else if (option === 8) {
            setAppointmentHistoryModalOpen(true);
            setSelectedPatient(appointment.patientId);
        } else {
            setSelectedOptions(option);
        }
    }

    function onCloseBookAppointmentModal() {
        setBookAppointmentModalOpen(false);
        setSelectedCallType(null);
    }

    function handleCellClick(cellData: any) {
        let { startDate, endDate } = cellData;
        let isOverlappedAllowed = resourceSlotData?.[0]?.isOverlappingAllowed;
        let checkOverlapped = checkOverlappedSlot(startDate, endDate, appointmentData);


        if (isOverlappedAllowed ? isOverlappedAllowed : !checkOverlapped) {
            let data: any = {
                appointmentDateTime: startDate,
                estimatedDurationMinutes: dayjs(endDate).diff(startDate, 'minute'),
                resourceId: +selectedResource?.value
            }

            if (selectedResource?.value === "1") {
                data = {
                    ...data,
                    medicalStaffId: selectedDoctor?.value ? +selectedDoctor?.value : null,
                }
            }

            setTimeSlotData(data);
            setBookAppointmentModalOpen(true);
            setSelectedCallType("2");
        } else {
            toastMessage("Slot not available", "error");
        }
    }

    const TimeTableCell = (props: any) => useMemo(() => {
        if (loading === false) {
            const { startDate, endDate } = props;
            let selectedResourceId = selectedResource?.value;
            let isSlotBlocked = checkIsTimeSlotBlocked(startDate, endDate, resourceSlotData, doctorSlotBlock, selectedResourceId);

            if (isSlotBlocked) {
                return <WeekView.TimeTableCell {...props} className={classes.timeTableBlockedCell} />;
            } return <WeekView.TimeTableCell {...props}  onDoubleClick={() => handleCellClick(props)} className={classes.timeTableCell} />;
        } else {
            return <WeekView.TimeTableCell {...props} className={classes.timeTableCell} />;
        }
    }, []);


    const Indicator = (props: any) => useSchedulerIndicator(props, indicatorInitialization, setIndicatorInitialization);
    let showScheduler = (selectedResource?.value && resourceSlotData.length !== 0);

    useEffect(() => {
        if (indicatorRef?.current) {
            indicatorRef.current.scrollIntoView({ block: "center" });
        }
    }, [indicatorRef, appointmentData.length])

    function onCreateEnquiry() {
        setSelectedCallType('1');
        setBookAppointmentModalOpen(true);
    }

    function onChangeResource(data: any) {
        setSelectedResource(data);
        if (data?.value) {
            setSchedulerDate(new Date());
        }
    }

    let errorLabel = selectedResource ? (
        (selectedResource?.value === "1" && !selectedDoctor) ? "Please select a Doctor" : (
            `Resourse slot not configured for ${selectedResource?.value === "1" ? `Dr. ${selectedDoctor?.label}` : selectedResource?.label}`
        )
    ) : "Please select a Resurce.";

    return (
        <>
            <Box style={{ height: "calc(100vh - 64px)", background: "white" }} className="scheduler-table">

                <div style={{ height: "100%", display: "flex" }}>

                    <ScheulingControllerPanel
                        onCreateEnquiry={onCreateEnquiry}
                        onChangeResource={onChangeResource}
                        setSelectedDoctor={setSelectedDoctor}
                        selectedDoctor={selectedDoctor}
                        selectedResource={selectedResource}
                    />

                    <div className={showScheduler ? "scroll-root-body" : "scroll-root-unset"} style={{ width: "100%" }}>
                        {showScheduler && <Scheduler
                            data={appointment}
                            firstDayOfWeek={dayjs().get('day')}
                        >
                            <ViewState
                                onCurrentDateChange={onCurrentDateChange}
                                defaultCurrentViewName="Day"
                                onCurrentViewNameChange={viewName => {
                                    onViewChange(viewName);
                                    setCurrentViewName(viewName);
                                }}
                                currentDate={schedulerDate}
                            />

                            <DayView
                                startDayHour={schedulerStartEndTime.startDayHour}
                                endDayHour={schedulerStartEndTime.endDayHour}
                                timeTableCellComponent={TimeTableCell}
                                dayScaleCellComponent={DayScaleCell}
                                timeScaleLabelComponent={TimeLabel}
                                cellDuration={10}
                            />

                            <WeekView
                                startDayHour={schedulerStartEndTime.startDayHour}
                                endDayHour={schedulerStartEndTime.endDayHour}
                                timeTableCellComponent={TimeTableCell}
                                dayScaleCellComponent={DayScaleCell}
                                timeScaleLabelComponent={TimeLabel}
                                cellDuration={10}
                            />

                            <Appointments
                                containerComponent={props => (
                                    <Appointments.Container
                                        {...props} // Custom Appointment width
                                        style={{ ...props.style, width: `calc(${props.style.width} - ${currentViewName === "Day" ? "40px" : "10px"})` }}
                                    />
                                )}
                            />
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
                            <CurrentTimeIndicator indicatorComponent={Indicator} />
                            <Resources
                                data={resources}
                                mainResourceName="visitTypeId"
                            />

                            <AppointmentTooltip
                                layoutComponent={(props) => {
                                    return (
                                        <AppointmentTooltip.Layout
                                            {...props}
                                            contentComponent={contentProps => (
                                                <LayoutComponent
                                                    {...contentProps}
                                                    appointmentByDateData={appointmentData}
                                                    onSelectAppointmentAction={onSelectAppointmentAction}
                                                    onHide={props.onHide}
                                                />
                                            )}
                                        />
                                    )
                                }}
                            />

                        </Scheduler>}

                        {(resourceSlotData.length === 0 && !loading) && (
                            <h1 style={{ textAlign: "center", marginTop: "30px" }}>{errorLabel}</h1>
                        )}
                    </div>

                </div>
            </Box>

            {bookAppointmentModalOpen && (
                <BookAppointmentModal
                    closeModal={onCloseBookAppointmentModal}
                    selectedCallType={selectedCallType}
                    timeSlotData={timeSlotData}
                    apiCall={onAppointmentByDateApiCall}
                />
            )}

            {rescheduleModalOpen && (
                <RescheduleAppointmentModal
                    closeModal={() => {
                        setReschedulemodalOpen(false);
                        setSelectedOptions(null);
                    }}
                    onApiCall={onAppointmentByDateApiCall}
                    selectedAppointment={selectedAppointment}
                    onCurrentDateChange={onCurrentDateChange}
                />
            )}

            {selectedOptions === 2 && (
                <CancelAppointmentModal
                    closeModal={() => setSelectedOptions(null)}
                    onApiCall={onAppointmentByDateApiCall}
                    selectedAppointment={selectedAppointment}
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
});

export default AppointmentScheduling;