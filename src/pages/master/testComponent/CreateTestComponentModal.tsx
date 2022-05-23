import React, { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import AddCircle from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomTextBox, CustomSelect, CustomCheckBox, Select } from 'components/forms';
import { SaveButton, SecondaryButton } from 'components/button';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { genderTypeOptions, resultTypeOptions, referenceRangeConditionOptions, componentMathmeticalOperatorOptions } from 'utils/constants/default';
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

const CreateTestComponentModal = (props: Props) => {
    const { closeModal, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control, watch, getValues, setValue, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [componentResultFormulas, setComponentResultFormulas] = useState<any>([]);
    const [referenceRangeCondition, setReferenceRangeCondition] = useState<any>(referenceRangeConditionOptions[0]);

    const { fields, append, remove } = useFieldArray({ control, name: 'componentReferenceRanges' });

    const { clinicData, sampleTypeData, unitOfMeasureData, sampleContainerData, resultValueData, departmentData, componentData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
            sampleTypeData: masterPaginationReducer[masterPaginationServices.sample].data,
            unitOfMeasureData: masterPaginationReducer[masterPaginationServices.unitOfMeasure].data,
            sampleContainerData: masterPaginationReducer[masterPaginationServices.sampleContainer].data,
            resultValueData: masterPaginationReducer[masterPaginationServices.resultValue].data,
            departmentData: masterPaginationReducer[masterPaginationServices.department].data,
            componentData: masterPaginationReducer[masterPaginationServices.component].data
        }),
        shallowEqual
    );

    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let sampleTypeOptions = sampleTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let unitOfMeasureOptions = unitOfMeasureData.modelItems?.map((option: any) => ({ label: option.uomLongName, value: option.id }));
    let sampleContainerOptions = sampleContainerData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let resultValueOptions = resultValueData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let subDepartmentOptions = departmentData.modelItems?.filter((item: any) => item.parentDepartmentId !== null)?.map((option: any) => ({ label: option.name, value: option.id }));
    let testComponentOptions = componentData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        append({});
    }, [])

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.sample, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.unitOfMeasure, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.sampleContainer, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.resultValue, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.department, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.component, {}));
    }, []);

    function handleAddMoreComponentClick() {

        let componentId = getValues("formulaTestComponentId")?.value;
        let componentName = getValues("formulaTestComponentId")?.label;
        if (componentName) {
            if (componentResultFormulas?.length) {
                let operator = getValues("formulaComponentOperatorId")?.value;
                if (operator) {
                    let formula = [{
                        formulaName: getValues("formulaName"),
                        formula: `${componentResultFormulas[0]?.formula}${operator}p${componentId}`,
                        displayFormula: `${componentResultFormulas[0]?.displayFormula}${operator}${componentName}`,
                        decimalUpto: getValues("formulaDecimalUpto") ?? 0,
                        isRoudingOff: getValues("formulaIsRoudingOff") ?? false
                    }]
                    setComponentResultFormulas(formula);
                }
            }
            else {
                let formula = [{
                    id: 0,
                    formulaName: getValues("formulaName"),
                    formula: `p${componentId}`,
                    displayFormula: componentName,
                    decimalUpto: getValues("formulaDecimalUpto") ?? 0,
                    isRoundingOff: getValues("formulaIsRoudingOff") ?? false
                }]
                setComponentResultFormulas(formula)
            }
        }
    }

    function onSubmit(data: any) {

        let bodyData = getFormBody(data);

        let referenceRangeConditionId = referenceRangeCondition?.value ?? 0; //getValues("referenceRangeCondition")?.value ?? 0;

        if (bodyData?.componentReferenceRanges?.length && referenceRangeConditionId) {
            let newList = bodyData?.componentReferenceRanges?.map((item: any) => ({
                ...item,
                conditionAgeGender: referenceRangeConditionId,
                genderId: item.genderId?.value
            }))
            bodyData = {
                ...bodyData,
                componentReferenceRanges: newList ?? []
            }
        }

        bodyData = {
            ...bodyData,
            componentResultFormulas: bodyData.resultType !== 4 ? [] : componentResultFormulas ?? []
        }

        setLoading(true);
        services.createComponent(bodyData)
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
                            <FormPrimaryHeading label={formatMessage({ id: "create-test-component" })} />
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
                                            <CustomSelect
                                                options={clinicOptions}
                                                label={formatMessage({ id: "clinic" })}
                                                name="componentClinicMappingIds"
                                                control={control}
                                                error={errors.componentClinicMappingIds}
                                                rules={validationRule.textbox({ required: true })}
                                                multiple
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "component-name" })}
                                                name="name"
                                                control={control}
                                                error={errors.name}
                                                rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "integration-id" })}
                                                name="integrationId"
                                                control={control}
                                                error={errors.integrationId}
                                                rules={validationRule.textbox({ required: true, type: "number" })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={subDepartmentOptions}
                                                label={formatMessage({ id: "sub-department" })}
                                                name="subDepartmentId"
                                                control={control}
                                                error={errors.subDepartmentId}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={resultTypeOptions}
                                                label={formatMessage({ id: "result-type" })}
                                                name="resultType"
                                                control={control}
                                                error={errors.resultType}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        {watch("resultType")?.value === 3 &&
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={resultValueOptions}
                                                    label={formatMessage({ id: "result-value" })}
                                                    name="componentResultValueIds"
                                                    control={control}
                                                    error={errors.componentResultValueIds}
                                                    rules={validationRule.textbox({ required: watch("resultType")?.value === 3 ? true : false })}
                                                    multiple
                                                />
                                            </Grid>
                                        }
                                        {watch("resultType")?.value === 1 &&
                                            <>
                                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "decimal-upto" })}
                                                        name="decimalUpto"
                                                        control={control}
                                                        error={errors.decimalUpto}
                                                        rules={validationRule.textbox(
                                                            {
                                                                required: watch("resultType")?.value === 1 ? true : false,
                                                                type: "number"
                                                            }
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                                    <CustomCheckBox
                                                        name="isRoudingOff"
                                                        label={formatMessage({ id: "is-rounding-off" })}
                                                        control={control}
                                                        error={errors.isRoudingOff}
                                                        rules={validationRule.textbox({ required: watch("resultType")?.value === 1 ? true : false })}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={sampleTypeOptions}
                                                label={formatMessage({ id: "sample-type" })}
                                                name="sampleId"
                                                control={control}
                                                error={errors.sampleId}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={unitOfMeasureOptions}
                                                label={formatMessage({ id: "unit-of-measurement" })}
                                                name="unitOfMeasureId"
                                                control={control}
                                                error={errors.unitOfMeasureId}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={sampleContainerOptions}
                                                label={formatMessage({ id: "sample-container" })}
                                                name="sampleContainerId"
                                                control={control}
                                                error={errors.sampleContainerId}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "equipment-test-code" })}
                                                name="equipmentTestCode"
                                                control={control}
                                                error={errors.equipmentTestCode}
                                                rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                                            />
                                        </Grid>

                                        {watch("resultType")?.value === 4 &&
                                            <>
                                                <Grid item xs={12}>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="result-formula" />
                                                    </h3>
                                                </Grid>
                                                <Grid container spacing={2} item xs={12}>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "formula-name" })}
                                                            name="formulaName"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "decimal-upto" })}
                                                            name="formulaDecimalUpto"
                                                            control={control}
                                                            type="number"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                                        <CustomCheckBox
                                                            name="formulaIsRoudingOff"
                                                            label={formatMessage({ id: "is-rounding-off" })}
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                                        <CustomSelect
                                                            label={formatMessage({ id: "component" })}
                                                            options={testComponentOptions}
                                                            control={control}
                                                            name="formulaTestComponentId"
                                                        />
                                                    </Grid>
                                                    {componentResultFormulas?.length > 0 &&
                                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                                            <CustomSelect
                                                                label={formatMessage({ id: "action" })}
                                                                options={componentMathmeticalOperatorOptions}
                                                                control={control}
                                                                name="formulaComponentOperatorId"
                                                                defaultValue={componentMathmeticalOperatorOptions[0]}
                                                            />
                                                        </Grid>
                                                    }
                                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                                        <Button variant="contained" color="primary" onClick={handleAddMoreComponentClick}>
                                                            <FormattedMessage id="add" />
                                                        </Button>
                                                    </Grid>

                                                    {componentResultFormulas?.length > 0 &&
                                                        <Grid item xs={12} lg={12} md={12} sm={6}>
                                                            <TableContainer>
                                                                <Table stickyHeader aria-label="sticky table">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell style={{ width: "25%" }}><FormattedMessage id="formula-name" /></TableCell>
                                                                            <TableCell style={{ width: "25%" }}><FormattedMessage id="formula" /></TableCell>
                                                                            <TableCell style={{ width: "25%" }}><FormattedMessage id="decimal-upto" /></TableCell>
                                                                            <TableCell style={{ width: "25%" }}><FormattedMessage id="is-rounding-off" /></TableCell>
                                                                            <TableCell></TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {componentResultFormulas?.map((formula: any, index: any) => {
                                                                            return (
                                                                                <TableRow hover key={index} role="checkbox" tabIndex={-1}>
                                                                                    <TableCell>{formula.formulaName}</TableCell>
                                                                                    <TableCell>{formula.displayFormula}</TableCell>
                                                                                    <TableCell>{formula.decimalUpto}</TableCell>
                                                                                    <TableCell>{formula.isRoundingOff ? "Yes" : "No"}</TableCell>
                                                                                    <TableCell>
                                                                                        {(componentResultFormulas.length) !== 0 && <IconButton
                                                                                            size="small"
                                                                                            style={{ margin: "0px", right: 0, marginTop: "-18px", marginRight: "-8px" }}
                                                                                            color="secondary"
                                                                                            onClick={() => {
                                                                                                setComponentResultFormulas([])
                                                                                            }}
                                                                                        >
                                                                                            <Cancel fontSize="small" />
                                                                                        </IconButton>}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Grid>
                                                    }

                                                </Grid>
                                            </>
                                        }

                                        <Grid item xs={12}>
                                            <h3 className="formHeading">
                                                <FormattedMessage id="reference-range" />
                                            </h3>
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "minimum-range" })}
                                                name="minimumRange"
                                                control={control}
                                                error={errors.minimumRange}
                                                rules={validationRule.textbox({ type: "number" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "maximum-range" })}
                                                name="maximumRange"
                                                control={control}
                                                error={errors.maximumRange}
                                                rules={validationRule.textbox({ type: "number" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "low-panic-value" })}
                                                name="lowPanicValue"
                                                control={control}
                                                error={errors.lowPanicValue}
                                                rules={validationRule.textbox({ type: "number" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "high-panic-value" })}
                                                name="highPanicValue"
                                                control={control}
                                                error={errors.highPanicValue}
                                                rules={validationRule.textbox({ type: "number" })}
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={3} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "text-reference-range" })}
                                                name="textReferenceRange"
                                                control={control}
                                                rows={4}
                                                multiline
                                            />
                                        </Grid>

                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            {/* <CustomSelect
                                                options={referenceRangeConditionOptions}
                                                label={formatMessage({ id: "reference-range-condition" })}
                                                control={control}
                                                name="referenceRangeCondition"
                                                rules={validationRule.textbox({ required: true })}
                                                defaultValue={referenceRangeConditionOptions[0]}
                                            /> */}
                                            <Select
                                                options={referenceRangeConditionOptions}
                                                label={formatMessage({ id: "reference-range-condition" })}
                                                onChange={(_, data: any) => {
                                                    setReferenceRangeCondition(data);
                                                    if (data?.value == 1) {
                                                        const records = getValues("componentReferenceRanges");
                                                        let rangeData = records?.map((item: any) => ({
                                                            ...item,
                                                            genderId: []
                                                        }));
                                                        setValue("componentReferenceRanges", rangeData);
                                                    }
                                                    else if (data?.value == 2) {
                                                        const records = getValues("componentReferenceRanges");
                                                        let rangeData = records?.map((item: any) => ({
                                                            ...item,
                                                            from_Age: null,
                                                            to_Age: null
                                                        }));
                                                        setValue("componentReferenceRanges", rangeData);
                                                    }
                                                }}
                                                defaultValue={referenceRangeConditionOptions[0]}
                                            />
                                        </Grid>

                                        <Grid container spacing={2} item xs={12}>
                                            {fields.map(({ id }, index) => {
                                                return (
                                                    <React.Fragment key={id}>
                                                        <Grid item xs={12} lg={3} md={3} sm={6}>
                                                            <CustomSelect
                                                                options={genderTypeOptions}
                                                                label={formatMessage({ id: "gender-type" })}
                                                                control={control}
                                                                name={`componentReferenceRanges[${index}][genderId]`}
                                                                error={errors?.[`componentReferenceRanges`]?.[index]?.['genderId']}
                                                                disabled={referenceRangeCondition?.value === 1 ? true : false}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={3} md={3} sm={6}>
                                                            <CustomTextBox
                                                                label={formatMessage({ id: "age-in-years-from" })}
                                                                control={control}
                                                                name={`componentReferenceRanges[${index}][from_Age]`}
                                                                error={errors?.[`componentReferenceRanges`]?.[index]?.['from_Age']}
                                                                type="number"
                                                                disabled={referenceRangeCondition?.value === 2 ? true : false}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={2} md={3} sm={6}>
                                                            <CustomTextBox
                                                                label={formatMessage({ id: "age-in-years-to" })}
                                                                control={control}
                                                                name={`componentReferenceRanges[${index}][to_Age]`}
                                                                error={errors?.[`componentReferenceRanges`]?.[index]?.['to_Age']}
                                                                type="number"
                                                                disabled={referenceRangeCondition?.value === 2 ? true : false}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={2} md={3} sm={6}>
                                                            <CustomTextBox
                                                                label={formatMessage({ id: "minimum-value" })}
                                                                control={control}
                                                                name={`componentReferenceRanges[${index}][minimumValue]`}
                                                                error={errors?.[`componentReferenceRanges`]?.[index]?.['minimumValue']}
                                                                type="number"
                                                                rules={validationRule.textbox({ required: true, type: "number" })}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={2} md={3} sm={6} style={{ position: 'relative' }}>
                                                            <CustomTextBox
                                                                label={formatMessage({ id: "maximum-value" })}
                                                                control={control}
                                                                name={`componentReferenceRanges[${index}][maximumValue]`}
                                                                error={errors?.[`componentReferenceRanges`]?.[index]?.['maximumValue']}
                                                                type="number"
                                                                rules={validationRule.textbox({ required: true, type: "number" })}
                                                            />
                                                            {(fields.length - 1) !== 0 && <IconButton
                                                                size="small"
                                                                style={{ margin: "0px", position: "absolute", right: 0, marginTop: "-18px", marginRight: "-8px" }}
                                                                color="secondary"
                                                                onClick={() => {
                                                                    remove(index);
                                                                }}
                                                            >
                                                                <Cancel fontSize="small" />
                                                            </IconButton>}
                                                        </Grid>
                                                    </React.Fragment>
                                                )
                                            })}
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={1} sm={6}>
                                            <SecondaryButton
                                                label="Add More"
                                                endIcon={<AddCircle color="primary" />}
                                                onClick={() => {
                                                    append({});
                                                }}
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

export default CreateTestComponentModal;

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