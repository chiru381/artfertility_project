import React, { useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';

import { CustomSelect, CustomDatePicker, CustomTextBox, CustomCheckBox, SearchableTextBox, TextBox, CustomTimePicker } from 'components/forms'
import { createCustomCompositeFilter, getApiDate, getFormBody, validationRule } from 'utils/global';
import { getMasterPaginationData } from 'redux/actions';
import { RootReducerState } from 'utils/types';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { FormModal, HoverLoader, PopupSearchTable } from 'components';
import { masterPaginationServices, patientPopupColumns } from 'utils/constants';
import { useAsyncDebounce, useCreateLookupOptions } from 'utils/hooks';
import { checkIsTimeSlotBlocked, checkOverlappedSlot } from './checkTimeSlotAvailability';

interface Props {
    closeModal: () => void;
    selectedCallType: string | number;
    timeSlotData: any;
    apiCall: () => void;
}

const BookAppointmentModal = React.memo(({ closeModal, selectedCallType, timeSlotData, apiCall }: Props) => {
    const { handleSubmit, formState: { errors }, control, getValues, reset, setValue, watch, trigger } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useContext<any>(RootContext);

    const [createBookingLoading, setCreateBookingLoading] = useState(false);
    const [selectedUHID, setSelectedUHID] = useState('');
    const [age, setAge] = useState<any>('');
    const [uhidText, setUhidText] = useState("");
    const [uhidPopupOpen, setUhidPopupOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    let isEnquiry = selectedCallType === "1";
    const { leadSourceData, appointmentLookupData, wifeWithPartnerData, wifeWithPartnerDataLoading, selectedClinic,
        resourceAppointmentSlotData, appointmentByDateData, doctorSlotBlockData } = useSelector(
            ({ masterPaginationReducer, appointmentLookupReducer, utilityReducer }: RootReducerState) => {
                return ({
                    appointmentLookupData: appointmentLookupReducer.data,
                    leadSourceData: masterPaginationReducer[masterPaginationServices.leadSource].data,
                    wifeWithPartnerData: masterPaginationReducer[masterPaginationServices.wifeWithPartner].data,
                    wifeWithPartnerDataLoading: masterPaginationReducer[masterPaginationServices.wifeWithPartner].loading,
                    selectedClinic: utilityReducer.selectedClinic,

                    resourceAppointmentSlotData: masterPaginationReducer[masterPaginationServices.resourceSlotAppointmentConfig].data,
                    appointmentByDateData: masterPaginationReducer[masterPaginationServices.appointmentByDate].data,
                    doctorSlotBlockData: masterPaginationReducer[masterPaginationServices.appointmentDoctorSlotBlock].data,
                })
            },
            shallowEqual
        );

    let leadSourceOption = leadSourceData.modelItems.reduce((acc: any, curr: any) => {
        let option = { label: curr.name, value: String(curr.id) };
        acc[`leadSource${curr.leadSourceOrder}`] = acc?.[`leadSource${curr.leadSourceOrder}`] ? [option, ...acc[`leadSource${curr.leadSourceOrder}`]] : [option];
        return acc;
    }, {});

    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(appointmentLookupData);
    let resourceSlotData = resourceAppointmentSlotData.modelItems;
    let appointmentData = appointmentByDateData.modelItems;
    let doctorSlotBlock = doctorSlotBlockData.modelItems;

    useEffect(() => {
        if (timeSlotData?.appointmentDateTime) {
            let date = timeSlotData?.appointmentDateTime;

            let duration = null;
            resourceAppointmentSlotData.modelItems.map((slot: any) => {
                if (timeSlotData?.medicalStaffId ? (+timeSlotData?.medicalStaffId === slot.doctorId) : true) {
                    duration = slot.durationMinutes;
                }
            });

            if (duration) {
                let from = dayjs(date).set('seconds', 0).toDate();
                let to = dayjs(date).add(+duration, 'minute').toDate();
                setValue('fromTime', from);
                setValue('toTime', to);
            }
        }
    }, []);

    function onSubmit({ fromTime, toTime, chnid, ...rest }: any) {
        let resourceId = timeSlotData?.resourceId;
        let isSlotBlocked = checkIsTimeSlotBlocked(fromTime, toTime, resourceSlotData, doctorSlotBlock, resourceId);
        let checkOverlapped = checkOverlappedSlot(fromTime, toTime, appointmentData);

        if (isEnquiry ? false : (isSlotBlocked || checkOverlapped)) {
            toastMessage("Timing not available", "error");
        } else {
            let formData: any = {
                ...rest,
                appointmentCallTypeId: +selectedCallType,
                clinicId: +selectedClinic,
            };
            if (isEnquiry) {
                formData = {
                    ...formData,
                    appointmentDateTime: dayjs().toISOString(),
                    estimatedDurationMinutes: 0,
                    isRescheduled: false,
                    isCancelled: false
                }
            } else {
                formData = {
                    ...timeSlotData,
                    ...formData,
                    appointmentDateTime: getApiDate(fromTime),
                    estimatedDurationMinutes: dayjs(toTime).diff(dayjs(fromTime), 'minute')
                }

                if (selectedPatient) {
                    const { id: patientId, firstName, middleName, lastName, email, telephone, wifeCouples } = selectedPatient;
                    formData = {
                        ...formData,
                        patientId, firstName, middleName, lastName, email, telephone
                    }
                    if (wifeCouples?.length) {
                        const { id: coupleId, chnId } = wifeCouples[0]
                        formData = {
                            ...formData, coupleId, chnid: chnId
                        }
                    }
                }

            }
            let bodyData = getFormBody(formData);

            setCreateBookingLoading(true);
            // existing patient appointment and new appointment service is handled at once
            let createBookingService = services[(selectedUHID ? 'createExistingPatientAppointment' : 'createAppointment') as keyof typeof services];
            createBookingService(selectedUHID ? { ...bodyData, uhid: selectedUHID } : bodyData)
                .then((res) => {
                    setCreateBookingLoading(false);
                    if (res.data?.succeeded) {
                        closeModal();
                        toastMessage(formatMessage({ id: selectedUHID ? "appointment-create-message" : "create-enquiry-message" }));
                        apiCall();
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setCreateBookingLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
    }

    function onPatientSearchApi(value: string) {
        let members = ["uhid", "firstName", "lastName", "telephone"];
        let params = createCustomCompositeFilter(members, value);

        dispatch(getMasterPaginationData(masterPaginationServices.wifeWithPartner, params));
    }

    const onChangeValue = useAsyncDebounce((value: string) => {
        onPatientSearchApi(value);
    }, 500);

    function resetExistingPatinet() {
        setSelectedUHID("");

        let formData = getValues();
        let formatedFormData: any = {};

        Object.keys(formData).map(key => {
            if (key === "fromTime" || key === "toTime") {
                formatedFormData[key] = formData[key];
            } else {
                formatedFormData[key] = null;
            }
        });

        reset(formatedFormData);
        setSelectedPatient(null);
        setAge('');
    }

    function onFocus() {
        if (wifeWithPartnerData.modelItems.length === 0) {
            onPatientSearchApi("");
        }
        setTimeout(() => {
            setUhidPopupOpen(true);
        }, 200);
    }

    function onRowClick(row: any) {
        if (row.uhid) {
            let formData = getValues();
            let formatedFormData: any = {};

            Object.keys(formData).map(key => {
                if (key.includes("Id") && row[key]) {
                    if (row[key.replace('Id', "Name")]) {
                        formatedFormData[key] = { label: row[key.replace('Id', "Name")], value: String(row[key]) };
                    } else {
                        formatedFormData[key] = null;
                    }
                } else if (row[key]) {
                    formatedFormData[key] = row[key];
                } else {
                    formatedFormData[key] = formData[key];
                }
            });

            setUhidPopupOpen(false);
            setUhidText(row.uhid);
            setAge(row.currentAge);
            setSelectedUHID(row.uhid);

            if (row?.wifeCouples?.length) {
                const { chnId } = row?.wifeCouples[0];
                formatedFormData['chnid'] = chnId;
            }
            reset(formatedFormData);
            setSelectedPatient(row);
        }
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: isEnquiry ? "create-enquiry" : "book-appointment" })}
                confirmLabel={formatMessage({ id: "book" })}
                modalSize="medium"
            >
                <Grid container spacing={3}>
                    {!isEnquiry && (
                        <Grid item xs={12} lg={6}>
                            <SearchableTextBox
                                label={formatMessage({ id: "uhid" })}
                                value={uhidText}
                                onChange={e => {
                                    setUhidText(e.target.value);
                                    onChangeValue(e.target.value);
                                }}
                                onFocus={onFocus}
                                onCancel={() => {
                                    setUhidText("")
                                    resetExistingPatinet();
                                }}
                                disabled={selectedUHID ? true : false}
                            />

                            <PopupSearchTable
                                popupOpen={uhidPopupOpen}
                                closePopup={() => setUhidPopupOpen(false)}
                                tableData={wifeWithPartnerData.modelItems}
                                columns={[...patientPopupColumns(formatMessage)]}
                                onRowClick={onRowClick}
                                loading={wifeWithPartnerDataLoading}
                            />
                        </Grid>
                    )}

                    {!isEnquiry && <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "chn" })}
                            control={control}
                            name="chnid"
                            error={errors.chnid}
                            disabled={true}
                        />
                    </Grid>}

                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "first-name" })}
                            rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                            control={control}
                            name="firstName"
                            error={errors.firstName}
                            disabled={(selectedUHID || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "middle-name" })}
                            name="middleName"
                            control={control}
                            error={errors.middleName}
                            disabled={(selectedUHID || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                            rules={validationRule.textbox({ type: "textWithSpace" })}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "last-name" })}
                            rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                            control={control}
                            name="lastName"
                            error={errors.lastName}
                            disabled={(selectedUHID || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "email" })}
                            name="email"
                            control={control}
                            error={errors.email}
                            disabled={(selectedUHID || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                            rules={validationRule.textbox({ type: "email" })}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "mobile-number" })}
                            name="telephone"
                            control={control}
                            error={errors.telephone}
                            type="number"
                            rules={validationRule.textbox({ type: "number", required: true })}
                            disabled={(selectedUHID || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                        />
                    </Grid>


                    {!isEnquiry && (
                        <>
                            <Grid item xs={6} lg={6}>
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
                                    onChangeDate={() => trigger('toTime')}
                                />
                            </Grid>

                            <Grid item xs={6} lg={6}>
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
                                    onChangeDate={() => trigger('fromTime')}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12} lg={6}>
                        <TextBox
                            value={age}
                            label={formatMessage({ id: "age" })}
                            type={"number"}
                            onChange={e => {
                                setAge(+e.target.value);
                                if (e.target.value && +e.target.value < 100) {
                                    setValue('birthDate', dayjs().subtract(+e.target.value, 'year').toISOString(), { shouldValidate: true });
                                } else {
                                    setValue('birthDate', null, { shouldValidate: true });
                                }
                            }}
                            disabled={(selectedUHID || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomDatePicker
                            control={control}
                            label={formatMessage({ id: "dob" })}
                            name="birthDate"
                            error={errors.birthDate}
                            rules={{
                                required: true,
                                validate: value => (dayjs().diff(value, 'year') >= 18) || formatMessage({ id: "age-validation-message-18" })
                            }}
                            onChangeValue={date => date ? setAge(dayjs().diff(date, 'year')) : null}
                            maxDate={new Date()}
                            disabled={(selectedUHID || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "gender" })}
                            options={selectOptions?.genders ?? []}
                            control={control}
                            name="genderId"
                            error={errors.genderId}
                            disabled={((selectedUHID && watch('genderId')) || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "lead-source-1" })}
                            options={leadSourceOption?.leadSource1 ?? []}
                            control={control}
                            name="leadSource1Id"
                            error={errors.leadSource1Id}
                            disabled={((selectedUHID && watch('leadSource1Id')) || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "lead-source-2" })}
                            options={leadSourceOption?.leadSource2 ?? []}
                            control={control}
                            name="leadSource2Id"
                            error={errors.leadSource2Id}
                            disabled={((selectedUHID && watch('leadSource2Id')) || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "lead-source-3" })}
                            options={leadSourceOption?.leadSource3 ?? []}
                            control={control}
                            name="leadSource3Id"
                            error={errors.leadSource3Id}
                            disabled={((selectedUHID && watch('leadSource3Id')) || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "client-type" })}
                            options={selectOptions?.paymentTypes ?? []}
                            control={control}
                            name="paymentTypeId"
                            error={errors.paymentTypeId}
                            disabled={((selectedUHID && watch('paymentTypeId')) || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                        />
                    </Grid>
                    {(!isEnquiry && timeSlotData?.medicalStaffId) && <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "visit-type" })}
                            options={selectOptions?.visitTypes ?? []}
                            control={control}
                            name="visitTypeId"
                            error={errors.visitTypeId}
                            rules={{ required: true }}
                        />
                    </Grid>}
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "remarks" })}
                            error={errors.remark}
                            name="remark"
                            control={control}
                            multiline
                        />
                    </Grid>
                    {isEnquiry && <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "resource" })}
                            options={selectOptions?.resources ?? []}
                            control={control}
                            name="resourceId"
                            error={errors.resourceId}
                            rules={{ required: true }}
                        />
                    </Grid>}


                    <Grid container item xs={12} direction="column">
                        <CustomCheckBox
                            name="smsNotification"
                            label={formatMessage({ id: "sms-notification" })}
                            control={control}
                            disabled={(selectedUHID || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                        />

                        <CustomCheckBox
                            name="emailNotification"
                            label={formatMessage({ id: "email-notification" })}
                            control={control}
                            disabled={(selectedUHID || (!timeSlotData?.medicalStaffId && !isEnquiry)) ? true : false}
                        />
                    </Grid>

                </Grid>
            </FormModal>

            {(createBookingLoading) && <HoverLoader />}
        </>
    )
});

export default BookAppointmentModal;