import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { shallowEqual, useSelector } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Appointments,
    WeekView,
    Toolbar,
    ViewSwitcher,
    Resources,
    DateNavigator,
    TodayButton,
    MonthView,
    AllDayPanel
} from '@devexpress/dx-react-scheduler-material-ui';

import { blockTypeList, halfDayList, slotConfigResources } from "utils/constants";
import { CustomDatePicker, CustomSelect, TimePicker } from 'components/forms';
import { RootReducerState } from 'utils/types';
import { FormModal, HoverLoader } from 'components';
import { getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useCreateLookupOptions, useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    selectedData?: any;
    onApiCall: (status: boolean) => void;
}

const CreateOTSlotBlock = ({ closeModal, selectedData, onApiCall }: Props) => {
    const { control, formState: { errors }, watch, handleSubmit, setValue } = useForm();
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [appointment, setAppointment] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [schedulerStartEndTime, setSchedulerStartEndTime] = useState({
        startDayHour: 8,
        endDayHour: 18
    });
    const [time, setTime] = useState({ fromTime: "08:00", toTime: "18:00" });

    const { appointmentLookupData, selectedClinic } = useSelector(
        ({ appointmentLookupReducer, utilityReducer }: RootReducerState) => {
            return ({
                appointmentLookupData: appointmentLookupReducer.data,
                selectedClinic: utilityReducer.selectedClinic
            })
        },
        shallowEqual
    );

    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(appointmentLookupData);

    useEffect(() => {
        if (selectedData && Object.keys(selectOptions).length) {
            updateFields(selectedData);
        }
    }, [Object.keys(selectOptions).length]);

    function updateFields(data: any) {
        const { blockTypeId, blockReasonId, clinicId, operatingTheatreId, fromDate, toDate, fromTime, toTime } = data;
        setValue('blockTypeId', blockTypeList.find(list => +list.value === +blockTypeId));
        setValue('blockReasonId', selectOptions?.blockReasons?.find((list: any) => +list.value === +blockReasonId) ?? null);
        setValue('clinicId', selectOptions?.clinics?.find((list: any) => +list.value === +clinicId) ?? null);
        setValue('operatingTheatreId', selectOptions?.operationTheatres?.find((list: any) => +list.value === +operatingTheatreId) ?? null);
        setValue('fromDate', fromDate);
        setValue('toDate', toDate);
        setTime({ fromTime, toTime });
        if (blockTypeId === 2) {
            if (fromTime === "08:00:00") {
                setValue('halfDayId', halfDayList[0])
            } else {
                setValue('halfDayId', halfDayList[1])
            }
        }
    }

    useEffect(() => {
        if (watch('fromDate') && watch('toDate')) {
            let startDate = dayjs(watch('fromDate')).set('hour', 8).set('minute', 0);
            let endDate = dayjs(watch('toDate')).set('hour', 18).set('minute', 0);

            setAppointment([{
                title: watch('blockReasonId')?.label ?? '',
                startDate: startDate.toDate(),
                endDate: endDate.toDate(),
                type: "blocked"
            }])
        }
    }, [watch('fromDate'), watch('toDate'), watch('blockReasonId')]);

    useEffect(() => {
        let blockTypeId = watch('blockTypeId')?.value;
        let halfDayId = watch('halfDayId')?.value;
        let toTime = time.toTime;
        let fromTime = time.fromTime;

        if (blockTypeId === "1") {
            setSchedulerStartEndTime({ startDayHour: 8, endDayHour: 18 });
        } else if (blockTypeId === "2" && halfDayId) {
            setSchedulerStartEndTime({ startDayHour: halfDayId === "1" ? 8 : 14, endDayHour: halfDayId === "1" ? 14 : 18 });
        } else if (blockTypeId === "3" && fromTime && toTime) {
            setSchedulerStartEndTime({ startDayHour: +dayjs(fromTime, 'hh:mm').format('HH'), endDayHour: +dayjs(toTime, 'hh:mm').format('HH') });
        }
    }, [watch('blockTypeId'), watch('halfDayId'), time.fromTime, time.toTime]);

    function onSubmit(data: any) {
        const bodyData = getFormBody(data);
        const { halfDayId, ...rest } = bodyData;
        let fromTime = '08:00:00';
        let toTime = '18:00:00';

        if (rest.blockTypeId === 2 && halfDayId === 1) {
            fromTime = '08:00:00';
            toTime = '14:00:00';
        } else if (rest.blockTypeId === 2 && halfDayId === 2) {
            fromTime = '14:00:00';
            toTime = '18:00:00';
        } else if (rest.blockTypeId === 3) {
            fromTime = time.fromTime;
            toTime = time.toTime;
        }

        let formData = {
            ...rest,
            fromTime,
            toTime,
            clinicId: +selectedClinic
        }

        setLoading(true);
        let doctorSlotBlockService = services[(selectedData ? 'updateOTSlotBlock' : 'createOTSlotBlock') as keyof typeof services];
        doctorSlotBlockService(selectedData ? { ...formData, id: selectedData.id } : formData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: selectedData ? "update-ot-slot-block-message" : "create-ot-slot-block-message" }));
                    closeModal();
                    onApiCall(selectedData ? true : false);
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    const handleTimeChange = (timeData: { name: string, value: string }) => {
        const { name, value } = timeData;
        const { fromTime, toTime } = time;

        if ((name === "fromTime" && !dayjs(value, 'HH:mm').isAfter(dayjs(toTime, 'HH:mm'))) || (name === "toTime" && !dayjs(value, 'HH:mm').isBefore(dayjs(fromTime, 'HH:mm')))) {
            setTime({ ...time, [name]: value })
        } else {
            toastMessage("Invalid time.", 'error');
        }
    }


    return (
        <FormModal
            onCancel={closeModal}
            modalSize='full-page'
            slideAnimation={false}
            onConfirm={handleSubmit(onSubmit)}
        >
            <>
                <Paper elevation={1} style={{ height: "100%", display: "flex", flexFlow: 'column' }}>
                    <Box p={2} style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                        <Grid spacing={2} container >
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "select-ot" })}
                                    options={selectOptions?.operationTheatres ?? []}
                                    control={control}
                                    name="operatingTheatreId"
                                    error={errors.operatingTheatreId}
                                    rules={{ required: true }}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "block-reason" })}
                                    options={selectOptions?.blockReasons ?? []}
                                    control={control}
                                    name="blockReasonId"
                                    error={errors.blockReasonId}
                                    rules={{ required: true }}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "block-type" })}
                                    options={blockTypeList}
                                    control={control}
                                    name="blockTypeId"
                                    error={errors.blockTypeId}
                                    rules={{ required: true }}
                                />
                            </Grid>
                            {watch('blockTypeId')?.value === "2" && (
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        label={formatMessage({ id: "half-day" })}
                                        options={halfDayList}
                                        control={control}
                                        name="halfDayId"
                                        error={errors.halfDayId}
                                        rules={{ required: true }}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomDatePicker
                                    control={control}
                                    label={formatMessage({ id: "from-date" })}
                                    name="fromDate"
                                    error={errors.fromDate}
                                    minDate={new Date()}
                                    maxDate={watch('toDate') ? dayjs(watch('toDate')) : undefined}
                                    rules={{ required: true }}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomDatePicker
                                    control={control}
                                    label={formatMessage({ id: "to-date" })}
                                    name="toDate"
                                    error={errors.toDate}
                                    minDate={watch('fromDate') ? dayjs(watch('fromDate')) : new Date()}
                                    rules={{ required: true }}
                                />
                            </Grid>
                            {watch('blockTypeId')?.value === "3" && (
                                <>
                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                        <TimePicker
                                            value={dayjs(time.fromTime, "HH:mm")}
                                            onChange={(date: any) => {
                                                handleTimeChange({ name: "fromTime", value: dayjs(date).format('HH:mm') });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                        <TimePicker
                                            value={dayjs(time.toTime, "HH:mm")}
                                            onChange={(date: any) => {
                                                handleTimeChange({ name: "toTime", value: dayjs(date).format('HH:mm') });
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                    <div style={{ flexGrow: 1, overflowY: "auto" }}>
                        <Scheduler data={appointment}>

                            <ViewState
                                defaultCurrentViewName="Month"
                            />

                            <WeekView
                                startDayHour={schedulerStartEndTime.startDayHour}
                                endDayHour={schedulerStartEndTime.endDayHour}
                            />
                            <AllDayPanel />
                            <MonthView />

                            <Appointments />
                            <Toolbar />
                            <ViewSwitcher />
                            <DateNavigator />
                            <TodayButton />

                            <Resources data={slotConfigResources} />
                        </Scheduler>
                    </div>
                </Paper>

                {loading && <HoverLoader />}
            </>
        </FormModal>
    )
}

export default CreateOTSlotBlock;