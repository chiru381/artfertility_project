import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Receipt from '@material-ui/icons/Receipt';
import Print from '@material-ui/icons/Print';
import Typography from '@material-ui/core/Typography';

import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { FormPrimaryHeading } from 'components/forms';
import BillingPaymentMode from '../BillingPaymentMode';
import { getFormBody } from 'utils/global';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { CustomDialog, HoverLoader } from 'components';

interface Props {
    closeModal: () => void;
    formBodyData?: any;
    closeParentModal?: () => void;
}

const PackageSettlementPaymentModal = React.memo((props: Props) => {
    const { closeModal, formBodyData, closeParentModal } = props;
    const { handleSubmit, formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    let patientPayableAmount = formBodyData.patientPayableAmount;

    const [billingBodyData, setBillingBodyData] = useState<any>(null);
    const [paymentDueAmount, setPaymentDueAmount] = useState<null | number>(null);
    const [loading, setLoading] = useState(false);

    function onSubmit({ paymentBreakups }: any) {
        let totalPayment = 0;
        let billingBodyData = {
            paymentBreakups: paymentBreakups.map((payment: any) => {
                totalPayment += +payment.amount;
                return ({ ...getFormBody(payment, true), amount: +payment.amount });
            }),
            ...formBodyData
        }

        if (totalPayment < patientPayableAmount) {
            let dueAmount = patientPayableAmount - totalPayment;
            setPaymentDueAmount(dueAmount);
            billingBodyData = {
                ...billingBodyData,
                balanceAmount: dueAmount
            }
        } else if (totalPayment > patientPayableAmount) {
            toastMessage("payment is more than patient payable amount.", "error");
        } else {
            createBill(billingBodyData);
        }
        setBillingBodyData(billingBodyData);
    }


    function createBill(billingBodyData: any) {
        setLoading(true);
        services.createInPatientPackageSettlement(billingBodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "insert-message" }));
                    closeModal();
                    if (closeParentModal) {
                        closeParentModal();
                    }
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function onAgreeDue() {
        setPaymentDueAmount(null);
        createBill(billingBodyData);
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={formatMessage({ id: "payment" })} />

                            <ButtonGroup>
                                <PrimaryButton
                                    label="Generate Receipt"
                                    endIcon={<Receipt />}
                                    onClick={handleSubmit(onSubmit)}
                                />

                                {/* <PrimaryButton
                                    label="Print Duplicate Bill"
                                    endIcon={<Print />}
                                /> */}

                                <SecondaryButton
                                    label="Cancel"
                                    onClick={closeModal}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <div className="flex-center" style={{ marginRight: "30px" }}>
                                        <Typography variant="body1" className="label-one uppercase">
                                            {formatMessage({ id: 'amount-to-be-recevied' })}:
                                        </Typography>
                                        <Typography variant="body1" className="label-input">{patientPayableAmount}</Typography>
                                    </div>
                                </Grid>

                                <BillingPaymentMode
                                    control={control}
                                    watch={watch}
                                    errors={errors}
                                    setValue={setValue}
                                    billAmount={patientPayableAmount}
                                />

                            </Grid>
                        </div>

                    </Box>
                </div>

                <CustomDialog
                    open={paymentDueAmount ? true : false}
                    onDisagree={() => {
                        setPaymentDueAmount(null);
                        setBillingBodyData(null);
                    }}
                    onAgree={onAgreeDue}
                    title={formatMessage({ id: "payment-due-alert" })}
                    subTitle={`Due you want to create due bill?`}
                />

                {loading && <HoverLoader />}
            </>
        </Modal>
    )
});

export default PackageSettlementPaymentModal;