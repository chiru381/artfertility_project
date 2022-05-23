import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import ListItemText from "@material-ui/core/ListItemText";

import { CustomSelect, CustomTextBox, RadioButton } from "components/forms";
import { HoverLoader } from "components";
import {
  masterPaginationServices, fertilizationTypes, spermOriginType, cycleTypeOptions, pregnancyTypes,
  embryosDayOptions, numberTransferredOptions, spermOriginTypeOptions
} from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const PreviousTreatment = (props: Props) => {
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, watch, reset } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [hasPreviousTreatment, setHasPreviousTreatment] = useState(true);
  const [isCancelled, setIsCancelled] = useState(true);
  const [isHusbandSperm, setIsHusbandSperm] = useState(true);
  const [isPGT, setIsPGT] = useState(true);
  const [isGoodFertilization, setIsGoodFertilization] = useState(true);
  const [isSurrogacy, setIsSurrogacy] = useState(true);
  const [isPregnancy, setIsPregnancy] = useState(true);
  const [spermOrigin, setSpermOrigin] = useState(spermOriginType.Ejaculation);
  const [pregnancyType, setPregnancyType] = useState(fertilizationTypes.IVF);
  const [fertilizationType, setFertilizationType] = useState(pregnancyTypes.Single);

  const [episodeId, setEpisodeId] = useState(0);
  const [previousTreatmentId, setPreviousTreatmentId] = useState(0);

  const [listRows, setListRows] = useState<any>([]);

  let patientId = useGetPatientId();

  const { calendarYearData, treatmentTypeData, treatmentCountryData, cancelReasonData, protocolData, pregnancyResultData,
    cycleComplicationData, transferredQalityData } = useSelector(
      ({ masterPaginationReducer }: RootReducerState) => ({
        calendarYearData: masterPaginationReducer[masterPaginationServices.calendarYear].data,
        treatmentTypeData: masterPaginationReducer[masterPaginationServices.treatmentType].data,
        treatmentCountryData: masterPaginationReducer[masterPaginationServices.country].data,
        cancelReasonData: masterPaginationReducer[masterPaginationServices.cancelReason].data,
        protocolData: masterPaginationReducer[masterPaginationServices.protocol].data,
        pregnancyResultData: masterPaginationReducer[masterPaginationServices.pregnancyResult].data,
        cycleComplicationData: masterPaginationReducer[masterPaginationServices.cycleComplication].data,
        transferredQalityData: masterPaginationReducer[masterPaginationServices.transferredQality].data
      }),
      shallowEqual
    );

  let calendarYearOptions = calendarYearData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let treatmentTypeOptions = treatmentTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let treatmentCountryOptions = treatmentCountryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let cancelReasonOptions = cancelReasonData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let protocolOptions = protocolData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let pregnancyResultOptions = pregnancyResultData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let cycleComplicationOptions = cycleComplicationData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let transferredQalityOptions = transferredQalityData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.calendarYear, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.treatmentType, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.country, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.cancelReason, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.protocol, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.pregnancyResult, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.cycleComplication, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.transferredQality, {}));
    onGetPreviousTreatmentByIdOnApiCall();
  }, []);

  function onSubmitAsDraft(data: any) {
    let bodyData = getFormBody(data);
    SaveFormData(bodyData, true);
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    SaveFormData(bodyData, false);
  }

  function SaveFormData(data: any, idDraft: any) {

    let bodyData = {
      ...data,
      id: episodeId,
      patientId: patientId,
      isDraft: idDraft,
      previousTreatmentId: previousTreatmentId,
      hasPreviousTreatment: hasPreviousTreatment,
      isCancelled: isCancelled,
      isHusbandSperm: isHusbandSperm,
      isPGT: isPGT,
      isGoodFertilization: isGoodFertilization,
      isSurrogacy: isSurrogacy,
      isPregnancy: isPregnancy,
      spermOrigin: spermOrigin,
      pregnancyType: pregnancyType,
      fertilizationType: fertilizationType
    }

    setLoading(true);

    services.upsertPreviousTreatment(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(false);
          resetForm();
          toastMessage(formatMessage({ id: isEditOn ? "update-message" : "create-message" }));
          onGetPreviousTreatmentByIdOnApiCall();
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
      PreviousTreatmentId: previousTreatmentId,
      PreviousTreatmentEpisodeId: episodeId
    }
    setDeleteLoading(true);
    services.deletePreviousTreatment(parms)
      .then((res) => {
        setDeleteLoading(false);
        if (res.data?.succeeded) {
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

  function onEdit(data: any) {
    setIsEditOn(true);
    setFormData(data);
  }


  function onGetPreviousTreatmentByIdOnApiCall() {
    let paramsData = {
      PreviousTreatmentId: patientId
    };
    setLoading(true);
    services.getPreviousTreatmentById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          let resData = res.data.response;
          setListRows(resData?.previousTreatmentEpisodes);
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function resetForm() {
    reset({});

    setHasPreviousTreatment(true);
    setIsCancelled(true);
    setIsHusbandSperm(true);
    setIsPGT(true);
    setIsGoodFertilization(true);
    setIsSurrogacy(true);
    setIsPregnancy(true);

    setSpermOrigin(spermOriginType.Ejaculation);
    setPregnancyType(pregnancyTypes.Single);
    setFertilizationType(fertilizationTypes.IVF);
  }

  function setFormData(record: any) {

    let data = {
      ...record,
      eggTransferredNumber: numberTransferredOptions?.find((option: any) => option.value == record?.eggTransferredNumber) ?? null,
      calendarYearId: { label: record?.calendarYearName, value: record?.calendarYearId },
      treatmentTypeId: { label: record?.treatmentTypeName, value: record?.treatmentTypeId },
      treatmentCountryId: { label: record?.treatmentCountryName, value: record?.treatmentCountryId },
      cancelReasonId: { label: record?.cancelReasonName, value: record?.cancelReasonId },
      protocolId: { label: record?.protocolName, value: record?.protocolId },
      eggTransferQualityId1: { label: record?.eggTransferQuality1Name, value: record?.eggTransferQualityId1 },
      eggTransferQualityId2: { label: record?.eggTransferQuality2Name, value: record?.eggTransferQualityId2 },
      eggTransferQualityId3: { label: record?.eggTransferQuality3Name, value: record?.eggTransferQualityId3 },
      pregnancyResultId: { label: record?.pregnancyResultName, value: record?.pregnancyResultId },
      cycleComplicationId: { label: record?.cycleComplicationName, value: record?.cycleComplicationId },
      cycleType: cycleTypeOptions?.find((option: any) => option.value == record?.cycleType) ?? null,
      eggTransferDay: embryosDayOptions?.find((option: any) => option.value == record?.eggTransferDay) ?? null,
      numberTransferredDay: embryosDayOptions?.find((option: any) => option.value == record?.numberTransferredDay) ?? null,
    }

    reset(data);
    setEpisodeId(data?.id);
    setPreviousTreatmentId(data?.previousTreatmentId);

    setHasPreviousTreatment(data.hasPreviousTreatment);
    setIsCancelled(data.isCancelled);
    setIsHusbandSperm(data.isHusbandSperm);
    setIsPGT(data.isPGT);
    setIsGoodFertilization(data.isGoodFertilization);
    setIsSurrogacy(data.isSurrogacy);
    setIsPregnancy(data.isPregnancy);
    setSpermOrigin(data.spermOrigin);
    setPregnancyType(data.pregnancyType);
    setFertilizationType(data.fertilizationType);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "previous-treatments" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onClickSecondaryButton={handleSubmit(onSubmitAsDraft)}
      secondaryButtonProps={{
        label: "Draft"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <FormLabel component="legend">{formatMessage({ id: "previous-treatments" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="hasPreviousTreatment"
              onChange={() => {
                setHasPreviousTreatment(true);
              }}
              checked={hasPreviousTreatment}
            />
            <RadioButton
              label="No"
              name="hasPreviousTreatment"
              onChange={() => {
                setHasPreviousTreatment(false);
              }}
              checked={!hasPreviousTreatment}
            />
          </Grid>
          <Grid item xs={12} lg={4} md={12} sm={12}>
            <Box
              style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <TableContainer>
                  <Table size="small" stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <FormattedMessage id="history-list" />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <Grid item xs={12} lg={12} md={12} sm={12}>
                        <List style={{ maxHeight: "45vh", overflowX: "hidden" }}>
                          {listRows?.map((item: any, index: any) => {
                            return (
                              <ListItem key={index} dense role={undefined} style={{ background: index % 2 == 0 ? "#F6FFFF 0% 0% no-repeat padding-box" : "#F8F8F8 0% 0% no-repeat padding-box", }}>
                                <ListItemText className="cursorPointer" onClick={() => {
                                  if (hasPreviousTreatment) {
                                    onEdit(item);
                                  }
                                }}
                                  primary={`${item?.calendarYearName}; ${item?.treatmentTypeName}; Sperm: ${item.isHusbandSperm ? 'Partner' : 'Donor'}; Pregnancy: ${item.isPregnancy ? 'Y' : 'N'}; ${item?.pregnancyResultName};`} />
                              </ListItem>
                            );
                          })}
                          {!listRows?.length && (
                            <ListItem dense role={undefined} style={{ background: "#F8F8F8 0% 0% no-repeat padding-box", textAlign: "center", }}>
                              <ListItemText primary="No history available." />
                            </ListItem>
                          )}
                        </List>
                      </Grid>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Box>

          </Grid>
          <Grid item xs={12} lg={8} md={12} sm={12}>
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
              <Grid container spacing={2} xs={12}>
                <Grid item xs={3} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={calendarYearOptions}
                    label={formatMessage({ id: "year" })}
                    name="calendarYearId"
                    control={control}
                    error={errors?.calendarYearId}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={9} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={treatmentTypeOptions}
                    label={formatMessage({ id: "treatment" })}
                    name="treatmentTypeId"
                    control={control}
                    error={errors?.treatmentTypeId}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "center-of-treatment" })}
                    name="treatmentCenter"
                    control={control}
                    error={errors?.treatmentCenter}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={treatmentCountryOptions}
                    label={formatMessage({ id: "country" })}
                    name="treatmentCountryId"
                    control={control}
                    error={errors?.treatmentCountryId}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend" style={{ marginRight: "5px" }}>{formatMessage({ id: "cancelled" })}</FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isCancelled"
                    onChange={() => {
                      setIsCancelled(true);
                    }}
                    checked={isCancelled}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isCancelled"
                    onChange={() => {
                      setIsCancelled(false);
                    }}
                    checked={!isCancelled}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={cancelReasonOptions}
                    label={formatMessage({ id: "reason-for-cancellation" })}
                    name="cancelReasonId"
                    control={control}
                    error={errors?.cancelReasonId}
                    disabled={hasPreviousTreatment && isCancelled ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <RadioButton
                    label="IUI TO IVF"
                    name="fertilizationType"
                    onChange={() => {
                      setFertilizationType(fertilizationTypes.IVF);
                    }}
                    checked={fertilizationType == fertilizationTypes.IVF ? true : false}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                  <RadioButton
                    label="IVF TO IUI"
                    name="fertilizationType"
                    onChange={() => {
                      setFertilizationType(fertilizationTypes.IUI);
                    }}
                    checked={fertilizationType == fertilizationTypes.IUI ? true : false}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={8} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "comments", })}
                    name="comments"
                    control={control}
                    rules={validationRule.textbox({ maxLength: 100 })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px", marginTop: "10px" }} pt={1} padding={1}>
              <Grid container spacing={2} xs={12}>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend" style={{ marginRight: "5px" }}> {formatMessage({ id: "sperm-source" })}</FormLabel>
                  <RadioButton
                    label={formatMessage({ id: "partner" })}
                    name="isHusbandSperm"
                    onChange={() => {
                      setIsHusbandSperm(true);
                    }}
                    checked={isHusbandSperm}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                  <RadioButton
                    label={formatMessage({ id: "donor" })}
                    name="isHusbandSperm"
                    onChange={() => {
                      setIsHusbandSperm(false);
                    }}
                    checked={!isHusbandSperm}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend"> {formatMessage({ id: "sperm-origin" })}</FormLabel>
                  <RadioButton
                    label={formatMessage({ id: "ejaculation" })}
                    name="spermOrigin"
                    onChange={() => {
                      setSpermOrigin(spermOriginType.Ejaculation);
                    }}
                    checked={spermOrigin == spermOriginType.Ejaculation ? true : false}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                  <RadioButton
                    label={formatMessage({ id: "testicular" })}
                    name="spermOrigin"
                    onChange={() => {
                      setSpermOrigin(spermOriginType.Testicle);
                    }}
                    checked={spermOrigin == spermOriginType.Testicle ? true : false}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend"> {formatMessage({ id: "pgt-done" })}</FormLabel>
                  <RadioButton
                    label="YES"
                    name="isPGT"
                    onChange={() => {
                      setIsPGT(true);
                    }}
                    checked={isPGT}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                  <RadioButton
                    label="NO"
                    name="isPGT"
                    onChange={() => {
                      setIsPGT(false);
                    }}
                    checked={!isPGT}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={protocolOptions}
                    label={formatMessage({ id: "protocol" })}
                    name="protocolId"
                    control={control}
                    error={errors?.protocolId}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={cycleTypeOptions}
                    label={formatMessage({ id: "type-of-cycle" })}
                    name="cycleType"
                    control={control}
                    error={errors?.cycleType}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "fsh" })}
                    name="fsh"
                    control={control}
                    error={errors?.fsh}
                    rules={validationRule.textbox({ type: "number" })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "hmg/lh" })}
                    name="hMGLH"
                    control={control}
                    error={errors?.hMGLH}
                    rules={validationRule.textbox({ type: "number" })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <Box>
                    <h3 className="formHeading" >
                    </h3>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "no-of-oocytes" })}
                    name="eggsNumber"
                    control={control}
                    error={errors?.eggsNumber}
                    rules={validationRule.textbox({ type: "number" })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "no-of-fr-oocytes" })}
                    name="frozenEggsNumber"
                    control={control}
                    error={errors?.frozenEggsNumber}
                    rules={validationRule.textbox({ type: "number" })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "mi" })}
                    name="mi"
                    control={control}
                    error={errors?.mi}
                    rules={validationRule.textbox({ type: "number" })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomSelect
                    options={embryosDayOptions}
                    label={formatMessage({ id: "day" })}
                    name="eggTransferDay"
                    control={control}
                    error={errors?.eggTransferDay}
                    rules={validationRule.textbox({ type: "number" })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <Box>
                    <h3 className="formHeading">
                    </h3>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <FormLabel component="legend"> {formatMessage({ id: "good-fertilisation" })}</FormLabel>
                  <RadioButton
                    label="YES"
                    name="isGoodFertilization"
                    onChange={() => {
                      setIsGoodFertilization(true);
                    }}
                    checked={isGoodFertilization}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                  <RadioButton
                    label="NO"
                    name="isGoodFertilization"
                    onChange={() => {
                      setIsGoodFertilization(false);
                    }}
                    checked={!isGoodFertilization}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "no-of-embryos" })}
                    name="embryosNumber"
                    control={control}
                    error={errors?.embryosNumber}
                    rules={validationRule.textbox({ type: "number" })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={numberTransferredOptions}
                    label={formatMessage({ id: "no-of-tr-embryos" })}
                    name="eggTransferredNumber"
                    control={control}
                    error={errors?.eggTransferredNumber}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={embryosDayOptions}
                    label={formatMessage({ id: "day" })}
                    name="numberTransferredDay"
                    control={control}
                    error={errors?.numberTransferredDay}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <FormLabel component="legend" style={{ marginBottom: "5px" }}>&nbsp;</FormLabel>
                  <CustomTextBox
                    label={formatMessage({ id: "no-of-fr-embryos" })}
                    name="frEmbryosNumber"
                    control={control}
                    error={errors?.frEmbryosNumber}
                    rules={validationRule.textbox({ type: "number" })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <FormLabel component="legend" style={{ marginBottom: "5px" }}>{formatMessage({ id: "quality-of-tr-embryos" })}</FormLabel>
                  <CustomSelect
                    options={transferredQalityOptions}
                    label=""
                    name="eggTransferQualityId1"
                    control={control}
                    error={errors?.eggTransferQualityId1}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <FormLabel component="legend" style={{ marginBottom: "5px" }}>&nbsp;</FormLabel>
                  <CustomSelect
                    options={transferredQalityOptions}
                    label=""
                    name="eggTransferQualityId2"
                    control={control}
                    error={errors?.eggTransferQualityId2}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <FormLabel component="legend" style={{ marginBottom: "5px" }}> &nbsp;</FormLabel>
                  <CustomSelect
                    options={transferredQalityOptions}
                    label=""
                    name="eggTransferQualityId3"
                    control={control}
                    error={errors?.eggTransferQualityId3}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px", marginTop: "10px" }} pt={1} padding={1}>
              <Grid container spacing={2} xs={12}>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <FormLabel component="legend">{formatMessage({ id: "pregnancy" })}</FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isPregnancy"
                    onChange={() => {
                      setIsPregnancy(true);
                    }}
                    checked={isPregnancy}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isPregnancy"
                    onChange={() => {
                      setIsPregnancy(false);
                    }}
                    checked={!isPregnancy}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend">{formatMessage({ id: "type" })}</FormLabel>
                  <RadioButton
                    label={formatMessage({ id: "single" })}
                    name="pregnancyType"
                    onChange={() => {
                      setPregnancyType(pregnancyTypes.Single);
                    }}
                    checked={pregnancyType == pregnancyTypes.Single ? true : false}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                  <RadioButton
                    label="Multiple"
                    name="pregnancyType"
                    onChange={() => {
                      setPregnancyType(pregnancyTypes.Multiple);
                    }}
                    checked={pregnancyType == pregnancyTypes.Multiple ? true : false}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={5} md={4} sm={6}>
                  <FormLabel component="legend">&nbsp;</FormLabel>
                  <CustomSelect
                    options={cycleComplicationOptions}
                    label={formatMessage({ id: "complications" })}
                    name="cycleComplicationId"
                    control={control}
                    error={errors?.cycleComplicationId}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <FormLabel component="legend" > {formatMessage({ id: "surrogacy" })}</FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isSurrogacy"
                    onChange={() => {
                      setIsSurrogacy(true);
                    }}
                    checked={isSurrogacy}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isSurrogacy"
                    onChange={() => {
                      setIsSurrogacy(false);
                    }}
                    checked={!isSurrogacy}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={pregnancyResultOptions}
                    label={formatMessage({ id: "outcome" })}
                    name="pregnancyResultId"
                    control={control}
                    error={errors?.pregnancyResultId}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={5} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "any-abnormality-in-child" })}
                    name="abnormalityRemarks"
                    control={control}
                    rows={2}
                    multiline
                    rules={validationRule.textbox({ maxLength: 100 })}
                    disabled={hasPreviousTreatment ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "observation" })}
                    name="observation"
                    control={control}
                    rows={2}
                    multiline
                    rules={validationRule.textbox({ maxLength: 200 })}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default PreviousTreatment;
