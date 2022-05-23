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
import AddNewMedication from "./AddNewMedication";
import AddNewOTConsumables from "./AddNewOTConsumables";
import { getTableParams } from 'utils/global';


interface Props { }


const AnesthesiaDetails = (props: Props) => {
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [addNewOTConsumblesOpen, setAddNewOTConsumblesOpen] = useState(false);
    const [addNewMedicationOpen, setAddNewMedicationOpen] = useState(false);
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

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, params));
    }

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
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={5}>
                            <Grid container spacing={2}>
                                <Grid container lg={6} spacing={2} style={{ marginRight: "20px" }}>
                                    <Grid item xs={12} lg={12} md={12} sm={12}>
                                        <Box>
                                            <h3 className="formHeading">
                                                <FormattedMessage id="vital-signs" />
                                            </h3>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} lg={12} md={12} sm={12}>
                                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                            <Grid item xs={12}>
                                                <TableContainer>
                                                    <Table stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell></TableCell>
                                                                <TableCell><FormattedMessage id="pre-operative" /></TableCell>
                                                                <TableCell><FormattedMessage id="pre-operative" /></TableCell>
                                                                <TableCell><FormattedMessage id="pre-operative" /></TableCell>
                                                                <TableCell><FormattedMessage id="graph" /></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="temperature" /></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="blood-pressure(bp)" /></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="pulse-rate(pr)" /></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="respiratory-rate(rr)" /></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="o2-saturation" /></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="height" /></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="weight" /></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="monitored-by" /></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="date-and-time" /></TableCell>
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
                                </Grid>
                                <Grid container lg={6} spacing={2}>
                                    <Grid item xs={12}>
                                        <Box>
                                            <h3 className="formHeading">
                                                <FormattedMessage id="procedure" />
                                            </h3>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex" }}>
                                                    <FormLabel component="legend" >{formatMessage({ id: "anesthesia" })}:</FormLabel>
                                                    <CustomCheckBox
                                                        label={formatMessage({ id: "not-applicable" })}
                                                        name="isEnlarged"
                                                        control={control}
                                                    />
                                                    <CustomCheckBox
                                                        label={formatMessage({ id: "local" })}
                                                        name="isEnlarged"
                                                        control={control}
                                                    />
                                                    <CustomCheckBox
                                                        label={formatMessage({ id: "general" })}
                                                        name="isEnlarged"
                                                        control={control}
                                                    />
                                                    <CustomCheckBox
                                                        label={formatMessage({ id: "regional" })}
                                                        name="isEnlarged"
                                                        control={control}
                                                    />
                                                    <CustomCheckBox
                                                        label={formatMessage({ id: "sedation" })}
                                                        name="isEnlarged"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} lg={3} md={4} sm={6} style={{ display: "flex" }}>
                                                    <CustomSelect
                                                        options={medicalStaffOptions}
                                                        label={formatMessage({ id: "mild" })}
                                                        name="husbandParentsConsanguinityId"
                                                        control={control}
                                                        error={errors.husbandParentsConsanguinityId}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} lg={12} md={12} sm={12}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "mast-ventilation" })}
                                                        name="companyName"
                                                        control={control}
                                                        error={errors.companyName}

                                                    />
                                                </Grid>
                                                <Grid item xs={12} lg={12} md={12} sm={12}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "emergency" })}
                                                        name="companyName"
                                                        control={control}
                                                        error={errors.companyName}

                                                    />
                                                </Grid>
                                                <Grid item xs={12} lg={12} md={12} sm={12}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "reflexes" })}
                                                        name="companyName"
                                                        control={control}
                                                        error={errors.companyName}

                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={8} style={{ marginTop: "20px" }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "xa" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}

                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "p" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}

                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "t" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}

                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "c" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}

                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "s" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}

                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "ax" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}

                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={4} style={{ marginTop: "20px" }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomSelect
                                                options={medicalStaffOptions}
                                                label={formatMessage({ id: "dr" })}
                                                name="husbandParentsConsanguinityId"
                                                control={control}
                                                error={errors.husbandParentsConsanguinityId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "del" })}
                                                name="companyName"
                                                control={control}
                                                error={errors.companyName}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={10} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "disposition" })}
                                        name="companyName"
                                        control={control}
                                        error={errors.companyName}
                                        placeholder="free text 500 characters"

                                    />
                                </Grid>
                                <Grid item xs={12} lg={2} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "upload-documents" })}
                                        name="companyName"
                                        control={control}
                                        error={errors.companyName}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={12} md={12} sm={12}>
                                    <Grid item xs={12}>
                                        <Box>
                                            <h3 className="formHeading">
                                                <FormattedMessage id="medications" />
                                            </h3>
                                        </Box>
                                    </Grid>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid item xs={6} style={{ float: "right", marginBottom: "20px" }}>
                                            <SecondaryButton
                                                label={formatMessage({ id: "add-new" })}
                                                style={{ float: "right" }}
                                                onClick={() => {
                                                    setAddNewMedicationOpen(true);
                                                    setSelectedRow({});
                                                }}
                                            />
                                        </Grid>
                                        {addNewMedicationOpen && (
                                            <AddNewMedication
                                                closeModal={() => setAddNewMedicationOpen(false)}
                                                onApiCall={onApiCall}
                                            />
                                        )}
                                        <Grid item xs={12}>
                                            <TableContainer>
                                                <Table stickyHeader aria-label="sticky table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell><FormattedMessage id="drug-name" /></TableCell>
                                                            <TableCell><FormattedMessage id="dose" /></TableCell>
                                                            <TableCell><FormattedMessage id="route" /></TableCell>
                                                            <TableCell><FormattedMessage id="diluent" /></TableCell>
                                                            <TableCell><FormattedMessage id="frequency" /></TableCell>
                                                            <TableCell><FormattedMessage id="administration" /></TableCell>
                                                            <TableCell><FormattedMessage id="prescribed-by" /></TableCell>
                                                            <TableCell><FormattedMessage id="date-and-time-of-medication" /></TableCell>
                                                            <TableCell><FormattedMessage id="given-by" /></TableCell>
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
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box>
                                            <h3 className="formHeading">
                                                <FormattedMessage id="procedure" />
                                            </h3>
                                        </Box>
                                    </Grid>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "or-type" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                    placeholder="free text 50 characters"
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "surgery-type" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "classification" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "positioning" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={2} md={4} sm={6} >
                                                <FormLabel component="legend">{formatMessage({ id: "support-devices" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "pollows" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "gel-pads" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "arm-bands" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
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
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "head-rest" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "supine" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "safety-belts" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "lateral-supports" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "warming-devices" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free text 20 characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={2} md={4} sm={6} >
                                                <FormLabel component="legend">{formatMessage({ id: "padding" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "arms" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "axilla" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "heels" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "hips" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "knees" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "shoulder" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "head" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free text 20 characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={2} md={4} sm={6} >
                                                <Grid item xs={12} style={{ marginBottom: "20px" }}>
                                                    <CustomSelect
                                                        options={medicalStaffOptions}
                                                        label={formatMessage({ id: "hair-clipping" })}
                                                        name="husbandParentsConsanguinityId"
                                                        control={control}
                                                        error={errors.husbandParentsConsanguinityId}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "done-by" })}
                                                        name="companyName"
                                                        control={control}
                                                        error={errors.companyName}
                                                    />
                                                </Grid>
                                                <FormLabel component="legend">{formatMessage({ id: "skin-preparation" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "chlorhexidine" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "povidone-lodine" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free text 50 characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={2} md={4} sm={6} >
                                                <FormLabel component="legend">{formatMessage({ id: "electrocautery" })} </FormLabel>
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "yes" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "monopolar" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "bipolar" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "cutting" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "coagulation" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={3} md={4} sm={6} >
                                                <FormLabel component="legend">{formatMessage({ id: "patient-plate-location" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "arms" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "left" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "leg" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "left" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "buttocks" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomSelect
                                                    options={medicalStaffOptions}
                                                    label={formatMessage({ id: "left" })}
                                                    name="husbandParentsConsanguinityId"
                                                    control={control}
                                                    error={errors.husbandParentsConsanguinityId}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free text 50 characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={2} md={4} sm={6} >
                                                <FormLabel component="legend">{formatMessage({ id: "estimated-blood-loss" })} </FormLabel>
                                                <Grid item xs={12} style={{ marginBottom: "20px" }}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "swabs" })}
                                                        name="companyName"
                                                        control={control}
                                                        error={errors.companyName}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} style={{ marginBottom: "20px" }}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "suction" })}
                                                        name="companyName"
                                                        control={control}
                                                        error={errors.companyName}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "total" })}
                                                        name="companyName"
                                                        control={control}
                                                        error={errors.companyName}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} lg={2} md={4} sm={6} >
                                                <FormLabel component="legend">{formatMessage({ id: "specimens" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "yes" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "no" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "histo-pathology" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomTextBox
                                                    label={formatMessage({ id: "no-of-specimen" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "others" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free text 50 characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={2} md={4} sm={6} >
                                                <FormLabel component="legend">{formatMessage({ id: "instruments-sets" })} </FormLabel>
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "1" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free text 20 characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "2" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free text 20 characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                                <CustomCheckBox
                                                    label={formatMessage({ id: "3" })}
                                                    name="isEnlarged"
                                                    control={control}
                                                />
                                                <CustomTextBox
                                                    label={formatMessage({ id: "free text 20 characters" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} lg={4}>
                                                        <Grid item xs={12} style={{ marginBottom: "20px" }}>
                                                            <CustomTextBox
                                                                label={formatMessage({ id: "checklist" })}
                                                                name="companyName"
                                                                control={control}
                                                                error={errors.companyName}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <CustomTextBox
                                                                label={formatMessage({ id: "surgery-safety-checklist" })}
                                                                name="companyName"
                                                                control={control}
                                                                error={errors.companyName}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} lg={8}>
                                                        <Grid item xs={12}>
                                                            <Box>
                                                                <h3 className="formHeading">
                                                                    <FormattedMessage id="ot-consumables" />
                                                                </h3>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                                                                <Grid item xs={6} style={{ float: "right", marginBottom: "20px" }}>
                                                                    <SecondaryButton
                                                                        label={formatMessage({ id: "add-new" })}
                                                                        style={{ float: "right" }}
                                                                        onClick={() => {
                                                                            setAddNewOTConsumblesOpen(true);
                                                                            setSelectedRow({});
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                {addNewOTConsumblesOpen && (
                                                                    <AddNewOTConsumables
                                                                        closeModal={() => setAddNewOTConsumblesOpen(false)}
                                                                        onApiCall={onApiCall}
                                                                    />
                                                                )}
                                                                <Grid item xs={12}>
                                                                    <TableContainer>
                                                                        <Table stickyHeader aria-label="sticky table">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell><FormattedMessage id="item-name" /></TableCell>
                                                                                    <TableCell><FormattedMessage id="specification" /></TableCell>
                                                                                    <TableCell><FormattedMessage id="pre-count" /></TableCell>
                                                                                    <TableCell><FormattedMessage id="post-count" /></TableCell>
                                                                                    <TableCell><FormattedMessage id="checked-by" /></TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
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
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="input-output-chart" />
                                        </h3>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={8} md={8} sm={8}>
                                    <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={4}>
                                                <FormLabel component="legend">{formatMessage({ id: "intacke-add" })} </FormLabel>
                                                <TableContainer>
                                                    <Table stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="time(automatic-on-adding-line)" /></TableCell>
                                                                <TableCell><FormattedMessage id="oral(ml)" /></TableCell>
                                                                <TableCell><FormattedMessage id="parentral(ml)" /></TableCell>
                                                                <TableCell><FormattedMessage id="total(ml)" /></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                            <Grid item xs={12} lg={8}>
                                                <FormLabel component="legend">{formatMessage({ id: "output-add" })} </FormLabel>
                                                <TableContainer>
                                                    <Table stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><FormattedMessage id="time(automatic-on-adding-line)" /></TableCell>
                                                                <TableCell><FormattedMessage id="urine(ml)" /></TableCell>
                                                                <TableCell><FormattedMessage id="vomit(ml)" /></TableCell>
                                                                <TableCell><FormattedMessage id="drain(ml)" /></TableCell>
                                                                <TableCell><FormattedMessage id="blood(ml)" /></TableCell>
                                                                <TableCell><FormattedMessage id="total(ml)" /></TableCell>
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
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                            <Grid item xs={12} lg={4}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "total-intake" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={4}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "total-output" })}
                                                    name="companyName"
                                                    control={control}
                                                    error={errors.companyName}
                                                />
                                            </Grid>
                                        </Grid>

                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={4} md={4} sm={4}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "notes" })}
                                        name="companyName"
                                        control={control}
                                        error={errors.companyName}
                                        placeholder="free text 1000 characters"

                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box >
            {loading || deleteLoading && <HoverLoader />}
        </>
    );
};

export default AnesthesiaDetails;
