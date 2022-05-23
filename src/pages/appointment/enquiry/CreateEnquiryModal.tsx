import React, { useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';

import { CustomSelect, CustomDatePicker, CustomTextBox, CustomCheckBox, TextBox } from 'components/forms'
import { getFormBody, validationRule } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { FormModal, HoverLoader } from 'components';
import { masterPaginationServices } from 'utils/constants';
import { useCreateLookupOptions } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    onApiCall: () => void;
}

const CreateEnquiryModal = React.memo(({ closeModal, onApiCall }: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useContext<any>(RootContext);

    const [createBookingLoading, setCreateBookingLoading] = useState(false);
    const [age, setAge] = useState<any>('');

    const { leadSourceData, appointmentLookupData, selectedClinic } = useSelector(
        ({ masterPaginationReducer, appointmentLookupReducer, utilityReducer }: RootReducerState) => {
            return ({
                appointmentLookupData: appointmentLookupReducer.data,
                leadSourceData: masterPaginationReducer[masterPaginationServices.leadSource].data,
                selectedClinic: utilityReducer.selectedClinic,
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

    function onSubmit({ fromTime, toTime, chnid, ...rest }: any) {
        let formData: any = {
            ...rest,
            appointmentCallTypeId: 1,
            clinicId: +selectedClinic,
            appointmentDateTime: dayjs().toISOString(),
            estimatedDurationMinutes: 0,
            isRescheduled: false,
            isCancelled: false
        };

        let bodyData = getFormBody(formData);

        setCreateBookingLoading(true);
        services.createAppointment(bodyData)
            .then((res) => {
                setCreateBookingLoading(false);
                if (res.data?.succeeded) {
                    closeModal();
                    toastMessage(formatMessage({ id: "create-enquiry-message" }));
                    onApiCall();
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setCreateBookingLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "create-enquiry" })}
                confirmLabel={formatMessage({ id: "book" })}
                modalSize="medium"
            >
                <Grid container spacing={3}>

                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "first-name" })}
                            rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                            control={control}
                            name="firstName"
                            error={errors.firstName}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "middle-name" })}
                            name="middleName"
                            control={control}
                            error={errors.middleName}
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
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "email" })}
                            name="email"
                            control={control}
                            error={errors.email}
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
                        />
                    </Grid>

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
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "gender" })}
                            options={selectOptions?.genders ?? []}
                            control={control}
                            name="genderId"
                            error={errors.genderId}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "lead-source-1" })}
                            options={leadSourceOption?.leadSource1 ?? []}
                            control={control}
                            name="leadSource1Id"
                            error={errors.leadSource1Id}
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
                    <Grid item xs={12} lg={6}>
                        <CustomSelect
                            label={formatMessage({ id: "resource" })}
                            options={selectOptions?.resources ?? []}
                            control={control}
                            name="resourceId"
                            error={errors.resourceId}
                            rules={{ required: true }}
                        />
                    </Grid>


                    <Grid container item xs={12} direction="column">
                        <CustomCheckBox
                            name="smsNotification"
                            label={formatMessage({ id: "sms-notification" })}
                            control={control}
                        />

                        <CustomCheckBox
                            name="emailNotification"
                            label={formatMessage({ id: "email-notification" })}
                            control={control}
                        />
                    </Grid>

                </Grid>
            </FormModal>

            {(createBookingLoading) && <HoverLoader />}
        </>
    )
});

export default CreateEnquiryModal;