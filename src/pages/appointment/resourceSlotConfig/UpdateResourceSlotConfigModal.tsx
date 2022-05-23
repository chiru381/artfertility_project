import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector, shallowEqual } from 'react-redux';
import dayjs from 'dayjs';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';


import { CustomSelect, CustomTextBox, CustomDatePicker, CustomCheckBox, CheckBox, CustomTimePicker } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { services } from 'utils/services';
import { getDayName } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { validationRule, getFormBody } from 'utils/global';
import { useCreateLookupOptions, useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const UpdateResourceSlotConfigModal = (props: Props) => {
    const { closeModal, selectedData, onApiCall } = props;
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();

    const { handleSubmit, formState: { errors }, control, reset, watch, getValues, trigger } = useForm({ mode: 'all' });
    const { fields } = useFieldArray({ control, name: "resourceSlotConfig" });

    const [isSameTimeForAllDays, setIsSameTimeForAllDays] = useState(false);
    const [loading, setLoading] = useState(false);


    const { appointmentLookupData, selectedClinic } = useSelector(
        ({ appointmentLookupReducer, utilityReducer }: RootReducerState) => ({
            appointmentLookupData: appointmentLookupReducer.data,
            selectedClinic: utilityReducer.selectedClinic
        }),
        shallowEqual
    );

    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(appointmentLookupData);

    useEffect(() => {
        if (selectOptions?.medicalStaffs?.length) {
            let data = {
                ...selectedData,
                resourceId: selectOptions?.resources?.find((item: any) => item.value == selectedData?.resourceId) ?? null,
                doctorId: selectOptions?.medicalStaffs?.find((item: any) => item.value == selectedData?.doctorId) ?? null,
                resourceSlotConfig: selectedData.resourceSlotConfigDetails.map((config: any)=> ({
                    ...config,
                    fromTime: dayjs(config.fromTime, 'hh:mm:ss').toDate(),
                    toTime: dayjs(config.toTime, 'hh:mm:ss').toDate()
                }))
            };

            reset(data);
        }
    }, [reset, selectOptions?.medicalStaffs?.length]);

    const handleSameTimeForAllDaysChange = (fromTime: any = null, toTime: any = null) => {
        let list = watch('resourceSlotConfig');
        const newList = list.map((item: any) => ({
            ...item,
            fromTime: fromTime ?? item.fromTime,
            toTime: toTime ?? item.toTime,
        }));
        reset({ ...getValues(), 'resourceSlotConfig': newList });
    }

    function onSubmit({ resourceSlotConfig, ...data }: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            resourceSlotConfigDetails: resourceSlotConfig.map((config: any) => ({
                ...config,
                fromTime: dayjs(config.fromTime).format('hh:mm'),
                toTime: dayjs(config.toTime).format('hh:mm'),
            })),
            id: selectedData.id,
            clinicId: +selectedClinic,
            isOverlappingAllowed: data?.isOverlappingAllowed ?? false
        }

        setLoading(true);
        services.updateResourceSlotConfig(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "update-resource-slot-config-message" }));
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
                title={formatMessage({ id: "update-resource-slot-configuration" })}
                modalSize="medium"
            >

                <Grid container spacing={2}>
                    <Grid item xs={12} lg={4} md={6} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "slot-duration" })}
                            name="durationMinutes"
                            control={control}
                            type="number"
                            rules={validationRule.textbox({ required: true, type: "number" })}
                            error={errors.durationMinutes}
                        />
                    </Grid>

                    <Grid item xs={12} lg={4} md={6} sm={6}>
                        <CustomDatePicker
                            control={control}
                            label={formatMessage({ id: "from-date" })}
                            name="fromDate"
                            error={errors.fromDate}
                            rules={{ required: true }}
                            minDate={new Date()}
                            maxDate={watch('toDate') ? dayjs(watch('toDate')) : undefined}
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
                        <CustomSelect
                            label={formatMessage({ id: "resource" })}
                            options={selectOptions?.resources ?? []}
                            control={control}
                            name="resourceId"
                            error={errors.resourceId}
                            rules={{ required: true }}
                        />
                    </Grid>

                    {watch('resourceId')?.value === "1" && (
                        <Grid item xs={12} lg={4} md={6} sm={6}>
                            <CustomSelect
                                label={formatMessage({ id: "doctor" })}
                                options={selectOptions?.medicalStaffs ?? []}
                                control={control}
                                name="doctorId"
                                error={errors.doctorId}
                                rules={{ required: true }}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} lg={4} md={6} sm={6}>
                        <FormGroup>
                            <CustomCheckBox
                                name="isOverlappingAllowed"
                                label={formatMessage({ id: "overlapping-appointment" })}
                                control={control}
                                error={errors.isOverlappingAllowed}
                            />
                        </FormGroup>
                    </Grid>

                    <Grid item xs={12}>
                        <h3 className="formHeading">
                            <FormattedMessage id="resource-slot-timing" />
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
                                                                trigger(`resourceSlotConfig[${index}][fromTIme]`);
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

export default UpdateResourceSlotConfigModal;