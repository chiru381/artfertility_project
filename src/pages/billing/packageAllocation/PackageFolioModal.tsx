import React, { useState, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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

import { RootReducerState } from 'utils/types';
import { chargeTypeList, itemType, masterPaginationServices, servicePopupColumns } from 'utils/constants';
import { useAsyncDebounce, useCalculateOPBillServiceItem, useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { ButtonGroup, PrimaryButton, SecondaryButton, TableDeleteButton } from 'components/button';
import { CustomTextBox, FormPrimaryHeading, SearchableTextBox, Select } from 'components/forms';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { createCustomCompositeFilter, removeNullFromObject } from 'utils/global';
import { HoverLoader, PopupSearchTable } from 'components';
import InPatientUserDetailForm from './InPatientUserDetailForm';

interface Props {
    closeModal: () => void;
    selectedPackageBill?: any;
}

const PackageFolioModal = React.memo((props: Props) => {
    const { closeModal, selectedPackageBill } = props;
    const { handleSubmit, control, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);

    const [doctorId, setDoctorId] = useState<any>(null);
    const [visitTypeId, setVisitTypeId] = useState<any>(null);
    const [priorityId, setPriorityId] = useState<any>(null);

    const [serviceText, setServiceText] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState<null | number>(null);
    const [servicePopupOpen, setServicePopupOpen] = useState(false);

    const [folioServiceItem, setFolioServiceItem] = useState<any>([]);
    const [packageFolioData, setPackageFolioData] = useState<any>(null);

    const { totalAmount } = useCalculateOPBillServiceItem(folioServiceItem);

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

    useEffect(() => {
        if (selectedPackageBill) {
            setValue('packageName', selectedPackageBill.packageName);

            setLoading(true);
            services.getPackageFolioByPatientId({ patientId: selectedPackageBill.patientId })
                .then(res => {
                    setLoading(false);
                    if (res.data.response) {
                        const { inPatientPackageFolioItemDetails, stageName, stageCycleName } = res.data.response;
                        setPackageFolioData(res.data.response);
                        setValue("stageName", stageName);
                        setValue("cycleName", stageCycleName);

                        setFolioServiceItem(inPatientPackageFolioItemDetails.map(({ isBillable, drugCategoryId, pharmacyItemId, ...rest }: any) => {
                            return removeNullFromObject({
                                ...rest,
                                isBillable: chargeTypeList[isBillable ? 1 : 0]
                            })
                        }
                        ));
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch(() => setLoading(false))
        }
    }, []);

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
        setSelectedServiceId(+row.id);
        setServiceText(row.name);
        setServicePopupOpen(false);
    }

    function onAddDoctor() {
        let params = { packageAllocationId: selectedPackageBill.id, serviceItemId: +doctorId.value };
        let dublicateServiceItem = folioServiceItem.find((service: any) => +service.medicalStaffId === +doctorId.value);

        if (dublicateServiceItem) {
            toastMessage("dublicate entry.", "error");
        } else {
            setLoading(true);
            services.getPackageFolioDoctorFee(params)
                .then(res => {
                    setLoading(false);
                    if (res.data.succeeded === true) {
                        let item = {
                            // serviceItemId: +doctorId.value,
                            serviceAmount: res.data.response.serviceAmount,
                            itemType: itemType.Consultation,
                            itemName: `Dr. ${doctorId.label}`,
                            visitTypeId: +visitTypeId.value,
                            medicalStaffId: +doctorId.value
                        }
                        onAddPackageFolioItems(item);
                        setDoctorId(null);
                        setVisitTypeId(null);
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch(() => setLoading(false))
        }
    }

    function onAddService() {
        let params = { packageAllocationId: selectedPackageBill.id, serviceItemId: selectedServiceId };
        let dublicateServiceItem = folioServiceItem.find((service: any) => +service.serviceItemId === selectedServiceId);

        if (dublicateServiceItem) {
            toastMessage("dublicate entry.", "error");
        } else {
            setLoading(true);
            services.getPackageFolioServiceAmount(params)
                .then(res => {
                    setLoading(false);
                    if (res.data.succeeded === true) {
                        let item = {
                            serviceItemId: selectedServiceId,
                            serviceAmount: res.data.response.serviceAmount,
                            itemType: itemType.Investigation,
                            itemName: serviceText,
                            priorityId: +priorityId.value
                        }
                        onAddPackageFolioItems(item);
                        setPriorityId(null);
                        setSelectedServiceId(null);
                        setServiceText('');
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch(() => setLoading(false))
        }
    }

    function onAddPackageFolioItems(item: { [key: string]: any }) {
        setFolioServiceItem([...folioServiceItem, {
            ...item,
            quantity: 1,
            discountAmount: 0,
            isBillable: chargeTypeList[0],
            isItemOrderFromFolio: true,
        }])
    }

    function onChargeType(chargeType: any, index: number) {
        setFolioServiceItem(folioServiceItem.map((folioService: any, i: number) => ({ ...folioService, isBillable: i === index ? chargeType : folioService.isBillable })));
    }

    function onSubmit() {
        let bodyData = {
            id: selectedPackageBill.id,
            packageAllocationId: selectedPackageBill.id,
            stageId: packageFolioData?.stageId,
            inPatientPackageFolioItemDetails: folioServiceItem.map((folioService: any) => ({ ...folioService, isBillable: folioService.isBillable.value === "2" ? true : false })),
            treatingDoctorId: 1
        }

        setLoading(true);
        services.createPackageFolio(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "insert-message" }));
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

    function onDeleteServiceItem(serviceIndex: number) {
        setFolioServiceItem(folioServiceItem.filter((_: any, index: number) => index !== serviceIndex));
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading
                                textTransform="uppercase"
                                label={formatMessage({ id: "package-folio" })}
                            />

                            <ButtonGroup>
                                <PrimaryButton
                                    label={formatMessage({ id: "add-to-package-folio" })}
                                    onClick={handleSubmit(onSubmit)}
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
                                            <PrimaryButton
                                                label={formatMessage({ id: "add-now" })}
                                                disabled={!(doctorId && visitTypeId && !packageFolioData?.minimumDepositAmountRequired)}
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
                                                        setSelectedServiceId(null);
                                                    }}
                                                    disabled={!!(selectedServiceId || packageFolioData?.minimumDepositAmountRequired)}
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
                                            <PrimaryButton
                                                label={formatMessage({ id: "add-now" })}
                                                disabled={!(selectedServiceId && priorityId)}
                                                onClick={onAddService}
                                            />
                                        </Grid>
                                    </Grid>
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
                                    <TableContainer component={Paper} elevation={1} >
                                        <Table aria-label="sticky table">
                                            <TableHead style={{ background: "#DFE8FF" }}>
                                                <TableRow>
                                                    <TableCell><strong>#</strong></TableCell>
                                                    <TableCell><strong>{formatMessage({ id: "service-inclusive-in-package" })}</strong></TableCell>
                                                    <TableCell><strong>{formatMessage({ id: "service-amount" })}</strong></TableCell>
                                                    {/* <TableCell><strong>{formatMessage({ id: "patient-payable" })}</strong></TableCell> */}
                                                    <TableCell><strong>{formatMessage({ id: "charge-type" })}</strong></TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {folioServiceItem.map((service: any, index: number) => {
                                                    return (
                                                        <TableRow hover key={index} role="checkbox" tabIndex={-1} >
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{service.itemName}</TableCell>
                                                            <TableCell>{service.serviceAmount}</TableCell>
                                                            {/* <TableCell>{service.patientPayable}</TableCell> */}
                                                            <TableCell>
                                                                <Select
                                                                    value={service.isBillable}
                                                                    options={chargeTypeList}
                                                                    textFieldProps={{
                                                                        variant: "standard",
                                                                    }}
                                                                    onChange={(_, data) => onChargeType(data, index)}
                                                                    disableClearable
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                {!service.isAcknowledge && (
                                                                    <TableDeleteButton onClick={() => onDeleteServiceItem(index)} />
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                <TableRow style={{ background: "#EEEEEE" }}>
                                                    <TableCell></TableCell>
                                                    <TableCell><strong><FormattedMessage id="total" /></strong></TableCell>
                                                    <TableCell colSpan={3}><strong>{totalAmount}</strong></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                            </Grid>
                        </div>

                    </Box>
                </div>

                {loading && <HoverLoader />}
            </>
        </Modal>
    )
});

export default PackageFolioModal;