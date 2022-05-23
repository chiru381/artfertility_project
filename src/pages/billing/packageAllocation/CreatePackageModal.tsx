import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Check from '@material-ui/icons/Check';

import { RootReducerState } from 'utils/types';
import { masterPaginationServices } from 'utils/constants';
import { useCreateDropdownOptions, useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { CustomCheckBox, CustomSelect, CustomTextBox, FormPrimaryHeading } from 'components/forms';
import { getMasterPaginationData } from 'redux/actions';
import { getFormBody, removeNullFromObject } from 'utils/global';
import { services } from 'utils/services';
import { HoverLoader } from 'components';
import InPatientUserDetailForm from './InPatientUserDetailForm';

interface Props {
    closeModal: () => void;
    selectedPackageBill?: any;
    onApiCall?: (status: boolean) => void;
    patientId?: string | number | null;
}


const CreatePackageModal = React.memo((props: Props) => {
    const { closeModal, selectedPackageBill, onApiCall, patientId } = props;
    const { handleSubmit, formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();

    const [packageBillData, setPackageBillData] = useState<any>(null);
    const [selectedPatient, setSelectedPatientData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const { packageData, facilitatorData, billingLookupData } = useSelector(
        ({ masterPaginationReducer, billingLookupReducer }: RootReducerState) => {
            return ({
                packageData: masterPaginationReducer[masterPaginationServices.package].data,
                facilitatorData: masterPaginationReducer[masterPaginationServices.facilitator].data,
                billingLookupData: billingLookupReducer.data,
            })
        },
        shallowEqual
    );
    let packageOptions = useCreateDropdownOptions(packageData.modelItems);
    let facilitatorOptions = useCreateDropdownOptions(facilitatorData.modelItems);
    let selectOptions = useCreateLookupOptions(billingLookupData);

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.package, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.facilitator, {}));
    }, []);

    useEffect(() => {
        if (selectedPackageBill && packageOptions.length && Object.keys(billingLookupData).length) {
            let params = { packageAllocationId: +selectedPackageBill.id };
            setLoading(true);
            services.getPackageBillById(params)
                .then(res => {
                    setLoading(false);
                    setPackageBillData(res.data.response);
                    updateFields(res.data.response);
                })
                .catch(() => setLoading(false))
        }
    }, [packageOptions.length, billingLookupData]);

    useEffect(() => {
        let packageId = watch('packageId')?.value;
        if (packageId) {
            let selectedPackage = packageData.modelItems.find((p: any) => p.id === +packageId);
            setValue('packageAmount', selectedPackage.packageCost);
        }
    }, [watch('packageId')]);

    useEffect(() => {
        let facilitatorId = watch('facilitatorId')?.value;
        if (facilitatorId) {
            let selectedFacilitator = facilitatorData.modelItems.find((p: any) => p.id === +facilitatorId);
            setValue('facilitatorPercentage', selectedFacilitator.facilitatorPercentage);
            setValue('facilitatorAmount', selectedFacilitator.facilitatorAmount);
        }
    }, [watch('facilitatorId')]);

    function updateFields(data: any) {
        const { isSubvention, isFacilitator, merchantId, merchantName, emiSchemeId, emiSchemeName, packageId, packageName, facilitatorId, facilitatorName } = data;
        let selectedMerchant = { label: merchantName, value: String(merchantId) };
        let selectedEmiScheme = { label: emiSchemeName, value: String(emiSchemeId) };
        let selectedPackage = { label: packageName, value: packageId };
        let selectedFacilitator = { label: facilitatorName, value: facilitatorId };

        setValue("isSubvention", isSubvention);
        setValue("isFacilitator", isFacilitator);
        setValue("merchantId", selectedMerchant);
        setValue("emiSchemeId", selectedEmiScheme);
        setValue("packageId", selectedPackage);
        setValue("facilitatorId", selectedFacilitator);
    }

    function onSubmit({ userInfo, ...rest }: any) {
        let bodyData = {
            ...getFormBody(rest),
        };

        if (selectedPackageBill) {
            let { patientId, patientPaymentTypeId: paymentTypeId, clinicId, treatingDoctorId, coupleId, stageId } = packageBillData;
            bodyData = {
                ...bodyData,
                patientId, paymentTypeId, clinicId, treatingDoctorId,
                isPackageCancel: false,
                isPackageSettled: false,
                stageId,
                coupleId: coupleId ? coupleId : null
            }
        } else {
            let { id: patientId, paymentTypeId, clinicId, doctorId: treatingDoctorId, wifeCouples } = selectedPatient;
            bodyData = {
                ...bodyData,
                patientId, paymentTypeId, clinicId, treatingDoctorId,
                isPackageCancel: false,
                isPackageSettled: false,
                stageId: packageData.modelItems.find((p: any) => p.id === +bodyData.packageId).stageId,
                coupleId: wifeCouples?.[0]?.id ?? null
            }
        }

        setLoading(true);
        let patientService = services[(selectedPackageBill ? 'updatePackageBill' : 'createPackageBill') as keyof typeof services];
        let packageFormData = selectedPackageBill ? { ...bodyData, id: selectedPackageBill.id } : bodyData
        patientService(removeNullFromObject(packageFormData))
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: selectedPackageBill ? "update-package-bill-message" : "create-package-bill-message" }));
                    if (onApiCall) {
                        onApiCall(selectedPackageBill ? false : true);
                    }
                    closeModal();
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading
                                textTransform="uppercase"
                                label={formatMessage({ id: "package-allocation" })}
                            />

                            <ButtonGroup>
                                <PrimaryButton
                                    label={formatMessage({ id: selectedPackageBill ? "update" : "assign" })}
                                    endIcon={<Check />}
                                    onClick={handleSubmit(onSubmit)}
                                />

                                <SecondaryButton
                                    label={formatMessage({ id: "cancel" })}
                                    onClick={() => {
                                        closeModal();
                                    }}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>

                                <InPatientUserDetailForm
                                    control={control}
                                    setValue={setValue}
                                    setSelectedPatientData={setSelectedPatientData}
                                    packageBillData={packageBillData}
                                    patientId={patientId}
                                />

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>

                                <Grid item xs={12}>
                                    <CustomCheckBox
                                        label="Is Subvention package"
                                        control={control}
                                        name="isSubvention"
                                    />
                                    <CustomCheckBox
                                        label="Is Facilitator"
                                        control={control}
                                        name="isFacilitator"
                                    />
                                </Grid>

                                {watch("isSubvention") && (
                                    <Grid item xs={12}>
                                        <div style={{ background: "#F9F9F9", borderRadius: "7px", padding: "20px", border: "1px solid #EEEEEE" }}>
                                            <Typography style={{ marginBottom: "10px" }} variant="body1" className="label-one bold">
                                                <FormattedMessage id="subvention-package" />
                                            </Typography>

                                            <Grid container spacing={3}>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <CustomSelect
                                                        label={formatMessage({ id: "merchant" })}
                                                        options={selectOptions?.merchants ?? []}
                                                        control={control}
                                                        name="merchantId"
                                                        error={errors.merchantId}
                                                        rules={{ required: true }}
                                                        disableClearable
                                                    />
                                                </Grid>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <CustomSelect
                                                        label={formatMessage({ id: "emi-scheme" })}
                                                        options={selectOptions?.emiSchemes ?? []}
                                                        control={control}
                                                        name="emiSchemeId"
                                                        error={errors.emiSchemeId}
                                                        rules={{ required: true }}
                                                        disableClearable
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>
                                )}

                                {watch("isFacilitator") && (
                                    <Grid item xs={12}>
                                        <div style={{ background: "#F9F9F9", borderRadius: "7px", padding: "20px", border: "1px solid #EEEEEE" }}>
                                            <Typography style={{ marginBottom: "10px" }} variant="body1" className="label-one bold">
                                                <FormattedMessage id="facilitator-details" />
                                            </Typography>

                                            <Grid container spacing={3}>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <CustomSelect
                                                        options={facilitatorOptions}
                                                        label={formatMessage({ id: "facilitator" })}
                                                        control={control}
                                                        name="facilitatorId"
                                                        error={errors.facilitatorId}
                                                        rules={{ required: true }}
                                                        disableClearable
                                                    />
                                                </Grid>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "facilitator" }) + " %"}
                                                        control={control}
                                                        name="facilitatorPercentage"
                                                        InputProps={{ readOnly: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "facilitator-amount" })}
                                                        control={control}
                                                        name="facilitatorAmount"
                                                        InputProps={{ readOnly: true }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>

                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        label={formatMessage({ id: "package" })}
                                        options={packageOptions}
                                        control={control}
                                        name="packageId"
                                        error={errors.packageId}
                                        rules={{ required: true }}
                                        disableClearable
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "amount" })}
                                        control={control}
                                        name="packageAmount"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>

                            </Grid>
                        </div>

                    </Box>
                </div>

                {loading && <HoverLoader />}
            </>
        </Modal>
    )
});

export default CreatePackageModal;