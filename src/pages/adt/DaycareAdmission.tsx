import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { CustomSelect, CustomTextBox, CustomCheckBox, TextBox, Select } from 'components/forms';
import { services } from 'utils/services';
import { createCustomCompositeFilter, getFormBody, getTableParams } from 'utils/global';
import { bedStatus, masterPaginationServices, patientPopupColumns } from 'utils/constants';
import { useToastMessage } from 'utils/hooks';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
import { PopupSearchTable } from 'components';
import { useAsyncDebounce } from 'utils/hooks';

const DaycareAdmission = React.memo(() => {
    const { handleSubmit, formState: { errors }, control, getValues, reset, setValue, watch } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();
    const location = useLocation<any>();
    let history = useHistory();

    const [submitLoading, setSubmitLoading] = useState(false);
    const [selectedUHID, setSelectedUHID] = useState('');
    const [uhidText, setUhidText] = useState("");
    const [uhidPopupOpen, setUhidPopupOpen] = useState(false);
    const [chnIdOptions, setChnIdOptions] = useState([]);
    const [selectedChnIdOptions, setSelectedChnIdOptions] = useState([]);
    const [partnerData, setPartnerData] = useState<any[]>([]);
    const [coupleId, setCoupleId] = useState(0);
    const [partnerName, setPartnerName] = useState(null);
    const [partnerGender, setPartnerGender] = useState(null);
    const [partnerAge, setPartnerAge] = useState(null);
    const [partnerDOB, setPartnerDOB] = useState('');
    const [partnerPhone, setPartnerPhone] = useState(null);

    let patientData = location.state ?? {};

    const { bedData, medicalStaffData, patientSerchData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            bedData: masterPaginationReducer[masterPaginationServices.bed].data,
            medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
            patientSerchData: masterPaginationReducer[masterPaginationServices.patientForAdmissionSearch].data
        }),
        shallowEqual
    );

    let bedOptions = bedData.modelItems?.filter((item: any) => (item.bedStatusId === bedStatus.Vacant))?.map((option: any) => ({ label: option.name, value: option.id }));
    let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.bed, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
    }, []);

    useEffect(() => {
        if (bedData.modelItems?.length && medicalStaffOptions.length && patientData) {
            if (patientData) {
                let selectedBed = bedData.modelItems?.filter((item: any) => (item.id === patientData?.bedId)).map((option: any) => ({ label: option.name, value: option.id }));
                Object.assign(bedOptions, selectedBed);
            }

            let data = {
                ...patientData,
                bedId: bedOptions?.find((item: any) => item.value == patientData?.bedId) ?? null,
                admittingDoctorId: medicalStaffOptions?.find((item: any) => item.value == patientData?.admittingDoctorId) ?? null,
                anestheticDoctorId: medicalStaffOptions?.find((item: any) => item.value == patientData?.anestheticDoctorId) ?? null,
                requestRaisedDate: dayjs(patientData?.requestRaisedDate).format('DD-MM-YYYY hh:mm A'),
                partnerDOB: patientData?.partnerDOB ? dayjs(patientData?.partnerDOB).format('DD-MM-YYYY') : null,
            };

            setCoupleId(data.coupleId);
            setPartnerName(data.partnerName);
            setPartnerGender(data.partnerGender);
            setPartnerAge(data.partnerAge);
            setPartnerDOB(data.partnerDOB);
            setPartnerPhone(data.partnerPhone);
            reset(data);
        }
    }, [reset, bedOptions.length, medicalStaffOptions.length, patientData]);

    const handleCancelClick = () => {
        history.goBack();
    }

    const handleResetClick = () => {
        resetExistingPatinet();
        setUhidText("");
    }

    const handlePrintClick = () => {

    }

    function onSubmit(data: any) {
        const bodyData = getFormBody(data);

        setSubmitLoading(true);
        if (Object.keys(patientData).length) {
            let requestData: any = {
                id: bodyData?.id ?? 0,
                inPatientNumber: patientData?.inPatientNumber,
                patientId: bodyData.patientId,
                inPatientPackageAllocationId: bodyData?.inPatientPackageAllocationId,
                bedId: bodyData.bedId,
                admittingDoctorId: bodyData.admittingDoctorId,
                anestheticDoctorId: bodyData.anestheticDoctorId
            }
            if (bodyData?.coupleId) {
                requestData = {
                    ...requestData,
                    coupleId: bodyData?.coupleId ?? 0
                }
            }

            services.updateAdmission(requestData)
                .then((res) => {
                    setSubmitLoading(false);
                    if (res.data?.succeeded) {
                        toastMessage(formatMessage({ id: "update-admission-message" }));
                        handleCancelClick();
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setSubmitLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
        else {
            let requestData: any = {
                patientId: bodyData.patientId,
                inPatientPackageAllocationId: bodyData?.inPatientPackageAllocationId,
                bedId: bodyData.bedId,
                admittingDoctorId: bodyData.admittingDoctorId,
                anestheticDoctorId: bodyData.anestheticDoctorId
            }

            if (bodyData?.coupleId) {
                requestData = {
                    ...requestData,
                    coupleId: bodyData?.coupleId ?? 0,
                }
            }
            services.createAdmission(requestData)
                .then((res) => {
                    setSubmitLoading(false);
                    if (res.data?.succeeded) {
                        toastMessage(formatMessage({ id: "create-admission-message" }));
                        handleCancelClick();
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setSubmitLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
    }

    function updateFields(data: any) {
        const formData = {
            inPatientNumber: data?.inPatientNumber ?? 0,
            patientId: data?.id,
            chnId: data?.chnIds,
            coupleId: data?.coupleId ?? 0,
            inPatientPackageAllocationId: data?.packageAllocations?.length > 0 ? data?.packageAllocations[0]?.id ?? 0 : 0,
            clinicName: data?.clinicName,
            patientFullName: data?.fullName,
            patientGenderName: data?.genderName,
            patientAgeInYear: data?.currentAge,
            patientTelephone: data?.telephone,
            patientPatientNote: data?.patientNote,
            inPatientPackageAllocationTreatingDoctorUserDisplayName: data?.packageAllocations?.length > 0 ? data?.packageAllocations[0]?.treatingDoctorUserDisplayName : null,
            inPatientPackageAllocationPaymentTypeName: data?.packageAllocations?.length > 0 ? data?.packageAllocations[0]?.paymentTypeName : null,
            inPatientPackageAllocationPayerInsuranceCompanyName: data?.packageAllocations?.length > 0 ? data?.packageAllocations[0]?.payerInsuranceCompanyName : null,
            patientIsVIP: data?.isVIP,
            inPatientPackageAllocationIsSubvention: data?.packageAllocations?.length > 0 ? data?.packageAllocations[0]?.isSubvention : null,
            inPatientPackageAllocationPackageName: data?.packageAllocations?.length > 0 ? data?.packageAllocations[0]?.packageName : null,
            requestRaisedDate: dayjs(data?.requestRaisedDate).format('DD-MM-YYYY hh:mm A'),
            partnerName: null,
            partnerGender: null,
            partnerAge: null,
            partnerDOB: null,
            partnerPhone: null
        };
        setCoupleId(data?.coupleId ?? 0);
        setPartnerName(null);
        setPartnerGender(null);
        setPartnerAge(null);
        setPartnerDOB('');
        setPartnerPhone(null);
        reset(formData);
    }

    const onChangeValue = useAsyncDebounce((value: string) => {
        let members = ["uhid", "firstName", "lastName", "telephone"];
        let params = createCustomCompositeFilter(members, value);

        dispatch(getMasterPaginationData(masterPaginationServices.patientForAdmissionSearch, params));
        if (!value) {
            resetExistingPatinet();
        }
    }, 500);

    function resetExistingPatinet() {
        setSelectedUHID("");
        setChnIdOptions([]);
        setSelectedChnIdOptions([]);
        setPartnerData([]);
        reset({});
        if (watch('chnid')) {
            setValue('chnid', "");
        }

        setCoupleId(0);
        setPartnerName(null);
        setPartnerGender(null);
        setPartnerAge(null);
        setPartnerDOB('');
        setPartnerPhone(null);
    }

    function onFocus() {
        setTimeout(() => {
            setUhidPopupOpen(true);
        }, 300);
    }

    function onRowClick(row: any) {
        if (row.uhid) {

            setUhidPopupOpen(false);
            setSelectedUHID(row.uhid);
            setUhidText(row.uhid);
            updateFields(row);
            if (row?.id) {
                ongetPartnerByPatientIdApiCall(row?.id);
            }
        }
    }

    function ongetPartnerByPatientIdApiCall(patientId: any) {
        let paramsData = {
            patientId: patientId
        };

        const bodyData = getTableParams({});

        services.getPartnerByPatientId({ body: bodyData, params: paramsData })
            .then((res) => {
                setSubmitLoading(false);
                if (res.data?.succeeded) {
                    let chnIdOptions = res.data?.modelItems?.map((couple: any) => ({ label: couple.chnId, value: couple.chnId }))
                    setChnIdOptions(chnIdOptions);
                    setPartnerData(res.data?.modelItems);
                }
            })
            .catch((err) => {
                setSubmitLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    const handleCHNIDChange = (value: any) => {
        fillPartnerData(value);
    }

    function fillPartnerData(value: any) {
        const selectedPartnerData = partnerData.find((item: any) => item.chnId == value);

        let formData = getValues();

        let data = {
            ...formData,
            coupleId: selectedPartnerData?.id,
            partnerName: selectedPartnerData?.wifePatientId === formData?.patientId ? (selectedPartnerData?.husbandPatientFullNameWithTitle ?? null) : (selectedPartnerData?.wifePatientFullNameWithTitle ?? null),
            partnerGender: selectedPartnerData?.wifePatientId === formData?.patientId ? (selectedPartnerData?.husbandPatientGenderName ?? null) : (selectedPartnerData?.wifePatientGenderName ?? null),
            partnerAge: selectedPartnerData?.wifePatientId === formData?.patientId ? (selectedPartnerData?.husbandAge ?? null) : (selectedPartnerData?.wifePatientAge ?? null),
            partnerDOB: dayjs(selectedPartnerData?.wifePatientId === formData?.patientId ? (selectedPartnerData?.husbandPatientBirthDate ?? null) : (selectedPartnerData?.wifePatientBirthDate ?? null)).format('DD-MM-YYYY'),
            partnerPhone: selectedPartnerData?.wifePatientId === formData?.patientId ? (selectedPartnerData?.husbandPatientTelephone ?? null) : (selectedPartnerData?.wifePatientTelephone ?? null)
        }

        setValue('coupleId', data.coupleId);

        setCoupleId(data.coupleId);
        setPartnerName(data.partnerName);
        setPartnerGender(data.partnerGender);
        setPartnerAge(data.partnerAge);
        setPartnerDOB(data.partnerDOB);
        setPartnerPhone(data.partnerPhone);
    }

    return (
        <>
            <Box py={4} className="container">
                <Paper elevation={1}>
                    <Box p={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <h3 className="formHeading">
                                    <FormattedMessage id="general-information" />
                                </h3>
                            </Grid>
                            {Object.keys(patientData).length ?
                                <Grid className="icon_up" item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "uhid" })}
                                        name="patientUHID"
                                        control={control}
                                        rules={{ required: true }}
                                        error={errors.patientUHID}
                                        disabled
                                    />
                                </Grid>
                                :
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <TextBox
                                        label={formatMessage({ id: "search-by-uhid" })}
                                        value={uhidText}
                                        name="patientUHID"
                                        required={true}
                                        error={errors.patientUHID}
                                        autoComplete="off"
                                        onChange={e => {
                                            setUhidText(e.target.value);
                                            onChangeValue(e.target.value);
                                        }}
                                        onFocus={onFocus}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {uhidText ? (
                                                        <IconButton
                                                            onClick={() => {
                                                                setUhidText("")
                                                                resetExistingPatinet();
                                                            }}
                                                            size="small"
                                                        >
                                                            <CancelIcon color="primary" />
                                                        </IconButton>
                                                    ) : (
                                                        <SearchIcon />
                                                    )}
                                                </InputAdornment>
                                            )
                                        }}
                                    />

                                    <PopupSearchTable
                                        popupOpen={uhidPopupOpen && patientSerchData?.modelItems?.length}
                                        closePopup={() => setUhidPopupOpen(false)}
                                        tableData={patientSerchData.modelItems}
                                        columns={[...patientPopupColumns(formatMessage)]}
                                        onRowClick={onRowClick}
                                    />
                                </Grid>
                            }
                            <Grid item xs={12} lg={3} md={4} sm={6}>

                                {Object.keys(patientData).length ?
                                    <CustomTextBox
                                        label={formatMessage({ id: "couple-history-number" })}
                                        name="partnerCHN"
                                        control={control}
                                        disabled
                                    />
                                    :
                                    <Select
                                        label={formatMessage({ id: "couple-history-number" })}
                                        options={chnIdOptions}
                                        value={selectedChnIdOptions ?? []}
                                        onChange={(_, data: any) => {
                                            setSelectedChnIdOptions(data);
                                            handleCHNIDChange(data?.value);
                                        }}
                                    />
                                }
                            </Grid>

                            <Grid className="icon_up" item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "ip-number" })}
                                    name="inPatientNumber"
                                    control={control}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "clinic" })}
                                    name="clinicName"
                                    control={control}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "patient-name" })}
                                    name="patientFullName"
                                    control={control}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "gender" })}
                                    name="patientGenderName"
                                    control={control}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "current-ageinyears" })}
                                    name="patientAgeInYear"
                                    control={control}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "mobile-number" })}
                                    name="patientTelephone"
                                    control={control}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "treating-doctor" })}
                                    name="inPatientPackageAllocationTreatingDoctorUserDisplayName"
                                    control={control}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "client-type" })}
                                    name="inPatientPackageAllocationPaymentTypeName"
                                    control={control}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "payer" })}
                                    name="inPatientPackageAllocationPayerInsuranceCompanyName"
                                    control={control}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={1} md={4} sm={6}>
                                <CustomCheckBox
                                    name="patientIsVIP"
                                    label={formatMessage({ id: "vip" })}
                                    control={control}
                                    disabled
                                    style={{ color: (watch("patientIsVIP") == true ? "red" : "") }}
                                />
                            </Grid>
                            <Grid item xs={12} lg={1} md={4} sm={6}>
                                <CustomCheckBox
                                    name="inPatientPackageAllocationIsSubvention"
                                    label={formatMessage({ id: "subvention" })}
                                    control={control}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "patient-note" })}
                                    name="patientPatientNote"
                                    control={control}
                                    multiline
                                    rows={4}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <h3 className="formHeading">
                                    <FormattedMessage id="package-information" />
                                </h3>
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "package-name" })}
                                    name="inPatientPackageAllocationPackageName"
                                    control={control}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "admission-datetime" })}
                                    name="requestRaisedDate"
                                    control={control}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "bed" })}
                                    options={bedOptions ?? []}
                                    control={control}
                                    name="bedId"
                                    error={errors.bedId}
                                    rules={{ required: true }}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "admitting-doctor" })}
                                    options={medicalStaffOptions ?? []}
                                    control={control}
                                    name="admittingDoctorId"
                                    error={errors.admittingDoctorId}
                                    rules={{ required: true }}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "anesthetic" })}
                                    options={medicalStaffOptions ?? []}
                                    control={control}
                                    name="anestheticDoctorId"
                                    error={errors.anestheticDoctorId}
                                    rules={{ required: true }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <h3 className="formHeading">
                                    <FormattedMessage id="partner-information" />
                                </h3>
                            </Grid>

                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <TextBox
                                    label={formatMessage({ id: "partner-name" })}
                                    name="partnerName"
                                    value={partnerName}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <TextBox
                                    label={formatMessage({ id: "gender" })}
                                    name="partnerGender"
                                    value={partnerGender}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={1} md={4} sm={6}>
                                <TextBox
                                    label={formatMessage({ id: "age" })}
                                    name="partnerAge"
                                    value={partnerAge}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={2} md={4} sm={6}>
                                <TextBox
                                    label={formatMessage({ id: "dob" })}
                                    name="partnerDOB"
                                    value={partnerDOB}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <TextBox
                                    label={formatMessage({ id: "phone" })}
                                    name="partnerPhone"
                                    value={partnerPhone}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box pt={6} style={{ display: "flex", justifyContent: "flex-end" }}
                                    className="formLayout-footer">
                                    <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}
                                        style={{ marginLeft: "15px" }}>
                                        <FormattedMessage id={Object.keys(patientData).length ? "update-admission" : "admit"} />
                                    </Button >
                                    {!Object.keys(patientData).length &&
                                        <Button variant="outlined" color="primary" style={{ marginLeft: "15px" }} onClick={handleResetClick}>
                                            <FormattedMessage id="reset" />
                                        </Button>
                                    }
                                    <Button variant="outlined" color="primary" style={{ marginLeft: "15px" }} onClick={handlePrintClick}>
                                        <FormattedMessage id="print" />
                                    </Button>
                                    <Button variant="outlined" color="primary" style={{ marginLeft: "15px" }} onClick={handleCancelClick}>
                                        <FormattedMessage id="cancel" />
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </>
    )
});

export default DaycareAdmission;