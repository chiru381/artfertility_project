import { useState, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

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
    DateNavigator,
    TodayButton,
    CurrentTimeIndicator,
    ViewSwitcher,
    Resources
} from '@devexpress/dx-react-scheduler-material-ui';
import Box from '@material-ui/core/Box';
import Today from '@material-ui/icons/Today';
import dayjs from 'dayjs';

import { masterPaginationServices } from "utils/constants";
import OTRoomBookingModal from './OTRoomBookingModal';
import { RootReducerState } from 'utils/types';
import { HoverLoader } from 'components';
import RescheduleOTAppointmentModal from './RescheduleOTAppointmentModal';
import { LayoutComponent } from './LayoutComponent';

import { getMasterPaginationData } from 'redux/actions';
import { useSchedulerStyles } from 'assets/styles/mui';
import { checkIsTimeSlotBlocked, checkOverlappedSlot } from './checkTimeSlotAvailability';
import { useSchedulerIndicator, useToastMessage } from 'utils/hooks';
import { SecondaryButton } from 'components/button';
import OTRoomControllerPanel from './OTRoomControllerPanel';
import { DayScaleCell, TimeLabel } from '../doctorDiary/TimeTableSubComponent';
import { getAppointmentFromToDate } from 'utils/global';

interface Props {

}

const AppointmentScheduling = (props: Props) => {
    const classes = useSchedulerStyles();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();

    const [currentViewName, setCurrentViewName] = useState<string>("Day");
    const [OTRoomBookingModalOpen, setOTRoomBookingModalOpen] = useState(false);
    const [timeSlotData, setTimeSlotData] = useState({});
    const [schedulerStartEndTime, setSchedulerStartEndTime] = useState({
        startDayHour: 8,
        endDayHour: 18
    });
    const [appointment, setAppointment] = useState([]);
    const [schedulerDate, setSchedulerDate] = useState(new Date());

    const [selectedOTRoom, setSelectedOTRoom] = useState<any>(null);
    const [indicatorInitialization, setIndicatorInitialization] = useState(false);

    const [rescheduleModalOpen, setReschedulemodalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState({});

    const { otSlotConfigAppointmentData, otSlotConfigAppointmentLoading, otSlotBlockLoading, otAppointmentByDateLoading,
        otSlotBlockData, otAppointmentByDateData, operatingTheatreRoomData } = useSelector(
            ({ masterPaginationReducer }: RootReducerState) => ({
                otSlotConfigAppointmentData: masterPaginationReducer[masterPaginationServices.otSlotAppointmentConfig].data,
                otSlotConfigAppointmentLoading: masterPaginationReducer[masterPaginationServices.otSlotAppointmentConfig].loading,

                otSlotBlockData: masterPaginationReducer[masterPaginationServices.appointmentOTSlotBlock].data,
                otSlotBlockLoading: masterPaginationReducer[masterPaginationServices.appointmentOTSlotBlock].loading,

                otAppointmentByDateData: masterPaginationReducer[masterPaginationServices.otAppointmentByDate].data,
                otAppointmentByDateLoading: masterPaginationReducer[masterPaginationServices.otAppointmentByDate].loading,

                operatingTheatreRoomData: masterPaginationReducer[masterPaginationServices.operatingTheatreRoom].data,
            }),
            shallowEqual
        );
    let loading = (otSlotConfigAppointmentLoading || otSlotBlockLoading || otAppointmentByDateLoading);
    let otSlotConfigData = otSlotConfigAppointmentData.modelItems;
    let otSlotBlock = otSlotBlockData.modelItems;
    let OTRoomData = operatingTheatreRoomData.modelItems;
    let appointmentData = otAppointmentByDateData.modelItems;

    let params = useMemo(() => {
        const { fromDateTime, toDateTime } = getAppointmentFromToDate(schedulerDate, currentViewName);
        return ({
            fromDateTime, toDateTime,
            operationTheatreId: +selectedOTRoom
        })
    }, [schedulerDate, currentViewName, selectedOTRoom]);

    let resources = useMemo(() => ([{
        fieldName: 'otRoomId',
        title: 'OT Room',
        instances: OTRoomData.map((otRoom: any) => ({ id: otRoom.id, text: otRoom.name, color: otRoom.colorCode })),
    }]), [OTRoomData.length]);

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.operatingTheatreRoom, params));
    }, []);

    useEffect(() => {
        if (OTRoomData?.length) {
            setSelectedOTRoom(OTRoomData[0].id);
        }
    }, [OTRoomData])

    useEffect(() => {
        if (selectedOTRoom) {
            dispatch(getMasterPaginationData(masterPaginationServices.otSlotAppointmentConfig, params));
            dispatch(getMasterPaginationData(masterPaginationServices.appointmentOTSlotBlock, params));
            onAppointmentByDateApiCall();
        }
    }, [selectedOTRoom]);

    useEffect(() => {
        let data = appointmentData.map((appointment: any) => {
            return {
                title: `${appointment.appointmentNumber} - ${appointment.operatingTheatreName} - ${appointment.surgeryName} - ${appointment.patientFullName} - Tel:${appointment.telephone}`,
                startDate: dayjs(appointment.appointmentDateTime).toDate(),
                endDate: dayjs(appointment.appointmentDateTime).add(appointment.estimatedDurationMinutes, 'minute').toDate(),
                operatingTheatreId: appointment.operatingTheatreId ?? null,
                id: appointment.id,
                otRoomId: appointment.operatingTheatreId
            }
        });
        setAppointment(data);
    }, [appointmentData]);

    useEffect(() => {
        if (otSlotConfigData.length) {
            let startDayHour: any = null;
            let endDayHour = 0;

            otSlotConfigData.map((item: any) => {
                item?.operatingTheatreSlotConfigDetails?.map((subItem: any) => {
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
    }, [otSlotConfigAppointmentData])

    function currentDateChange(currentDate: any) {
        const { selectedDate, fromDateTime, toDateTime } = getAppointmentFromToDate(currentDate, currentViewName);

        if (dayjs(selectedDate).format('DD-MM-YYYY') !== dayjs(schedulerDate).format('DD-MM-YYYY')) {
            setSchedulerDate(selectedDate);
            let modifiedParams = { ...params, fromDateTime, toDateTime };
            dispatch(getMasterPaginationData(masterPaginationServices.otAppointmentByDate, modifiedParams));
            dispatch(getMasterPaginationData(masterPaginationServices.appointmentOTSlotBlock, modifiedParams));
        }
    }

    function onAppointmentByDateApiCall() {
        dispatch(getMasterPaginationData(masterPaginationServices.otAppointmentByDate, params));
    }

    function onSelectAppointmentAction(option: null | number, appointment: any) {
        setSelectedAppointment(appointment);

        if (option === 1) {
            setReschedulemodalOpen(true);
        }
    }

    function onCloseOTRoomBookingModal() {
        setOTRoomBookingModalOpen(false);
    }

    function handleCellClick(cellData: any) {
        let { startDate, endDate } = cellData;
        let isOverlappedAllowed = otSlotConfigData?.[0]?.isOverlappingAllowed;
        let checkOverlapped = checkOverlappedSlot(startDate, endDate, appointmentData);

        if (isOverlappedAllowed ? isOverlappedAllowed : !checkOverlapped) {
            let data: any = {
                appointmentDateTime: startDate,
                estimatedDurationMinutes: dayjs(endDate).diff(startDate, 'minute'),
                operatingTheatreId: +selectedOTRoom ?? null,
            }

            setTimeSlotData(data);
            setOTRoomBookingModalOpen(true);
        } else {
            toastMessage("Slot not available", "error");
        }
    }

    const TimeTableCell = (props: any) => useMemo(() => {
        if (!loading) {
            const { startDate, endDate } = props;
            let isSlotBlocked = checkIsTimeSlotBlocked(startDate, endDate, otSlotConfigData, otSlotBlock);

            if (isSlotBlocked) {
                return <WeekView.TimeTableCell {...props} className={classes.timeTableBlockedCell} />;
            } return <WeekView.TimeTableCell {...props} onDoubleClick={() => handleCellClick(props)} className={classes.timeTableCell} />;
        } else {
            return <WeekView.TimeTableCell {...props} />;
        }
    }, []);


    function onViewChange(viewName: String) {
        let defaultDay = dayjs().get('day');
        let currentDay = dayjs(params.fromDateTime).get('day');
        let selectedDate = dayjs(params.fromDateTime).subtract((defaultDay === currentDay || viewName === "Day") ? 0 : (currentDay + 1), "day").toDate();

        let modifiedParams = {
            ...params,
            fromDateTime: dayjs(selectedDate).toDate(),
            toDateTime: dayjs(selectedDate).add(viewName === "Day" ? 0 : 6, "day").toDate(),
        }
        dispatch(getMasterPaginationData(masterPaginationServices.otAppointmentByDate, modifiedParams));
        dispatch(getMasterPaginationData(masterPaginationServices.appointmentOTSlotBlock, modifiedParams));
        setIndicatorInitialization(false);
    }

    const Indicator = (props: any) => useSchedulerIndicator(props, indicatorInitialization, setIndicatorInitialization);

    let showScheduler = (selectedOTRoom && otSlotConfigData.length !== 0);

    return (
        <>
            <Box style={{ height: "calc(100vh - 64px)", background: "white" }} className="scheduler-table">

                <div style={{ height: "100%", display: "flex" }}>

                    <OTRoomControllerPanel
                        selectedOTRoom={selectedOTRoom}
                        setSelectedOTRoom={setSelectedOTRoom}
                    />

                    <div className={showScheduler ? "scroll-root-body" : "scroll-root-unset"} style={{ width: "100%" }}>
                        {showScheduler && (
                            <Scheduler
                                data={appointment}
                                firstDayOfWeek={dayjs().get('day')}
                            >
                                <ViewState
                                    onCurrentDateChange={currentDateChange}
                                    currentViewName={currentViewName}
                                    onCurrentViewNameChange={viewName => {
                                        setCurrentViewName(viewName);
                                        onViewChange(viewName);
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
                                    )} />
                                <TodayButton />

                                <CurrentTimeIndicator indicatorComponent={Indicator} />
                                <Resources
                                    data={resources}
                                    mainResourceName="otRoomId"
                                />

                                <AppointmentTooltip
                                    layoutComponent={(props) => {
                                        return (
                                            <AppointmentTooltip.Layout
                                                {...props}
                                                contentComponent={contentProps => (
                                                    <LayoutComponent
                                                        {...contentProps}
                                                        onSelectAppointmentAction={onSelectAppointmentAction}
                                                        appointmentByDateData={appointmentData}
                                                        onHide={props.onHide}
                                                    />
                                                )}
                                            />
                                        )
                                    }}
                                />

                            </Scheduler>
                        )}

                        {(selectedOTRoom && otSlotConfigData.length === 0 && !loading) && (
                            <h1 style={{ textAlign: "center", marginTop: "30px" }}>OT Room slot not configured</h1>
                        )}
                    </div>

                </div>
            </Box>

            {OTRoomBookingModalOpen && (
                <OTRoomBookingModal
                    closeModal={onCloseOTRoomBookingModal}
                    timeSlotData={timeSlotData}
                    apiCall={onAppointmentByDateApiCall}
                />
            )}

            {rescheduleModalOpen && (
                <RescheduleOTAppointmentModal
                    closeModal={() => {
                        setReschedulemodalOpen(false);
                    }}
                    onApiCall={onAppointmentByDateApiCall}
                    selectedAppointment={selectedAppointment}
                    currentDateChange={currentDateChange}
                />
            )}

            {loading && <HoverLoader />}
        </>
    )
}

export default AppointmentScheduling;