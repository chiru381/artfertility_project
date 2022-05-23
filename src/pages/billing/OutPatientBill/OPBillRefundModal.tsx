import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';


import { RootReducerState } from 'utils/types';
import { transactionType } from 'utils/constants';
import { useCalculateOPBillServiceItem, useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { CheckBox, CustomSelect, CustomTextBox, FormPrimaryHeading } from 'components/forms';
import BillingUserDetailForm from './BillingUserDetailForm';
import BillRefundMode from '../BillRefundMode';
import { services } from 'utils/services';
import { HoverLoader } from 'components';
import { floatNumConv } from 'utils/global';

interface Props {
    closeModal: () => void;
    selectedBill: any;
}

const BillRefundModal = React.memo((props: Props) => {
    const { closeModal, selectedBill } = props;
    const { handleSubmit, formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [loading, setLoading] = useState(false);
    const [billingData, setBillingData] = useState<any>(null);
    const [serviceItem, setServiceItem] = useState<any>([]);
    let { totalAmount } = useCalculateOPBillServiceItem(serviceItem);
    let totalRefundAmount = serviceItem.reduce((acc: number, curr: any) => {
        return acc += curr.checked ? curr.serviceAmount : 0;
    }, 0);

    const { billingLookupData } = useSelector(
        ({ billingLookupReducer }: RootReducerState) => {
            return ({
                billingLookupData: billingLookupReducer.data,
            })
        },
        shallowEqual
    );
    let selectOptions = useCreateLookupOptions(billingLookupData);

    useEffect(() => {
        if (billingData?.outPatientBillingBreakups) {
            setServiceItem(billingData.outPatientBillingBreakups.map((bill: any) => ({ ...bill, checked: false })));
        }
    }, [billingData])


    useEffect(() => {
        const { invoiceNumber, id } = selectedBill;
        setValue("userInfo.billNo", invoiceNumber);

        if (id) {
            setLoading(true);
            services.getOPBillByBillId({ billId: id })
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setBillingData(res.data.response);
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

    function onTickRefundService(index: number) {
        setServiceItem(serviceItem.map((service: any, i: number) => ({ ...service, checked: index === i ? !service.checked : service.checked })));
    }

    function onSubmit(data: any) {
        const { refundReasonId, paymentModeId, payableName, remarks, cardNumber, issueDate, IFSCCode } = data;

        let paymentBreakups: any = {
            transactionType: transactionType.OutPatientRefund,
            amount: totalRefundAmount,
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
            refundAmount: totalRefundAmount,
            refundStatus: 1,
            refundReasonId: +refundReasonId.value,
            outPatientBillingId: selectedBill.id,
            outPatientBillingBreakups: serviceItem.filter((service: any) => service.checked).map(({ checked, ...rest }: any) => ({ ...rest })),
            paymentBreakups: [paymentBreakups]
        }

        setLoading(true);
        services.refundOPBill(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    closeModal();
                    toastMessage("OP Bill refund success.");
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
                                label={formatMessage({ id: "op-refund-service" })}
                            />

                            <ButtonGroup>
                                <PrimaryButton
                                    label="Send To Finance"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!totalRefundAmount}
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

                                <BillingUserDetailForm
                                    control={control}
                                    setValue={setValue}
                                    billingData={billingData}
                                />

                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "bill-no" })}
                                        control={control}
                                        name="userInfo.billNo"
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>

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
                                    <TableContainer component={Paper} elevation={1}>
                                        <Table aria-label="sticky table">
                                            <TableHead style={{ background: "#DFE8FF" }}>
                                                <TableRow>
                                                    <TableCell><strong>#</strong></TableCell>
                                                    <TableCell><strong><FormattedMessage id="billed-service-name" /></strong></TableCell>
                                                    <TableCell><strong><FormattedMessage id="amount" /></strong></TableCell>
                                                    <TableCell><strong><FormattedMessage id="status" /></strong></TableCell>
                                                    <TableCell style={{ paddingLeft: "0px" }}><strong><FormattedMessage id="refund" /></strong></TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {serviceItem.map((service: any, index: number) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{service.serviceItemName}</TableCell>
                                                        <TableCell>{service.serviceAmount}</TableCell>
                                                        <TableCell>{service.hasServiceConsumed ? "Completed" : "Pending"}</TableCell>
                                                        <TableCell padding="checkbox">
                                                            <CheckBox
                                                                checked={service.checked}
                                                                disabled={service.hasServiceConsumed}
                                                                onChange={() => onTickRefundService(index)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow style={{ background: "#EEEEEE" }}>
                                                    <TableCell></TableCell>
                                                    <TableCell><strong><FormattedMessage id="total" /></strong></TableCell>
                                                    <TableCell colSpan={3}><strong>{totalAmount}</strong></TableCell>
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
                                            <Typography variant="body1" className="label-input">{floatNumConv(totalAmount)}</Typography>
                                        </div>

                                        <div className="flex-center">
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'total-refund-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{floatNumConv(totalRefundAmount)}</Typography>
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

export default BillRefundModal;