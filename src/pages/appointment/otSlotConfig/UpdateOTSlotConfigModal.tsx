import { useContext, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import dayjs from 'dayjs';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { CustomSelect, CustomTextBox, CustomDatePicker, CustomCheckBox, CheckBox, CustomTimePicker } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { getDayName, masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
import { getFormBody } from 'utils/global';
import { useCreateLookupOptions } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    selectedOTSlotData: { [key: string]: any };
    onApiCall: () => void
}

const UpdateOTSlotConfigModal = (props: Props) => {
    const { closeModal, selectedOTSlotData, onApiCall } = props;
    const { formatMessage } = useIntl();
    const { toastMessage } = useContext<any>(RootContext);
    const dispatch = useDispatch();
    const { handleSubmit, formState: { errors }, control, reset, watch, getValues, setValue, trigger } = useForm({ mode: 'all' });
    const { fields } = useFieldArray({ control, name: "resourceSlotConfig" });

    const [isSameTimeForAllDays, setIsSameTimeForAllDays] = useState(false);
    const [loading, setLoading] = useState(false);

    const { appointmentLookupData, surgeryData, selectedClinic } = useSelector(
        ({ appointmentLookupReducer, masterPaginationReducer, utilityReducer }: RootReducerState) => ({
            appointmentLookupData: appointmentLookupReducer.data,
            surgeryData: masterPaginationReducer[masterPaginationServices.surgery].data,
            selectedClinic: utilityReducer.selectedClinic
        }),
        shallowEqual
    );

    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(appointmentLookupData);

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.surgery, {}));
    }, []);

    useEffect(() => {
        if (Object.keys(selectOptions).length) {
            const { durationMinutes, clinicId, operatingTheatreId, surgeryId, fromDate, toDate, operatingTheatreSlotConfigDetails } = selectedOTSlotData;
            reset({
                fromDate, toDate, durationMinutes,
                clinicId: selectOptions?.clinics?.find((list: any) => +list.value === +clinicId) ?? null,
                operatingTheatreId: selectOptions?.operationTheatres?.find((list: any) => +list.value === +operatingTheatreId) ?? null,
                surgeryId: selectOptions?.surgeries?.find((list: any) => +list.value === +surgeryId) ?? null,
                resourceSlotConfig: operatingTheatreSlotConfigDetails.map((config: any)=> ({
                    ...config,
                    fromTime: dayjs(config.fromTime, 'hh:mm:ss').toDate(),
                    toTime: dayjs(config.toTime, 'hh:mm:ss').toDate()
                }))
            })
        }
    }, [Object.keys(selectOptions).length]);

    useEffect(() => {
        if (watch("surgeryId")?.value) {
            let selectedSurgery = surgeryData.modelItems.find((surgery: any) => +surgery.id === +watch("surgeryId").value);
            if (selectedSurgery) {
                setValue("durationMinutes", +selectedSurgery.durationInMinutes);
            }
        }
    }, [watch("surgeryId")]);

    const handleSameTimeForAllDaysChange = (fromTime: any = null, toTime: any = null) => {
        let list = watch('resourceSlotConfig');
        const newList = list.map((item: any) => ({
            ...item,
            fromTime: fromTime ?? item.fromTime,
            toTime: toTime ?? item.toTime,
        }));
        reset({ ...getValues(), 'resourceSlotConfig': newList });
    }

    function onSubmit({resourceSlotConfig, ...data}: any) {
        let bodyData = getFormBody(data);

        bodyData = {
            ...bodyData,
            id: +selectedOTSlotData.id,
            clinicId: +selectedClinic,
            isOverlappingAllowed: data?.isOverlappingAllowed ?? false,
            operatingTheatreSlotConfigDetails: resourceSlotConfig.map((config: any) => ({
                ...config,
                fromTime: dayjs(config.fromTime).format('hh:mm'),
                toTime: dayjs(config.toTime).format('hh:mm'),
            })),
        }

        setLoading(true);
        services.updateOTSlotConfig(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "update-ot-slot-config-message" }));
                    closeModal();
                }
                else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "update-ot-slot-config" })}
                modalSize="medium"
            >

                <Grid container spacing={2}>
                    <Grid item xs={12} lg={4} md={6} sm={6}>
                        <CustomSelect
                            label={formatMessage({ id: "select-ot" })}
                            options={selectOptions?.operationTheatres ?? []}
                            control={control}
                            name="operatingTheatreId"
                            error={errors.operatingTheatreId}
                        />
                    </Grid>
                    <Grid item xs={12} lg={4} md={6} sm={6}>
                        <CustomSelect
                            label={formatMessage({ id: "surgery" })}
                            options={selectOptions?.surgeries ?? []}
                            control={control}
                            name="surgeryId"
                            error={errors.surgeryId}
                            rules={{ required: true }}
                            disableClearable
                        />
                    </Grid>
                    <Grid item xs={12} lg={4} md={6} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "slot-duration" })}
                            name="durationMinutes"
                            control={control}
                            type="number"
                            error={errors.durationMinutes}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>

                    <Grid item xs={12} lg={4} md={6} sm={6}>
                        <CustomDatePicker
                            control={control}
                            label={formatMessage({ id: "from-date" })}
                            name="fromDate"
                            error={errors.fromDate}
                            rules={{ required: true }}
                            maxDate={new Date(watch('toDate'))}
                        />
                    </Grid>

                    <Grid item xs={12} lg={4} md={6} sm={6}>
                        <CustomDatePicker
                            control={control}
                            label={formatMessage({ id: "to-date" })}
                            name="toDate"
                            error={errors.toDate}
                            rules={{ required: true }}
                            minDate={new Date(watch('fromDate'))}
                        />
                    </Grid>

                    <Grid item xs={12} lg={4} md={6} sm={6}>
                        <CustomCheckBox
                            name="isOverlappingAllowed"
                            label={formatMessage({ id: "overlapping" }) + "?"}
                            control={control}
                            error={errors.isOverlappingAllowed}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <h3 className="formHeading">
                            <FormattedMessage id="ot-slot-timing" />
                        </h3>

                        <CheckBox
                            label={formatMessage({ id: "same-time-for-all-days" })}
                            checked={isSameTimeForAllDays}
                            onChange={(e: any) => {
                                let status = e.target.checked;
                                setIsSameTimeForAllDays(status);
                                if (status) {
                                    let { fromTime, toTime } = watch('resourceSlotConfig')?.[0];
                                    handleSameTimeForAllDaysChange(fromTime, toTime);
                                }
                            }}
                            name="isSameTimeForAllDays"
                        />


                        <Paper elevation={0} style={{ border: "1px solid #C2C2C2" }}>
                            <TableContainer style={{ whiteSpace: "nowrap" }}>
                                <Table stickyHeader aria-label="sticky-table">
                                    <TableHead style={{ height: "35px" }}>
                                        <TableRow>
                                            <TableCell><FormattedMessage id="days" /></TableCell>
                                            <TableCell><FormattedMessage id="from-hh" /></TableCell>
                                            <TableCell><FormattedMessage id="to-hh" /></TableCell>
                                            <TableCell><FormattedMessage id="exclude" /></TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {fields.map((slot, index) => {
                                            return (
                                                <TableRow hover key={slot.id} role="checkbox">
                                                    <TableCell> {getDayName(+watch(`resourceSlotConfig[${index}][dayOfWeekNumber]`))} </TableCell>
                                                    <TableCell>
                                                        <CustomTimePicker
                                                            name={`resourceSlotConfig[${index}][fromTime]`}
                                                            error={errors?.[`resourceSlotConfig`]?.[index]?.['fromTime']}
                                                            control={control}
                                                            fullWidth={false}
                                                            style={{ width: "150px" }}
                                                            rules={{
                                                                validate: (val) => {
                                                                    let tf = 'HH:mm';
                                                                    let fromTime = dayjs(val).format(tf);
                                                                    let toTime = dayjs(watch(`resourceSlotConfig[${index}][toTime]`)).format(tf);
                                                                    return (dayjs(fromTime, tf).isBefore(dayjs(toTime, tf)) && !dayjs(fromTime).isSame(dayjs(toTime, tf))) || "after or same as To-Time"
                                                                }
                                                            }}
                                                            onChangeDate={date=> {
                                                                trigger(`resourceSlotConfig[${index}][toTime]`);
                                                                if(isSameTimeForAllDays){
                                                                    handleSameTimeForAllDaysChange(date, null)
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <CustomTimePicker
                                                            name={`resourceSlotConfig[${index}][toTime]`}
                                                            error={errors?.[`resourceSlotConfig`]?.[index]?.['toTime']}
                                                            control={control}
                                                            fullWidth={false}
                                                            style={{ width: "150px" }}
                                                            rules={{
                                                                validate: (val) => {
                                                                    let tf = 'HH:mm';
                                                                    let toTime = dayjs(val).format(tf);
                                                                    let fromTime = dayjs(watch(`resourceSlotConfig[${index}][fromTime]`)).format(tf);
                                                                    return (dayjs(toTime, tf).isAfter(dayjs(fromTime, tf)) && !dayjs(toTime, tf).isSame(dayjs(fromTime, tf))) || "before or same as From-Time"
                                                                }
                                                            }}
                                                            onChangeDate={date=> {
                                                                trigger(`resourceSlotConfig[${index}][fromTime]`);
                                                                if(isSameTimeForAllDays){
                                                                    handleSameTimeForAllDaysChange(null, date)
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <CustomCheckBox
                                                            name={`resourceSlotConfig[${index}][isExcluded]`}
                                                            control={control}
                                                            label=""
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                    </Grid>
                </Grid>
            </FormModal>

            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateOTSlotConfigModal;