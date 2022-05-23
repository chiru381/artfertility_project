import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import FormLabel from "@material-ui/core/FormLabel";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import BorderColorOutlinedIcon from "@material-ui/icons/BorderColorOutlined";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from '@material-ui/core/Tooltip';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { TableButtonGroup, TableEditButton, SecondaryButton, TableCreateButton, DeleteButton } from 'components/button';
import { CustomSelect, CustomTextBox, CustomCheckBox, CustomDatePicker, RadioButton, CustomRadioButton } from "components/forms";
import { HoverLoader } from "components";
import { tableInitialState, cycleOptions, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage } from "utils/hooks";
import Header from "pages/clinical/Header";


interface Props { }


const DischargeSummery = (props: Props) => {
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [addNewRequestOpen, setAddNewRequestOpen] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation<any>();
    const { handleSubmit, formState: { errors }, control, watch, getValues, reset, } = useForm({ mode: "all" });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);
    const [isEditOn, setIsEditOn] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [richTextModalOpen, setRichTextModalOpen] = useState(false);
    const { fields, append, remove } = useFieldArray({ control, name: "clinicalHistoryContraceptions", });
    const [headerLabel, setHeaderLabel] = useState("");
    const [relevantNotes, setRelevantNote] = useState(null);
    const [treatmentPlan, setTreatmentPlan] = useState(null);
    const [isContraceptions, setIsContraceptions] = useState(false);
    const [isOnsiteVisit, setIsOnsiteVisit] = useState(true);


    let patientData = location.state ?? {};

    const { medicalStaffData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
        }),
        shallowEqual
    );

    let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
    }, []);

    function onPrint() { }
    function onNext() { }
    function onPrevious() { }
    function onEdit() { }
    function onDelete() { }
    function onSubmit() { }

    return (
        <>
            <Box>
                <Grid item xs={12}>
                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                        <Grid container spacing={2}>
                            < Grid item xs={12} lg={12} md={12} sm={12}>
                                <TableContainer>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><FormattedMessage id="admission-details" /></TableCell>
                                                <TableCell><FormattedMessage id="discharge-details" /></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            <Grid item xs={12} lg={6} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "reason-for-admission" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="As in General form"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "principal-discharge-diagnosis" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="free text 50 characters"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "surgery-findings" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="free text 500 characters"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "secondary-discharge-diagnosis1" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="free text 50 characters"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "secondary-discharge-diagnosis2" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="free text 50 characters"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "condition-on-discharge" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="free text 100 characters"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "education" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="free text 100 characters"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                    < Grid item xs={12} lg={12} md={12} sm={12}>
                                        <TableContainer>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><FormattedMessage id="s-no" /></TableCell>
                                                        <TableCell><FormattedMessage id="brand-name" /></TableCell>
                                                        <TableCell><FormattedMessage id="generic-name" /></TableCell>
                                                        <TableCell><FormattedMessage id="route" /></TableCell>
                                                        <TableCell><FormattedMessage id="strength" /></TableCell>
                                                        <TableCell><FormattedMessage id="dosage" /></TableCell>
                                                        <TableCell><FormattedMessage id="frequency" /></TableCell>
                                                        <TableCell><FormattedMessage id="duration" /></TableCell>
                                                        <TableCell><FormattedMessage id="instructions" /></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={9} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "discharge-and-followup-instructions" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="free text 500 characters"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>

                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomCheckBox
                                    label={formatMessage({ id: "sick-leave-not-required" })}
                                    control={control}
                                    name="isSubvention"
                                    placeholder="che"
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "sick-leave" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="free text 100 characters"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomDatePicker
                                    label={formatMessage({ id: "follow-up-on" })}
                                    name="lastMenstrualPeriod"
                                    control={control}
                                    error={errors.lastMenstrualPeriod}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomDatePicker
                                    label={formatMessage({ id: "sick-leave-from" })}
                                    name="lastMenstrualPeriod"
                                    control={control}
                                    error={errors.lastMenstrualPeriod}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomDatePicker
                                    label={formatMessage({ id: "sick-leave-to" })}
                                    name="lastMenstrualPeriod"
                                    control={control}
                                    error={errors.lastMenstrualPeriod}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
            {loading || deleteLoading && <HoverLoader />}
        </>
    );
};

export default DischargeSummery;
