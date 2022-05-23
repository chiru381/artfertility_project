import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { CustomTextBox, FormPrimaryHeading } from 'components/forms';
import BillRefundMode from '../BillRefundMode';
import BillingUserDetailForm from '../OutPatientBill/BillingUserDetailForm';
import { useCalculateOPBillServiceItem, useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { HoverLoader } from 'components';

interface Props {
    closeModal: () => void;
    selectedRow: any;
    onApiCall: () => void;
}

const VerifyOPBillRefundModal = React.memo((props: Props) => {
    const { closeModal, selectedRow, onApiCall } = props;
    const { formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [billingData, setBillingData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    let serviceItemList = billingData?.outPatientBillingBreakups ?? [];
    let { totalAmount } = useCalculateOPBillServiceItem(serviceItemList);
    let refundData = selectedRow?.paymentBreakups?.[0] ?? null;

    useEffect(() => {
        const { outPatientBillingId, outPatientBillingInvoiceNumber } = selectedRow;
        setValue("billNo", outPatientBillingInvoiceNumber);

        if (outPatientBillingId) {
            setLoading(true);
            services.getOPBillByBillId({ billId: outPatientBillingId })
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setBillingData(res.data.response);
                        const { invoiceNumber } = res.data.response;
                        setValue("billNo", invoiceNumber);
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
    }, []);

    function onSubmit(refundFlag: number) {
        let params = {
            refundType: 2,
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
                                label={formatMessage({ id: "refund-against-service" }) + "/" + formatMessage({ id: "opd-cancellation" })}
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
                                    billingData={billingData}
                                />

                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "bill-no" })}
                                        control={control}
                                        name="billNo"
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>

                                <Grid item xs={12}>
                                    <TableContainer component={Paper} elevation={1}>
                                        <Table aria-label="sticky table">
                                            <TableHead style={{ background: "#DFE8FF" }}>
                                                <TableRow>
                                                    <TableCell><strong>#</strong></TableCell>
                                                    <TableCell><strong><FormattedMessage id="billed-service-name" /></strong></TableCell>
                                                    <TableCell><strong><FormattedMessage id="amount" /></strong></TableCell>
                                                    <TableCell><strong><FormattedMessage id="status" /></strong></TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {serviceItemList.map((field: any, index: number) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{field.serviceItemName}</TableCell>
                                                        <TableCell>{field.serviceAmount}</TableCell>
                                                        <TableCell>{field.sendforCancellation ? "Completed" : "Pending"}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow style={{ background: "#EEEEEE" }}>
                                                    <TableCell></TableCell>
                                                    <TableCell><strong><FormattedMessage id="total" /></strong></TableCell>
                                                    <TableCell colSpan={2}><strong>{totalAmount}</strong></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <Grid item xs={12}>
                                    <div className="flex-center">
                                        <div className="flex-center" style={{ marginRight: "30px" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'total-bill-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{billingData?.billAmount}</Typography>
                                        </div>

                                        <div className="flex-center">
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'total-refund' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{selectedRow?.refundAmount}</Typography>
                                        </div>
                                    </div>
                                </Grid>

                                <BillRefundMode
                                    setValue={setValue}
                                    control={control}
                                    watch={watch}
                                    errors={errors}
                                    refundData={refundData}
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

export default VerifyOPBillRefundModal;