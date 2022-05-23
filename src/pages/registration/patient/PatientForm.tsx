import { useState, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { ControllerProps, FormProviderProps, FieldErrors } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';

import { createCustomCompositeFilter, isIndia, validationRule } from 'utils/global';
import { RootReducerState } from 'utils/types';
import {
    CustomSelect, CustomDatePicker, CustomTextBox, CustomCheckBox, RegistrationFormImagePicker,
    TextBox, RegistrationDocumentForm, SearchableTextBox, DatePicker
} from 'components/forms'
import {
    appointmentIdPopupColumns, contactIdPopupColumns, eligibilityAuthorizationList, filterOperators,
    masterPaginationServices
} from 'utils/constants';
import { useAsyncDebounce, useCreateLeadSourceLookupOptions, useCreateLookupOptions } from 'utils/hooks';
import { PopupSearchTable } from 'components';
import { getMasterPaginationData } from 'redux/actions';
import DynamicCoPayCalculation from './DynamicCoPayCalculation';
import RegistrationAddressForm from './RegistrationAddressForm';

interface Props {
    control: ControllerProps["control"];
    watch: FormProviderProps['watch'];
    register: FormProviderProps['register'];
    setValue: FormProviderProps['setValue'];
    clearErrors: FormProviderProps['clearErrors'];
    errors: FieldErrors;
    isUpdateModal: boolean;
    updateFields: (data: any) => void;
    patientData: any;
    patientResponse: any;
    patientDocument: any;
    setPatientDocument: any;
    dynamiccopayData: any;
    setDynamiccopayData: any;
    chnId?: string | null;
}

const PatientForm = ({ errors, control, watch, register, setValue, clearErrors, isUpdateModal, updateFields,
    patientData, patientResponse, patientDocument, setPatientDocument, dynamiccopayData, setDynamiccopayData, chnId }: Props) => {

    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [uhidText, setUhidText] = useState("");
    const [appointmentId, setAppointmentId] = useState("");
    const [contactId, setContactId] = useState("");
    const [startAge, setStartAge] = useState("");
    const [currentAge, setCurrentAge] = useState("");
    const [registrationDate, setRegistrationDate] = useState(new Date());
    const [appointmentPopupOpen, setAppointmentPopupOpen] = useState(false);
    const [contactIdPopupOpen, setContactIdPopupOpen] = useState(false);

    const { patientLookupData, leadSourceData, appointmentData, appointmentLoading } = useSelector(
        ({ patientLookupReducer, masterPaginationReducer }: RootReducerState) => {
            return ({
                patientLookupData: patientLookupReducer.data,
                leadSourceData: masterPaginationReducer[masterPaginationServices.leadSource].data,
                appointmentData: masterPaginationReducer[masterPaginationServices.appointment].data,
                appointmentLoading: masterPaginationReducer[masterPaginationServices.appointment].loading
            })
        },
        shallowEqual
    );

    // filtering blank record and formating for dropdown
    let selectOptions = useCreateLookupOptions(patientLookupData);
    let leadSourceOption = useCreateLeadSourceLookupOptions(leadSourceData.modelItems);
    const paymentOptions = selectOptions?.paymentTypes ?? [];
    // const paymentOptions = selectOptions?.paymentTypes?.filter((options: any) => isIndia() ? +options.value === 1 : false) ?? [];

    useEffect(() => {
        if (patientData) {
            setUhidText(patientData.uhid);
            setRegistrationDate(patientData.createdDateTime);
            setStartAge(patientData.startAge);
            setCurrentAge(patientData.currentAge);
        }
    }, [patientData]);

    useEffect(() => {
        if (patientResponse?.uhid) {
            setUhidText(patientResponse?.uhid);
        }
    }, [patientResponse]);

    useEffect(() => {
        if (watch('titleId'), selectOptions?.genders?.length) {
            if (watch('titleId')?.value === "1") {
                setValue('genderId', selectOptions?.genders.find((gender: any) => gender.value === "1"));
            } else if (watch('titleId')?.value === "2") {
                setValue('genderId', selectOptions?.genders.find((gender: any) => gender.value === "2"));
            }
        }
    }, [watch('titleId'), selectOptions?.genders]);

    useEffect(() => {
        let paymentTypeId = +watch('paymentTypeId')?.value;
        if (paymentTypeId === 1) {
            setValue('payerInsuranceCompanyId', null);
            setValue('PayerInsuranceCompanyPrimarySponsorId', null);
            setValue('tariffId', null);
            setValue('insuranceNumber', null);
            setValue('insuranceValidFrom', null);
            setValue('insuranceValidTo', null);
            setValue('eligibilityAuthorizationStatus', null);
            setValue('refereneNumber', null);
            setValue('planLimit', null);
            setDynamiccopayData([]);
        }
    }, [watch('paymentTypeId')]);

    const onChangeAppointmentValue = useAsyncDebounce((value: string, callType: string) => {
        let members = ["appointmentNumber", "firstName", "lastName", "telephone"];
        let params = {
            ...createCustomCompositeFilter(members, value),
            customFilters: [
                {
                    member: "appointmentCallTypeId",
                    value: callType,
                    operator: filterOperators.isEqualTo
                },
                {
                    member: "patientId",
                    value: "null",
                    operator: filterOperators.isEqualTo
                }
            ]
        };

        dispatch(getMasterPaginationData(masterPaginationServices.appointment, params));
    }, 500);

    function onFocus(type: string) {
        setTimeout(() => {
            if (type === "appointmentPopupOpen") {
                onChangeAppointmentValue("", "2");
                setAppointmentPopupOpen(true);
            } else if (type === "contactIdPopupOpen") {
                onChangeAppointmentValue("", "1");
                setContactIdPopupOpen(true);
            }
        }, 200);
    }

    function onRowClick(row: any) {
        updateFields(row);
        if (row.appointmentCallTypeId === 1) {
            setContactId(row.appointmentNumber);
        } else {
            setAppointmentId(row.appointmentNumber);
        }
        setContactIdPopupOpen(false);
        setAppointmentPopupOpen(false);
    }


    let imageUrl = patientData?.imageDataBase64String ? `data:image/jpeg;base64,${patientData?.imageDataBase64String}` : null;

    return (
        <>
            {isUpdateModal && (
                <>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <TextBox
                            label={formatMessage({ id: "uhid" })}
                            value={uhidText}
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <TextBox
                            label={formatMessage({ id: "chn" })}
                            value={chnId}
                            disabled={true}
                        />
                    </Grid>
                </>
            )}

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <DatePicker
                    label={formatMessage({ id: "registration-date" })}
                    value={registrationDate}
                    disabled={true}
                    onChange={() => { }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "client-type" })}
                    options={paymentOptions}
                    control={control}
                    name="paymentTypeId"
                    error={errors.paymentTypeId}
                    rules={{ required: true }}
                />
            </Grid>

            {!isUpdateModal && (
                <>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <SearchableTextBox
                            label={formatMessage({ id: "appointment-id" })}
                            value={appointmentId}
                            onChange={e => {
                                setAppointmentId(e.target.value);
                                onChangeAppointmentValue(e.target.value, "2");
                            }}
                            onFocus={() => onFocus('appointmentPopupOpen')}
                            onCancel={() => setAppointmentId("")}
                            disabled={isUpdateModal}
                        />

                        <PopupSearchTable
                            popupOpen={appointmentPopupOpen}
                            closePopup={() => setAppointmentPopupOpen(false)}
                            tableData={appointmentData.modelItems}
                            columns={[...appointmentIdPopupColumns(formatMessage)]}
                            onRowClick={onRowClick}
                            loading={appointmentLoading}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <SearchableTextBox
                            label={formatMessage({ id: "contact-id" })}
                            value={contactId}
                            onChange={e => {
                                setContactId(e.target.value);
                                onChangeAppointmentValue(e.target.value, "1");
                            }}
                            onFocus={() => onFocus('contactIdPopupOpen')}
                            onCancel={() => setContactId("")}
                            disabled={isUpdateModal}
                        />

                        <PopupSearchTable
                            popupOpen={contactIdPopupOpen}
                            closePopup={() => setContactIdPopupOpen(false)}
                            tableData={appointmentData.modelItems}
                            columns={[...contactIdPopupColumns(formatMessage)]}
                            onRowClick={onRowClick}
                            loading={appointmentLoading}
                        />
                    </Grid>
                </>
            )}


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
                                        required: true
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
                                    rules={validationRule.textbox({
                                        type: "textWithSpace"
                                    })}
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
                                    rules={validationRule.textbox({
                                        type: "textWithSpace"
                                    })}
                                    control={control}
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
                initialZipCode={patientData?.zipCode ?? null}
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
                    rules={validationRule.textbox({ required: true, type: 'number' })}
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
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "referring-doctor" })}
                    options={selectOptions?.referringDoctors ?? []}
                    control={control}
                    name="refferingDoctorId"
                    error={errors.refferingDoctorId}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "lead-source-1" })}
                    options={leadSourceOption?.leadSource1 ?? []}
                    control={control}
                    name="leadSource1Id"
                    error={errors.leadSource1Id}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "lead-source-2" })}
                    options={leadSourceOption?.leadSource2 ?? []}
                    control={control}
                    name="leadSource2Id"
                    error={errors.leadSource2Id}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "lead-source-3" })}
                    options={leadSourceOption?.leadSource3 ?? []}
                    control={control}
                    name="leadSource3Id"
                    error={errors.leadSource3Id}
                    rules={{ required: true }}
                />
            </Grid>

            <RegistrationDocumentForm
                patientDocument={patientDocument}
                setPatientDocument={setPatientDocument}
            />

            {watch('paymentTypeId')?.value !== "1" && (
                <PatientChannelInformation
                    watch={watch}
                    errors={errors}
                    control={control}
                    selectOptions={selectOptions}
                    formatMessage={formatMessage}
                    dynamiccopayData={dynamiccopayData}
                    setDynamiccopayData={setDynamiccopayData}
                    setValue={setValue}
                    patientData={patientData}
                />
            )}

            <Grid item xs={12}>
                <h3 className="formHeading">
                    <FormattedMessage id="others" />
                </h3>
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "registration-doctor" })}
                    options={selectOptions?.medicalStaffs ?? []}
                    control={control}
                    name="doctorId"
                    error={errors.doctorId}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "religion" })}
                    options={selectOptions?.religions ?? []}
                    control={control}
                    name="religionId"
                    error={errors.religionId}
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
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "patient-note" })}
                    error={errors.patientNote}
                    multiline
                    rowsMax={2}
                    name="patientNote"
                    control={control}
                    rules={validationRule.textbox({ maxLength: 400 })}
                />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "vip-reason" })}
                    options={selectOptions?.vipReasons ?? []}
                    control={control}
                    name="vipReasonId"
                    error={errors.vipReasonId}
                    rules={{ required: watch("isVIP") ? true : false }}
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
                {/* <CustomCheckBox
                    name="isAccessibleByAnotherClinic"
                    label={formatMessage({ id: "data-accessbility" })}
                    control={control}
                /> */}
                <CustomCheckBox
                    name="isVIP"
                    label={formatMessage({ id: "vip" })}
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
};

export default PatientForm;

const PatientChannelInformation = ({ errors, control, selectOptions, formatMessage, watch,
    dynamiccopayData, setDynamiccopayData, setValue, patientData }: any) => {

    const [sponsorOptions, setSponsorOptions] = useState([]);

    const { insuranceCompanyData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                insuranceCompanyData: masterPaginationReducer[masterPaginationServices.insuranceCompany].data,
            })
        },
        shallowEqual
    );
    const payerOptions = insuranceCompanyData.modelItems.filter((insurance: any) => insurance.primarySponsorId === null).map((city: any) => ({ label: city.name, value: String(city.id) }));

    useEffect(() => {
        let sponsorId = watch('payerInsuranceCompanyId')?.value;
        setSponsorOptions(insuranceCompanyData.modelItems.filter(((insurance: any) => +insurance.primarySponsorId === +sponsorId)).map((city: any) => ({ label: city.name, value: String(city.id) })));
        if (sponsorOptions.length) {
            setValue("PayerInsuranceCompanyPrimarySponsorId", null);
        }
    }, [watch('payerInsuranceCompanyId')]);

    useEffect(() => {
        if (patientData) {
            let insuranceId = patientData.payerInsuranceCompanyId;
            let selectedInsurance = insuranceCompanyData.modelItems.find((insurance: any) => +insurance.id === +insuranceId);
            if (selectedInsurance?.primarySponsorId) {
                setValue('PayerInsuranceCompanyPrimarySponsorId', { label: selectedInsurance.name, value: String(selectedInsurance.id) });
                let payerInsurance = insuranceCompanyData.modelItems.find((insurance: any) => +insurance.id === +selectedInsurance.primarySponsorId);
                if (payerInsurance) {
                    setValue('payerInsuranceCompanyId', { label: payerInsurance.name, value: String(payerInsurance.id) });
                }
            } else if (selectedInsurance) {
                setValue('payerInsuranceCompanyId', { label: selectedInsurance.name, value: String(selectedInsurance.id) });
            }
        }
    }, [patientData]);

    return (
        <>
            <Grid item xs={12}>
                <h3 className="formHeading">
                    <FormattedMessage id="patient-channel-information" />
                </h3>
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "payer" })}
                    options={payerOptions ?? []}
                    control={control}
                    name="payerInsuranceCompanyId"
                    error={errors.payerInsuranceCompanyId}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "sponsor" })}
                    options={sponsorOptions ?? []}
                    control={control}
                    name="PayerInsuranceCompanyPrimarySponsorId"
                    error={errors.PayerInsuranceCompanyPrimarySponsorId}
                    rules={{ required: sponsorOptions.length ? true : false }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "network-plan-type" })}
                    options={selectOptions?.tariffs ?? []}
                    control={control}
                    name="tariffId"
                    error={errors.tariffId}
                    rules={{ required: true }}
                />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "insuranceId" })}
                    error={errors.insuranceNumber}
                    name="insuranceNumber"
                    control={control}
                    rules={{ required: true }}
                />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomDatePicker
                    control={control}
                    label={formatMessage({ id: "insurance-valid-from" })}
                    name="insuranceValidFrom"
                    error={errors.insuranceValidFrom}
                    maxDate={new Date()}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomDatePicker
                    control={control}
                    label={formatMessage({ id: "insurance-valid-to" })}
                    name="insuranceValidTo"
                    error={errors.insuranceValidTo}
                    minDate={new Date()}
                    rules={{ required: true }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "eligibility-authorization-status" })}
                    options={eligibilityAuthorizationList}
                    control={control}
                    name="eligibilityAuthorizationStatus"
                    error={errors.eligibilityAuthorizationStatus}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "reference" })}
                    error={errors.refereneNumber}
                    name="refereneNumber"
                    control={control}
                    rules={{
                        required: watch('eligibilityAuthorizationStatus')?.value === "1"
                    }}
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "plan-limit" })}
                    error={errors.planLimit}
                    name="planLimit"
                    control={control}
                    type="number"
                />
            </Grid>

            <DynamicCoPayCalculation
                dynamiccopayData={dynamiccopayData}
                setDynamiccopayData={setDynamiccopayData}
            />
        </>
    )
}