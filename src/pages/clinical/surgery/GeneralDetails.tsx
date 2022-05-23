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


const GeneralDetails = (props: Props) => {
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
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomSelect
                                    options={medicalStaffOptions}
                                    label={formatMessage({ id: "assisting-nurse" })}
                                    name="husbandParentsConsanguinityId"
                                    control={control}
                                    error={errors.husbandParentsConsanguinityId}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "informed-consent" })} </FormLabel>
                                <CustomCheckBox
                                    label={formatMessage({ id: "informed-pre-anesthesia" })}
                                    control={control}
                                    name="isSubvention"
                                />
                                <CustomCheckBox
                                    label={formatMessage({ id: "check-list-done" })}
                                    control={control}
                                    name="isSubvention"
                                />
                                <CustomCheckBox
                                    label={formatMessage({ id: "biopsy" })}
                                    control={control}
                                    name="isSubvention"
                                />
                                <CustomCheckBox
                                    label={formatMessage({ id: "anesthesia-clearance" })}
                                    control={control}
                                    name="isSubvention"
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomSelect
                                    options={medicalStaffOptions}
                                    label={formatMessage({ id: "icd-10-diagnosis" })}
                                    name="husbandParentsConsanguinityId"
                                    control={control}
                                    placeholder="as selected in Diagnosis"
                                    error={errors.husbandParentsConsanguinityId}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "icd-10-code" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomSelect
                                    options={medicalStaffOptions}
                                    label={formatMessage({ id: "assistant" })}
                                    name="husbandParentsConsanguinityId"
                                    control={control}
                                    error={errors.husbandParentsConsanguinityId}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "reason-for-admission" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="surgery Indication"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "validated-by" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="logged user who checks"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "cpt-code" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "other-diagnosis" })}
                                    name="companyName"
                                    control={control}
                                    error={errors.companyName}
                                    placeholder="free text 50 characters"
                                    rules={validationRule.textbox({ type: "textWithSpace" })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <Box>
                                                <h3 className="formHeading">
                                                    <FormattedMessage id="patient-personal-details" />
                                                </h3>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={12}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "profession" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                rules={validationRule.textbox({ type: "textWithSpace" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={12}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "next-of-kin" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                rules={validationRule.textbox({ type: "textWithSpace" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={12}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "insurance-company" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                rules={validationRule.textbox({ type: "textWithSpace" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={12}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "mobile-no1" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                rules={validationRule.textbox({ type: "textWithSpace" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={12}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "mobile-no2" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                rules={validationRule.textbox({ type: "textWithSpace" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={12}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "relationship" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                rules={validationRule.textbox({ type: "textWithSpace" })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={12}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "validity" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                rules={validationRule.textbox({ type: "textWithSpace" })}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
            {loading || deleteLoading && <HoverLoader />}
        </>
    );
};

export default GeneralDetails;
