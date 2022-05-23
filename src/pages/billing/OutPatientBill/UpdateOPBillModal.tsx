import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

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


import { createCustomCompositeFilter, floatNumConv } from 'utils/global';
import { getMasterPaginationData } from 'redux/actions';
import { RootReducerState } from 'utils/types';
import { CustomDialog, HoverLoader, PopupSearchTable } from 'components';
import { services } from 'utils/services';
import { billsTableColumns, masterPaginationServices, servicePopupColumns } from 'utils/constants';
import { useAsyncDebounce, useCalculateOPBillServiceItem, useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { ButtonGroup, PrimaryButton, SaveButton, SecondaryButton, TableDeleteButton } from 'components/button';
import { FormPrimaryHeading, SearchableTextBox, Select, TextBox } from 'components/forms';
import CreateBillUserForm from './CreateBillUserForm';
import BillDiscountModal from './BillDiscountModal';
import OPBillAdjustDepositModal from './OPBillAdjustDepositModal';
import BillPaymentModal from './BillPaymentModal';
import { generateOPBillBodyData } from './generateOPBBillBodyData';

interface Props {
    closeModal: () => void;
    selectedBill: any;
    onApiCall: () => void;
}

const UpdateOPBillModal = React.memo((props: Props) => {
    const { closeModal, selectedBill, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control, setValue, watch } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();

    const [addDiscountModal, setAddDiscountModal] = useState(false);
    const [adjustDepositModal, setAdjustDepositModal] = useState(false);
    const [selectedPatient, setSelectedPatientData] = useState<any>(null);
    const [billPaymentModalOpen, setBillPaymentModalOpen] = useState(false);
    const [duePaymentPopup, setDuePaymentPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const [doctorId, setDoctorId] = useState<any>(null);
    const [visitTypeId, setVisitTypeId] = useState<any>(null);
    const [priorityId, setPriorityId] = useState<any>(null);

    const [serviceText, setServiceText] = useState('');
    const [selectedService, setSelectedService] = useState<any>(null);
    const [servicePopupOpen, setServicePopupOpen] = useState(false);

    const [serviceItem, setServiceItem] = useState<{ [key: string]: any }[]>([]);
    const [billingData, setBillingData] = useState<any>(null);
    const [depositAmountAvail, setDepositAmountAvail] = useState<any>(null);
    const [formBodyData, setFormBodyData] = useState<any>(null);
    const [billStatusId, setBillStatusId] = useState<null | number>(null);
    const [performingDoctorId, setPerformingDoctorId] = useState<any>(null);
    const [consultationTypeId, setConsultationTypeId] = useState<any>(null);

    const patientTransactionData = billingData?.patientTransactionData?.[0];
    const billStatus = billStatusId ? billStatusId === 1 ? "Bill Open" : "Bill Closed" : "";

    let balanceDepositAmount = (depositAmountAvail && patientTransactionData) ? (patientTransactionData?.balanceDepositAmount - depositAmountAvail) : patientTransactionData?.balanceDepositAmount;
    let totalDepositAmount = patientTransactionData?.totalDepositAmount ?? 0;

    const { serviceData, serviceDataLoading, billingLookupData } = useSelector(
        ({ masterPaginationReducer, billingLookupReducer }: RootReducerState) => {
            return ({
                serviceData: masterPaginationReducer[masterPaginationServices.service].data,
                serviceDataLoading: masterPaginationReducer[masterPaginationServices.service].loading,
                billingLookupData: billingLookupReducer.data,
            })
        },
        shallowEqual
    );
    let selectOptions = useCreateLookupOptions(billingLookupData);
    let { totalAmount, totalDiscount, netAmount } = useCalculateOPBillServiceItem(serviceItem);

    // 1 = Cash Patient/Bill Now, 2 = Credit Patient/Bill Later
    let paymentTypeId = selectedPatient?.paymentTypeId ?? null;

    useEffect(() => {
        const { invoiceNumber, createdDateTime, id } = selectedBill;
        setValue("userInfo.billNo", invoiceNumber);
        setValue("userInfo.billDate", createdDateTime);

        if (id) {
            setLoading(true);
            services.getOPBillByBillId({ billId: id })
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        const { balanceAmount, paymentTypeId, patientId } = res.data.response;
                        setBillingData(res.data.response);
                        if (balanceAmount) {
                            setDuePaymentPopup(true);
                        }
                        if (paymentTypeId === 2) {
                            getPatientInfoByPatientId(patientId);
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
    }, []);

    useEffect(() => {
        if (billingData) {
            const { outPatientVisits, outPatientBillingBreakups, billStatus } = billingData;
            const outPatientVisitsData = outPatientVisits?.[0];
            setBillStatusId(billStatus);
            if (outPatientVisitsData) {
                setValue("userInfo.visitNo", outPatientVisitsData.visitNumber);
                setValue("userInfo.visitDate", outPatientVisitsData.createdDateTime);
            }
            setServiceItem(outPatientBillingBreakups)
        }
    }, [billingData]);


    // when payment type is credit
    // i.e when credit bill patient may change payment type before settling bill
    function getPatientInfoByPatientId(patientId: number) {
        const parms = { patientId };
        setLoading(true);
        services.getPatientWithPartnerById(parms)
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    const { paymentTypeId } = res.data.response;
                    setSelectedPatientData({ ...selectedPatient, paymentTypeId });
                }
            })
            .catch(() => setLoading(false))
    }

    function onServiceSearchApi(value: string) {
        let members = ["name"];
        let params = createCustomCompositeFilter(members, value);

        dispatch(getMasterPaginationData(masterPaginationServices.service, params));
    }

    const onChangeValue = useAsyncDebounce((value: string) => {
        onServiceSearchApi(value);
    }, 500);

    function onFocus() {
        if (serviceData.modelItems.length === 0) {
            onServiceSearchApi("");
        }
        setTimeout(() => {
            setServicePopupOpen(true);
        }, 200);
    }

    function onRowClick(row: any) {
        setSelectedService(row);
        setServiceText(row.name);
        setServicePopupOpen(false);
    }

    function onAddDoctor() {
        let bodyData = {
            isConsultationItem: true,
            medicalStaffId: +doctorId.value,
            visitTypeId: +visitTypeId.value,
            serviceItemName: `Dr. ${doctorId.label}`,
            consultationTypeId: +consultationTypeId.value
        }
        onGetItemPriceApi(bodyData);
    }

    function onAddService() {
        let bodyData = {
            isConsultationItem: false,
            serviceItemId: +selectedService.id,
            serviceItemName: selectedService.name,
        }
        onGetItemPriceApi(bodyData);
    }

    function onGetItemPriceApi({ serviceItemName, ...data }: any) {
        let { serviceItemId = null, medicalStaffId = null, visitTypeId = null } = data;
        const { id: patientId, paymentTypeId, tariffId, genderId } = selectedPatient;
        let dublicateServiceItem = serviceItem.find((service: any) => (visitTypeId ? (service.medicalStaffId === medicalStaffId) : false || serviceItemId ? (serviceItemId === service.serviceItemId) : false));
        let bodyData = {
            ...data,
            patientId, paymentTypeId, tariffId, genderId
        }

        if (dublicateServiceItem) {
            toastMessage("dublicate entry.", "error");
        } else {
            setLoading(true)
            services.getOPBillingItemPrice(bodyData)
                .then(res => {
                    setLoading(false);
                    if (res.data?.succeeded === true) {
                        let { billingCode, cptCode, isConsultationItem, serviceAmount, coPaymentAmount: coPayment, deductableAmount } = res.data.response;
                        let selectedServiceItem = serviceItem?.[0];
                        let newServiceItem: any = {
                            billingCode, cptCode, isConsultationItem, serviceItemName, quantity: 1, serviceAmount, coPayment,
                            deductableAmount, discountAmount: null, discountPerchantage: null,
                            discountReasonId: null, discountTypeId: null, roleId: null, hasServiceConsumed: false, sendforCancellation: false
                        }
                        if (medicalStaffId) {
                            newServiceItem = {
                                ...newServiceItem,
                                medicalStaffId, visitTypeId,
                                consultationTypeId: +consultationTypeId.value
                            }
                        }
                        if (serviceItemId) {
                            newServiceItem = {
                                ...newServiceItem,
                                serviceItemId,
                                priorityId: +priorityId.value,
                                performingDoctorId: +performingDoctorId.value
                            }
                        }
                        if (selectedServiceItem?.discountTypeId === 2) {
                            newServiceItem = {
                                ...newServiceItem,
                                discountAmount: floatNumConv((selectedServiceItem.discountPerchantage / 100) * serviceAmount),
                                discountPerchantage: selectedServiceItem.discountPerchantage,
                            }
                        }
                        setServiceItem([...serviceItem, newServiceItem]);
                        if (depositAmountAvail) {
                            setDepositAmountAvail(null)
                        }
                        if (visitTypeId) {
                            setDoctorId(null);
                            setVisitTypeId(null);
                            setConsultationTypeId(null);
                        } else {
                            setServiceText("");
                            setSelectedService(null);
                            setPriorityId(null);
                            setPerformingDoctorId(null);
                        }
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch(() => setLoading(false))
        }
    }

    function onDeleteServiceItem(serviceIndex: number) {
        setServiceItem(serviceItem.filter((_, index: number) => index !== serviceIndex));
        setDepositAmountAvail(null);
    }

    function onSubmit() {
        let billType = +selectedPatient.paymentTypeId;
        let billingBodyData = generateOPBillBodyData(selectedPatient, serviceItem, billType, totalAmount, totalDiscount, depositAmountAvail);

        if ((depositAmountAvail === (totalAmount - totalDiscount)) || billType === 2) {
            setLoading(true);
            services.updateOPBill(billingBodyData)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        toastMessage(formatMessage({ id: "insert-message" }));
                        closeModal();
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
        } else {
            setFormBodyData(billingBodyData);
            setBillPaymentModalOpen(true);
        }
    }

    function settleCashBill() {
        setBillPaymentModalOpen(true);
        let data = {
            billAmount: totalAmount, discountAmount: totalDiscount, id: billingData.id, invoiceNumber: billingData.invoiceNumber,
            balanceAmount: billingData.balanceAmount, billType: 1, dueSettlement: billingData.balanceAmount, patientId: billingData.patientId
        }
        setFormBodyData(data);
    }

    function updateBillStatus(billStatus: 1 | 2) {
        let params = {
            OutPatientBillId: billingData.id,
            Flag: billStatus,
            EncounterEndTypeId: 1
        }
        setLoading(true);
        services.updateOPBillStatus(params)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "bill-status-update-message" }));
                    setBillStatusId(billStatus);
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function onAgreeDuePayment() {
        settleCashBill();
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container op-bill-modal">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={formatMessage({ id: "op-billing" })} />

                            <ButtonGroup>
                                {(paymentTypeId === 1 && billingData?.balanceAmount) && (
                                    <PrimaryButton
                                        label="Settle Bill"
                                        onClick={() => setDuePaymentPopup(true)}
                                    />
                                )}

                                {(paymentTypeId !== 1 && billStatusId === 1) && (
                                    <SaveButton
                                        onClick={handleSubmit(onSubmit)}
                                        label={formatMessage({ id: "update" })}
                                    />
                                )}

                                <SecondaryButton
                                    label={formatMessage({ id: "cancel" })}
                                    onClick={closeModal}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>

                                <CreateBillUserForm
                                    control={control}
                                    watch={watch}
                                    setValue={setValue}
                                    setSelectedPatientData={setSelectedPatientData}
                                    billUserData={billingData}
                                />

                                {(paymentTypeId !== 1 && billStatusId === 1) && (
                                    <>
                                        <Grid item xs={12}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <Select
                                                        label={formatMessage({ id: "add-doctor" })}
                                                        options={selectOptions?.medicalStaffs ?? []}
                                                        value={doctorId}
                                                        onChange={(_, data: any) => setDoctorId(data)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <Select
                                                        label={formatMessage({ id: "visit-type" })}
                                                        options={selectOptions?.visitTypes ?? []}
                                                        value={visitTypeId}
                                                        onChange={(_, data: any) => setVisitTypeId(data)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <Select
                                                        label={formatMessage({ id: "consultation-type" })}
                                                        options={selectOptions?.consultationTypes ?? []}
                                                        value={consultationTypeId}
                                                        onChange={(_, data: any) => setConsultationTypeId(data)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <PrimaryButton
                                                        label={formatMessage({ id: "add-now" })}
                                                        disabled={!(doctorId && visitTypeId && selectedPatient && consultationTypeId)}
                                                        onClick={onAddDoctor}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <PopupSearchTable
                                                        popupOpen={servicePopupOpen}
                                                        closePopup={() => setServicePopupOpen(false)}
                                                        tableData={serviceData.modelItems}
                                                        columns={[...servicePopupColumns(formatMessage)]}
                                                        onRowClick={onRowClick}
                                                        loading={serviceDataLoading}
                                                        popupTooltipStyle={{ marginTop: "0px" }}
                                                    >
                                                        <SearchableTextBox
                                                            label={formatMessage({ id: "add-service" })}
                                                            value={serviceText}
                                                            onChange={e => {
                                                                setServiceText(e.target.value);
                                                                onChangeValue(e.target.value);
                                                            }}
                                                            onFocus={onFocus}
                                                            onCancel={() => {
                                                                setServiceText("");
                                                                setSelectedService(null);
                                                            }}
                                                            disabled={(selectedService) ? true : false}
                                                        />
                                                    </PopupSearchTable>

                                                </Grid>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <Select
                                                        label={formatMessage({ id: "priority" })}
                                                        options={selectOptions?.priorities ?? []}
                                                        value={priorityId}
                                                        onChange={(_, data: any) => setPriorityId(data)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <Select
                                                        label={formatMessage({ id: "performing-doctor" })}
                                                        options={selectOptions?.medicalStaffs ?? []}
                                                        value={performingDoctorId}
                                                        onChange={(_, data: any) => setPerformingDoctorId(data)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                                    <PrimaryButton
                                                        label={formatMessage({ id: "add-now" })}
                                                        disabled={!(selectedService && priorityId && selectedPatient && performingDoctorId)}
                                                        onClick={onAddService}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}


                                <Grid item xs={12} className="service-card">
                                    <Grid container spacing={3}>

                                        <Grid item xs={12}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} lg={3} md={4} sm={6} style={{ display: "flex", alignItems: "center" }}>
                                                    <Typography variant="body1" className="label-one">
                                                        {formatMessage({ id: 'deposited-amount' })}:
                                                    </Typography>
                                                    <Typography variant="body1" className="label-input">{totalDepositAmount}</Typography>
                                                </Grid>

                                                <Grid item xs={12} lg={3} md={4} sm={6} style={{ display: "flex", alignItems: "center" }}>
                                                    <Typography variant="body1" className="label-one">
                                                        {formatMessage({ id: 'balance-deposited-amount' })}:
                                                    </Typography>
                                                    <Typography variant="body1" className="label-input">{balanceDepositAmount ?? 0}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TableContainer component={Paper} elevation={1}>
                                                <Table aria-label="sticky table">
                                                    <TableHead style={{ background: "#DFE8FF" }}>
                                                        <TableRow>
                                                            <TableCell><strong>#</strong></TableCell>
                                                            {billsTableColumns.map(col => (
                                                                <TableCell key={col.label}>
                                                                    <strong><FormattedMessage id={col.label} /></strong>
                                                                </TableCell>
                                                            ))}
                                                            <TableCell></TableCell>
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {serviceItem.map((row: any, index: number) => (
                                                            <TableRow hover={true} key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                {billsTableColumns.map((col, subIndex) => {
                                                                    let value = row?.[col.name] ?? '-';
                                                                    if (col.name === "amount") {
                                                                        value = row.quantity * row.serviceAmount;
                                                                    } else if (col.name === "netAmount") {
                                                                        value = row.serviceAmount - row.discountAmount - row.coPayment - row.deductableAmount;
                                                                    }
                                                                    return (
                                                                        <TableCell key={subIndex}>{floatNumConv(value)}</TableCell>
                                                                    )
                                                                })}
                                                                <TableCell>
                                                                    <TableDeleteButton onClick={() => onDeleteServiceItem(index)} />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                        <TableRow style={{ background: "#00000029" }}>
                                                            <TableCell colSpan={2}></TableCell>
                                                            <TableCell colSpan={1}><strong>Total</strong></TableCell>
                                                            <TableCell colSpan={4}></TableCell>
                                                            <TableCell colSpan={1}><strong>{floatNumConv(totalDiscount)}</strong></TableCell>
                                                            <TableCell colSpan={1}><strong>{floatNumConv(totalAmount)}</strong></TableCell>
                                                            <TableCell colSpan={3}></TableCell>
                                                            <TableCell colSpan={1}><strong>{floatNumConv(1)}</strong></TableCell>
                                                            <TableCell colSpan={1}></TableCell>
                                                        </TableRow>
                                                    </TableBody>

                                                </Table>
                                            </TableContainer>
                                        </Grid>

                                        {(paymentTypeId !== 1 && billStatusId === 1) && (
                                            <Grid item xs={12}>
                                                <PrimaryButton
                                                    label="Add Discount"
                                                    style={{ marginRight: '20px' }}
                                                    onClick={() => setAddDiscountModal(true)}
                                                    disabled={!serviceItem.length || selectedPatient?.paymentTypeId === 2}
                                                />

                                                <PrimaryButton
                                                    label="Adjust Through Deposit"
                                                    onClick={() => setAdjustDepositModal(true)}
                                                    disabled={!(patientTransactionData && netAmount > 0)}
                                                />
                                            </Grid>
                                        )}

                                    </Grid>
                                </Grid>

                                {(paymentTypeId !== 1) && (
                                    <Grid item xs={12}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex" }}>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Typography variant="body2" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                                        {formatMessage({ id: 'bill-status' })}:
                                                    </Typography>
                                                    <TextBox
                                                        value={billStatus}
                                                        disabled
                                                        fullWidth={false}
                                                    />
                                                </div>

                                                <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
                                                    <Typography variant="body2" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                                        {formatMessage({ id: 'bill-open-date-time' })}:
                                                    </Typography>
                                                    <TextBox
                                                        value={dayjs().format('DD-MM-YYYY hh:MM A')}
                                                        disabled
                                                        fullWidth={false}
                                                    />
                                                </div>
                                            </div>

                                            <ButtonGroup>
                                                {(billStatusId !== 1) && (
                                                    <PrimaryButton
                                                        label="Bill Open"
                                                        onClick={() => updateBillStatus(1)}
                                                    />
                                                )}
                                                {billStatusId === 1 && (
                                                    <PrimaryButton
                                                        label="Bill Close"
                                                        onClick={() => updateBillStatus(2)}
                                                    />
                                                )}
                                            </ButtonGroup>
                                        </div>
                                    </Grid>
                                )}

                            </Grid>
                        </div>

                    </Box>
                </div>


                {addDiscountModal && (
                    <BillDiscountModal
                        closeModal={() => setAddDiscountModal(false)}
                        setServiceItem={setServiceItem}
                        serviceItem={serviceItem}
                    />
                )}

                {adjustDepositModal && (
                    <OPBillAdjustDepositModal
                        closeModal={() => setAdjustDepositModal(false)}
                        patientTransactionData={patientTransactionData}
                        totalBillAmount={totalAmount - totalDiscount}
                        depositAmountAvail={depositAmountAvail}
                        setDepositAmountAvail={setDepositAmountAvail}
                    />
                )}

                {billPaymentModalOpen && (
                    <BillPaymentModal
                        closeModal={() => setBillPaymentModalOpen(false)}
                        closeParentModal={closeModal}
                        formBodyData={formBodyData}
                        onApiCall={onApiCall}
                    />
                )}

                {loading && <HoverLoader />}

                <CustomDialog
                    open={duePaymentPopup}
                    onDisagree={() => setDuePaymentPopup(false)}
                    onAgree={onAgreeDuePayment}
                    title={String(formatMessage({ id: "settle-bill" })).toUpperCase()}
                    subTitle={`Patient has due amount of ${billingData?.balanceAmount}. Do you want to pay now?`}
                />

            </>
        </Modal>
    )
});

export default UpdateOPBillModal;