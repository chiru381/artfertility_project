import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ControllerProps, FormProviderProps } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';

import { CustomCheckBox, CustomTextBox, SearchableTextBox } from 'components/forms';
import { services } from 'utils/services';
import { HoverLoader, PopupSearchTable } from 'components';
import { createCustomCompositeFilter } from 'utils/global';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useAsyncDebounce } from 'utils/hooks';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices, patientPopupColumns } from 'utils/constants';
import { RootReducerState } from 'utils/types';

interface Props {
    control: ControllerProps["control"];
    setValue: FormProviderProps['setValue'];
    patientId?: string | number | null;
    setSelectedPatientData?: React.Dispatch<React.SetStateAction<any>>;
    billingData?: any;
}

const BillingUserDetailForm = ({ patientId, setSelectedPatientData, control, setValue, billingData }: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [uhidPopupOpen, setUhidPopupOpen] = useState(false);
    const [disableUhid, setDisableUhid] = useState(false);

    const [uhidText, setUhidText] = useState("");

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
        if (billingData) {
            const { patientName, fullName, ageInYear: currentAge, patientNotes, patientNote, referringDoctorName,
                doctorUserDisplayName, chnId, partnerName, coupleHusbandFullName } = billingData;
            let formsData = {
                ...billingData,
                fullName: fullName || patientName,
                currentAge,
                patientNote: patientNote || patientNotes,
                doctorUserDisplayName: doctorUserDisplayName || referringDoctorName,
                chnId,
                partnerName: coupleHusbandFullName || partnerName
            }
            updateFormsField(formsData);
        }
    }, [billingData])

    function updateFields(fieldsData: any) {
        const { wifeCouples } = fieldsData;
        let formsData = {
            ...fieldsData,
            chnId: wifeCouples?.[0]?.chnId,
            partnerName: wifeCouples?.[0]?.partnerName,
        }
        updateFormsField(formsData);
    }

    function updateFormsField(fieldsData: any) {
        const { uhid, clinicName, fullName, genderName, currentAge, patientNote, isVIP, telephone,
            doctorUserDisplayName, payerInsuranceCompanyName, paymentTypeName, chnId, partnerName } = fieldsData;

        setValue('userInfo.uhid', uhid);
        setValue('userInfo.clinicName', clinicName);
        setValue('userInfo.fullName', fullName);
        setValue('userInfo.genderName', genderName);
        setValue('userInfo.currentAge', currentAge);
        setValue('userInfo.patientNote', patientNote);
        setValue('userInfo.isVIP', isVIP);
        setValue('userInfo.telephone', telephone);
        setValue('userInfo.doctorUserDisplayName', doctorUserDisplayName);
        setValue('userInfo.payerInsuranceCompanyName', payerInsuranceCompanyName);
        setValue('userInfo.paymentTypeName', paymentTypeName);

        if (chnId) {
            setValue('userInfo.chn', chnId);
            setValue('userInfo.partnerName', partnerName);
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
            updateFields(row);
            setUhidPopupOpen(false);
            setDisableUhid(true);
            setUhidText(row.uhid);
            if (setSelectedPatientData) {
                setSelectedPatientData(row);
            }
        }
    }

    return (
        <>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        {!(patientId || billingData) ? (
                            <>
                                <SearchableTextBox
                                    label={formatMessage({ id: "uhid" })}
                                    value={uhidText}
                                    onChange={e => {
                                        setUhidText(e.target.value);
                                        onChangeValue(e.target.value);
                                    }}
                                    onFocus={onFocus}
                                    onCancel={() => {
                                        setUhidText("");
                                        onApiCall("");
                                        setDisableUhid(false);
                                    }}
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
                    name="userInfo.fullName"
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
            <Grid item xs={6} lg={3} md={4} sm={6}>
                <CustomTextBox
                    label={formatMessage({ id: "client-type" })}
                    control={control}
                    name="userInfo.paymentTypeName"
                    disabled
                />
            </Grid>
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

export default BillingUserDetailForm;