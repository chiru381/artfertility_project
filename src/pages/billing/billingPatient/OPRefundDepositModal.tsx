import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import { buttonIconStyle, images, transactionType } from 'utils/constants';
import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { CustomTextBox, FormPrimaryHeading } from 'components/forms';
import BillingUserDetailForm from '../OutPatientBill/BillingUserDetailForm';
import BillRefundMode from '../BillRefundMode';
import { HoverLoader } from 'components';

import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { validationRule } from 'utils/global';

interface Props {
    closeModal: () => void;
    patientId: number;
}

const OPRefundDepositModal = React.memo((props: Props) => {
    const { closeModal, patientId } = props;
    const { handleSubmit, formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [patientBillingData, setPatientBillingData] = useState<any>(null);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const patientTransactionData = patientBillingData?.patientsTransactionData?.[0];
    let totalDepositAmount = patientTransactionData?.totalDepositAmount ?? 0;
    let balanceDepositAmount = patientTransactionData?.balanceDepositAmount ?? 0;

    useEffect(() => {
        if (balanceDepositAmount) {
            setValue("refundableAmount", balanceDepositAmount);
        }
    }, [balanceDepositAmount]);

    useEffect(() => {
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

    function onSubmit(data: any) {
        const { paymentModeId, payableName, remarks, cardNumber, issueDate, IFSCCode, refundableAmount, refundRemarks } = data;
        const { id: patientId, uhid: patientUHID, clinicId } = selectedPatient;

        let paymentBreakups: any = {
            transactionType: transactionType.DepositRefund,
            amount: +refundableAmount,
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
            patientId, patientUHID, clinicId, refundAmount: +refundableAmount,
            "refundStatus": 1, refundRemarks,
            paymentBreakups: [paymentBreakups]
        }

        setLoading(true);
        services.createOPRefund(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage("OP Refund Success");
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
                                label={formatMessage({ id: "op-refund-deposit" })}
                            />

                            <ButtonGroup>
                                <SecondaryButton
                                    label={formatMessage({ id: "cancel" })}
                                    onClick={closeModal}
                                />

                                <PrimaryButton
                                    label={formatMessage({ id: "sent-to-finance" })}
                                    endIcon={<img src={images.sentIcon} style={buttonIconStyle} alt="sent-to-finance" />}
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!watch('refundableAmount')}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>

                                <BillingUserDetailForm
                                    control={control}
                                    setValue={setValue}
                                    patientId={patientId}
                                    setSelectedPatientData={setSelectedPatient}
                                />

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>

                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "remarks" })}
                                        control={control}
                                        name="refundRemarks"
                                        error={errors.refundRemarks}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <div className="flex-center flex-wrap">
                                        <div className="flex-center" style={{ marginRight: "30px" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'deposited-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{totalDepositAmount}</Typography>
                                        </div>

                                        <div className="flex-center" style={{ marginRight: "30px" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'balance-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{balanceDepositAmount}</Typography>
                                        </div>

                                        <div className="flex-center">
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'refundable-amount' })}:
                                            </Typography>
                                            <CustomTextBox
                                                control={control}
                                                name="refundableAmount"
                                                error={errors.refundableAmount}
                                                type="number"
                                                rules={{
                                                    ...validationRule.textbox({ type: "numberWithDecimal" }),
                                                    validate: value => balanceDepositAmount >= value || "amout is greater than balance amount."
                                                }}
                                                containerStyle={{ width: "180px", marginLeft: "20px" }}
                                            />
                                        </div>
                                    </div>
                                </Grid>

                                <BillRefundMode
                                    setValue={setValue}
                                    control={control}
                                    watch={watch}
                                    errors={errors}
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

export default OPRefundDepositModal;