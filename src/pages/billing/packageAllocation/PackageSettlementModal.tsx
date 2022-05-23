import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

import { useCalculateFolioServiceItem, useToastMessage } from 'utils/hooks';
import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { CustomTextBox, FormPrimaryHeading } from 'components/forms';
import SettlePackageSettlementModal from './SettlePackageSettlementModal';
import { services } from 'utils/services';
import InPatientUserDetailForm from './InPatientUserDetailForm';
import { HoverLoader } from 'components';
import InPatientPackageSettleDiscountModal from './InPatientPackageSettleDiscountModal';
import PackageSettlementPaymentModal from './PackageSettlementPaymentModal';

interface Props {
    closeModal: () => void;
    selectedPackageBill?: any;
    onApiCall: () => void;
}


const PackageSettlementModal = React.memo((props: Props) => {
    const { closeModal, selectedPackageBill, onApiCall } = props;
    const { control, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [packageSettlementDiscountModalOpen, setPackageSettlementDiscountModalOpen] = useState(false);
    const [settlePackageSettlementModalOpen, setSettlePackageSettlementModalOpen] = useState(false);
    const [packageSettlementPaymentModalOpen, setpackageSettlementPaymentModalOpen] = useState(false);

    const [packageFolioData, setPackageFolioData] = useState<any>(null);
    const [folioServiceItem, setFolioServiceItem] = useState<any>([]);
    const [formBodyData, setFormBodyData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { totalDiscount, totalNetAmount, totalServiceAmount } = useCalculateFolioServiceItem(folioServiceItem);
    let depositedAmount = packageFolioData?.totalDepositAmount;


    useEffect(() => {
        if (selectedPackageBill) {
            setValue('packageName', selectedPackageBill.packageName);

            setLoading(true);
            services.getPackageSettlementByPatientId({ patientId: selectedPackageBill.patientId })
            .then(res => {
                setLoading(false);
                if (res.data.response) {
                    const { inPatientPackageFolioItemDetails, id: inPatientPackageFolioId, stageName, stageCycleName } = res.data.response;
                    setValue("stageName", stageName);
                    setValue("cycleName", stageCycleName);
                    setPackageFolioData(res.data.response);
                    setFolioServiceItem(inPatientPackageFolioItemDetails.map(({ itemName, serviceAmount }: any) => ({
                        itemName, serviceAmount, inPatientPackageFolioId,
                        discountAmount: null,
                        depositPer: null,
                        discountReasonId: 0,
                        discountTypeId: 0,
                        userRoleId: 0,
                    })));
                }
            })
            .catch(() => setLoading(false))
        }
    }, []);

    function onConfirmBillSettlement() {
        let folioDiscount = folioServiceItem.filter((item: any) => item.discountAmount).map(({ itemName, serviceAmount, ...rest }: any) => ({ ...rest }));
        let bodyData = {
            id: selectedPackageBill.id,
            billAmount: totalServiceAmount,
            discountAmount: totalDiscount,
            adjustedAmount: depositedAmount > totalNetAmount ? totalNetAmount : depositedAmount,
            patientPayableAmount: depositedAmount > totalNetAmount ? 0 : (totalNetAmount - depositedAmount),
            patientDueAmount: 0,
            inPatientPackageDiscounts: folioDiscount
        }

        if (bodyData.patientPayableAmount) {
            setFormBodyData(bodyData);
            setpackageSettlementPaymentModalOpen(true);
        } else {
            setLoading(true);
            services.createInPatientPackageSettlement(bodyData)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        toastMessage(formatMessage({ id: "insert-message" }));
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
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading
                                textTransform="uppercase"
                                label={formatMessage({ id: "package-bill-settlement" })}
                            />

                            <ButtonGroup>
                                <PrimaryButton
                                    label={formatMessage({ id: "discount" })}
                                    onClick={() => setPackageSettlementDiscountModalOpen(true)}
                                    disabled={!folioServiceItem.length}
                                />

                                <PrimaryButton
                                    label={formatMessage({ id: "settle" })}
                                    onClick={() => setSettlePackageSettlementModalOpen(true)}
                                    disabled={!folioServiceItem.length}
                                />

                                <SecondaryButton
                                    label={formatMessage({ id: "cancel" })}
                                    onClick={closeModal}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>

                                <InPatientUserDetailForm
                                    control={control}
                                    setValue={setValue}
                                    packageBillData={packageFolioData}
                                />

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>


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
                                        label={formatMessage({ id: "cycle" })}
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
                                    <div className="flex-center">
                                        <div className="flex-center" style={{ marginRight: "30px" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'deposited-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{packageFolioData?.totalDepositAmount ?? 0}</Typography>
                                        </div>

                                        <div className="flex-center">
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'balance-amount-to-be-deposited' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{packageFolioData?.minimumDepositAmountRequired ?? 0}</Typography>
                                        </div>
                                    </div>
                                </Grid>

                                <Grid item xs={12}>
                                    <TableContainer component={Paper} elevation={1} style={{ marginTop: "5px" }}>
                                        <Table aria-label="sticky table">
                                            <TableHead style={{ background: "#DFE8FF" }}>
                                                <TableRow>
                                                    <TableCell><strong>#</strong></TableCell>
                                                    <TableCell><strong>{formatMessage({ id: "service-category" })}</strong></TableCell>
                                                    <TableCell><strong>{formatMessage({ id: "amount" })}</strong></TableCell>
                                                    <TableCell><strong>{formatMessage({ id: "discount" })} %</strong></TableCell>
                                                    <TableCell><strong>{formatMessage({ id: "discount-amount" })}</strong></TableCell>
                                                    <TableCell><strong>{formatMessage({ id: "patient-payable" })}</strong></TableCell>
                                                    {/* <TableCell><strong>{formatMessage({ id: "payer-payable" })}</strong></TableCell> */}
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {folioServiceItem.map((service: any, index: number) => {
                                                    return (
                                                        <TableRow hover key={index} role="checkbox" tabIndex={-1} >
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{service.itemName}</TableCell>
                                                            <TableCell>{service.serviceAmount}</TableCell>
                                                            <TableCell>{service.depositPer}</TableCell>
                                                            <TableCell>{service.discountAmount}</TableCell>
                                                            <TableCell>{service.serviceAmount - service.discountAmount}</TableCell>
                                                            {/* <TableCell>{service.payerPayable}</TableCell> */}
                                                        </TableRow>
                                                    );
                                                })}
                                                <TableRow style={{ background: "#EEEEEE" }}>
                                                    <TableCell></TableCell>
                                                    <TableCell><strong><FormattedMessage id="total" /></strong></TableCell>
                                                    <TableCell><strong>{totalServiceAmount}</strong></TableCell>
                                                    <TableCell><strong></strong></TableCell>
                                                    <TableCell><strong>{totalDiscount}</strong></TableCell>
                                                    <TableCell><strong>{totalNetAmount}</strong></TableCell>
                                                    {/* <TableCell><strong>22200</strong></TableCell> */}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                            </Grid>
                        </div>

                    </Box>
                </div>


                {packageSettlementDiscountModalOpen && (
                    <InPatientPackageSettleDiscountModal
                        closeModal={() => setPackageSettlementDiscountModalOpen(false)}
                        folioServiceItem={folioServiceItem}
                        setFolioServiceItem={setFolioServiceItem}
                    />
                )}

                {settlePackageSettlementModalOpen && (
                    <SettlePackageSettlementModal
                        closeModal={() => setSettlePackageSettlementModalOpen(false)}
                        packageBillData={packageFolioData}
                        onConfirmBillSettlement={onConfirmBillSettlement}
                        folioServiceItem={folioServiceItem}
                    />
                )}

                {packageSettlementPaymentModalOpen && (
                    <PackageSettlementPaymentModal
                        closeModal={() => setpackageSettlementPaymentModalOpen(false)}
                        closeParentModal={()=> {
                            closeModal();
                            onApiCall();
                        }}
                        formBodyData={formBodyData}
                    />
                )}

                {loading && <HoverLoader />}
            </>
        </Modal>
    )
});

export default PackageSettlementModal;