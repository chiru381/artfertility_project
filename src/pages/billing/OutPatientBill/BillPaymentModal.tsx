import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';

import { billPaymentFields, transactionType } from 'utils/constants';
import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { CustomTextBox, FormPrimaryHeading } from 'components/forms';
import BillingPaymentMode from '../BillingPaymentMode';
import { getFormBody } from 'utils/global';
import { Receipt } from '@material-ui/icons';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { CustomDialog, HoverLoader } from 'components';

interface Props {
    closeModal: () => void;
    closeParentModal?: () => void;
    formBodyData?: any;
    onApiCall?: () => void;
}

const BillPaymentModal = React.memo((props: Props) => {
    const { closeModal, formBodyData, closeParentModal, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control, watch, setValue, getValues } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);

    const [paymentDueAmount, setPaymentDueAmount] = useState<null | number>(null);
    const [billingBodyData, setBillingBodyData] = useState<any>(null);

    const { billAmount, discountAmount, depositAmountAvail, dueSettlement, id } = formBodyData;
    let netAmount = dueSettlement ?? (billAmount - discountAmount - (depositAmountAvail ?? 0));

    useEffect(() => {
        if (formBodyData) {
            setValue('billAmount', billAmount);
            setValue('discountAmount', discountAmount);
            setValue('patientPayableAmount', netAmount);
        }
    }, [formBodyData]);

    function onSubmit({ paymentBreakups }: any) {
        let totalPayment = 0;
        let billingBodyData = {
            paymentBreakups: paymentBreakups.map((payment: any) => {
                totalPayment += +payment.amount;
                return ({ ...getFormBody(payment, true), amount: +payment.amount });
            }),
            ...formBodyData,
            balanceAmount: 0
        }

        if (totalPayment < netAmount) {
            let dueAmount = netAmount - totalPayment;
            setPaymentDueAmount(dueAmount);
            billingBodyData = {
                ...billingBodyData,
                balanceAmount: dueAmount
            }
        } else if (totalPayment > netAmount) {
            toastMessage("payment is more than patient payable amount.", "error");
        } else {
            createBill(billingBodyData);
        }
        setBillingBodyData(billingBodyData);
    }

    function createBill(billingBodyData: any) {
        // create/update bill payment and settle op bill cash
        let OPBillPaymentService = services[(dueSettlement ? 'settleCashOPBill' : id ? 'updateOPBill' : 'createOPBill') as keyof typeof services];

        setLoading(true);
        OPBillPaymentService(billingBodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "insert-message" }));
                    closeModal();
                    if (closeParentModal) {
                        closeParentModal();
                    }
                    if (onApiCall) {
                        onApiCall();
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

    function onDuePayment({ paymentBreakups }: any) {
        const { billAmount, discountAmount, ...rest } = formBodyData;
        let totalPayment = 0;
        let billingBodyData = {
            paymentBreakups: paymentBreakups.map((payment: any) => {
                totalPayment += +payment.amount;
                return ({ ...getFormBody(payment, true), amount: +payment.amount });
            }),
            ...rest
        }

        if (totalPayment > dueSettlement) {
            toastMessage("payment is more than patient payable amount.", "error");
        } else if (totalPayment < dueSettlement) {
            toastMessage("payment is less than patient payable amount.", "error");
        } else {
            // cash due settlement service
            createBill(billingBodyData);
        }
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={formatMessage({ id: "payment" })} />

                            <ButtonGroup>
                                {/* <ReceiptInvoice />

                                <PrimaryButton
                                    label="Print Duplicate Bill"
                                    endIcon={<Print />}
                                    onClick={handleSubmit(onSubmit)}
                                /> */}
                                <PrimaryButton
                                    label="Create Bill"
                                    endIcon={<Receipt />}
                                    onClick={handleSubmit(data => dueSettlement ? onDuePayment(data) : onSubmit(data))}
                                />

                                <SecondaryButton
                                    label="Cancel"
                                    onClick={closeModal}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>

                                <BillingPaymentMode
                                    control={control}
                                    watch={watch}
                                    errors={errors}
                                    setValue={setValue}
                                    billAmount={netAmount}
                                    getValues={getValues}
                                    transactionType={transactionType[dueSettlement ? 'OPBillSettlement' : 'OutPatientBill']}
                                />

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>

                                {billPaymentFields.map((fields, index) => (
                                    <Grid key={index} item xs={6} lg={3} md={4} sm={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: fields.label })}
                                            name={fields.name}
                                            control={control}
                                            disabled
                                        />
                                    </Grid>
                                ))}

                            </Grid>
                        </div>

                    </Box>
                </div>

                {loading && <HoverLoader />}

                <CustomDialog
                    open={paymentDueAmount ? true : false}
                    onDisagree={() => {
                        setPaymentDueAmount(null);
                        setBillingBodyData(null);
                    }}
                    onAgree={onAgreeDue}
                    title={formatMessage({ id: "payment-due-alert" })}
                    subTitle={`Do you want to create due bill?`}
                />
            </>
        </Modal>
    )
});

export default BillPaymentModal;