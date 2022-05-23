import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ControlPointIcon from "@material-ui/icons/ControlPoint";

import { TableButtonGroup, DeleteButton } from 'components/button';
import { CustomSelect, Select, CustomTextBox, SearchableTextBox, RadioButton, CustomCheckBox } from "components/forms";
import { HoverLoader } from "components";
import { masterPaginationServices, patientStateOptions, diagnosisCategoryOptions } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage } from "utils/hooks";
import Header from "pages/clinical/Header";
import { CustomDialog } from 'components/CustomDialog';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';

interface Props { }

const AddNewDiagnosis = (props: Props) => {
    const dispatch = useDispatch();
    const location = useLocation<any>();
    const { formState: { errors }, control, getValues, reset, watch } = useForm({ mode: "all" });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const { handleSubmit } = useForm({ mode: "all" });
    const [isEditOn, setIsEditOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [hasIcd10CodeDiagnosisHistory, setHasIcd10CodeDiagnosisHistory] = useState(true);
    const [listRows, setListRows] = useState<any>([]);
    const [searchText, setSearchText] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSingleRecordDeleteConfirmation, setShowSingleRecordDeleteConfirmation] = useState(false);
    const [selectedDiagnosisId, setSelectedDiagnosisId] = useState(0);

    const { fields, append, remove } = useFieldArray({ control, name: "addICDDiagnosises" });

    let patientData = location.state ?? {};

    const { icod10CodeDiagnosisData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            icod10CodeDiagnosisData: masterPaginationReducer[masterPaginationServices.icd10CodeDiagnosis].data,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.icd10CodeDiagnosis, {}));
    }, []);

    const { modelItems } = icod10CodeDiagnosisData;

    useEffect(() => {
        addDefaultfields();
        if (modelItems?.length) {
            onEdit();
        }
    }, [modelItems])

    function addDefaultfields() {
        let newList = modelItems.map((item: any) => ({
            ...item,
            isSelected: false
        }));
        setListRows(newList);
    }


    function onEdit() {
        let paramsData = {
            GynecologicalHistoryId: patientData?.id ?? 1,
            ManMedicalHistoryId: patientData?.id ?? 1
        }

        setLoading(true);
        let medicalHistoryService = services[(location.pathname?.indexOf("/clinical-history/medical") > -1 ? 'getMedicalHistoryById' : 'getManMedicalHistoryById') as keyof typeof services];

        medicalHistoryService(paramsData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    setIsEditOn(true);
                    setSelectedDiagnosisId(0);
                    // setFormData(res.data.response);
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }




    function onAddDiagnosis(data: any) {
        if (data) {

            append({
                id: 0,
                diagnosistype: 0,
                diagnosisDate: null,
                patientDiagnosisId: 0,
                icD10Id: 0,
                addICDDiagnosisName: data?.icdName,
                addICDDiagnosisCode: data?.icdCode
            });

        }
    }

    function onRemoveDiagnosis() {
        if (selectedDiagnosisId > 0) {
            let index = fields?.findIndex((item: any) => item.diagnosisId === selectedDiagnosisId);
            remove(index);
            setShowSingleRecordDeleteConfirmation(false);

            let newList = listRows.map((record: any) => ({
                ...record,
                isSelected: record.id === selectedDiagnosisId ? false : record.isSelected
            }));
            setListRows(newList);
            setSelectedDiagnosisId(0);
        }
    }

    function handleClose() {
        setShowConfirmation(false);
        setShowSingleRecordDeleteConfirmation(false);
        setSelectedDiagnosisId(0);
    }

    function onAgree() {
        setHasIcd10CodeDiagnosisHistory(false);
        remove();
        setShowConfirmation(false);
        addDefaultfields();
        setSelectedDiagnosisId(0);
    }
   
    function onSubmit() {}

    function onDelete() { }

    return (

        <CustomClinicalActionHeaderWithWrap
            title={formatMessage({ id: "new-diagnosis" })}
            onSave={handleSubmit(onSubmit)}
            saveButtonProps={{
                label: isEditOn ? "update" : "save"
            }}
            onDelete={onDelete}
        //   menuList={anamnesisMenuList}
        >
            <Box padding={2} component={Paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={7} md={12} sm={12}>
                        <Grid item xs={12} lg={12} md={12} sm={12}>
                            <TableContainer>
                                <Table size="small" stickyHeader aria-label="sticky table" style={{ border: "1px solid #c2c2c2" }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ width: "1%" }}><FormattedMessage id="code" /></TableCell>
                                            <TableCell style={{ width: "25%" }}><FormattedMessage id="Diagnosis" /></TableCell>
                                            <TableCell style={{ width: "5%", textAlign: "center" }}><FormattedMessage id="type" /></TableCell>
                                            <TableCell style={{ width: "2%" }}><FormattedMessage id="select" /></TableCell>
                                            <TableCell style={{ width: "5%" }}><FormattedMessage id="action" /></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields.map(({ id, diagnosisName }: any, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={id} >
                                                    <TableCell>
                                                        {diagnosisName}
                                                    </TableCell>
                                                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                                                        <CustomTextBox
                                                            label=""
                                                            name={`addICDDiagnosises[${index}][addICDDiagnosisName]`}
                                                            control={control}
                                                            error={errors?.[`addICDDiagnosises`]?.[index]?.["stage"]}
                                                            rules={validationRule.textbox({ type: "textWithNumber", maxLength: 15 })}
                                                            disabled={hasIcd10CodeDiagnosisHistory ? false : true}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{ paddingLeft: "2px", paddingRight: "0px" }}>
                                                        <RadioButton
                                                            label="Primary"
                                                            name={`addICDDiagnosises[${index}][diagnosistype]`}
                                                            disabled={hasIcd10CodeDiagnosisHistory ? false : true}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{ paddingLeft: "2px", paddingRight: "0px" }}>
                                                        <CustomCheckBox
                                                            label=""
                                                            placeholder=""
                                                            labelPlacement="start"
                                                            name={`addICDDiagnosises[${index}][treatmentDetails]`}
                                                            control={control}
                                                            error={errors?.[`addICDDiagnosises`]?.[index]?.["treatmentDetails"]}
                                                            disabled={hasIcd10CodeDiagnosisHistory ? false : true}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{ position: "relative" }}>
                                                        {fields?.length &&
                                                            <TableButtonGroup>
                                                                <DeleteButton
                                                                    onDelete={() => {
                                                                        let data = getValues("addICDDiagnosises")[index];
                                                                        let newList = listRows.map((record: any, idx: any) => ({
                                                                            ...record,
                                                                            isSelected: data.diagnosisId === record.id ? false : record.isSelected
                                                                        }));
                                                                        setListRows(newList);
                                                                        remove(index);
                                                                    }}
                                                                />
                                                            </TableButtonGroup>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {!fields?.length &&
                                            <TableRow hover role="checkbox" tabIndex={-1} >
                                                <TableCell colSpan={5} style={{ textAlign: "center" }}>No record added.</TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} lg={5} md={12} sm={12} >
                        <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                            <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }}>
                                <Select
                                    options={diagnosisCategoryOptions}
                                    label={formatMessage({ id: "gender-category" })}
                                    onChange={(_, data: any) => {
                                        if (data?.value) {
                                            let newList = listRows.filter((item: any) => item.diagnosisCategoryId == data.value);
                                            setListRows(newList);
                                        }
                                        else {
                                            let newListRows = modelItems.map((item: any) => ({
                                                ...item,
                                                isSelected: fields?.some((options: any) => item.id == options.diagnosisId),
                                            }));
                                            setListRows(newListRows);
                                        }
                                    }}
                                />

                                <SearchableTextBox
                                    style={{ marginLeft: "2px" }}
                                    placeholder="Find (word search)"
                                    onChange={(e: any) => {
                                        if (e.target.value) {
                                            let newList = modelItems.filter((item: any) => item.name?.toLowerCase().includes(e.target.value?.toLowerCase().trim()));
                                            setListRows(newList);
                                        }
                                        else {
                                            let newListRows = modelItems.map((item: any) => ({
                                                ...item,
                                                isSelected: fields?.some((options: any) => item.id == options.diagnosisId),
                                            }));
                                            setListRows(newListRows);
                                        }
                                        setSearchText(e.target.value);
                                    }}
                                    value={searchText}
                                />
                            </Grid>
                            <Grid item xs={12} lg={12} md={12} sm={12}>
                                <List style={{ maxHeight: "43vh", overflowX: "hidden" }}>
                                    {listRows?.map((item: any, index: any) => {
                                        return (
                                            <ListItem key={index} dense role={undefined} style={{ background: index % 2 == 0 ? "#F6FFFF 0% 0% no-repeat padding-box" : "#F8F8F8 0% 0% no-repeat padding-box" }}>
                                                <ListItemText primary={item.icdName} />
                                                <ListItemSecondaryAction>
                                                    {hasIcd10CodeDiagnosisHistory ? (<IconButton
                                                        edge="end"
                                                        aria-label="comments"
                                                        onClick={() => {
                                                            if (item.isSelected) {
                                                                setShowSingleRecordDeleteConfirmation(true);
                                                                setSelectedDiagnosisId(item.id);
                                                            }
                                                            else {
                                                                onAddDiagnosis(item);

                                                                let newList = listRows.map((record: any, idx: any) => ({
                                                                    ...record,
                                                                    isSelected: index === idx ? (record.isSelected ? false : true) : record.isSelected
                                                                }));
                                                                setListRows(newList);
                                                            }
                                                        }}>
                                                        {item.isSelected ? (<CheckCircleIcon style={{ color: "green" }} />) : <ControlPointIcon />}
                                                    </IconButton>)
                                                        : (<IconButton
                                                            edge="end"
                                                            aria-label="comments"
                                                        >
                                                            {item.isSelected ? (<CheckCircleIcon style={{ color: "green" }} />) : <ControlPointIcon />}
                                                        </IconButton>)
                                                    }
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        );
                                    })}
                                    {!listRows?.length &&
                                        <ListItem dense role={undefined} style={{ background: "#F8F8F8 0% 0% no-repeat padding-box", textAlign: "center" }}>
                                            <ListItemText primary="No order available." />
                                        </ListItem>
                                    }
                                </List>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {(showConfirmation || showSingleRecordDeleteConfirmation) && (
                <CustomDialog
                    open={true}
                    onDisagree={handleClose}
                    onAgree={() => {
                        if (showConfirmation) {
                            onAgree();
                        } else {
                            onRemoveDiagnosis();
                        }
                    }}
                    title={formatMessage({ id: "delete-title" })}
                    subTitle={formatMessage({ id: "medical-history-alert-confirmation-message" })}
                />
            )}

            {loading || deleteLoading && <HoverLoader />}
        </CustomClinicalActionHeaderWithWrap>
    );
};

export default AddNewDiagnosis;

