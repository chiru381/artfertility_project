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
import { CustomSelect, Select, CustomTextBox, SearchableTextBox, RadioButton } from "components/forms";
import { HoverLoader } from "components";
import { masterPaginationServices, patientStateOptions, } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { CustomDialog } from 'components/CustomDialog';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const MedicalHistory = (props: Props) => {
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const { handleSubmit, formState: { errors }, control, getValues, reset, watch } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [isEditOn, setIsEditOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hasGeneralGynecologicalHistory, setHasGeneralGynecologicalHistory] = useState(true);
  const [listRows, setListRows] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSingleRecordDeleteConfirmation, setShowSingleRecordDeleteConfirmation] = useState(false);
  const [selectedDisorderId, setSelectedDisorderId] = useState(0);

  const { fields, append, remove } = useFieldArray({ control, name: "patientMedicalHistories" });

  let patientId = useGetPatientId();

  const { disorderData, disorderCategoryData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      disorderData: masterPaginationReducer[masterPaginationServices.disorder].data,
      disorderCategoryData: masterPaginationReducer[masterPaginationServices.disorderCategory].data,
    }),
    shallowEqual
  );

  let disorderCategoryOptions = disorderCategoryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.disorder, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.disorderCategory, {}));
  }, []);

  const { modelItems } = disorderData;

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

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    let newList = bodyData?.patientMedicalHistories?.map((item: any) => ({
      ...item,
      stateId: item?.patientDisorderState?.value,
      patientDisorderState: item?.patientDisorderState?.value
    }));

    bodyData = {
      ...bodyData,
      id: patientId,
      hasGeneralGynecologicalHistory: hasGeneralGynecologicalHistory,
      patientMedicalHistories: newList,
      isMedicalhistory: hasGeneralGynecologicalHistory,
      manMedicalItems: newList
    };

    setLoading(true);

    let medicalHistoryService = location.pathname?.indexOf("/clinical-history/medical") > -1 ?
      services[(isEditOn ? 'updateMedicalHistory' : 'createMedicalHistory') as keyof typeof services]
      : services[(isEditOn ? 'updateManMedicalHistory' : 'createManMedicalHistory') as keyof typeof services];

    medicalHistoryService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setSelectedDisorderId(0);
          toastMessage(formatMessage({ id: isEditOn ? "medical-history-update-message" : "medical-history-create-message" }));
        } else {
          toastMessage(res.data?.message, "error");
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, "error");
      });
  }

  function onDelete() {
    let parms = {
      GynecologicalHistoryId: patientId,
      ManMedicalHistoryId: patientId
    }
    setDeleteLoading(true);

    let medicalHistoryService = services[(location.pathname?.indexOf("/clinical-history/medical") > -1 ? 'deleteMedicalHistory' : 'deleteManMedicalHistory') as keyof typeof services];

    medicalHistoryService(parms)
      .then((res) => {
        setDeleteLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(false);
          setSelectedDisorderId(0);
          resetForm();
          toastMessage(formatMessage({ id: "delete-message" }));
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setDeleteLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function onEdit() {
    let paramsData = {
      GynecologicalHistoryId: patientId,
      ManMedicalHistoryId: patientId
    }

    setLoading(true);
    let medicalHistoryService = services[(location.pathname?.indexOf("/clinical-history/medical") > -1 ? 'getMedicalHistoryById' : 'getManMedicalHistoryById') as keyof typeof services];

    medicalHistoryService(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setSelectedDisorderId(0);
          setFormData(res.data.response);
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function resetForm() {
    reset({});
    let newList = modelItems.map((item: any) => ({
      ...item,
      isSelected: false
    }));
    setListRows(newList);
    setShowConfirmation(false);
    setShowSingleRecordDeleteConfirmation(false);
    setSelectedDisorderId(0);
  }

  function setFormData(resData: any) {

    let newList = resData?.patientMedicalHistories?.length > 0 ?
      resData?.patientMedicalHistories?.map((item: any) => ({
        ...item,
        patientDisorderState: patientStateOptions?.find((options: any) => options.value == item?.patientDisorderState) ?? null,
      }))
      : resData?.manMedicalItems?.map((item: any) => ({
        ...item,
        patientDisorderState: patientStateOptions?.find((options: any) => options.value == item?.stateId) ?? null,
      }))

    let data = {
      ...resData,
      patientMedicalHistories: newList
    }
    reset(data);
    setHasGeneralGynecologicalHistory(resData?.patientMedicalHistories ? resData?.hasGeneralGynecologicalHistory : resData?.isMedicalhistory);

    let newListRows = modelItems.map((item: any) => ({
      ...item,
      isSelected: newList?.some((options: any) => item.id == options.disorderId),
    }));

    setListRows(newListRows);
  }

  function onAddDisorder(data: any) {
    if (data) {

      append({
        id: 0,
        stage: "",
        patientDisorderState: 0,
        treatmentDetails: "",
        gynecologicalHistoryId: 0,
        disorderId: data?.id,
        disorderName: data?.name,
        disorderDisorderCategoryName: ""
      });

    }
  }

  function onRemoveDisorder() {
    if (selectedDisorderId > 0) {
      let index = fields?.findIndex((item: any) => item.disorderId === selectedDisorderId);
      remove(index);
      setShowSingleRecordDeleteConfirmation(false);

      let newList = listRows.map((record: any) => ({
        ...record,
        isSelected: record.id === selectedDisorderId ? false : record.isSelected
      }));
      setListRows(newList);
      setSelectedDisorderId(0);
    }
  }

  function handleClose() {
    setShowConfirmation(false);
    setShowSingleRecordDeleteConfirmation(false);
    setSelectedDisorderId(0);
  }

  function onAgree() {
    setHasGeneralGynecologicalHistory(false);
    remove();
    setShowConfirmation(false);
    addDefaultfields();
    setSelectedDisorderId(0);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "heading-clinical-history-medical" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8} md={12} sm={12}>
            <Grid item xs={12} lg={12} md={4} sm={6} style={{ display: "flex", alignItems: "center" }}>
              <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "medical-history" })}</FormLabel>
              <RadioButton
                label="Yes"
                name="hasGeneralGynecologicalHistory"
                onChange={() => {
                  setHasGeneralGynecologicalHistory(true);
                }}
                checked={hasGeneralGynecologicalHistory}
              />
              <RadioButton
                label="No"
                name="hasGeneralGynecologicalHistory"
                onChange={() => {
                  if (watch("patientMedicalHistories")?.length > 0) {
                    setShowConfirmation(true);
                  }
                  else {
                    setHasGeneralGynecologicalHistory(false);
                  }
                }}
                checked={!hasGeneralGynecologicalHistory}
              />
            </Grid>

            <Grid item xs={12} lg={12} md={12} sm={12}>
              <TableContainer>
                <Table size="small" stickyHeader aria-label="sticky table" style={{ border: "1px solid #c2c2c2" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "20%" }}><FormattedMessage id="parent-medical-history" /></TableCell>
                      <TableCell style={{ width: "15%" }}><FormattedMessage id="stage" /></TableCell>
                      <TableCell style={{ width: "30%", textAlign: "center" }}><FormattedMessage id="state" /></TableCell>
                      <TableCell style={{ width: "30%" }}><FormattedMessage id="treatement-details" /></TableCell>
                      <TableCell style={{ width: "5%" }}><FormattedMessage id="action" /></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map(({ id, disorderName }: any, index) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={id} >
                          <TableCell>
                            {disorderName}
                          </TableCell>
                          <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                            <CustomTextBox
                              label=""
                              name={`patientMedicalHistories[${index}][stage]`}
                              control={control}
                              error={errors?.[`patientMedicalHistories`]?.[index]?.["stage"]}
                              rules={validationRule.textbox({ type: "textWithNumber", maxLength: 15 })}
                              disabled={hasGeneralGynecologicalHistory ? false : true}
                            />
                          </TableCell>
                          <TableCell style={{ paddingLeft: "2px", paddingRight: "0px" }}>
                            <CustomSelect
                              options={patientStateOptions}
                              label=""
                              name={`patientMedicalHistories[${index}][patientDisorderState]`}
                              control={control}
                              error={errors?.[`patientMedicalHistories`]?.[index]?.["patientDisorderState"]}
                              disabled={hasGeneralGynecologicalHistory ? false : true}
                            />
                          </TableCell>
                          <TableCell style={{ paddingLeft: "2px", paddingRight: "0px" }}>
                            <CustomTextBox
                              label=""
                              placeholder=""
                              name={`patientMedicalHistories[${index}][treatmentDetails]`}
                              control={control}
                              error={errors?.[`patientMedicalHistories`]?.[index]?.["treatmentDetails"]}
                              rules={validationRule.textbox({ type: "textWithNumberSpecialCharacter", maxLength: 30 })}
                              disabled={hasGeneralGynecologicalHistory ? false : true}
                            />
                          </TableCell>
                          <TableCell>
                            {hasGeneralGynecologicalHistory &&
                              <TableButtonGroup>
                                <DeleteButton
                                  onDelete={() => {
                                    let data = getValues("patientMedicalHistories")[index];
                                    let newList = listRows.map((record: any, idx: any) => ({
                                      ...record,
                                      isSelected: data.disorderId === record.id ? false : record.isSelected
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

            <Grid item xs={12} lg={12} md={12} sm={12}>
              <CustomTextBox
                style={{ marginTop: "30px" }}
                label={formatMessage({ id: "observations" })}
                name="observations"
                control={control}
                error={errors.observations}
                rules={validationRule.textbox({ maxLength: 200 })}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} lg={4} md={12} sm={12} >
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
              <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }}>
                <Select
                  options={disorderCategoryOptions}
                  label={formatMessage({ id: "all-category" })}
                  onChange={(_, data: any) => {
                    if (data?.value) {
                      let newList = listRows.filter((item: any) => item.disorderCategoryId == data.value);
                      setListRows(newList);
                    }
                    else {
                      let newListRows = modelItems.map((item: any) => ({
                        ...item,
                        isSelected: fields?.some((options: any) => item.id == options.disorderId),
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
                        isSelected: fields?.some((options: any) => item.id == options.disorderId),
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
                        <ListItemText primary={item.name} />
                        <ListItemSecondaryAction>
                          {hasGeneralGynecologicalHistory ? (<IconButton
                            edge="end"
                            aria-label="comments"
                            onClick={() => {
                              if (item.isSelected) {
                                setShowSingleRecordDeleteConfirmation(true);
                                setSelectedDisorderId(item.id);
                              }
                              else {
                                onAddDisorder(item);

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
              onRemoveDisorder();
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

export default MedicalHistory;
