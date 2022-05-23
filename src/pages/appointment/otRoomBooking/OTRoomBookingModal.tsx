import React, { useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';

import { CustomSelect, CustomTextBox, SearchableTextBox, CustomTimePicker } from 'components/forms'
import { createCustomCompositeFilter, getApiDate, getFormBody } from 'utils/global';
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
    timeSlotData: any;
    apiCall: () => void;
}

const OTRoomBookingModal = React.memo(({ closeModal, timeSlotData, apiCall }: Props) => {
    const { handleSubmit, formState: { errors }, control, getValues, reset, setValue, watch } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createBookingLoading, setCreateBookingLoading] = useState(false);
    const [selectedUHID, setSelectedUHID] = useState('');
    const [uhidText, setUhidText] = useState("");
    const [uhidPopupOpen, setUhidPopupOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const { toastMessage } = useContext<any>(RootContext);

    const { appointmentLookupData, wifeWithPartnerData, wifeWithPartnerDataLoading, selectedClinic,
        otSlotConfigAppointmentData, otSlotBlockData, otAppointmentByDateData } = useSelector(
            ({ masterPaginationReducer, appointmentLookupReducer, utilityReducer }: RootReducerState) => {
                return ({
                    appointmentLookupData: appointmentLookupReducer.data,
                    wifeWithPartnerData: masterPaginationReducer[masterPaginationServices.wifeWithPartner].data,
                    wifeWithPartnerDataLoading: masterPaginationReducer[masterPaginationServices.wifeWithPartner].loading,
                    selectedClinic: utilityReducer.selectedClinic,
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
        if (timeSlotData?.appointmentDateTime) {
            let date = timeSlotData?.appointmentDateTime;

            let duration = null;
            otSlotConfigAppointmentData.modelItems.map((slot: any) => {
                if (timeSlotData?.operatingTheatreId ? (+timeSlotData?.operatingTheatreId === +slot.operatingTheatreId) : true) {
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


    function onSubmit({ fromTime, toTime, medicalStaffId, surgeryId, remark, age }: any) {
        let isSlotBlocked = checkIsTimeSlotBlocked(fromTime, toTime, otSlotConfigData, otSlotBlock);
        let checkOverlapped = checkOverlappedSlot(fromTime, toTime, appointmentData);

        if (isSlotBlocked || checkOverlapped) {
            toastMessage("Timing not available", "error");
        } else if (selectedPatient) {
            const { id: patientId, firstName, middleName, lastName, email, telephone, wifeCouples } = selectedPatient;
            let formData: any = {
                ...timeSlotData,
                clinicId: +selectedClinic,
                appointmentDateTime: getApiDate(fromTime),
                estimatedDurationMinutes: dayjs(toTime).diff(fromTime, 'minute'),
                estimatedAppointmentFromTime: dayjs(fromTime).set("second", 0).format('HH:mm:ss'),
                estimatedAppointmentToTime: dayjs(toTime).set("second", 0).format('HH:mm:ss'),
                isLinked: false,
                patientId, firstName, middleName, lastName, email, telephone,
                medicalStaffId, surgeryId, remark, age,
                coupleId: null
            };

            if (wifeCouples?.length) {
                const { id: coupleId } = wifeCouples[0]
                formData = {
                    ...formData, coupleId, isLinked: true
                }
            }

            let bodyData = getFormBody(formData, true);

            setCreateBookingLoading(true);
            services.createOTRoomAppointment({ ...bodyData })
                .then((res) => {
                    setCreateBookingLoading(false);
                    if (res.data?.succeeded) {
                        closeModal();
                        toastMessage(formatMessage({ id: "appointment-create-message" }));
                        apiCall();
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setCreateBookingLoading(false);
                    toastMessage(err.message, 'error');
                })
        } else {
            toastMessage("Please select a patient.", "error");
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
        let fromTime = watch('fromTime');
        let toTime = watch('toTime');
        setSelectedUHID("");
        reset({ fromTime, toTime, medicalStaffId: null, surgeryId: null });
        setSelectedPatient(null);
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
            setSelectedUHID(row.uhid);
            setUhidText(row.uhid);

            if (row?.wifeCouples?.length) {
                const { husbandFullName, chnId } = row?.wifeCouples[0];
                formatedFormData['chnid'] = chnId;
                formatedFormData['partnerName'] = husbandFullName;
            }
            reset({ ...formatedFormData, age: row?.currentAge });
            setSelectedPatient(row);
        }
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "book-ot-room" })}
                confirmLabel={formatMessage({ id: "book" })}
                modalSize="medium"
            >
                <Grid container spacing={3}>
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

                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "chn" })}
                            control={control}
                            name="chnid"
                            error={errors.chnid}
                            disabled={true}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "first-name" })}
                            control={control}
                            name="firstName"
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "middle-name" })}
                            name="middleName"
                            control={control}
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "last-name" })}
                            control={control}
                            name="lastName"
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "email" })}
                            name="email"
                            control={control}
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "mobile-number" })}
                            name="telephone"
                            control={control}
                            disabled={true}
                        />
                    </Grid>

                    <>
                        <Grid item xs={6} lg={3}>
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

                        <Grid item xs={6} lg={3}>
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

                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "age" })}
                            name="currentAge"
                            control={control}
                            disabled={true}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "doctor" })}
                            options={selectOptions?.medicalStaffs ?? []}
                            control={control}
                            name="medicalStaffId"
                            error={errors.medicalStaffId}
                            rules={{ required: true }}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "surgery" })}
                            options={selectOptions?.surgeries ?? []}
                            control={control}
                            name="surgeryId"
                            error={errors.surgeryId}
                            rules={{ required: true }}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "partner-name" })}
                            control={control}
                            name="partnerName"
                            disabled={true}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "client-type" })}
                            control={control}
                            name="paymentTypeName"
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "remarks" })}
                            error={errors.remark}
                            name="remark"
                            control={control}
                            multiline
                        />
                    </Grid>

                </Grid>
            </FormModal>

            {(createBookingLoading) && <HoverLoader />}
        </>
    )
});

export default OTRoomBookingModal;