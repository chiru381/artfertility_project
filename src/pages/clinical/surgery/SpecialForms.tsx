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


const SpecialForms = (props: Props) => {
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
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="egg-retrieval(opu)" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <h3 className="formHeading">
                                                                <FormattedMessage id="patient" />
                                                            </h3>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} md={4} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "wt" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} md={4} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "ht" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} md={4} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "bmi" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} md={4} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "bp" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={4} md={4} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "pr" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <h3 className="formHeading">
                                                                <FormattedMessage id="pre-medication" />
                                                            </h3>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "midazolam(dormicum)2.5-mg-inj-iu" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex" }}>
                                                        <Grid item xs={12} lg={4}>
                                                            <CustomCheckBox
                                                                label={formatMessage({ id: "pethidine-im" })}
                                                                name="isEnlarged"
                                                                control={control}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={4}>
                                                            <CustomTextBox
                                                                label={formatMessage({ id: "0.00" })}
                                                                name="companyName"
                                                                control={control}
                                                                error={errors.companyName}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <h3 className="formHeading">
                                                                <FormattedMessage id="anti-biotics" />
                                                            </h3>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "iv-ceftriaxone-2mg" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6} style={{ display: "flex" }}>
                                                        <Grid item xs={12} lg={6}>
                                                            <CustomCheckBox
                                                                label={formatMessage({ id: "inj-gentamicin" })}
                                                                name="isEnlarged"
                                                                control={control}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={6}>
                                                            <CustomSelect
                                                                options={medicalStaffOptions}
                                                                label={formatMessage({ id: "0.00" })}
                                                                name="husbandParentsConsanguinityId"
                                                                control={control}
                                                                placeholder="as selected in General"
                                                                error={errors.husbandParentsConsanguinityId}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "iv-metronidazole-1mg" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "others" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "description" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                            placeholder="free text 100 characters"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <h3 className="formHeading">
                                                                <FormattedMessage id="follicles-flush" />
                                                            </h3>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <FormLabel component="legend">{formatMessage({ id: "left-ovary" })} </FormLabel>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "all-flushed" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <FormLabel component="legend">{formatMessage({ id: "right-ovary" })} </FormLabel>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "all-flushed" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "partially-flushed" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "partially-flushed" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "not-flushed" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "not-flushed" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="access-to-ovary" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "abnormal-findings" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "observations" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 200 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "access-to-left-ovary" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    placeholder="as selected in General"
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "access-to-right-ovary" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    placeholder="as selected in General"
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "reason-of-difficulty" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 100 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "reason-of-difficulty" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 100 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormLabel component="legend">{formatMessage({ id: "punctured-paratubal-ovarian-cyst" })} </FormLabel>
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <FormLabel component="legend">{formatMessage({ id: "left-ovary" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "dermoid" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "endometrioma" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "hydrosalpinx" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "adhesion" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <FormLabel component="legend">{formatMessage({ id: "right-ovary" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "dermoid" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "endometrioma" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "hydrosalpinx" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "adhesion" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "description" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 100 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "description" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 100 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormLabel component="legend">{formatMessage({ id: "access-ovary-via-puncture" })} </FormLabel>
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <FormLabel component="legend">{formatMessage({ id: "left-ovary" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "transmyometrial" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "endometrioma" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "myoma" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "prophylactic-antibiotic" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "uterus" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <FormLabel component="legend">{formatMessage({ id: "right-ovary" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "transmyometrial" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "endometrioma" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "myoma" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "prophylactic-antibiotic" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "uterus" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 100 characters"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <h3 className="formHeading">
                                                                <FormattedMessage id="complications" />
                                                            </h3>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex" }}>
                                                        <Grid item xs={12} lg={4}>
                                                            <CustomCheckBox
                                                                label={formatMessage({ id: "pain" })}
                                                                name="isEnlarged"
                                                                control={control}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={8}>
                                                            <RadioButton
                                                                label="Mild"
                                                                name="isOnsiteVisit"
                                                                onChange={() => {
                                                                    setIsOnsiteVisit(true);
                                                                }}
                                                                checked={isOnsiteVisit}
                                                            />
                                                            <RadioButton
                                                                label="Moderate"
                                                                name="isOnsiteVisit"
                                                                onChange={() => {
                                                                    setIsOnsiteVisit(false);
                                                                }}
                                                                checked={!isOnsiteVisit}
                                                            />
                                                            <RadioButton
                                                                label="Severe"
                                                                name="isOnsiteVisit"
                                                                onChange={() => {
                                                                    setIsOnsiteVisit(false);
                                                                }}
                                                                checked={!isOnsiteVisit}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex" }}>
                                                        <Grid item xs={12} lg={4}>
                                                            <CustomCheckBox
                                                                label={formatMessage({ id: "haemorrhage" })}
                                                                name="isEnlarged"
                                                                control={control}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={8}>
                                                            <RadioButton
                                                                label="Mild"
                                                                name="isOnsiteVisit"
                                                                onChange={() => {
                                                                    setIsOnsiteVisit(true);
                                                                }}
                                                                checked={isOnsiteVisit}
                                                            />
                                                            <RadioButton
                                                                label="Moderate"
                                                                name="isOnsiteVisit"
                                                                onChange={() => {
                                                                    setIsOnsiteVisit(false);
                                                                }}
                                                                checked={!isOnsiteVisit}
                                                            />
                                                            <RadioButton
                                                                label="Severe"
                                                                name="isOnsiteVisit"
                                                                onChange={() => {
                                                                    setIsOnsiteVisit(false);
                                                                }}
                                                                checked={!isOnsiteVisit}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "tranexamic-acid-1gm-iv" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex" }}>
                                                        <Grid item xs={12} lg={4}>
                                                            <CustomCheckBox
                                                                label={formatMessage({ id: "dizzies" })}
                                                                name="isEnlarged"
                                                                control={control}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={8}>
                                                            <RadioButton
                                                                label="Mild"
                                                                name="isOnsiteVisit"
                                                                onChange={() => {
                                                                    setIsOnsiteVisit(true);
                                                                }}
                                                                checked={isOnsiteVisit}
                                                            />
                                                            <RadioButton
                                                                label="Moderate"
                                                                name="isOnsiteVisit"
                                                                onChange={() => {
                                                                    setIsOnsiteVisit(false);
                                                                }}
                                                                checked={!isOnsiteVisit}
                                                            />
                                                            <RadioButton
                                                                label="Severe"
                                                                name="isOnsiteVisit"
                                                                onChange={() => {
                                                                    setIsOnsiteVisit(false);
                                                                }}
                                                                checked={!isOnsiteVisit}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "if-severe-atropine-iv-given" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12}>
                                                        <CustomSelect
                                                            options={medicalStaffOptions}
                                                            label={formatMessage({ id: "dose" })}
                                                            name="husbandParentsConsanguinityId"
                                                            control={control}
                                                            error={errors.husbandParentsConsanguinityId}
                                                        />
                                                    </Grid>

                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <h3 className="formHeading">
                                                                <FormattedMessage id="other-data" />
                                                            </h3>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "remarks" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                            placeholder="free text 200 characters"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "further-management" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                            placeholder="free text 200 characters"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <h3 className="formHeading">
                                                                <FormattedMessage id="medication" />
                                                            </h3>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "luteal-pahse-support-as-prescribed-previously" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomSelect
                                                            options={medicalStaffOptions}
                                                            label={formatMessage({ id: "instructions-given" })}
                                                            name="husbandParentsConsanguinityId"
                                                            control={control}
                                                            error={errors.husbandParentsConsanguinityId}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomSelect
                                                            options={medicalStaffOptions}
                                                            label={formatMessage({ id: "crinone-gel-8%" })}
                                                            name="husbandParentsConsanguinityId"
                                                            control={control}
                                                            error={errors.husbandParentsConsanguinityId}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={12} sm={12}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "pregnyl(iu)" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                            placeholder="free text 50 characters"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomSelect
                                                            options={medicalStaffOptions}
                                                            label={formatMessage({ id: "endometrin-100mg" })}
                                                            name="husbandParentsConsanguinityId"
                                                            control={control}
                                                            error={errors.husbandParentsConsanguinityId}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomSelect
                                                            options={medicalStaffOptions}
                                                            label={formatMessage({ id: "cyclogest-400mg-pessary" })}
                                                            name="husbandParentsConsanguinityId"
                                                            control={control}
                                                            error={errors.husbandParentsConsanguinityId}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "buserelin-spray-daily" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={6} md={6} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "puffs-per-day" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "testoge-1-sachet" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CustomCheckBox
                                                            label={formatMessage({ id: "continue-hrt-as-previously-mentioned" })}
                                                            name="isEnlarged"
                                                            control={control}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="diagnostic-hysteroscopy" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "instructions-given-by" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="additional-instructions" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "walk-30-min-after-procedure" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "no-sexual-intercourse(1week)" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "serum-betal-hcg" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "serum-bhcg-on" })}
                                        name="companyName"
                                        control={control}
                                        error={errors.companyName}
                                        placeholder="from ET form"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="fna" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={12} md={4} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "anesthesia-type" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={8}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="clinical-findings" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "testis-vol-left" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "testis-vol-right" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "epididymis-is-present" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "vas-deferens-is-present" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "left-testicle" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "right-testicle" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "fine-needle-aspiration-performed-on" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "sperum-cells" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "left-testicles" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "aspiration-performed-left" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "aspiration-performed-right" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "testicular-tissues-sent-for-histopathology" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "comments" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 500 characters"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="male-anamnesis" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "fsh-value" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "karyotype" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "type-of-azoospermia" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "maturation-arrest" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="tese-mtese" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} lg={12} md={4} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "pre-operative-diagnosis" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={4} sm={6}>
                                                        <CustomTextBox
                                                            label={formatMessage({ id: "post-operative-diagnosis" })}
                                                            name="companyName"
                                                            control={control}
                                                            error={errors.companyName}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={4} sm={6}>
                                                        <CustomSelect
                                                            options={medicalStaffOptions}
                                                            label={formatMessage({ id: "procedure" })}
                                                            name="husbandParentsConsanguinityId"
                                                            control={control}
                                                            error={errors.husbandParentsConsanguinityId}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={12} md={4} sm={6}>
                                                        <CustomSelect
                                                            options={medicalStaffOptions}
                                                            label={formatMessage({ id: "complications" })}
                                                            name="husbandParentsConsanguinityId"
                                                            control={control}
                                                            error={errors.husbandParentsConsanguinityId}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <h3 className="formHeading">
                                                                <FormattedMessage id="clinical-findings" />
                                                            </h3>
                                                        </Box>
                                                    </Grid>
                                                    <FormLabel component="legend">{formatMessage({ id: "pre-operative-findings" })}: </FormLabel>
                                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                                        <CustomSelect
                                                            options={medicalStaffOptions}
                                                            label={formatMessage({ id: "testis-vol-left" })}
                                                            name="husbandParentsConsanguinityId"
                                                            control={control}
                                                            error={errors.husbandParentsConsanguinityId}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                                        <CustomSelect
                                                            options={medicalStaffOptions}
                                                            label={formatMessage({ id: "testis-vol-right" })}
                                                            name="husbandParentsConsanguinityId"
                                                            control={control}
                                                            error={errors.husbandParentsConsanguinityId}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="male-anamnesis" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "fsh-value" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "dna" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "karyotype" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "azoospermia" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "maturation-arrest" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={2} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "latrozole" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={5} md={4} sm={6}>
                                                <CustomDatePicker
                                                    label={formatMessage({ id: "medication-start-date" })}
                                                    name="capturingDate"
                                                    control={control}
                                                    error={errors.capturingDate}
                                                    rules={validationRule.textbox({ required: true })}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={5} md={4} sm={6}>
                                                <CustomDatePicker
                                                    label={formatMessage({ id: "medication-end-date" })}
                                                    name="capturingDate"
                                                    control={control}
                                                    error={errors.capturingDate}
                                                    rules={validationRule.textbox({ required: true })}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "additional-medication" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="tese" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "left" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "right" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>

                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "both-testicles" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomTextBox
                                                    label=""
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomTextBox
                                                    label=""
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "waiting-enzymatic-digestion" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "separate-sample-sent-for-direct-histology" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="micro-tese" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "left" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "right" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>

                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "both-testicles" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>

                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomTextBox
                                                    label=""
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "waiting-enzymatic-digestion" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "separate-sample-sent-for-direct-histology" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "epididymis" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "vas-deferens" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "epididymis-is" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "vas-deferens-is" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "both-testicles" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "needs" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>

                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomDatePicker
                                                    label={formatMessage({ id: "date-of-removal" })}
                                                    name="capturingDate"
                                                    control={control}
                                                    error={errors.capturingDate}
                                                    rules={validationRule.textbox({ required: true })}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomDatePicker
                                                    label={formatMessage({ id: "follow-up-date" })}
                                                    name="capturingDate"
                                                    control={control}
                                                    error={errors.capturingDate}
                                                    rules={validationRule.textbox({ required: true })}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "stiches-removed" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "skin-suture-is" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "no-of-stiches-on-right-side" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "no-of-stiches-on-left-side" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "sperm-seen-during-the-procedure" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>

                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "disposition" })}
                                                    name="companyName"
                                                    control={control}
                                                    placeholder="free text 200 characters"
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "further-management" })}
                                                    name="companyName"
                                                    control={control}
                                                    placeholder="free text 200 characters"
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "observations" })}
                                                    name="companyName"
                                                    control={control}
                                                    placeholder="free text 200 characters"
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                            <Grid container spacing={2}>

                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="instructions-after-egg-retrieval" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={8} md={12} sm={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "instructions-given-by" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "medication" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "start-medication-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "folic-acid" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "folic-acid-mcg" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "cyclogest-400mg-vaginally-3x-daily" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "clexane" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "start-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "crinone-gel-8%-3x-daily" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "clexane" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                placeholder="free text 50 characters"
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "endometrin-100mg-vaginally-3x-daily" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "buserelin" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "daily-puff" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={4} md={12} sm={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box>
                                                <h3 className="formHeading">
                                                    <FormattedMessage id="ohss" />
                                                </h3>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "injection-cetrotide" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "start-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "end-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "tab-dostinex" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "start-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "end-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "tab-letrozole" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "start-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "end-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="other-instructions" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={6} md={6} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "yes" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6} md={6} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "yes" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6} md={6} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "yes" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6} md={6} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "yes" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={12} md={12} sm={12}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "others" })}
                                        name="companyName"
                                        control={control}
                                        error={errors.companyName}
                                        placeholder="free text 200 characters"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="embryo-transfer" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box>
                                                <h3 className="formHeading">
                                                    <FormattedMessage id="staff" />
                                                </h3>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "embrologist" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "assistant" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box>
                                                <h3 className="formHeading">
                                                    <FormattedMessage id="transfer" />
                                                </h3>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "no-of-embryos-transferred" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "time" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "duration" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="embryo-quality" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="embryo1" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "grading" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "grading-comments" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 50 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "day-of-transfer" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "remarks" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 50 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "blastocyst-stage" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "cfdna" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pgt-m" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pgt-sr" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pgt-a" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="embryo2" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "grading" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "grading-comments" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 50 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "day-of-transfer" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "remarks" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 50 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "blastocyst-stage" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "cfdna" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pgt-m" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pgt-sr" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pgt-a" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="embryo3" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "grading" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "grading-comments" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 50 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "day-of-transfer" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "remarks" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 50 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "blastocyst-stage" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "cfdna" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pgt-m" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pgt-sr" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pgt-a" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="other-data" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "type-of-character-used" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "distance-to-the-fundus" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "embryo-transfer-difficulty" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "obturator-used" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "cavity-length" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "cervix-dilated" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "pozzi-used" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "missed-transfer" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "blood-at-the-tip-of-inner-catheter" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "echoguided" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "others" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "mucus-at-the-tip-of-inner-catheter" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "visibility-uterus" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "bhcg-on" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "blood-at-the-tip-of-outer-catheter" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "mucus-at-the-tip-of-outer-catheter" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>


                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="medication" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <CustomCheckBox
                                                label={formatMessage({ id: "luteal-pahse-support-as-prescribed-previously" })}
                                                name="isEnlarged"
                                                control={control}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "instructions-given" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "pregnyl(iu)" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "cyclogest-400mg-pessary" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "crinone-gel-8%" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "endometrin-100mg" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={10} md={12} sm={12}>
                                            <CustomCheckBox
                                                label={formatMessage({ id: "buserelin-spray-daily" })}
                                                name="isEnlarged"
                                                control={control}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "puffs-per-day" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "remarks" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                placeholder="free text 200 characters"
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "ultrasound-placement" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                placeholder="free text 200 characters"
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "further-management" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                                placeholder="free text 200 characters"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="instructions-after-embryo-transfer" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={12} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "instructions-given-by" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "folic-acid" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "folic-acid-mcg" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "aspirin" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "mg-aspirin" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "clexane" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "mg-clexane" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={4} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "clexane-start-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "progyluton-oral" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "mg-progylution-oral" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "progyluton-vaginal" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "mg-progyluton-vaginal" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "prednisolone" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "mg-predinisolone" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "innohep" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "mg-innohep" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={4} sm={6}>
                                            <CustomDatePicker
                                                label={formatMessage({ id: "innohep-start-date" })}
                                                name="capturingDate"
                                                control={control}
                                                error={errors.capturingDate}
                                                rules={validationRule.textbox({ required: true })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "buserelin" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "daily-puffs" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={12} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "vaginal-medication-3x-daily" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "medication" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "first-application" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "second-application" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "third-application" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="additional-instructions" />
                                        </h3>
                                    </Box>
                                </Grid>


                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "walk-30min-after-procedure" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "no-sexual-intercourse(1week)" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomSelect
                                        options={medicalStaffOptions}
                                        label={formatMessage({ id: "serum-beta-hcg" })}
                                        name="husbandParentsConsanguinityId"
                                        control={control}
                                        error={errors.husbandParentsConsanguinityId}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "serum-bhcg-on" })}
                                        name="companyName"
                                        control={control}
                                        error={errors.companyName}
                                        placeholder="from ET form"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="diagnostic-hysteroscopy" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="previous-gynecological-history" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <FormLabel component="legend">{formatMessage({ id: "clinical-history" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pre-during-ivf" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "recurrent-abortion" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "suspected-uterine-abnormalities" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "adhesions" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 100 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <h3 className="formHeading">
                                                        <FormattedMessage id="previous-gynecological-history" />
                                                    </h3>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "campo-trophy-scope-diameter-2.9mm" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "betochi-set-diameter-6mm" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "fibroscope-diameter-3.5mm-3.6mm" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "resectoscope-set" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "continuous-flow-operating-sheath-size-4.4mm" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "noraml-findings" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="from ET form"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "left-ostium" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "right-ostium" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "polyp" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "fibroid" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "septum" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "polyp" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "fibroid" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "septum" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "adhesions" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "60%" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "adhesions" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "60%" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free-text-100-characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free-text-100-characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "vagina" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "cervix" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free-text-100-characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free-text-100-characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "upload-documents" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "uterine-cavity" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "polyp" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "anterior" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "free-text" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "febroid" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "anterior" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "free-text" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "septium" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "anterior" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "free-text" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4} md={4} sm={6}>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "adhesions" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={8} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "anterior" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "free-text" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 100 characters"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} lg={4}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "anatomical-pathology" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "biopsy" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "histopathology" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free-text" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "planned-treatment" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "hysterometry" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "hysterometry" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "hysteroscopical-treatment" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free-text" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "result" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free-text" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "future-treatment" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {loading || deleteLoading && <HoverLoader />}
        </>
    );
};

export default SpecialForms;
