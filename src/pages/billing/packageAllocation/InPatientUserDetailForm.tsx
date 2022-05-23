import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ControllerProps, FormProviderProps } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';

import { CustomCheckBox, CustomTextBox, SearchableTextBox } from 'components/forms';
import { HoverLoader, PopupSearchTable } from 'components';
import { createCustomCompositeFilter } from 'utils/global';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useAsyncDebounce, useToastMessage } from 'utils/hooks';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices, patientPopupColumns } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { services } from 'utils/services';

interface Props {
    control: ControllerProps["control"];
    setValue: FormProviderProps['setValue'];
    setSelectedPatientData?: React.Dispatch<React.SetStateAction<any>>;
    packageBillData?: any;
    patientId?: string | number | null;
}

const InPatientUserDetailForm = ({ setSelectedPatientData, control, setValue, packageBillData, patientId }: Props) => {
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [uhidPopupOpen, setUhidPopupOpen] = useState(false);
    const [disableUhid, setDisableUhid] = useState(false);

    const [uhidText, setUhidText] = useState("");
    const [loading, setLoading] = useState(false);

    const { wifeWithPartnerData, wifeWithPartnerDataLoading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                wifeWithPartnerData: masterPaginationReducer[masterPaginationServices.wifeWithPartner].data,
                wifeWithPartnerDataLoading: masterPaginationReducer[masterPaginationServices.wifeWithPartner].loading,
            })
        },
        shallowEqual
    );

    useEffect(() => {
        if (patientId) {
            const parms = { patientId };
            setLoading(true);
            services.getPatientWithPartnerById(parms)
                .then((res) => {
                    setLoading(false);
                    if (res.status === 200) {
                        updateFields(res.data.response);
                        if (setSelectedPatientData) {
                            setSelectedPatientData(res.data.response);
                        }
                    }
                })
                .catch(() => setLoading(false))
        }
    }, [patientId]);

    useEffect(() => {
        if (packageBillData) {
            const { patientUHID, clinicName, patientFullName, patientGenderName, patientAgeInYear, currentAge, patientPatientNote, patientIsVIP, patientTelephone,
                treatingDoctorUserDisplayName, payerInsuranceCompanyName, paymentTypeName, chnId, patientCHNId, coupleHusbandFullName, partnerName } = packageBillData;

            setValue('userInfo.uhid', patientUHID);
            setValue('userInfo.clinicName', clinicName ?? "");
            setValue('userInfo.fullNameWithTitle', patientFullName);
            setValue('userInfo.genderName', patientGenderName);
            setValue('userInfo.currentAge', patientAgeInYear || currentAge);
            setValue('userInfo.patientNote', patientPatientNote);
            setValue('userInfo.isVIP', patientIsVIP ?? false);
            setValue('userInfo.telephone', patientTelephone);
            setValue('userInfo.doctorUserDisplayName', treatingDoctorUserDisplayName);
            setValue('userInfo.payerInsuranceCompanyName', payerInsuranceCompanyName);
            setValue('userInfo.paymentTypeName', paymentTypeName);
            setValue('userInfo.partnerName', coupleHusbandFullName || partnerName);
            setValue('userInfo.chnId', chnId || patientCHNId);
        }
    }, [packageBillData]);


    function updateFields(fieldsData: any) {
        const { uhid, clinicName, fullNameWithTitle, genderName, currentAge, patientNote, wifeCouples,
            isVIP, telephone, doctorUserDisplayName, payerInsuranceCompanyName, paymentTypeName, } = fieldsData;

        setValue('userInfo.uhid', uhid);
        setValue('userInfo.clinicName', clinicName);
        setValue('userInfo.fullNameWithTitle', fullNameWithTitle);
        setValue('userInfo.genderName', genderName);
        setValue('userInfo.currentAge', currentAge);
        setValue('userInfo.patientNote', patientNote);
        setValue('userInfo.isVIP', isVIP);
        setValue('userInfo.telephone', telephone);
        setValue('userInfo.doctorUserDisplayName', doctorUserDisplayName);
        setValue('userInfo.payerInsuranceCompanyName', payerInsuranceCompanyName);
        setValue('userInfo.paymentTypeName', paymentTypeName);

        if (wifeCouples?.length) {
            const { husbandFullName, chnId } = wifeCouples[0];
            setValue('userInfo.partnerName', husbandFullName);
            setValue('userInfo.chnId', chnId);

        }
    }

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

    function onRowClick(row: any) {
        if (row.uhid) {
            if (row.isBlocked) {
                toastMessage("Patient is blocked for transaction.", "error");
            } else {
                updateFields(row);
                setUhidPopupOpen(false);
                setDisableUhid(true);
                setUhidText(row.uhid);
                if (setSelectedPatientData) {
                    setSelectedPatientData(row);
                }
            }
        }
    }

    function onReset() {
        setUhidText("");
        setDisableUhid(false);

        setValue('userInfo.uhid', null);
        setValue('userInfo.clinicName', null);
        setValue('userInfo.fullNameWithTitle', null);
        setValue('userInfo.genderName', null);
        setValue('userInfo.currentAge', null);
        setValue('userInfo.patientNote', null);
        setValue('userInfo.isVIP', null);
        setValue('userInfo.telephone', null);
        setValue('userInfo.doctorUserDisplayName', null);
        setValue('userInfo.payerInsuranceCompanyName', null);
        setValue('userInfo.paymentTypeName', null);
        setValue('userInfo.partnerName', null);
        setValue('userInfo.chnId', null);
    }

    return (
        <>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        {!packageBillData ? (
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
                                    closePopup={() => setUhidPopupOpen(false)}
                                    tableData={wifeWithPartnerData.modelItems}
                                    columns={[...patientPopupColumns(formatMessage)]}
                                    onRowClick={onRowClick}
                                    loading={wifeWithPartnerDataLoading}
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
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "couple-history-number" })}
                            control={control}
                            name="userInfo.chnId"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "clinic" })}
                            control={control}
                            name="userInfo.clinicName"
                            disabled
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={6} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "patient-name" })}
                    control={control}
                    name="userInfo.fullNameWithTitle"
                    disabled
                />
            </Grid>
            <Grid item xs={6} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "gender" })}
                    control={control}
                    name="userInfo.genderName"
                    disabled
                />
            </Grid>
            <Grid item xs={6} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "age" })}
                    control={control}
                    name="userInfo.currentAge"
                    disabled
                />
            </Grid>
            <Grid item xs={6} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "partner-name" })}
                    control={control}
                    name="userInfo.partnerName"
                    disabled
                />
            </Grid>
            <Grid item xs={9}>
                <CustomTextBox
                    label={formatMessage({ id: "patient-note" })}
                    control={control}
                    name="userInfo.patientNote"
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
            <Grid item xs={6} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "mobile" })}
                    control={control}
                    name="userInfo.telephone"
                    disabled
                />
            </Grid>
            <Grid item xs={6} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "treating-doctor" })}
                    control={control}
                    name="userInfo.doctorUserDisplayName"
                    disabled
                />
            </Grid>
            {/* <Grid item xs={6} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "client-type" })}
                    control={control}
                    name="userInfo.paymentTypeId"
                    disabled
                    options={paymen}
                />
            </Grid> */}
            <Grid item xs={6} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "payer-name" })}
                    control={control}
                    name="userInfo.payerInsuranceCompanyName"
                    disabled
                />
            </Grid>

            {loading && <HoverLoader />}
        </>
    )
};

export default InPatientUserDetailForm;