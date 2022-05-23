import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Modal from '@material-ui/core/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomTextBox, CustomSelect, CustomCheckBox, Select, TextBox } from 'components/forms';
import { SaveButton, SecondaryButton } from 'components/button';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { testSourceOptions } from 'utils/constants/default';
import { RootReducerState } from 'utils/types';
import { HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { FormPrimaryHeading } from 'components/forms';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateTestModal = (props: Props) => {
    const { closeModal, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [testComponentMappings, setTestComponentMappings] = useState<any>([]);
    const [testComponentDetail, setTestComponentDetail] = useState<any>({});
    const [cptCode, setCPTCode] = useState(null);
    const [subDepartmentName, setSubDepartmentName] = useState(null);
    const [billingServiceId, setBillingServiceId] = useState(null);

    const { billingServiceData, clinicData, testComponentData, equipmentData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            billingServiceData: masterPaginationReducer[masterPaginationServices.service].data,
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
            testComponentData: masterPaginationReducer[masterPaginationServices.component].data,
            equipmentData: masterPaginationReducer[masterPaginationServices.equipment].data,

        }),
        shallowEqual
    );

    let billingServiceOptions = billingServiceData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let testComponentOptions = testComponentData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let equipmentOptions = equipmentData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.service, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.component, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.equipment, {}));
    }, []);

    function handleAddMoreComponentClick() {
        if (testComponentDetail?.value) {
            if (!testComponentMappings?.filter((item: any) => item.componentId === testComponentDetail?.value)?.length) {
                let data = [
                    ...testComponentMappings,
                    {
                        sequence: testComponentMappings?.length + 1,
                        componentId: testComponentDetail?.value ?? 0,
                        componentName: testComponentDetail?.label ?? null
                    }
                ]
                setTestComponentMappings(data);
                setTestComponentDetail(null);
            }
        }
    }

    function handleChangeBillingService(id: any) {
        let data = billingServiceData?.modelItems?.filter((item: any) => item.id === id);
        setBillingServiceId(id);
        setCPTCode(data[0]?.cptCode);
        setSubDepartmentName(data[0]?.subDepartmentName);
    }

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);

        bodyData = {
            ...bodyData,
            billingServiceId: billingServiceId,
            cptCode: cptCode,
            subDepartmentName: subDepartmentName,
            testComponentMappings: testComponentMappings
        }

        setLoading(true);
        services.createTest(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall(false);
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

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={formatMessage({ id: "create-lab-test" })} />
                            <CustomFooter
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                closeModal={() => {
                                    closeModal();
                                }}
                            />
                        </div>
                        <div className="full-modal-body-container">
                            <Paper elevation={2}>
                                <Box p={4}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "test-short-name" })}
                                                name="testShortname"
                                                control={control}
                                                error={errors.testShortname}
                                                rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "test-long-name" })}
                                                name="testLongname"
                                                control={control}
                                                error={errors.testLongname}
                                                rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "display-name" })}
                                                name="name"
                                                control={control}
                                                error={errors.name}
                                                rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <Select
                                                options={billingServiceOptions}
                                                label={formatMessage({ id: "billing-service" })}
                                                onChange={(_, data: any) => {
                                                    handleChangeBillingService(data?.value);
                                                }}
                                                value={billingServiceOptions?.find((data: any) => data.value === billingServiceId) ?? {}}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <TextBox
                                                label={formatMessage({ id: "cpt-code" })}
                                                value={cptCode}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <TextBox
                                                label={formatMessage({ id: "sub-department" })}
                                                value={subDepartmentName}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={clinicOptions}
                                                label={formatMessage({ id: "clinic" })}
                                                name="testClinicMappingIds"
                                                control={control}
                                                error={errors.testClinicMappingIds}
                                                rules={validationRule.textbox({ required: true })}
                                                multiple
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "test-code" })}
                                                name="testCode"
                                                control={control}
                                                error={errors.testCode}
                                                rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "billing-code" })}
                                                name="billingCode"
                                                control={control}
                                                error={errors.billingCode}
                                                rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={testSourceOptions}
                                                label={formatMessage({ id: "test-source" })}
                                                name="testSource"
                                                control={control}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomCheckBox
                                                name="isCulture"
                                                label={formatMessage({ id: "is-culture" })}
                                                control={control}
                                                error={errors.isCulture}
                                                required={true}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <h3 className="formHeading">
                                                <FormattedMessage id="test-component-mapping" />
                                            </h3>
                                        </Grid>
                                        <Grid container spacing={2} item xs={12}>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <Select
                                                    label={formatMessage({ id: "component" })}
                                                    options={testComponentOptions}
                                                    value={testComponentDetail}
                                                    onChange={(_, data: any) => {
                                                        setTestComponentDetail(data);
                                                    }}
                                                    id="testComponentId"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={1} md={1} sm={6}>
                                                <Button variant="contained" color="primary" onClick={handleAddMoreComponentClick}>
                                                    <FormattedMessage id="add" />
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <TableContainer>
                                                    <Table stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{ width: "50%" }}><FormattedMessage id="sequence-number" /></TableCell>
                                                                <TableCell style={{ width: "50%" }}><FormattedMessage id="component" /></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {testComponentMappings?.map((item: any, index: any) => {
                                                                return (
                                                                    <TableRow hover key={index} role="checkbox" tabIndex={-1} >
                                                                        <TableCell>{item.sequence}</TableCell>
                                                                        <TableCell>{item.componentName}</TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <h3 className="formHeading">
                                                <FormattedMessage id="test-instructions" />
                                            </h3>
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "test-note" })}
                                                name="testNote"
                                                control={control}
                                                rows={4}
                                                multiline
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <h3 className="formHeading">
                                                <FormattedMessage id="equipment-mapping" />
                                            </h3>
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={equipmentOptions}
                                                label={formatMessage({ id: "equipment" })}
                                                name="equipmentId"
                                                control={control}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <h3 className="formHeading">
                                                <FormattedMessage id="test-attributes" />
                                            </h3>
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "tat-in-minutes" })}
                                                name="tatInMinutes"
                                                control={control}
                                                rules={validationRule.textbox({ type: "number" })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomCheckBox
                                                name="isCumulative"
                                                label={formatMessage({ id: "is-cumulative" })}
                                                control={control}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "cumulative-days" })}
                                                name="cumulativeDays"
                                                control={control}
                                                rules={validationRule.textbox({ type: "number" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "font-name" })}
                                                name="fontName"
                                                control={control}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "font-size" })}
                                                name="fontSize"
                                                control={control}
                                                rules={validationRule.textbox({ type: "number" })}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Paper>
                        </div>
                    </Box>
                </div>
                {loading && <HoverLoader />}
            </>
        </Modal>
    )
}

export default CreateTestModal;

const CustomFooter = ({ handleSubmit, onSubmit, closeModal }: any) => {
    return (
        <div>
            <SecondaryButton
                label="Cancel"
                style={{ marginRight: "15px" }}
                onClick={closeModal}
            />
            <SaveButton
                onClick={handleSubmit(onSubmit)}
            />
        </div>
    )
}