import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { ControllerProps, FormProviderProps } from 'react-hook-form';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import { createCustomCompositeFilter } from 'utils/global';
import { getMasterPaginationData } from 'redux/actions';
import { RootReducerState } from 'utils/types';
import { HoverLoader, PopupSearchTable } from 'components';
import { eligibilityAuthorizationList, masterPaginationServices, patientPopupColumns } from 'utils/constants';
import { useAsyncDebounce, useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { CustomCheckBox, CustomDatePicker, CustomSelect, CustomTextBox, SearchableTextBox } from 'components/forms';
import { services } from 'utils/services';
import ViewDynamiccopayCalculationModal from './ViewDynamicCoPayCalculationModal';


interface Props {
    control: ControllerProps["control"];
    setValue: FormProviderProps["setValue"];
    watch: FormProviderProps["watch"];
    setSelectedPatientData?: React.Dispatch<React.SetStateAction<any>>;
    onResetUser?: () => void;
    patientId?: number;
    billUserData?: any;
}

const CreateBillUserForm = ({ control, setValue, watch, setSelectedPatientData, onResetUser, patientId, billUserData }: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();

    const [uhidPopupOpen, setUhidPopupOpen] = useState(false);
    const [disableUhid, setDisableUhid] = useState(false);
    const [uhidText, setUhidText] = useState("");
    const [paymentType, setPaymentType] = useState<null | number>(null);
    const [loading, setLoading] = useState(false);
    const [viewDynamicCoPayModalOpen, setViewDynamicCoPayModalOpen] = useState(false);
    const [dynamiccopayData, setDynamiccopayData] = useState<any>([]);

    const { wifeWithPartnerData, wifeWithPartnerLoading, billingLookupData } = useSelector(
        ({ masterPaginationReducer, billingLookupReducer }: RootReducerState) => {
            return ({
                wifeWithPartnerData: masterPaginationReducer[masterPaginationServices.wifeWithPartner].data,
                wifeWithPartnerLoading: masterPaginationReducer[masterPaginationServices.wifeWithPartner].loading,
                billingLookupData: billingLookupReducer.data
            })
        },
        shallowEqual
    );
    let selectOptions = useCreateLookupOptions(billingLookupData);

    useEffect(() => {
        if (patientId) {
            const parms = { patientId };
            setLoading(true);
            services.getPatientWithPartnerById(parms)
                .then((res) => {
                    setLoading(false);
                    if (res.status === 200) {
                        onRowClick(res.data.response);
                        if (setSelectedPatientData) {
                            setSelectedPatientData(res.data.response);
                        }
                    }
                })
                .catch(() => setLoading(false))
        }
    }, [patientId, billUserData]);

    useEffect(() => {
        if (billUserData) {
            const { patientName: fullName, ageInYear: currentAge, patientNotes: patientNote } = billUserData;

            let formsData = {
                ...billUserData, fullName, currentAge, patientNote
            }
            updateFields(formsData);
        }
    }, [billUserData])

    function onApiCall(value: string) {
        let members = ["uhid", "firstName", "lastName", "telephone"];
        let params = createCustomCompositeFilter(members, value);

        dispatch(getMasterPaginationData(masterPaginationServices.wifeWithPartner, params));
    }

    const onChangeValue = useAsyncDebounce((value: string) => {
        onApiCall(value);
    }, 500);

    function onFocus() {
        if (wifeWithPartnerData?.modelItems?.length === 0) {
            onApiCall("");
        }
        setTimeout(() => {
            setUhidPopupOpen(true);
        }, 200);
    }

    function updateFields(fieldsData: any) {
        const { wifeCouples } = fieldsData;
        let formsData = {
            ...fieldsData,
            chnId: wifeCouples?.[0]?.chnId,
            partnerName: wifeCouples?.[0]?.partnerName,
        }
        updateForms(formsData);

        setDisableUhid(true);
        setUhidText(fieldsData.uhid);
        setPaymentType(fieldsData.paymentTypeId ?? null);
    }

    function updateForms(formsData: any) {
        const { fullName, genderName, currentAge, patientNote, isVIP, telephone, referringDoctorId,
            referringDoctorName, paymentTypeName, payerInsuranceCompanyName, sponsorInsuranceCompanyName,
            tariffName, insuranceNumber, insuranceValidFrom, insuranceValidTo, eligibilityAuthorizationStatus,
            refereneNumber, planLimit, clinicName, uhid, chnId, partnerName } = formsData;

        setValue('userInfo.uhid', uhid);
        setValue('userInfo.clinicName', clinicName);
        setValue('userInfo.fullName', fullName);
        setValue('userInfo.genderName', genderName);
        setValue('userInfo.currentAge', currentAge);
        setValue('userInfo.patientNote', patientNote);
        setValue('userInfo.isVIP', isVIP);
        setValue('userInfo.telephone', telephone);
        // setValue('userInfo.doctorUserDisplayName', referringDoctorName);
        setValue('userInfo.paymentTypeName', paymentTypeName);
        setValue('userInfo.payerInsuranceCompanyName', payerInsuranceCompanyName);
        setValue('userInfo.sponsorInsuranceCompanyName', sponsorInsuranceCompanyName);
        setValue('userInfo.tariffName', tariffName);
        setValue('userInfo.insuranceNumber', insuranceNumber);
        setValue('userInfo.insuranceValidFrom', insuranceValidFrom);
        setValue('userInfo.insuranceValidTo', insuranceValidTo);
        if (referringDoctorId && referringDoctorName) {
            setValue('referringDoctorId', { label: referringDoctorName, value: referringDoctorId });
        }
        if (billUserData) {
            setValue('userInfo.referringDoctorName', referringDoctorName);
            setValue('userInfo.eligibilityAuthorizationStatus', eligibilityAuthorizationList[+eligibilityAuthorizationStatus - 1]?.label ?? null);
        } else {
            setValue('userInfo.eligibilityAuthorizationStatus', eligibilityAuthorizationList[+eligibilityAuthorizationStatus - 1] ?? null);
        }
        setValue('referenceNumber', refereneNumber);
        setValue('userInfo.planLimit', planLimit);

        if (chnId) {
            setValue('userInfo.chn', chnId);
            setValue('userInfo.partnerName', partnerName);
        }
        if (setSelectedPatientData) {
            setSelectedPatientData(formsData);
        }
        if (formsData?.insurancePlans?.length) {
            setDynamiccopayData(formsData.insurancePlans);
        }
    }

    function onRowClick(row: any) {
        if (row.isBlocked) {
            toastMessage("Patient is blocked for transaction.", "error");
        } else {
            updateFields(row);
            setUhidPopupOpen(false);
        }
    }

    function onReset() {
        setUhidText("");
        onApiCall("");
        setDisableUhid(false);
        setPaymentType(null);

        setValue('userInfo.uhid', null);
        setValue('userInfo.clinicName', null);
        setValue('userInfo.fullName', null);
        setValue('userInfo.genderName', null);
        setValue('userInfo.currentAge', null);
        setValue('userInfo.patientNote', null);
        setValue('userInfo.isVIP', null);
        setValue('userInfo.telephone', null);
        // setValue('userInfo.doctorUserDisplayName', null);
        setValue('userInfo.referringDoctorName', null);
        setValue('userInfo.paymentTypeName', null);
        setValue('userInfo.payerInsuranceCompanyName', null);
        setValue('userInfo.sponsorInsuranceCompanyName', null);
        setValue('userInfo.tariffName', null);
        setValue('userInfo.insuranceNumber', null);
        setValue('userInfo.insuranceValidFrom', null);
        setValue('userInfo.insuranceValidTo', null);
        setValue('userInfo.eligibilityAuthorizationStatus', null);
        setValue('referenceNumber', null);
        setValue('userInfo.planLimit', null);
        setValue('userInfo.chn', null);
        setValue('userInfo.partnerName', null);
        setValue('referringDoctorId', null);
        if (setSelectedPatientData) {
            setSelectedPatientData(null);
        }
        if (onResetUser) {
            onResetUser();
        }
    }

    return (
        <>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        {(!patientId && !billUserData) ? (
                            <>
                                <SearchableTextBox
                                    label={formatMessage({ id: "uhid" })}
                                    value={uhidText}
                                    onChange={e => {
                                        setUhidText(e.target.value);
                                        onChangeValue(e.target.value);
                                    }}
                                    onFocus={onFocus}
                                    onCancel={onReset}
                                    disabled={disableUhid}
                                />

                                <PopupSearchTable
                                    popupOpen={uhidPopupOpen}
                                    closePopup={() => {
                                        setUhidPopupOpen(false);
                                    }}
                                    tableData={wifeWithPartnerData.modelItems}
                                    columns={[...patientPopupColumns(formatMessage)]}
                                    onRowClick={onRowClick}
                                    loading={wifeWithPartnerLoading}
                                />
                            </>
                        ) : (
                            <CustomTextBox
                                label={formatMessage({ id: "uhid" })}
                                control={control}
                                name="userInfo.uhid"
                                disabled
                            />
                        )}
                    </Grid>

                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "couple-history-number" })}
                            name="userInfo.chn"
                            control={control}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "clinic" })}
                            name="userInfo.clinicName"
                            control={control}
                            disabled
                        />
                    </Grid>
                </Grid>
            </Grid>

            {billUserData && (
                <>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <CustomDatePicker
                            label={"Bill Date & Time"}
                            name="userInfo.billDate"
                            control={control}
                            disabled
                            format="DD-MM-YYYY hh:mm A"
                        />
                    </Grid>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={"Bill No."}
                            name="userInfo.billNo"
                            control={control}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <CustomDatePicker
                            label={"Visit Date & Time"}
                            name="userInfo.visitDate"
                            control={control}
                            disabled
                            format="DD-MM-YYYY hh:mm A"
                        />
                    </Grid>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={"Visit No."}
                            name="userInfo.visitNo"
                            control={control}
                            disabled
                        />
                    </Grid>
                </>
            )}

            <Grid item xs={12}>
                <div className="line" />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "patient-name" })}
                    name="userInfo.fullName"
                    control={control}
                    disabled
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "gender" })}
                    name="userInfo.genderName"
                    control={control}
                    disabled
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "current-ageinyears" })}
                    name="userInfo.currentAge"
                    control={control}
                    type="number"
                    // disabled
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "partner-name" })}
                    name="userInfo.partnerName"
                    control={control}
                    disabled
                />
            </Grid>
            <Grid item xs={9}>
                <CustomTextBox
                    label={formatMessage({ id: "patient-note" })}
                    name="userInfo.patientNote"
                    control={control}
                    disabled
                />
            </Grid>
            <Grid item xs={3}>
                <CustomCheckBox
                    name="userInfo.isVIP"
                    label={formatMessage({ id: "vip" })}
                    control={control}
                    style={{ pointerEvents: "none" }}
                    color="secondary"
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "mobile" })}
                    name="userInfo.telephone"
                    control={control}
                    disabled
                />
            </Grid>
            {/* <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "registration-doctor" })}
                    name="userInfo.doctorUserDisplayName"
                    control={control}
                    disabled
                />
            </Grid> */}
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "client-type" })}
                    name="userInfo.paymentTypeName"
                    control={control}
                    disabled
                />
            </Grid>
            {!billUserData && <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "referring-doctor" })}
                    name="referringDoctorId"
                    control={control}
                    options={selectOptions?.referringDoctors ?? []}
                />
            </Grid>}
            {billUserData && <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "referring-doctor" })}
                    name="userInfo.referringDoctorName"
                    control={control}
                    disabled
                />
            </Grid>}

            {
                (paymentType && paymentType !== 1) && (
                    <>
                        <Grid item xs={12}>
                            <h3 className="formHeading">
                                <FormattedMessage id="patient-channel-information" />
                            </h3>
                        </Grid>

                        <Grid item xs={12} lg={3} md={4} sm={6}>
                            <CustomTextBox
                                label={formatMessage({ id: "payer" })}
                                name="userInfo.payerInsuranceCompanyName"
                                control={control}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} md={4} sm={6}>
                            <CustomTextBox
                                label={formatMessage({ id: "sponsor" })}
                                name="userInfo.sponsorInsuranceCompanyName"
                                control={control}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} md={4} sm={6}>
                            <CustomTextBox
                                label={formatMessage({ id: "network-plan-type" })}
                                name="userInfo.tariffName"
                                control={control}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} md={4} sm={6}>
                            <CustomTextBox
                                label={formatMessage({ id: "insuranceId" })}
                                name="userInfo.insuranceNumber"
                                control={control}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} md={4} sm={6}>
                            <CustomDatePicker
                                label={formatMessage({ id: "insurance-valid-from" })}
                                name="userInfo.insuranceValidFrom"
                                control={control}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} md={4} sm={6}>
                            <CustomDatePicker
                                label={formatMessage({ id: "insurance-valid-to" })}
                                name="userInfo.insuranceValidTo"
                                control={control}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} md={4} sm={6}>
                            {billUserData ? (
                                <CustomTextBox
                                    label={formatMessage({ id: "eligibility-authorization-status" })}
                                    name="userInfo.eligibilityAuthorizationStatus"
                                    control={control}
                                    disabled
                                />
                            ) : (
                                <CustomSelect
                                    label={formatMessage({ id: "eligibility-authorization-status" })}
                                    name="eligibilityAuthorizationStatus"
                                    control={control}
                                    options={eligibilityAuthorizationList}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} lg={3} md={4} sm={6}>
                            <CustomTextBox
                                label={formatMessage({ id: "reference" })}
                                name="referenceNumber"
                                control={control}
                                disabled={watch('eligibilityAuthorizationStatus')?.value !== "1" && !billUserData}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} md={4} sm={6}>
                            <CustomTextBox
                                label={formatMessage({ id: "plan-limit" })}
                                name="userInfo.planLimit"
                                control={control}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} md={4} sm={6} style={{ alignItems: "flex-end", display: "flex" }}>
                            <Link
                                component="button"
                                variant="body1"
                                color="textPrimary"
                                onClick={() => setViewDynamicCoPayModalOpen(true)}
                                style={{ marginLeft: "15px", color: "#24408E" }}
                            >{formatMessage({ id: "view-dynamic-co-pay" })}</Link>
                        </Grid>
                    </>
                )
            }

            <Grid item xs={12}>
                <div className="line" />
            </Grid>

            {loading && <HoverLoader />}

            {
                viewDynamicCoPayModalOpen && (
                    <ViewDynamiccopayCalculationModal
                        closeModal={() => setViewDynamicCoPayModalOpen(false)}
                        dynamiccopayData={dynamiccopayData}
                    />
                )
            }
        </>
    )
}

export default CreateBillUserForm;