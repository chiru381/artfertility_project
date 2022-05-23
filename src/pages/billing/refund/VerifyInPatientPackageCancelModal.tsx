import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';

import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { CustomTextBox, FormPrimaryHeading } from 'components/forms';
import SubventionAndFacilitatorView from "../packageAllocation/SubventionAndFacilitatorView";
import BillRefundMode from '../BillRefundMode';
import { services } from 'utils/services';
import InPatientUserDetailForm from '../packageAllocation/InPatientUserDetailForm';
import { useToastMessage } from 'utils/hooks';
import { HoverLoader } from 'components';

interface Props {
    closeModal: () => void;
    selectedRow?: any;
    onApiCall: () => void;
}

const VerifyInPatientPackageCancelModal = React.memo((props: Props) => {
    const { closeModal, selectedRow, onApiCall } = props;
    const { formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);
    const [packageBillData, setPackageBillData] = useState<any>(null);
    const [refundData, setRefundData] = useState<any>(null);

    let refundPaymentDataData = selectedRow?.paymentBreakups?.[0] ?? null;

    useEffect(() => {
        if (selectedRow?.id) {
            let params = { packageAllocationId: +selectedRow.id };
            setLoading(true);
            services.getPackageBillById(params)
                .then(res => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setPackageBillData(res.data.response);
                        const { packageName, stageName, stageCycleName } = res.data.response;
                        setValue("packageName", packageName);
                        setValue("stageName", stageName);
                        setValue("cycleName", stageCycleName);
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch(() => setLoading(false))
        }
    }, []);

    useEffect(() => {
        let stageId = packageBillData?.stageId;
        if (stageId) {
            let params = {
                packageAllocationId: packageBillData.id,
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
    }, [packageBillData])

    function onSubmit(refundFlag: number) {
        let params = {
            refundType: 3,
            refundFlag,
            refundId: selectedRow.id,
            remarks: refundFlag === 2 ? "Approved" : "Rejected"
        }

        setLoading(true);
        services.updateRefundApprovalReject(params)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage("OP Refund Success");
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
                                label={formatMessage({ id: "refund-against-package-deposit" })}
                            />

                            <ButtonGroup>
                                <PrimaryButton
                                    label={formatMessage({ id: "approve" })}
                                    endIcon={<Check />}
                                    onClick={() => onSubmit(2)}
                                />

                                <PrimaryButton
                                    label={formatMessage({ id: "reject" })}
                                    endIcon={<Close />}
                                    onClick={() => onSubmit(3)}
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
                                    <CustomTextBox
                                        label={formatMessage({ id: "package" })}
                                        control={control}
                                        name="packageName"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "stages" })}
                                        control={control}
                                        name="stageName"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "cycle" })}
                                        control={control}
                                        name="cycleName"
                                        disabled
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
                                                {formatMessage({ id: 'refund-amount' })}:
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
                                    refundData={refundPaymentDataData}
                                />

                            </Grid>
                        </div>

                    </Box>
                </div>

                {loading && <HoverLoader />}

            </>
        </Modal>
    )
});

export default VerifyInPatientPackageCancelModal;