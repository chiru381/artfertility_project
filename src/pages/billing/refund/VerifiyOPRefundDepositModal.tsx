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
import { FormPrimaryHeading } from 'components/forms';
import BillingUserDetailForm from '../OutPatientBill/BillingUserDetailForm';
import BillRefundMode from '../BillRefundMode';
import { services } from 'utils/services';
import { HoverLoader } from 'components';
import { useToastMessage } from 'utils/hooks';
import { floatNumConv } from 'utils/global';

interface Props {
    closeModal: () => void;
    selectedRow: any;
    onApiCall: () => void;
}

const VerifiyOPRefundDepositModal = React.memo((props: Props) => {
    const { closeModal, selectedRow, onApiCall } = props;
    const { formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [loading, setLoading] = useState(false);
    const [patientBillingData, setPatientBillingData] = useState<any>(null);

    const patientTransactionData = patientBillingData?.patientsTransactionData?.[0];
    let totalDepositAmount = patientTransactionData?.totalDepositAmount ?? 0;
    let balanceDepositAmount = patientTransactionData?.balanceDepositAmount ?? 0;
    let refundAmount = selectedRow.refundAmount;
    let refundData = selectedRow?.paymentBreakups?.[0] ?? null;

    useEffect(() => {
        let patientId = selectedRow.patientId;
        if (patientId) {
            setLoading(true);
            services.getOPBillDetailByPatientId({ patientId })
                .then(res => {
                    setLoading(false);
                    if (res.data.succeeded) {
                        if (res.data.modelItems?.[0]) {
                            setPatientBillingData(res.data.modelItems?.[0]);
                        }
                    }
                })
                .catch(() => setLoading(true))
        }
    }, []);


    function onSubmit(refundFlag: number) {

        let params = {
            refundType: 1,
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
                                label={formatMessage({ id: "refund-against-opd-deposit" })}
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
                                    onClick={closeModal}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>

                                <BillingUserDetailForm
                                    control={control}
                                    setValue={setValue}
                                    billingData={patientBillingData}
                                />

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>

                                <Grid item xs={12}>
                                    <div className="flex-center">
                                        <div className="flex-center" style={{ marginRight: "30px" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'total-deposited' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{totalDepositAmount}</Typography>
                                        </div>

                                        <div className="flex-center">
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'consumed-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{totalDepositAmount - balanceDepositAmount}</Typography>
                                        </div>
                                    </div>
                                </Grid>

                                <Grid item xs={12}>
                                    <div className="flex-center">
                                        <div className="flex-center" style={{ marginRight: "30px" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'available-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{floatNumConv(balanceDepositAmount)}</Typography>
                                        </div>

                                        <div className="flex-center">
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'refund-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{floatNumConv(refundAmount)}</Typography>
                                        </div>
                                    </div>
                                </Grid>

                                {refundData && (
                                    <BillRefundMode
                                        watch={watch}
                                        setValue={setValue}
                                        control={control}
                                        errors={errors}
                                        refundData={refundData}
                                    />
                                )}

                            </Grid>
                        </div>

                    </Box>
                </div>

                {loading && <HoverLoader />}

            </>
        </Modal>
    )
});

export default VerifiyOPRefundDepositModal;