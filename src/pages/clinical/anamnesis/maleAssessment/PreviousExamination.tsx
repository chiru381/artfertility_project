import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import FormLabel from "@material-ui/core/FormLabel";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { CustomCheckBox } from 'components/forms';
import { TableButtonGroup, TableEditButton, DeleteButton } from 'components/button';
import { CustomSelect, CustomTextBox, CustomDatePicker } from "components/forms";
import { HoverLoader } from "components";
import {
  masterPaginationServices, consanguinityOptions, normalAbnomalOptions, azoospermiaOptions, azoospermiaTypes,
  yqdeletionOptions, azfABCDeletionOptions, karyotypeAbnormalOptions, karyotypeOptions, yqdeletionTypes
} from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage,useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const PreviousExamination = (props: Props) => {

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const { handleSubmit, formState: { errors }, control, reset, watch } = useForm({ mode: "all" });

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fields, append, remove } = useFieldArray({ control, name: "spermogramMappings", });
  const histopathologicalMappings = useFieldArray({ control, name: "histopathologicalMappings", });

  let patientId = useGetPatientId();

  const { consultationReasonData, calendarYearData, abnormalityData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      consultationReasonData: masterPaginationReducer[masterPaginationServices.consultationReason].data,
      calendarYearData: masterPaginationReducer[masterPaginationServices.calendarYear].data,
      abnormalityData: masterPaginationReducer[masterPaginationServices.abnormality].data
    }),
    shallowEqual
  );

  let consultationReasonOptions = consultationReasonData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let calendarYearOptions = calendarYearData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let abnormalityOptions = abnormalityData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.consultationReason, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.calendarYear, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.abnormality, {}));
    onAddSpermiogram();
    onAddTestType();
  }, []);

  useEffect(() => {
    if (consultationReasonOptions?.length && calendarYearOptions?.length && abnormalityOptions?.length) {
      onEdit();
    }
  }, [consultationReasonOptions?.length && calendarYearOptions?.length && abnormalityOptions?.length]);

  function onAddSpermiogram() {
    append({});
  }

  function onAddTestType() {
    histopathologicalMappings.append({});
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    let histopathologicalMappingsData = bodyData?.histopathologicalMappings?.map((item: any) => ({
      ...item,
      year: item?.year?.value
    }));

    let spermogramMappingsData = bodyData?.spermogramMappings?.map((item: any) => ({
      ...item,
      abnormalityId: item?.abnormalityId?.value,
      normalAbnormal: item?.normalAbnormal?.value,
      azoospermia: item?.azoospermia?.value,
      yqDeletion: item?.yqDeletion?.value,
      azfaDeletion: item?.azfaDeletion?.value,
      azfbDeletion: item?.azfbDeletion?.value,
      azfcDeletion: item?.azfcDeletion?.value,
      karyotype: item?.karyotype?.value,
      karyotypeAbnormal: item?.karyotypeAbnormal?.value
    }));

    bodyData = {
      ...bodyData,
      id: patientId,
      histopathologicalMappings: histopathologicalMappingsData,
      spermogramMappings: spermogramMappingsData
    };

    setLoading(true);

    let previsousExaminationOfTheManService = services[(isEditOn ? 'updatePreviousExaminationOfTheMan' : 'createPreviousExaminationOfTheMan') as keyof typeof services];

    previsousExaminationOfTheManService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          toastMessage(formatMessage({ id: isEditOn ? "update-message" : "create-message" }));
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
      PreviousExaminationoftheManId: patientId
    }
    setDeleteLoading(true);
    services.deletePreviousExaminationOfTheMan(parms)
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
      PreviousExaminationoftheManId: patientId
    };
    setLoading(true);
    services.getPreviousExaminationOfTheManById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
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
  }

  function setFormData(resData: any) {

    let histopathologicalMappingsData = resData?.histopathologicalMappings?.map((item: any) => ({
      ...item,
      year: calendarYearOptions?.find((option: any) => option.value == item.year) ?? null,
    }));

    let spermogramMappingsData = resData?.spermogramMappings?.map((item: any) => ({
      ...item,
      abnormalityId: abnormalityOptions?.find((option: any) => option.value == item.abnormalityId) ?? null,
      normalAbnormal: normalAbnomalOptions?.find((option: any) => option.value == item.normalAbnormal) ?? null,
      azoospermia: azoospermiaOptions?.find((option: any) => option.value == item.azoospermia) ?? null,
      yqDeletion: yqdeletionOptions?.find((option: any) => option.value == item.yqDeletion) ?? null,
      azfaDeletion: azfABCDeletionOptions?.find((option: any) => option.value == item.azfaDeletion) ?? null,
      azfbDeletion: azfABCDeletionOptions?.find((option: any) => option.value == item.azfbDeletion) ?? null,
      azfcDeletion: azfABCDeletionOptions?.find((option: any) => option.value == item.azfcDeletion) ?? null,
      karyotype: karyotypeOptions?.find((option: any) => option.value == item.karyotype) ?? null,
      karyotypeAbnormal: karyotypeAbnormalOptions?.find((option: any) => option.value == item.karyotypeAbnormal) ?? null,
    }));

    let data = {
      ...resData,
      consultationReasonId: consultationReasonOptions?.find((item: any) => item.value == resData?.consultationReasonId) ?? null,
      coupleConsanguinity: consanguinityOptions?.find((item: any) => item.value == resData?.coupleConsanguinity) ?? null,
      parentalConsanguinityFemale: consanguinityOptions?.find((item: any) => item.value == resData?.parentalConsanguinityFemale) ?? null,
      parentalConsanguinityMale: consanguinityOptions?.find((item: any) => item.value == resData?.parentalConsanguinityMale) ?? null,
      histopathologicalMappings: histopathologicalMappingsData,
      spermogramMappings: spermogramMappingsData
    }
    reset(data);
  }

  return (
      <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "male-assessment-previous-examination" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "start-date" })}
              name="startDate"
              control={control}
              error={errors.startDate}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={consultationReasonOptions}
              label={formatMessage({ id: "reason-for-visit" })}
              name="consultationReasonId"
              control={control}
              error={errors.consultationReasonId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "start-age" })}
              name="startAge"
              control={control}
              error={errors.startAge}
              rules={validationRule.textbox({ type: "number" })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "summary" })}
              name="summary"
              control={control}
              error={errors.summary}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Box>
              <h3 className="formHeading">
                <FormattedMessage id="paternity" />
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "children-same-partner" })}
              name="childrenSamePartner"
              control={control}
              error={errors.childrenSamePartner}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "children-other-partner" })}
              name="childrenSamePartner"
              control={control}
              error={errors.childrenSamePartner}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "total-children" })}
              name="totalChildren"
              control={control}
              error={errors.totalChildren}
            />
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Box>
              <h3 className="formHeading">
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend" style={{ marginBottom: "5px" }}>{formatMessage({ id: "couple-consanguinity" })}</FormLabel>
            <CustomSelect
              options={consanguinityOptions}
              label=""
              name="coupleConsanguinity"
              control={control}
              error={errors.coupleConsanguinity}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend" style={{ marginBottom: "5px" }}>{formatMessage({ id: "parental-consanguinity" })}</FormLabel>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "female-partner" })}
              name="parentalConsanguinityFemale"
              control={control}
              error={errors.parentalConsanguinityFemale}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend" style={{ marginBottom: "5px" }}>&nbsp;</FormLabel>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "male-partner" })}
              name="parentalConsanguinityMale"
              control={control}
              error={errors.parentalConsanguinityMale}
            />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <h3 className="formHeading">
                <FormattedMessage id="spermiogram" />
              </h3>
            </Box>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="date" /></TableCell>
                    <TableCell style={{ width: "12%" }} align="center"><FormattedMessage id="count" /></TableCell>
                    <TableCell style={{ width: "14%" }}>%<FormattedMessage id="percent-motile" /></TableCell>
                    <TableCell style={{ width: "12%" }}>%<FormattedMessage id="percent-normal" /></TableCell>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="normal/abnormal" /></TableCell>
                    <TableCell style={{ width: "18%" }}><FormattedMessage id="observation" /></TableCell>
                    <TableCell style={{ width: "15%" }}>
                      <Button
                        variant="contained"
                        onClick={onAddSpermiogram}
                        style={{ padding: "0px 11px", background: "white" }}
                      >
                        <FormattedMessage id="add-new-row" />
                      </Button>
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody style={{ padding: "9px 0.1rem" }}>
                  {fields.map(({ id }, index) => {
                    return (
                      <>
                        <TableRow hover tabIndex={-1} key={id}>
                          <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                            <CustomDatePicker
                              label={formatMessage({ id: "date" })}
                              name={`spermogramMappings[${index}].[date]`}
                              control={control}
                              error={errors?.[`spermogramMappings`]?.[index]?.["date"]}
                            />
                          </TableCell>
                          <TableCell align="center" style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                            <CustomTextBox
                              label=""
                              name={`spermogramMappings[${index}].[count]`}
                              control={control}
                              type="number"
                              error={errors?.[`spermogramMappings`]?.[index]?.["count"]}
                            />
                          </TableCell>
                          <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                            <CustomTextBox
                              label=""
                              name={`spermogramMappings[${index}].[motile]`}
                              control={control}
                              type="number"
                              error={errors?.[`spermogramMappings`]?.[index]?.["motile"]}
                            />
                          </TableCell>
                          <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                            <CustomTextBox
                              label=""
                              name={`spermogramMappings[${index}].[normal]`}
                              control={control}
                              type="number"
                              error={errors?.[`spermogramMappings`]?.[index]?.["normal"]}
                            />
                          </TableCell>
                          <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                            <CustomSelect
                              options={normalAbnomalOptions}
                              label={formatMessage({ id: "Abnormal" })}
                              name={`spermogramMappings[${index}].[normalAbnormal]`}
                              control={control}
                              error={errors?.[`spermogramMappings`]?.[index]?.["normalAbnormal"]}
                            />
                          </TableCell>
                          <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                            <CustomTextBox
                              label={formatMessage({ id: "observations" })}
                              name={`spermogramMappings[${index}].[observations]`}
                              control={control}
                            />
                          </TableCell>
                          <TableCell>
                            {fields.length - 1 !== 0 && (
                              <TableButtonGroup>
                                <TableEditButton onClick={() => {
                                }}
                                />
                                <DeleteButton
                                  onDelete={() => {
                                    remove(index);
                                  }}
                                />
                              </TableButtonGroup>
                            )
                            }
                          </TableCell>
                        </TableRow>
                        {watch(`spermogramMappings[${index}].[normalAbnormal]`)?.value === 2 &&
                          <>
                            <TableRow className="trBorderBottomRemove" style={{ borderBottom: "none", borderTop: "none" }}>
                              <TableCell style={{ paddingLeft: "2px", paddingRight: "2px", paddingTop: "42px" }}>
                                <CustomDatePicker
                                  label={formatMessage({ id: "date" })}
                                  name={`spermogramMappings[${index}].[date]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["date"]}
                                />
                              </TableCell>
                              <TableCell style={{ paddingLeft: "2px", paddingRight: "2px", paddingTop: "42px" }}>
                                <CustomSelect
                                  options={abnormalityOptions}
                                  label={formatMessage({ id: "abnormality" })}
                                  name={`spermogramMappings[${index}].[abnormalityId]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["abnormalityId"]}
                                />
                              </TableCell>
                              <TableCell style={{ paddingLeft: "2px", paddingRight: "2px", paddingTop: "42px" }}>
                                <CustomSelect
                                  options={azoospermiaOptions}
                                  label={formatMessage({ id: "azoospermia" })}
                                  name={`spermogramMappings[${index}].[azoospermia]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["azoospermia"]}
                                />
                              </TableCell>
                              <TableCell style={{ paddingLeft: "2px", paddingRight: "2px", paddingTop: "42px" }}>
                                <CustomSelect
                                  options={yqdeletionOptions}
                                  label={formatMessage({ id: "y-q-deletion" })}
                                  name={`spermogramMappings[${index}].[yqDeletion]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["yqDeletion"]}
                                  disabled={watch(`spermogramMappings[${index}].[azoospermia]`)?.value == azoospermiaTypes.NonObstructive ? false : true}
                                />
                              </TableCell>
                              <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                <CustomCheckBox
                                  label={formatMessage({ id: "azfa-deletion" })}
                                  name={`spermogramMappings[${index}].[isAZFADeletion]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["isAZFADeletion"]}
                                  disabled={watch(`spermogramMappings[${index}].[yqDeletion]`)?.value == yqdeletionTypes.Abnormal ? false : true}
                                />
                                <CustomSelect
                                  options={azfABCDeletionOptions}
                                  label=""
                                  name={`spermogramMappings[${index}].[azfaDeletion]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["azfaDeletion"]}
                                  disabled={watch(`spermogramMappings[${index}].[yqDeletion]`)?.value == yqdeletionTypes.Abnormal && watch(`spermogramMappings[${index}].[isAZFADeletion]`) ? false : true}
                                />
                              </TableCell>
                              <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                <CustomCheckBox
                                  label={formatMessage({ id: "azfb-deletion" })}
                                  name={`spermogramMappings[${index}].[isAZFBDeletion]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["isAZFBDeletion"]}
                                  disabled={watch(`spermogramMappings[${index}].[yqDeletion]`)?.value == yqdeletionTypes.Abnormal ? false : true}
                                />
                                <CustomSelect
                                  options={azfABCDeletionOptions}
                                  label=""
                                  name={`spermogramMappings[${index}].[azfbDeletion]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["azfbDeletion"]}
                                  disabled={watch(`spermogramMappings[${index}].[yqDeletion]`)?.value == yqdeletionTypes.Abnormal && watch(`spermogramMappings[${index}].[azfbDeletion]`) ? false : true}
                                />
                              </TableCell>
                              <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                <CustomCheckBox
                                  label={formatMessage({ id: "azfc-deletion" })}
                                  name={`spermogramMappings[${index}].[isAZFCDeletion]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["isAZFCDeletion"]}
                                  disabled={watch(`spermogramMappings[${index}].[yqDeletion]`)?.value == yqdeletionTypes.Abnormal ? false : true}
                                />
                                <CustomSelect
                                  options={azfABCDeletionOptions}
                                  label=""
                                  name={`spermogramMappings[${index}].[azfcDeletion]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["azfcDeletion"]}
                                  disabled={watch(`spermogramMappings[${index}].[yqDeletion]`)?.value == yqdeletionTypes.Abnormal && watch(`spermogramMappings[${index}].[azfcDeletion]`) ? false : true}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={3}></TableCell>
                              <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                <CustomSelect
                                  options={karyotypeOptions}
                                  label={formatMessage({ id: "karyotype" })}
                                  name={`spermogramMappings[${index}].[karyotype]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["karyotype"]}
                                />
                              </TableCell>
                              <TableCell style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                <CustomSelect
                                  options={karyotypeAbnormalOptions}
                                  label=""
                                  name={`spermogramMappings[${index}].[karyotypeAbnormal]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["karyotypeAbnormal"]}
                                />
                              </TableCell>
                              <TableCell colSpan={2} style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                <CustomTextBox
                                  label={formatMessage({ id: "remarks" })}
                                  name={`spermogramMappings[${index}].[karyotypeAbnormalRemarks]`}
                                  control={control}
                                  error={errors?.[`spermogramMappings`]?.[index]?.["karyotypeAbnormalRemarks"]}
                                />
                              </TableCell>
                            </TableRow>
                          </>
                        }
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25%" }}><FormattedMessage id="year" /></TableCell>
                    <TableCell style={{ width: "10%" }} align="center"></TableCell>
                    <TableCell style={{ width: "25%" }}><FormattedMessage id="test" /></TableCell>
                    <TableCell style={{ width: "35%" }}><FormattedMessage id="observation" /></TableCell>
                    <TableCell style={{ width: "5%" }}>
                      <Button
                        variant="contained"
                        onClick={onAddTestType}
                        style={{ padding: "0px 11px", background: "white" }}
                      >
                        <FormattedMessage id="add-new-row" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {histopathologicalMappings?.fields.map(({ id }, index) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell>
                            <CustomSelect
                              options={calendarYearOptions}
                              label={formatMessage({ id: "year" })}
                              name={`histopathologicalMappings[${index}].[year]`}
                              control={control}
                              error={errors?.[`histopathologicalMappings`]?.[index]?.["year"]}
                            />
                          </TableCell>

                          <TableCell colSpan={3} style={{ border: "0.1em solid #E2E2E2", borderTop: "white", padding: 0 }}>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell style={{ border: "0.1em solid #E2E2E2", borderTop: "white" }}> Hormonal Treatment </TableCell>
                                  <TableCell style={{ border: "0.1em solid #E2E2E2", borderTop: "white", padding: 0 }}>
                                    <CustomTextBox
                                      label=""
                                      name={`histopathologicalMappings[${index}].[hormonalTreatment]`}
                                      control={control}
                                      error={errors?.[`histopathologicalMappings`]?.[index]?.["hormonalTreatment"]}
                                      style={{ width: "100%" }}
                                    />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ border: "0.1em solid #E2E2E2", borderTop: "white" }}> TESE </TableCell>
                                  <TableCell style={{ border: "0.1em solid #E2E2E2", borderTop: "white", padding: 0 }}>
                                    <CustomTextBox
                                      label=""
                                      name={`histopathologicalMappings[${index}].[tese]`}
                                      control={control}
                                      error={errors?.[`histopathologicalMappings`]?.[index]?.["tese"]}
                                      style={{ paddingLeft: "0px", paddingRight: "0px" }}
                                    />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ border: "0.1em solid #E2E2E2", borderTop: "white" }}> Micro TESE </TableCell>
                                  <CustomTextBox
                                    label=""
                                    name={`histopathologicalMappings[${index}].[microTESE]`}
                                    control={control}
                                    error={errors?.[`histopathologicalMappings`]?.[index]?.["microTESE"]}
                                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                                  />
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ border: "0.1em solid #E2E2E2", borderTop: "white" }}> FNA </TableCell>
                                  <CustomTextBox
                                    label=""
                                    name={`histopathologicalMappings[${index}].[fna]`}
                                    control={control}
                                    error={errors?.[`histopathologicalMappings`]?.[index]?.["fna"]}
                                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                                  />
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ border: "0.1em solid #E2E2E2", borderTop: "white" }}> Sertoli Cells </TableCell>
                                  <CustomTextBox
                                    label=""
                                    name={`histopathologicalMappings[${index}].[sertoliCells]`}
                                    control={control}
                                    error={errors?.[`histopathologicalMappings`]?.[index]?.["sertoliCells"]}
                                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                                  />
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ border: "0.1em solid #E2E2E2", borderTop: "white" }}> Maturation Arrest </TableCell>
                                  <CustomTextBox
                                    label=""
                                    name={`histopathologicalMappings[${index}].[maturationArrest]`}
                                    control={control}
                                    error={errors?.[`histopathologicalMappings`]?.[index]?.["maturationArrest"]}
                                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                                  />
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ border: "0.1em solid #E2E2E2", borderTop: "white" }}> Other </TableCell>
                                  <CustomTextBox
                                    label=""
                                    name={`histopathologicalMappings[${index}].[other]`}
                                    control={control}
                                    error={errors?.[`histopathologicalMappings`]?.[index]?.["other"]}
                                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                                  />
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableCell>

                          <TableCell>
                            <TableButtonGroup>
                              <TableEditButton onClick={() => {
                              }}
                              />
                              <DeleteButton
                                onDelete={() => {
                                  histopathologicalMappings.remove(index);
                                }}
                              />
                            </TableButtonGroup>
                          </TableCell>
                        </TableRow>
                      </>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "observation" })}
              name="observations"
              control={control}
              error={errors.observations}
            />
          </Grid>
        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
      </CustomClinicalActionHeaderWithWrap>
  );
};

export default PreviousExamination;

