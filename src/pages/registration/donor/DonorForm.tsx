import { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { ControllerProps, FormProviderProps, FieldErrors } from 'react-hook-form';
import dayjs from 'dayjs';

import { CustomSelect, CustomDatePicker, CustomTextBox, CustomCheckBox, RegistrationFormImagePicker, RegistrationDocumentForm, DatePicker, TextBox } from 'components/forms';
import { validationRule } from 'utils/global';
import { RootReducerState } from 'utils/types';
import RegistrationAddressForm from '../patient/RegistrationAddressForm';

interface Props {
    control: ControllerProps["control"];
    watch: FormProviderProps['watch'];
    register: FormProviderProps['register'];
    setValue: FormProviderProps['setValue'];
    clearErrors: FormProviderProps['clearErrors'];
    errors: FieldErrors;
    isUpdateModal: boolean;
    selectedDonorData: any;
    donorResponse: any;
    patientDocument: any;
    setPatientDocument: any;
}

const DonorForm = ({ errors, control, watch, register, setValue, clearErrors, isUpdateModal, selectedDonorData, donorResponse, patientDocument, setPatientDocument }: Props) => {
    const { formatMessage } = useIntl();
    const [uhidText, setUhidText] = useState("");
    const [registrationDate, setRegistrationDate] = useState(new Date());
    const [startAge, setStartAge] = useState("");
    const [currentAge, setCurrentAge] = useState("");

    const { patientLookupData } = useSelector(
        ({ patientLookupReducer }: RootReducerState) => {
            return ({
                patientLookupData: patientLookupReducer.data,
            })
        },
        shallowEqual
    );

    // filtering blank record and formating for dropdown
    let selectOptions = Object.keys(patientLookupData).reduce((acc: any, curr) => (acc[curr] = patientLookupData[curr]?.filter((option: any) => option.text)?.map((option: any) => ({ label: option.text, value: option.value })), acc), {});

    useEffect(() => {
        if (selectedDonorData?.uhid) {
            setUhidText(selectedDonorData.uhid);
            setRegistrationDate(selectedDonorData.createdDateTime);
            setStartAge(selectedDonorData.startAge);
            setCurrentAge(selectedDonorData.currentAge);
        }
    }, [selectedDonorData]);

    useEffect(() => {
        if (donorResponse?.uhid) {
            setUhidText(donorResponse?.uhid);
        }
    }, [donorResponse]);

    useEffect(() => {
        if (watch('titleId'), selectOptions?.genders?.length) {
            if (watch('titleId')?.value === "1") {
                setValue('genderId', selectOptions?.genders.find((gender: any) => gender.value === "1"));
            }else if(watch('titleId')?.value === "2"){
                setValue('genderId', selectOptions?.genders.find((gender: any) => gender.value === "2"));
            }
        }
    }, [watch('titleId'), selectOptions?.genders])

    let imageUrl = selectedDonorData?.imageDataBase64String ? `data:image/jpeg;base64,${selectedDonorData?.imageDataBase64String}` : null;

    return (
        <>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <TextBox
                    label={formatMessage({ id: "donor-id" })}
                    value={uhidText}
                    disabled={true}
                />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <DatePicker
                    label={formatMessage({ id: "registration-date" })}
                    value={registrationDate}
                    disabled={true}
                    onChange={() => { }}
                />
            </Grid>

            <Grid item xs={12}>
                <div className="line" />
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={3} md={4}>
                        <RegistrationFormImagePicker
                            register={register}
                            watch={watch}
                            errors={errors}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            imageUrl={imageUrl}
                        />
                    </Grid>

                    <Grid item xs={12} lg={9} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={4} md={6} sm={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "title" })}
                                    options={selectOptions?.titles ?? []}
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    name="titleId"
                                    error={errors.titleId}
                                />
                            </Grid>
                            <Grid item xs={12} lg={4} md={6} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "first-name" })}
                                    rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                                    control={control}
                                    name="firstName"
                                    error={errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} lg={4} md={6} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "middle-name" })}
                                    name="middleName"
                                    control={control}
                                    error={errors.middleName}
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={4} md={6} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "last-name" })}
                                    rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                                    control={control}
                                    name="lastName"
                                    error={errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12} lg={4} md={6} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "nick-name" })}
                                    error={errors.nickName}
                                    name="nickName"
                                    control={control}
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={4} md={6} sm={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "gender" })}
                                    options={selectOptions?.genders ?? []}
                                    control={control}
                                    name="genderId"
                                    error={errors.genderId}
                                    rules={{
                                        required: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "marital-status" })}
                    options={selectOptions?.maritalStatus ?? []}
                    control={control}
                    name="maritalStatusId"
                    error={errors.maritalStatusId}
                    rules={{ required: true }}
                    onChangeValue={() => {
                        setValue("marriedSince", null);
                    }}
                />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomDatePicker
                    control={control}
                    label={formatMessage({ id: "married-since" })}
                    name="marriedSince"
                    disabled={watch('maritalStatusId')?.value === "2"}
                    error={errors.marriedSince}
                    maxDate={new Date()}
                />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <Grid container spacing={1}>
                    <Grid item xs={6} >
                        <TextBox
                            value={watch('birthDate') ? dayjs().diff(watch('birthDate'), 'year') : ""}
                            label={formatMessage({ id: "age" })}
                            type={"number"}
                            onChange={e => {
                                if (e.target.value && +e.target.value < 100) {
                                    setValue('birthDate', dayjs().subtract(+e.target.value, 'year').toISOString(), { shouldValidate: true });
                                } else {
                                    setValue('birthDate', null, { shouldValidate: true });
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} >
                        <CustomDatePicker
                            control={control}
                            label={formatMessage({ id: "dob" })}
                            name="birthDate"
                            error={errors.birthDate}
                            rules={{
                                required: true,
                                validate: value => (dayjs().diff(value, 'year') >= 18) || formatMessage({ id: "age-validation-message-18" })
                            }}
                            maxDate={new Date()}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <Grid container spacing={1}>
                    <Grid item xs={6} >
                        <TextBox
                            label={formatMessage({ id: "start-age" })}
                            disabled={true}
                            value={startAge}
                        />
                    </Grid>
                    <Grid item xs={6} >
                        <TextBox
                            label={formatMessage({ id: "current-age" })}
                            disabled={true}
                            value={currentAge}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <RegistrationAddressForm
                errors={errors}
                control={control}
                setValue={setValue}
                initialZipCode={selectedDonorData?.zipCode ?? null}
            />

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "address" })}
                    error={errors.address}
                    name="address"
                    control={control}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "occupation" })}
                    options={selectOptions?.occupations ?? []}
                    control={control}
                    name="occupationId"
                    error={errors.occupationId}
                />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "contact-type" })}
                    options={selectOptions?.contactTypes ?? []}
                    control={control}
                    name="contactTypeId"
                    error={errors.contactTypeId}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "email" })}
                    error={errors.email}
                    name="email"
                    control={control}
                    rules={validationRule.textbox({ type: "email", required: true })}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "phone" })}
                    rules={validationRule.textbox({ required: true, type: "number" })}
                    control={control}
                    name="telephone"
                    error={errors.telephone}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "nationality" })}
                    options={selectOptions?.nationalities ?? []}
                    control={control}
                    rules={{ required: true }}
                    name="nationalityId"
                    error={errors.nationalityId}
                />
            </Grid>

            <RegistrationDocumentForm
                patientDocument={patientDocument}
                setPatientDocument={setPatientDocument}
            />

            <Grid item xs={12}>
                <h3 className="formHeading">
                    <FormattedMessage id="others" />
                </h3>
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "religion" })}
                    options={selectOptions?.religions ?? []}
                    control={control}
                    name="religionId"
                    error={errors.religionId}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "birth-place" })}
                    options={selectOptions?.countries ?? []}
                    control={control}
                    name="birthCountryId"
                    error={errors.birthCountryId}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "visa-status" })}
                    options={selectOptions?.visaStatus ?? []}
                    control={control}
                    name="visaStatusId"
                    error={errors.visaStatusId}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "treating-doctor" })}
                    options={selectOptions?.medicalStaffs ?? []}
                    control={control}
                    name="doctorId"
                    error={errors.doctorId}
                    rules={{ required: true }}
                />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "language-known" })}
                    options={selectOptions?.languages ?? []}
                    control={control}
                    rules={{ required: true }}
                    multiple
                    name="patientLanguageIds"
                    error={errors.patientLanguageIds}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "clinical-complications" })}
                    options={selectOptions?.clinicalComplicationTypes ?? []}
                    control={control}
                    multiple
                    name="patientClinicalComplications"
                    error={errors.patientClinicalComplications}
                />
            </Grid>

            <Grid item xs={12}>
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
                {isUpdateModal && <CustomCheckBox
                    name="isBlocked"
                    label={formatMessage({ id: "block-for-transaction" })}
                    control={control}
                />}
            </Grid>
        </>
    )
}

export default DonorForm;