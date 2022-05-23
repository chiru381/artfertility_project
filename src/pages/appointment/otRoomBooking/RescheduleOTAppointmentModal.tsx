import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';

import { CustomDatePicker, CustomSelect, CustomTimePicker } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { formatApiDate, getApiDate, getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { RootReducerState } from 'utils/types';
import { getDayName, masterPaginationServices } from 'utils/constants';
import { checkIsTimeSlotBlocked, checkOverlappedSlot } from './checkTimeSlotAvailability';

interface Props {
    closeModal: () => void;
    onApiCall: () => void;
    selectedAppointment: any;
    currentDateChange: (date: any) => void;
}

const RescheduleOTAppointmentModal = (props: Props) => {
    const { closeModal, onApiCall, selectedAppointment, currentDateChange } = props;

    const { handleSubmit, formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);
    const [maxDate, setMaxDate] = useState<any>(undefined);
    const [excludedWeekDays, setExcludedWeekDays] = useState<any>([]);

    const { appointmentLookupData, otSlotConfigAppointmentData, otSlotBlockData, otAppointmentByDateData } = useSelector(
        ({ appointmentLookupReducer, masterPaginationReducer }: RootReducerState) => {
            return ({
                appointmentLookupData: appointmentLookupReducer.data,
                otSlotConfigAppointmentData: masterPaginationReducer[masterPaginationServices.otSlotAppointmentConfig].data,
                otSlotBlockData: masterPaginationReducer[masterPaginationServices.appointmentOTSlotBlock].data,
                otAppointmentByDateData: masterPaginationReducer[masterPaginationServices.otAppointmentByDate].data,
            })
        },
        shallowEqual
    );

    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(appointmentLookupData);

    let otSlotConfigData = otSlotConfigAppointmentData.modelItems;
    let otSlotBlock = otSlotBlockData.modelItems;
    let appointmentData = otAppointmentByDateData.modelItems;


    useEffect(() => {
        otSlotConfigData.map((slot: any) => {
            setMaxDate(dayjs(slot.toDate).toDate());
            let days = slot.operatingTheatreSlotConfigDetails.filter((slotConfig: any) => slotConfig.isExcluded).map((slotConfig: any) => slotConfig.dayOfWeekNumber);
            setExcludedWeekDays(days);
        });
        setValue('appointmentDateTime', dayjs(selectedAppointment.appointmentDateTime).toDate());
    }, []);

    useEffect(() => {
        setValue('fromTime', null);
        setValue('toTime', null);
        if (watch('appointmentDateTime')) {
            let date = formatApiDate(watch('appointmentDateTime'));
            let hour = dayjs(selectedAppointment.appointmentDateTime).hour();
            let minute = dayjs(selectedAppointment.appointmentDateTime).minute();
            let from = dayjs(date).set('hours', hour).set('minutes', minute).set('seconds', 0).toDate();

            setValue('fromTime', from);
        }
    }, [watch('appointmentDateTime')]);

    useEffect(() => {
        if (watch('fromTime')) {
            let date = watch('fromTime');

            let duration = null;
            otSlotConfigData.map((slot: any) => {
                if (selectedAppointment?.medicalStaffId ? (selectedAppointment?.medicalStaffId === slot.doctorId) : true) {
                    duration = slot.durationMinutes;
                }
            });

            if (duration) {
                let to = dayjs(date).add(+duration, 'minute').toDate();
                setValue('toTime', to);
            }
        }
    }, [watch('fromTime')])


    function onSubmit({ fromTime, toTime, rescheduleReasonId }: any) {
        let isSlotBlocked = checkIsTimeSlotBlocked(fromTime, toTime, otSlotConfigData, otSlotBlock);
        let checkOverlapped = checkOverlappedSlot(fromTime, toTime, appointmentData, selectedAppointment.id);

        if ((isSlotBlocked || checkOverlapped)) {
            toastMessage("Timing not available", "error");
        } else {
            let bodyData = getFormBody({ rescheduleReasonId });
            let formData = {
                ...bodyData,
                appointmentId: selectedAppointment.id,
                isRescheduled: true,
                clinicId: selectedAppointment.clinicId,
                operatingTheatreId: selectedAppointment.operatingTheatreId,

                appointmentDateTime: getApiDate(fromTime),
                estimatedDurationMinutes: dayjs(toTime).diff(fromTime, 'minute')
            }

            setLoading(true);
            services.rescheduleOTAppointment(formData)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        onApiCall();
                        toastMessage(formatMessage({ id: "appointment-reschedule-message" }));
                        closeModal();
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
    }

    function disableWeekends(date: any) {
        return excludedWeekDays.some((day: any) => dayjs(date).format('ddd') === getDayName(day))
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "reschedule-appointment" })}
            >
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "reschedule-date" })}
                            minDate={new Date()}
                            maxDate={maxDate}
                            shouldDisableDate={disableWeekends}
                            control={control}
                            name="appointmentDateTime"
                            error={errors.appointmentDateTime}
                            rules={{ required: true }}
                            onChangeValue={date => currentDateChange(date)}
                        />
                    </Grid>

                    <>
                        <Grid item xs={12}>
                            <CustomTimePicker
                                label={formatMessage({ id: "from-time" })}
                                name="fromTime"
                                error={errors.fromTime}
                                control={control}
                                rules={{
                                    required: true,
                                    validate: (val) => {
                                        let tf = 'HH:mm';
                                        let fromTime = dayjs(val).format(tf);
                                        let toTime = dayjs(watch('toTime')).format(tf);
                                        return (dayjs(fromTime, tf).isBefore(dayjs(toTime, tf)) && !dayjs(fromTime).isSame(dayjs(toTime, tf))) || "Time is after or same as To-Time"
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <CustomTimePicker
                                label={formatMessage({ id: "to-time" })}
                                name="toTime"
                                error={errors.toTime}
                                control={control}
                                rules={{
                                    required: true,
                                    validate: (val) => {
                                        let tf = 'HH:mm';
                                        let toTime = dayjs(val).format(tf);
                                        let fromTime = dayjs(watch('fromTime')).format(tf);
                                        return (dayjs(toTime, tf).isAfter(dayjs(fromTime, tf)) && !dayjs(toTime, tf).isSame(dayjs(fromTime, tf))) || "Time is before or same as From-Time"
                                    }
                                }}
                            />
                        </Grid>
                    </>

                    <Grid item xs={12}>
                        <CustomSelect
                            label={formatMessage({ id: "reschedule-reason" })}
                            options={selectOptions.rescheduleReasons ?? []}
                            control={control}
                            name="rescheduleReasonId"
                            error={errors.rescheduleReasonId}
                            rules={{ required: true }}
                        />
                    </Grid>

                </Grid>
            </FormModal>

            {loading && <HoverLoader />}
        </>
    )
}

export default RescheduleOTAppointmentModal;