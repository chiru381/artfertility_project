import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
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
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import AddIcon from "@material-ui/icons/Add";

import { TableButtonGroup, DeleteButton } from 'components/button';
import { Select, CustomTextBox, CustomCheckBox, SearchableTextBox, RadioButton } from "components/forms";
import { HoverLoader } from "components";
import { masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage ,useGetPatientId} from "utils/hooks";
import { CustomDialog } from 'components/CustomDialog';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props {

}

const FamilyHistory = (props: Props) => {
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, reset, } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [isEditOn, setIsEditOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hasFamilyHistory, setHasFamilyHistory] = useState(true);
  const [listRows, setListRows] = useState<any>([]);
  const [familyHistoryItems, setFamilyHistoryItems] = useState<any>([]);
  const [searchText, setSearchText] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSingleRecordDeleteConfirmation, setShowSingleRecordDeleteConfirmation] = useState(false);
  const [selectedDisorderData, setSelectedDisorderData] = useState<any>({});

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
  }, [modelItems]);

  function addDefaultfields() {
    let newList = modelItems.map((item: any) => ({
      ...item,
      isFather: false,
      isMother: false,
      isSibilings: false,
      isRelatives: false,
      isGrandParents: false
    }));
    setListRows(newList);
  }

  function onAddDisorder(data: any, columnName: string, index: number) {
    let newList = listRows.map((record: any, idx: any) => ({
      ...record,
      isFather: (columnName === "father" && index === idx) ? (record.isFather ? false : true) : record.isFather,
      isMother: (columnName === "mother" && index === idx) ? (record.isMother ? false : true) : record.isMother,
      isSibilings: (columnName === "siblings" && index === idx) ? (record.isSibilings ? false : true) : record.isSibilings,
      isRelatives: (columnName === "relatives" && index === idx) ? (record.isRelatives ? false : true) : record.isRelatives,
      isGrandParents: (columnName === "grandParents" && index === idx) ? (record.isGrandParents ? false : true) : record.isGrandParents
    }));
    setListRows(newList);

    if (familyHistoryItems?.some((item: any) => item.disorderId === data?.id)) {
      let familyHistoryRecords = familyHistoryItems.map((record: any, idx: any) => ({
        ...record,
        isFather: (columnName === "father" && record.disorderId === data?.id) ? (record.isFather ? false : true) : record.isFather,
        isMother: (columnName === "mother" && record.disorderId === data?.id) ? (record.isMother ? false : true) : record.isMother,
        isSibilings: (columnName === "siblings" && record.disorderId === data?.id) ? (record.isSibilings ? false : true) : record.isSibilings,
        isRelatives: (columnName === "relatives" && record.disorderId === data?.id) ? (record.isRelatives ? false : true) : record.isRelatives,
        isGrandParents: (columnName === "grandParents" && record.disorderId === data?.id) ? (record.isGrandParents ? false : true) : record.isGrandParents
      }));
      setFamilyHistoryItems(familyHistoryRecords);

      if (familyHistoryRecords?.some((item: any) => item.disorderId === data?.id && !item.isFather && !item.isMother && !item.isSibilings && !item.isRelatives && !item.isGrandParents)) {
        let orderIndex = listRows.findIndex((item: any) => item.id === data?.id);
        onDeleteDisorder(data?.id, orderIndex);
      }
    }
    else {
      setFamilyHistoryItems([
        ...familyHistoryItems,
        {
          id: 0,
          isFather: columnName === "father" ? true : false,
          isMother: columnName === "mother" ? true : false,
          isSibilings: columnName === "siblings" ? true : false,
          isRelatives: columnName === "relatives" ? true : false,
          isGrandParents: columnName === "grandParents" ? true : false,
          familyHistoryId: 0,
          disorderId: data?.id,
          disorderName: data?.name,
          disorderDisorderCategoryName: ""
        }]);
    }

    setSelectedDisorderData({});
    setShowSingleRecordDeleteConfirmation(false);
  }

  function onDeleteDisorder(disorderId: any, index: number) {
    let newList = familyHistoryItems?.filter((record: any, idx: any) => index !== idx);
    setFamilyHistoryItems(newList);

    let disorderList = listRows.map((item: any) => ({
      ...item,
      isFather: item.id === disorderId ? false : item.isFather,
      isMother: item.id === disorderId ? false : item.isMother,
      isSibilings: item.id === disorderId ? false : item.isSibilings,
      isRelatives: item.id === disorderId ? false : item.isRelatives,
      isGrandParents: item.id === disorderId ? false : item.isGrandParents
    }));

    setListRows(disorderList);
    setSelectedDisorderData({});
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    bodyData = {
      ...bodyData,
      id: patientId,
      hasFamilyHistory: hasFamilyHistory,
      familyHistoryItems: familyHistoryItems
    };

    setLoading(true);
    let familyHistoryService = services[(isEditOn ? 'updateFamilyHistory' : 'createFamilyHistory') as keyof typeof services];

    familyHistoryService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setSelectedDisorderData({});
          toastMessage(formatMessage({ id: isEditOn ? "family-history-update-message" : "family-history-create-message" }));
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
    const parms = {
      FamilyHistoryId: patientId,
    }
    setIsEditOn(false);
    setDeleteLoading(true);
    services.deleteFamilyHistory(parms)
      .then((res) => {
        setDeleteLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(false);
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
      FamilyHistoryId: patientId
    };
    setLoading(true);
    services.getFamilyHistoryById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setSelectedDisorderData({});
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
    setFamilyHistoryItems([]);
    setSelectedDisorderData({});
    setShowSingleRecordDeleteConfirmation(false);
    setShowConfirmation(false);
  }

  function setFormData(resData: any) {
    let data = {
      ...resData
    }
    reset(data);
    setHasFamilyHistory(data.hasFamilyHistory);
    setFamilyHistoryItems(data.familyHistoryItems);
    resetDisorderList(data.familyHistoryItems);
  }

  function resetDisorderList(familyHistoryItemsList: any) {
    let disorderList = modelItems.map((item: any) => ({
      ...item,
      isFather: familyHistoryItemsList.some((option: any) => option.disorderId == item.id && option.isFather),
      isMother: familyHistoryItemsList.some((option: any) => option.disorderId == item.id && option.isMother),
      isSibilings: familyHistoryItemsList.some((option: any) => option.disorderId == item.id && option.isSibilings),
      isRelatives: familyHistoryItemsList.some((option: any) => option.disorderId == item.id && option.isRelatives),
      isGrandParents: familyHistoryItemsList.some((option: any) => option.disorderId == item.id && option.isGrandParents)
    }));

    setListRows(disorderList);
  }

  function handleClose() {
    setShowConfirmation(false);
    setShowSingleRecordDeleteConfirmation(false);
    setSelectedDisorderData({});
  }

  function onAgree() {
    setHasFamilyHistory(false);
    setShowConfirmation(false);
    setShowSingleRecordDeleteConfirmation(false);
    addDefaultfields();
    setFamilyHistoryItems([]);
    setSelectedDisorderData({});
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "clinical-history-family" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }}>
              <FormLabel component="legend" >{formatMessage({ id: "family-history" })} </FormLabel>
              <RadioButton
                label="Yes"
                name="hasFamilyHistory"
                onChange={() => {
                  setHasFamilyHistory(true);
                }}
                checked={hasFamilyHistory}
                style={{ marginLeft: "5px" }}
              />
              <RadioButton
                label="No"
                name="hasFamilyHistory"
                onChange={() => {
                  if (familyHistoryItems?.length > 0) {
                    setShowConfirmation(true);
                  }
                  else {
                    setHasFamilyHistory(false);
                  }
                }}
                checked={!hasFamilyHistory}
              />
              |
              <CustomCheckBox
                name="isPatientAdopted"
                label={formatMessage({ id: "patient-adopted" })}
                control={control}
                error={errors?.isPatientAdopted}
                style={{ marginLeft: "10px" }}
              />
            </Grid>

            <Grid item xs={12} lg={12} md={12} sm={12} style={{ marginBottom: "20px" }}>
              <TableContainer>
                <Table size="small" stickyHeader aria-label="sticky table" style={{ border: "1px solid #c2c2c2" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "20%" }}><FormattedMessage id="previous-history" /></TableCell>
                      <TableCell style={{ width: "8%" }}><FormattedMessage id="father" /></TableCell>
                      <TableCell style={{ width: "8%" }}><FormattedMessage id="mother" /></TableCell>
                      <TableCell style={{ width: "8%" }}><FormattedMessage id="siblings" /></TableCell>
                      <TableCell style={{ width: "8%" }}><FormattedMessage id="relatives" /></TableCell>
                      <TableCell style={{ width: "8%" }}><FormattedMessage id="grand-parents" /></TableCell>
                      <TableCell style={{ width: "5%" }}><FormattedMessage id="action" /></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {familyHistoryItems.map((item: any, index: any) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={index} >
                          <TableCell component="th" scope="row">{item.disorderName}</TableCell>
                          <TableCell>
                            {item.isFather ? (<CheckIcon style={{ color: "green" }} />) : ""}
                          </TableCell>
                          <TableCell>
                            {item.isMother ? (<CheckIcon style={{ color: "green" }} />) : ""}
                          </TableCell>
                          <TableCell>
                            {item.isSibilings ? (<CheckIcon style={{ color: "green" }} />) : ""}
                          </TableCell>
                          <TableCell>
                            {item.isRelatives ? (<CheckIcon style={{ color: "green" }} />) : ""}
                          </TableCell>
                          <TableCell>
                            {item.isGrandParents ? (<CheckIcon style={{ color: "green" }} />) : ""}
                          </TableCell>
                          <TableCell>
                            <TableButtonGroup>
                              <DeleteButton
                                onDelete={() => {
                                  onDeleteDisorder(item.disorderId, index);
                                }}
                              />
                            </TableButtonGroup>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!familyHistoryItems?.length &&
                      <TableRow>
                        <TableCell style={{ textAlign: "center" }} colSpan={7}>No record available.</TableCell>
                      </TableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>
              <Box>
                <h3 className="formHeading">
                  <FormattedMessage id="deceased-parents" />
                </h3>
              </Box>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12} style={{ alignItems: "center", marginBottom: "5px", marginTop: "10px" }}>
              <CustomCheckBox
                name="isMotherDeceased"
                label={formatMessage({ id: "mother" })}
                control={control}
                error={errors?.isMotherDeceased}
                labelPlacement="end"
              />
              <CustomTextBox
                label=""
                name="motherDeceasedRemarks"
                control={control}
                error={errors.motherDeceasedRemarks}
                placeholder={formatMessage({ id: "Mother Deceased Remarks" })}
                rules={validationRule.textbox({ maxLength: 100 })}
              />
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12} style={{ alignItems: "center" }}>
              <CustomCheckBox
                name="isFatherDeceased"
                label={formatMessage({ id: "father" })}
                control={control}
                error={errors?.isFatherDeceased}
                labelPlacement="end"
              />
              <CustomTextBox
                label=""
                name="fatherDeceasedRemarks"
                control={control}
                error={errors.fatherDeceasedRemarks}
                placeholder={formatMessage({ id: "Father Deceased Remarks" })}
                rules={validationRule.textbox({ maxLength: 100 })}
              />
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>
              <CustomTextBox
                style={{ marginTop: "20px" }}
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

          <Grid item xs={12} lg={6} md={12} sm={12} >
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>

              <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <Select
                  options={disorderCategoryOptions}
                  label={formatMessage({ id: "all-category" })}
                  onChange={(_, data: any) => {
                    if (data?.value) {
                      let newList = listRows.filter((item: any) => item.disorderCategoryId == data.value);
                      setListRows(newList);
                    }
                    else {
                      resetDisorderList(familyHistoryItems);
                    }
                  }}
                />
                <SearchableTextBox
                  style={{ marginLeft: "5px" }}
                  placeholder="Find (word search)"
                  onChange={(e: any) => {
                    if (e.target.value) {
                      let newList = listRows.filter((item: any) => item.name?.toLowerCase().includes(e.target.value?.toLowerCase()));
                      setListRows(newList);
                    }
                    else {
                      resetDisorderList(familyHistoryItems);
                    }
                    setSearchText(e.target.value);
                  }}
                  value={searchText}
                />
              </Grid>

              <Grid item xs={12} lg={12} md={12} sm={12}>
                <TableContainer>
                  <Table size="small" stickyHeader style={{ border: "1px solid #c2c2c2" }} >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "10%" }}><FormattedMessage id="disorder" /></TableCell>
                        <TableCell style={{ width: "5%" }}><FormattedMessage id="father" /></TableCell>
                        <TableCell style={{ width: "5%" }}><FormattedMessage id="mother" /></TableCell>
                        <TableCell style={{ width: "5%" }}><FormattedMessage id="siblings" /></TableCell>
                        <TableCell style={{ width: "5%" }}><FormattedMessage id="relatives" /></TableCell>
                        <TableCell style={{ width: "5%" }}><FormattedMessage id="grand-parents" /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listRows?.map((item: any, index: any) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  if (!item.isFather) {
                                    onAddDisorder(item, "father", index);
                                  }
                                  else {
                                    setSelectedDisorderData({ data: item, columnName: "father", index: index });
                                    setShowSingleRecordDeleteConfirmation(true);
                                  }
                                }}
                                disabled={hasFamilyHistory ? false : true}
                              >
                                {item.isFather ? (<CheckIcon style={{ color: "green" }} />) : <AddIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  if (!item.isMother) {
                                    onAddDisorder(item, "mother", index);
                                  }
                                  else {
                                    setSelectedDisorderData({ data: item, columnName: "mother", index: index });
                                    setShowSingleRecordDeleteConfirmation(true);
                                  }
                                }}
                                disabled={hasFamilyHistory ? false : true}
                              >
                                {item.isMother ? (<CheckIcon style={{ color: "green" }} />) : <AddIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  if (!item.isSibilings) {
                                    onAddDisorder(item, "siblings", index);
                                  }
                                  else {
                                    setSelectedDisorderData({ data: item, columnName: "siblings", index: index });
                                    setShowSingleRecordDeleteConfirmation(true);
                                  }
                                }}
                                disabled={hasFamilyHistory ? false : true}
                              >
                                {item.isSibilings ? (<CheckIcon style={{ color: "green" }} />) : <AddIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  if (!item.isRelatives) {
                                    onAddDisorder(item, "relatives", index);
                                  }
                                  else {
                                    setSelectedDisorderData({ data: item, columnName: "relatives", index: index });
                                    setShowSingleRecordDeleteConfirmation(true);
                                  }
                                }}
                                disabled={hasFamilyHistory ? false : true}
                              >
                                {item.isRelatives ? (<CheckIcon style={{ color: "green" }} />) : <AddIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  if (!item.isGrandParents) {
                                    onAddDisorder(item, "grandParents", index);
                                  }
                                  else {
                                    setSelectedDisorderData({ data: item, columnName: "grandParents", index: index });
                                    setShowSingleRecordDeleteConfirmation(true);
                                  }
                                }}
                                disabled={hasFamilyHistory ? false : true}
                              >
                                {item.isGrandParents ? (<CheckIcon style={{ color: "green" }} />) : <AddIcon />}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {!listRows?.length &&
                        <TableRow>
                          <TableCell colSpan={6} style={{ textAlign: "center" }}>No record available.</TableCell>
                        </TableRow>
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
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
              if (selectedDisorderData) {
                onAddDisorder(selectedDisorderData?.data, selectedDisorderData?.columnName, selectedDisorderData?.index)
              }
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

export default FamilyHistory;
