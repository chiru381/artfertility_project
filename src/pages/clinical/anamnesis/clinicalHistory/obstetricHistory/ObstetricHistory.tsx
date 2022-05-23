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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";
import ListItemText from "@material-ui/core/ListItemText";

import { CustomSelect, CustomTextBox, RadioButton, } from "components/forms";
import { HoverLoader } from "components";
import { masterPaginationServices, miscarriageTypes, molarPregnancyTypes, ectopicStages, weightUnitOptions, yesNoOptions } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

import Ectopic from './Ectopic';
import BirthPretermAndToTerm from './BirthPretermAndToTerm';
import Miscarriage from './Miscarriage';
import Molar from './Molar';
import StillBirth from './StillBirth';

interface Props { }

const ObstetricHistory = (props: Props) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const { handleSubmit, formState: { errors }, control, watch, reset, getValues } = useForm({ mode: "all" });

  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasObstetricHistory, setHasObstetricHistory] = useState(true);

  const [miscarriageType, setMiscarriageType] = useState(miscarriageTypes.Spontaneous);
  const [miscarriageReason, setMiscarriageReason] = useState(0);
  const [deliveryModeId, setDeliveryModeId] = useState(0);
  const [molarPregnancyType, setMolarPregnancyType] = useState(molarPregnancyTypes.Partial);
  const [ectopicStage, setEctopicStage] = useState(ectopicStages.Right);
  const [hasIntrauterineGrowthRestriction, setHasIntrauterineGrowthRestriction] = useState(false);
  const [obstetricHistoryItemId, setObstetricHistoryItemId] = useState(0);
  const [listRows, setListRows] = useState<any>([]);

  let patientId = useGetPatientId();

  const { calendarYearData, pregnancyEndingTypeData, gestationTypeData, puerperalPathologyData, obstetricPathologyData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      calendarYearData: masterPaginationReducer[masterPaginationServices.calendarYear].data,
      pregnancyEndingTypeData: masterPaginationReducer[masterPaginationServices.pregnancyEndingType].data,
      gestationTypeData: masterPaginationReducer[masterPaginationServices.gestationType].data,
      puerperalPathologyData: masterPaginationReducer[masterPaginationServices.puerperalPathology].data,
      obstetricPathologyData: masterPaginationReducer[masterPaginationServices.obstetricPathology].data
    }),
    shallowEqual
  );

  let calendarYearOptions = calendarYearData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let pregnancyEndingTypeOptions = pregnancyEndingTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let gestationTypeOptions = gestationTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.calendarYear, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.pregnancyEndingType, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.gestationType, {}));

    //BirthPreterm
    dispatch(getMasterPaginationData(masterPaginationServices.gestationType, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.deliveryMode, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.puerperalPathology, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.obstetricPathology, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.gender, {}));

    onGetObstetricHistoryOnApiCall();
  }, []);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    let obstetricHistoryItemBirthDetailsData = bodyData?.obstetricHistoryItemBirthDetails?.map((item: any) => ({
      ...item,
      genderId: item.genderId?.value,
      isLiveChild: item.isLiveChild?.value == 1 ? true : false,
      weightUnit: item.weightUnit?.value
    }));

    let obstetricHistoryItemObstetricPathologiesData = bodyData?.obstetricHistoryItemObstetricPathologies?.filter((item: any) => item.isSelected == true);
    let obstetricHistoryItemPuerperalPathologiesData = bodyData?.obstetricHistoryItemPuerperalPathologies?.filter((item: any) => item.isSelected == true);

    bodyData = {
      ...bodyData,
      patientId: patientId,
      hasObstetricHistory: hasObstetricHistory,
      miscarriageType: miscarriageType,
      miscarriageReason: miscarriageReason,
      deliveryModeId: deliveryModeId,
      molarPregnancyType: molarPregnancyType,
      ectopicStage: ectopicStage,
      hasIntrauterineGrowthRestriction: hasIntrauterineGrowthRestriction,
      obstetricHistoryId: bodyData?.obstetricHistoryId ?? 0,
      obstetricHistoryItemBirthDetails: obstetricHistoryItemBirthDetailsData ?? [],
      obstetricHistoryItemObstetricPathologies: obstetricHistoryItemObstetricPathologiesData ?? [],
      obstetricHistoryItemPuerperalPathologies: obstetricHistoryItemPuerperalPathologiesData ?? []
    };

    setLoading(true);
    services.upsertObstetricHistory(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(false);
          resetForm();
          onGetObstetricHistoryOnApiCall();
          setObstetricHistoryItemId(0);
          toastMessage(formatMessage({ id: isEditOn ? "obstetric-history-update-message" : "obstetric-history-create-message" }));
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
      ObstetricHistoryId: patientId,
      ObstetricHistoryItemId: obstetricHistoryItemId
    }
    setDeleteLoading(true);
    services.deleteObstetricHistoryItem(parms)
      .then((res) => {
        setDeleteLoading(false);
        if (res.data?.succeeded) {
          setObstetricHistoryItemId(0);
          resetForm();
          onGetObstetricHistoryOnApiCall();
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

  function onGetObstetricHistoryOnApiCall() {
    let paramsData = {
      ObstetricHistoryId: patientId
    };
    setLoading(true);
    services.getObstetricHistoryById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setFormData(res.data.response);
          setListRows(res.data.response?.obstetricHistoryItems);

        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function resetForm() {
    reset({});
  }

  function setFormData(resData: any) {
    let data = {
      //...resData,
      obstetricHistoryId: resData.id,
      id: 0
    }
    reset(data);
  }

  function onEdit(resData: any) {
    let data = {
      ...getValues(),
      ...resData,
      calendarYearId: calendarYearOptions?.find((item: any) => item.value == resData.calendarYearId),
      gestationTypeId: pregnancyEndingTypeOptions?.find((item: any) => item.value == resData.gestationTypeId),
      pregnancyEndingTypeId: pregnancyEndingTypeOptions?.find((item: any) => item.value == resData.pregnancyEndingTypeId),
    }

    if (resData?.pregnancyEndingTypeId == (5 || 6)) {
      let obstetricHistoryItemBirthDetailsData = resData.obstetricHistoryItemBirthDetails?.map((item: any) => ({
        ...item,
        genderId: { label: item.genderName, value: item.genderId },
        weightUnit: weightUnitOptions.find((option: any) => option.value == item.weightUnit) ?? null,
        isLiveChild: yesNoOptions.find((option: any) => option.value == (item.isLiveChild ? 1 : 2)) ?? null,
      }));

      let puerperalPathologyOptions = puerperalPathologyData.modelItems?.map((option: any) => ({
        puerperalPathologyName: option.name,
        puerperalPathologyId: option.id,
        isSelected: resData?.obstetricHistoryItemPuerperalPathologies?.some((item: any) => item.puerperalPathologyId == option.id),
        remarks: resData?.obstetricHistoryItemPuerperalPathologies?.filter((item: any) => item.puerperalPathologyId == option.id)?.find((data: any) => { data.remarks }) ?? null,
      }));

      let obstetricPathologyOptions = obstetricPathologyData.modelItems?.map((option: any) => ({
        obstetricPathologyName: option.name,
        obstetricPathologyId: option.id,
        isSelected: resData?.obstetricHistoryItemObstetricPathologies?.some((item: any) => item.obstetricPathologyId == option.id)
      }));

      data = {
        ...data,
        obstetricHistoryItemBirthDetails: obstetricHistoryItemBirthDetailsData,
        obstetricHistoryItemPuerperalPathologies: puerperalPathologyOptions,
        obstetricHistoryItemObstetricPathologies: obstetricPathologyOptions
      }
      setHasIntrauterineGrowthRestriction(resData?.hasIntrauterineGrowthRestriction);
    }

    reset(data);

    setDeliveryModeId(resData?.deliveryModeId);
    setMiscarriageType(resData?.miscarriageType);
    setMiscarriageReason(resData?.miscarriageReason);

    setMolarPregnancyType(resData?.molarPregnancyType);
    setEctopicStage(resData?.ectopicStage);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "obstetric-history" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4} md={12} sm={12}>
            <Grid item xs={12} lg={12} md={6} sm={12} style={{ display: "flex", alignItems: "center" }}>
              <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "obstetric-background" })}</FormLabel>
              <RadioButton
                label="Yes"
                name="hasObstetricHistory"
                onChange={() => {
                  setHasObstetricHistory(true);
                }}
                checked={hasObstetricHistory}
              />
              <RadioButton
                label="No"
                name="hasObstetricHistory"
                onChange={() => {
                  setHasObstetricHistory(false);
                }}
                checked={!hasObstetricHistory}
              />
            </Grid>

            <Grid item xs={12} lg={12} md={12} sm={12}>
              <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px", marginTop: "5px" }} pt={1} padding={1} >
                <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }} >
                  <TableContainer>
                    <Table size="small" stickyHeader aria-label="sticky table" style={{ border: "1px solid #c2c2c2" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ textAlign: "center" }}>
                            <FormattedMessage id="history-list" />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <Grid item xs={12} lg={12} md={12} sm={12}>
                          <List style={{ maxHeight: "45vh", overflowX: "hidden" }}>
                            {listRows?.map((item: any, index: any) => {
                              return (
                                <ListItem key={index} dense role={undefined} style={{ background: index % 2 == 0 ? "#F6FFFF 0% 0% no-repeat padding-box" : "#F8F8F8 0% 0% no-repeat padding-box" }}>
                                  <Link className="cursorPointer" onClick={() => {
                                    if (hasObstetricHistory) {
                                      onEdit(item);
                                      setObstetricHistoryItemId(item.id);
                                    }
                                  }}
                                  >
                                    <ListItemText primary={`${item.calendarYearName ?? ""} - ${item.gestationTypeName ?? ""} - ${item?.pregnancyEndingTypeName ?? ""}`} /></Link>
                                </ListItem>
                              );
                            })}
                            {!listRows?.length && (
                              <ListItem dense role={undefined} style={{ background: "#F8F8F8 0% 0% no-repeat padding-box", textAlign: "center" }}>
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

            <Grid container spacing={1} item xs={12} style={{ marginTop: "10px" }}>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "gravida" })}
                  name="toTermGravida"
                  control={control}
                  rules={validationRule.textbox({ type: "number" })}
                  disabled={!hasObstetricHistory}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "para" })}
                  name="toTermPara"
                  control={control}
                  rules={validationRule.textbox({ type: "number" })}
                  disabled={!hasObstetricHistory}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "abortion" })}
                  name="toTermAbortion"
                  control={control}
                  rules={validationRule.textbox({ type: "number" })}
                  disabled={!hasObstetricHistory}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "ectopics" })}
                  name="toTermEctopic"
                  control={control}
                  rules={validationRule.textbox({ type: "number" })}
                  disabled={!hasObstetricHistory}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} lg={8} md={12} sm={12}>
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px", marginTop: "30px", marginBottom: "10px" }} pt={1} padding={1}>
              <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", marginBottom: "10px" }}>
                <Grid item xs={12} lg={2} md={2} sm={2} style={{ marginRight: "10px" }}>
                  <CustomSelect
                    options={calendarYearOptions}
                    label={formatMessage({ id: "year" })}
                    name="calendarYearId"
                    control={control}
                    error={hasObstetricHistory ? errors.calendarYearId : null}
                    rules={validationRule.textbox({ required: hasObstetricHistory ? true : false })}
                    disabled={!hasObstetricHistory}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={4} style={{ marginRight: "10px" }}>
                  <CustomSelect
                    options={gestationTypeOptions}
                    label={formatMessage({ id: "pregnancy-mode" })}
                    name="gestationTypeId"
                    control={control}
                    error={hasObstetricHistory ? errors.gestationTypeId : null}
                    rules={validationRule.textbox({ required: hasObstetricHistory ? true : false })}
                    disabled={!hasObstetricHistory}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={4} style={{ marginRight: "10px" }}>
                  <CustomSelect
                    options={pregnancyEndingTypeOptions}
                    label={formatMessage({ id: "ending" })}
                    name="pregnancyEndingTypeId"
                    control={control}
                    error={hasObstetricHistory ? errors.pregnancyEndingTypeId : null}
                    rules={validationRule.textbox({ required: hasObstetricHistory ? true : false })}
                    disabled={!hasObstetricHistory}
                  />
                </Grid>

                <Grid item xs={12} lg={1} md={1} sm={1}>
                  <CustomTextBox
                    label={formatMessage({ id: "W" })}
                    name="gestationalWeeks"
                    control={control}
                    error={hasObstetricHistory ? errors.gestationalWeeks : null}
                    rules={validationRule.textbox({ required: hasObstetricHistory ? true : false, type: "number" })}
                    disabled={!hasObstetricHistory}
                  />
                </Grid>
                +
                <Grid item xs={12} lg={1} md={1} sm={1}>
                  <CustomTextBox
                    label={formatMessage({ id: "D" })}
                    name="gestationalDays"
                    control={control}
                    error={hasObstetricHistory ? errors.gestationalDays : null}
                    rules={validationRule.textbox({ required: hasObstetricHistory ? true : false, type: "number" })}
                    disabled={!hasObstetricHistory}
                  />
                </Grid>
              </Grid>
              {watch("pregnancyEndingTypeId")?.value === 1 &&
                <Ectopic
                  control={control}
                  ectopicStage={ectopicStage}
                  setEctopicStage={setEctopicStage} />
              }
              {watch("pregnancyEndingTypeId")?.value === 2 &&
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={12} md={12} sm={12}>
                    <CustomTextBox
                      label={formatMessage({ id: "remarks", })}
                      name="observations"
                      control={control}
                      rules={validationRule.textbox({ maxLength: 200 })}
                    />
                  </Grid>
                  <Grid item xs={12} lg={12} md={12} sm={12} >
                    <CustomTextBox
                      label={formatMessage({ id: "complications", })}
                      name="complications"
                      control={control}
                      rules={validationRule.textbox({ maxLength: 50 })}
                    />
                  </Grid>
                </Grid>
              }
              {(watch("pregnancyEndingTypeId")?.value === 3 || watch("pregnancyEndingTypeId")?.value === 4) &&
                <Miscarriage
                  control={control}
                  miscarriageType={miscarriageType}
                  setMiscarriageType={setMiscarriageType}
                  miscarriageReason={miscarriageReason}
                  setMiscarriageReason={setMiscarriageReason}
                  deliveryModeId={deliveryModeId}
                  setDeliveryModeId={setDeliveryModeId}
                />
              }
              {(watch("pregnancyEndingTypeId")?.value === 5 || watch("pregnancyEndingTypeId")?.value === 6) &&
                <BirthPretermAndToTerm
                  control={control}
                  hasIntrauterineGrowthRestriction={hasIntrauterineGrowthRestriction}
                  setHasIntrauterineGrowthRestriction={setHasIntrauterineGrowthRestriction}
                  deliveryModeId={deliveryModeId}
                  setDeliveryModeId={setDeliveryModeId}
                  watch={watch}
                  errors={errors}
                />
              }
              {(watch("pregnancyEndingTypeId")?.value === 7) &&
                <Molar
                  control={control}
                  molarPregnancyType={molarPregnancyType}
                  setMolarPregnancyType={setMolarPregnancyType}
                />
              }
              {(watch("pregnancyEndingTypeId")?.value === 8) &&
                <StillBirth
                  control={control}
                  deliveryModeId={deliveryModeId}
                  setDeliveryModeId={setDeliveryModeId}
                />
              }
              {!(watch("pregnancyEndingTypeId")?.value) &&
                <Grid item xs={12} lg={6} md={6} sm={6} style={{ marginTop: "10px" }}>
                  <CustomTextBox
                    label={formatMessage({ id: "complications" })}
                    name="complications"
                    control={control}
                    rules={validationRule.textbox({ maxLength: 50 })}
                  />
                </Grid>
              }

            </Box>
            <Grid item xs={12} lg={12} md={12} sm={12}>
              <CustomTextBox
                label={formatMessage({ id: "observations" })}
                name="obstetricHistoryObservations"
                control={control}
                error={errors.obstetricHistoryObservations}
                multiline
                rows={2}
                rules={validationRule.textbox({ maxLength: 200 })}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default ObstetricHistory;
