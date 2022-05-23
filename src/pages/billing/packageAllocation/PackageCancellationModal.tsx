import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { CustomSelect, CustomTextBox, FormPrimaryHeading } from 'components/forms';
import SubventionAndFacilitatorView from "./SubventionAndFacilitatorView";
import BillRefundMode from '../BillRefundMode';
import { buttonIconStyle, images, masterPaginationServices, transactionType } from 'utils/constants';
import { CustomDialog, HoverLoader } from 'components';
import { services } from 'utils/services';
import InPatientUserDetailForm from './InPatientUserDetailForm';
import { RootReducerState } from 'utils/types';
import { useCreateDropdownOptions, useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { getMasterPaginationData } from 'redux/actions';

interface Props {
    closeModal: () => void;
    selectedPackageBill?: any;
    onApiCall: () => void;
}

const PackageCancellationModal = React.memo((props: Props) => {
    const { closeModal, selectedPackageBill, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();

    const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false);
    const [packageBillData, setPackageBillData] = useState<any>(null);
    const [refundData, setRefundData] = useState<any>(null);
    const [formBodyData, setFormBodyData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { stageData, stageDataLoading, billingLookupData } = useSelector(
        ({ masterPaginationReducer, billingLookupReducer }: RootReducerState) => {
            return ({
                stageData: masterPaginationReducer[masterPaginationServices.stage].data,
                stageDataLoading: masterPaginationReducer[masterPaginationServices.stage].loading,
                billingLookupData: billingLookupReducer.data
            })
        },
        shallowEqual
    );
    let stageOptions = useCreateDropdownOptions(stageData.modelItems);
    let selectOptions = useCreateLookupOptions(billingLookupData);

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.stage, {}));

        if (selectedPackageBill) {
            setValue('packageName', selectedPackageBill.packageName);

            let params = { packageAllocationId: +selectedPackageBill.id };
            setLoading(true);
            services.getPackageBillById(params)
                .then(res => {
                    setLoading(false);
                    setPackageBillData(res.data.response);
                    const { stageId, stageName, stageCycleName } = res.data.response;
                    setValue("stageId", { label: stageName, value: stageId });
                    setValue("cycleName", stageCycleName);
                })
                .catch(() => setLoading(false))
        }
    }, []);

    useEffect(() => {
        let stageId = watch('stageId')?.value;
        if (stageId) {
            let params = {
                packageAllocationId: selectedPackageBill.id,
                stageId: + stageId
            }
            setLoading(true);
            services.getInPatientRefundAmount(params)
                .then(res => {
                    setLoading(false);
                    setRefundData(res.data.response);
                })
                .catch(() => setLoading(false))
        }
    }, [watch('stageId')])

    function onAgree() {
        setCancelConfirmationOpen(false);
        cancelInPatientPackageBill();
    }

    function onChangeStage(data: any) {
        let selectedStage = stageData.modelItems.find((stage: any) => stage.id === data.value);
        if (selectedStage) {
            setValue("cycleName", selectedStage.cycleName);
        }
    }

    function onSubmit(data: any) {
        const { paymentModeId, payableName, remarks, cardNumber, issueDate, IFSCCode, stageId, refundReasonId } = data;

        let paymentBreakups: any = {
            transactionType: transactionType.PackageCancel,
            amount: +refundData.refundAmount,
            paymentModeId: +paymentModeId
        }

        if (paymentModeId !== "1") {
            paymentBreakups = {
                ...paymentBreakups,
                payableName, remarks, cardNumber, issueDate
            }
        }

        if (paymentModeId === "4") {
            paymentBreakups = {
                ...paymentBreakups,
                IFSCCode
            }
        }

        let bodyData = {
            "refundStatus": 1,
            paymentBreakups: [paymentBreakups],
            refundPercentage: refundData?.refundPercentage,
            refundAmount: refundData?.refundAmount,
            relisationAmount: refundData?.relisationAmount,
            discountAmount: refundData?.discountAmount,
            unusedPkgamount: refundData?.unusedPkgamount,
            id: selectedPackageBill.id,
            packageAllocationId: selectedPackageBill.id,
            stageId: +stageId.value,
            refundReasonId: +refundReasonId.value,
            remarks: refundReasonId.label,
        }
        setFormBodyData(bodyData);
        setCancelConfirmationOpen(true);
    }

    function cancelInPatientPackageBill() {
        setLoading(true);
        services.createInPatientPackageCancellation(formBodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage("Package Bill Cancelled.");
                    closeModal();
                    onApiCall();
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
                                label={formatMessage({ id: "package-cancellation" })}
                            />

                            <ButtonGroup>
                                <PrimaryButton
                                    label={formatMessage({ id: "send-to-finance" })}
                                    endIcon={<img src={images.sentIcon} style={buttonIconStyle} alt="sent-to-finance" />}
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!refundData?.refundAmount || refundData?.refundAmount < 0}
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
                                    packageBillData={packageBillData}
                                />

                                <SubventionAndFacilitatorView
                                    control={control}
                                    watch={watch}
                                    setValue={setValue}
                                    packageBillData={packageBillData}
                                />

                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        label={formatMessage({ id: "refund-reason" })}
                                        options={selectOptions?.refundReasons ?? []}
                                        control={control}
                                        name="refundReasonId"
                                        error={errors.refundReasonId}
                                        rules={{ required: true }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>

                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "package" })}
                                        control={control}
                                        name="packageName"
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        label={formatMessage({ id: "stages" })}
                                        control={control}
                                        name="stageId"
                                        error={errors.stageId}
                                        rules={{ required: true }}
                                        options={stageOptions}
                                        disableClearable
                                        onChangeValue={data => onChangeStage(data)}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "cycle" })}
                                        control={control}
                                        name="cycleName"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <div className="flex-center" style={{ flexWrap: "wrap" }}>
                                        <div className="flex-center" style={{ margin: "5px 30px 5px 0" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'package-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{refundData?.packageAmount}</Typography>
                                        </div>

                                        <div className="flex-center" style={{ margin: "5px 30px 5px 0" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'deposited-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{refundData?.totalDepositAmount}</Typography>
                                        </div>

                                        <div className="flex-center" style={{ margin: "5px 30px 5px 0" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'refund' })}%:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{refundData?.refundPercentage}</Typography>
                                        </div>


                                        <div className="flex-center" style={{ margin: "5px 0" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'total-refund' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{refundData?.refundAmount}</Typography>
                                        </div>
                                    </div>
                                </Grid>

                                <BillRefundMode
                                    watch={watch}
                                    setValue={setValue}
                                    control={control}
                                    errors={errors}
                                />

                            </Grid>
                        </div>

                    </Box>
                </div>

                <CustomDialog
                    open={cancelConfirmationOpen}
                    onDisagree={() => setCancelConfirmationOpen(false)}
                    onAgree={onAgree}
                    title={formatMessage({ id: "cancel-package" })}
                    subTitle={formatMessage({ id: "cancel-package-subtitle" })}
                />

                {(loading || stageDataLoading) && <HoverLoader />}
            </>
        </Modal>
    )
});

export default PackageCancellationModal;