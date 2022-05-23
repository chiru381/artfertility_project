import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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

import { createCustomCompositeFilter, floatNumConv } from 'utils/global';
import { getMasterPaginationData } from 'redux/actions';
import { RootReducerState } from 'utils/types';
import { HoverLoader, PopupSearchTable } from 'components';
import { services } from 'utils/services';
import { billsTableColumns, masterPaginationServices, servicePopupColumns } from 'utils/constants';
import { useAsyncDebounce, useCalculateOPBillServiceItem, useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { ButtonGroup, PrimaryButton, SaveButton, SecondaryButton, TableDeleteButton } from 'components/button';
import { FormPrimaryHeading, SearchableTextBox, Select } from 'components/forms';

import CreateBillUserForm from './CreateBillUserForm';
import BillDiscountModal from './BillDiscountModal';
import OPBillAdjustDepositModal from './OPBillAdjustDepositModal';
import BillPaymentModal from './BillPaymentModal';
import BillUserAlert from './BillUserAlert';
import { generateOPBillBodyData } from './generateOPBBillBodyData';

interface Props {
    closeModal: () => void;
    onApiCall?: () => void;
    patientId?: number;
}

const CreateOutPatientBillModal = React.memo((props: Props) => {
    const { closeModal, onApiCall, patientId } = props;
    const { handleSubmit, control, setValue, watch } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();

    const [addDiscountModal, setAddDiscountModal] = useState(false);
    const [adjustDepositModal, setAdjustDepositModal] = useState(false);
    const [billPaymentModalOpen, setBillPaymentModalOpen] = useState(false);

    const [doctorId, setDoctorId] = useState<any>(null);
    const [visitTypeId, setVisitTypeId] = useState<any>(null);
    const [consultationTypeId, setConsultationTypeId] = useState<any>(null);
    const [priorityId, setPriorityId] = useState<any>(null);
    const [performingDoctorId, setPerformingDoctorId] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [serviceText, setServiceText] = useState('');
    const [selectedService, setSelectedService] = useState<any>(null);
    const [servicePopupOpen, setServicePopupOpen] = useState(false);

    const [selectedPatient, setSelectedPatientData] = useState<any>(null);
    const [serviceItem, setServiceItem] = useState<{ [key: string]: any }[]>([]);
    const [patientBillingData, setPatientBillingData] = useState<any>(null);
    const [depositAmountAvail, setDepositAmountAvail] = useState<any>(null);
    const [formBodyData, setFormBodyData] = useState(null);

    const patientTransactionData = patientBillingData?.patientsTransactionData?.[0];

    let balanceDepositAmount = (depositAmountAvail && patientTransactionData) ? (patientTransactionData?.balanceDepositAmount - depositAmountAvail) : patientTransactionData?.balanceDepositAmount;

    const { serviceData, serviceDataLoading, billingLookupData } = useSelector(
        ({ masterPaginationReducer, billingLookupReducer }: RootReducerState) => {
            return ({
                serviceData: masterPaginationReducer[masterPaginationServices.service].data,
                serviceDataLoading: masterPaginationReducer[masterPaginationServices.service].loading,
                billingLookupData: billingLookupReducer.data
            })
        },
        shallowEqual
    );
    let selectOptions = useCreateLookupOptions(billingLookupData);
    let { totalAmount, totalDiscount, netAmount } = useCalculateOPBillServiceItem(serviceItem);

    useEffect(() => {
        if (selectedPatient) {
            let patientId = +selectedPatient.id;
            services.getOPBillDetailByPatientId({ patientId })
                .then(res => {
                    if (res.data.succeeded) {
                        if (res.data.modelItems?.[0]) {
                            setPatientBillingData(res.data.modelItems?.[0]);
                        }
                    }
                })
                .catch(err => console.log(err))
        }
    }, [selectedPatient]);

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

    function onSubmit({ eligibilityAuthorizationStatus, referringDoctorId, referenceNumber }: any) {
        // 1 = Cash Patient/Bill Now, 2 = Credit Patient/Bill Later
        let billType = +selectedPatient.paymentTypeId;
        let billingBodyData = generateOPBillBodyData(selectedPatient, serviceItem, billType, totalAmount, totalDiscount, depositAmountAvail);

        if (eligibilityAuthorizationStatus) {
            billingBodyData = {
                ...billingBodyData,
                eligibilityAuthorizationStatus: +eligibilityAuthorizationStatus.value,
                refereneNumber: referenceNumber
            }
        }
        if (referringDoctorId) {
            billingBodyData = {
                ...billingBodyData,
                referringDoctorId: +referringDoctorId.value
            }
        }

        if ((depositAmountAvail === (totalAmount - totalDiscount)) || billType === 2) {
            setLoading(true);
            services.createOPBill(billingBodyData)
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

    function onDeleteServiceItem(serviceIndex: number) {
        setServiceItem(serviceItem.filter((_, index: number) => index !== serviceIndex));
        setDepositAmountAvail(null);
    }

    function onResetUser() {
        setServiceItem([]);
        setDepositAmountAvail(null);
        setPatientBillingData(null);
    }

    function onAgreePatientAppointment() {
        const appointments = patientBillingData?.appointments?.[0];
        if (appointments) {
            const { medicalStaffId, medicalStaffUserDisplayName, visitTypeId, visitTypeName } = appointments;
            setDoctorId({ label: medicalStaffUserDisplayName, value: String(medicalStaffId) });
            setVisitTypeId({ label: visitTypeName, value: String(visitTypeId) });
        }
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={formatMessage({ id: "op-billing" })} />

                            <ButtonGroup>
                                <SaveButton
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!(serviceItem.length && selectedPatient)}
                                />
                                <SecondaryButton
                                    label="Cancel"
                                    onClick={closeModal}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>

                                <CreateBillUserForm
                                    watch={watch}
                                    control={control}
                                    setValue={setValue}
                                    setSelectedPatientData={setSelectedPatientData}
                                    onResetUser={onResetUser}
                                    patientId={patientId}
                                />

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

                                <Grid item xs={12} style={{ border: "1px solid rgba(0,0,0,0.5)", borderRadius: "6px", marginTop: "30px", paddingTop: "20px", paddingBottom: "20px" }}>
                                    <Grid container spacing={3}>

                                        <Grid item xs={12}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} lg={3} md={4} sm={6} style={{ display: "flex", alignItems: "center" }}>
                                                    <Typography variant="body1" className="label-one uppercase">
                                                        {formatMessage({ id: 'deposited-amount' })}:
                                                    </Typography>
                                                    <Typography variant="body1" className="label-input">{patientTransactionData?.totalDepositAmount ?? 0}</Typography>
                                                </Grid>

                                                <Grid item xs={12} lg={3} md={4} sm={6} style={{ display: "flex", alignItems: "center" }}>
                                                    <Typography variant="body1" className="label-one uppercase">
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
                                    </Grid>
                                </Grid>

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

                {patientBillingData && (
                    <BillUserAlert
                        patientBillingData={patientBillingData}
                        closeModal={closeModal}
                        onAgreePatientAppointment={onAgreePatientAppointment}
                    />
                )}

                {loading && <HoverLoader />}
            </>
        </Modal>
    )
});

export default CreateOutPatientBillModal;