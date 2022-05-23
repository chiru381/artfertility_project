import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Paper from '@material-ui/core/Paper';
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

import { TableButtonGroup, DeleteButton } from 'components/button';
import { CustomSelect, CustomTextBox, CustomDatePicker, RadioButton, CustomRadioButton } from "components/forms";
import { HoverLoader } from "components";
import { consanguinityOptions, cycleOptions, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import RichTextModal from "./RichTextModal";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { CustomDialog } from 'components/CustomDialog';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const GeneralHistory = (props: Props) => {
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, watch, getValues, reset, } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [richTextModalOpen, setRichTextModalOpen] = useState(false);

  const [showContraceptionConfirmation, setShowContraceptionConfirmation] = useState(false);
  const [headerLabel, setHeaderLabel] = useState("");
  const [isOnsiteVisit, setIsOnsiteVisit] = useState(true);
  const [isContraceptions, setIsContraceptions] = useState(false);
  const [relevantNotes, setRelevantNote] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const { fields, append, remove } = useFieldArray({ control, name: "clinicalHistoryContraceptions", });

  let patientId = useGetPatientId();

  const { medicalStaffData, consultationReasonData, dysmenorrheaData, contraceptiveMethodData, dressCodeData, skinColorData, translatorData,
  } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
      consultationReasonData: masterPaginationReducer[masterPaginationServices.consultationReason].data,
      dysmenorrheaData: masterPaginationReducer[masterPaginationServices.dysmenorrhea].data,
      contraceptiveMethodData: masterPaginationReducer[masterPaginationServices.contraceptiveMethod].data,
      dressCodeData: masterPaginationReducer[masterPaginationServices.dressCode].data,
      skinColorData: masterPaginationReducer[masterPaginationServices.skinColor].data,
      translatorData: masterPaginationReducer[masterPaginationServices.translator].data,
    }),
    shallowEqual
  );

  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));
  let consultationReasonOptions = consultationReasonData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let dysmenorrheaOptions = dysmenorrheaData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let contraceptiveMethodOptions = contraceptiveMethodData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let dressCodeOptions = dressCodeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let skinColorOptions = skinColorData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let translatorOptions = translatorData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.consultationReason, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.dysmenorrhea, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.contraceptiveMethod, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.dressCode, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.skinColor, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.translator, {}));

    onAddContraceptiveMethod();
  }, []);

  useEffect(() => {
    if (medicalStaffOptions?.length && consultationReasonOptions?.length && dysmenorrheaOptions?.length && contraceptiveMethodOptions?.length
      && dressCodeOptions?.length && skinColorOptions?.length && translatorOptions?.length) {
      onEdit();
    }
  }, [medicalStaffOptions?.length && consultationReasonOptions?.length && dysmenorrheaOptions?.length && contraceptiveMethodOptions?.length
    && dressCodeOptions?.length && skinColorOptions?.length && translatorOptions?.length])

  useEffect(() => {
    if (watch("consultationReasonId")?.value || watch("infertilityYears")) {
      let relevantNotesData = `${watch("consultationReasonId")?.value ? `Consultation reason : ${watch("consultationReasonId")?.label}, ` : ""} ${watch("infertilityYears") ? `years of infertility - ${watch("infertilityYears")}` : ""}`;
      setRelevantNote(relevantNotesData);
    }
  }, [watch("consultationReasonId")?.value || watch("infertilityYears")]);

  function onAddContraceptiveMethod() {
    append({});
  }

  function updateRelaventNotesAndTreatmentPlan(template: any) {
    if (headerLabel === "treatment-plan") {
      setTreatmentPlan(template);
    } else if (headerLabel === "relevant-notes") {
      setRelevantNote(template);
    }
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    let newList = bodyData?.clinicalHistoryContraceptions?.map((item: any) => ({
      ...item,
      contraceptiveMethodId: item?.contraceptiveMethodId?.value,
    }));

    bodyData = {
      ...bodyData,
      id: patientId,
      clinicalHistoryContraceptions: newList,
      treatmentPlan: treatmentPlan,
      relevantNotes: relevantNotes,
      isContraceptions: isContraceptions,
      isOnsiteVisit: isOnsiteVisit,
    };

    setLoading(true);

    let clinicalHistoryService = services[(isEditOn ? 'updateClinicalHistory' : 'createClinicalHistory') as keyof typeof services];

    clinicalHistoryService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          toastMessage(formatMessage({ id: isEditOn ? "general-history-update-message" : "general-history-create-message" }));
        } else {
          toastMessage(res.data?.message, "error");
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, "error");
      });
  }

  const handleLatestChange = (idx: any) => {
    let records = getValues("clinicalHistoryContraceptions");

    const newList = records?.map((item: any, index: any) => ({
      ...item,
      isLatest: index === idx ? true : false,
    }));
    reset({
      ...getValues(),
      clinicalHistoryContraceptions: newList,
    });
  };

  function onDelete() {
    const parms = {
      clinicalHistoryId: patientId,
    }
    setDeleteLoading(true);
    services.deleteClinicalHistory(parms)
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
      clinicalHistoryId: patientId
    };
    setLoading(true);
    services.getClinicalHistoryById(paramsData)
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
    setHeaderLabel("");
    setRelevantNote("");
    setTreatmentPlan("");
  }

  function setFormData(resData: any) {
    let newList = resData.clinicalHistoryContraceptions.map((item: any) => ({
      ...item,
      contraceptiveMethodId: { label: item.contraceptiveMethodName, value: item.contraceptiveMethodId }
    }));

    let data = {
      ...resData,
      responsibleId: medicalStaffOptions?.find((item: any) => item.value == resData?.responsibleId) ?? null,
      consultationReasonId: consultationReasonOptions?.find((item: any) => item.value == resData?.consultationReasonId) ?? null,
      dysmenorrheaId: dysmenorrheaOptions?.find((item: any) => item.value == resData?.dysmenorrheaId) ?? null,
      consistenceLeft: contraceptiveMethodOptions?.find((item: any) => item.value == resData?.consistenceLeft) ?? null,
      dressCodeId: dressCodeOptions?.find((item: any) => item.value == resData?.dressCodeId) ?? null,
      skinColorId: skinColorOptions?.find((item: any) => item.value == resData?.skinColorId) ?? null,
      translatorId: translatorOptions?.find((item: any) => item.value == resData?.translatorId) ?? null,
      wifeParentsConsanguinityId: consanguinityOptions?.find((item: any) => item.value == resData?.wifeParentsConsanguinityId) ?? null,
      husbandParentsConsanguinityId: consanguinityOptions?.find((item: any) => item.value == resData?.husbandParentsConsanguinityId) ?? null,
      coupleConsanguinityId: consanguinityOptions?.find((item: any) => item.value == resData?.coupleConsanguinityId) ?? null,
      cycleType: cycleOptions?.find((item: any) => item.value == resData?.cycleType) ?? null,
      clinicalHistoryContraceptions: newList
    }

    reset(data);
    setTreatmentPlan(data.treatmentPlan);
    setRelevantNote(data.relevantNotes);
    setIsContraceptions(data.isContraceptions);
    setIsOnsiteVisit(data.isOnsiteVisit);
  }

  function handleClose() {
    setShowContraceptionConfirmation(false);
  }

  function onAgree() {
    setIsContraceptions(false);
    remove();
    setTimeout(() => {
      append({});
    }, 100);
    setShowContraceptionConfirmation(false);
  }

  function createMarkup(data: any) {
    return { __html: data };
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "heading-clinical-history-general" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} md={4} sm={6} style={{ display: "flex", alignItems: "center" }} >
            <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "on-site-visit" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="isOnsiteVisit"
              onChange={() => {
                setIsOnsiteVisit(true);
              }}
              checked={isOnsiteVisit}
            />

            <RadioButton
              label="No"
              name="isOnsiteVisit"
              onChange={() => {
                setIsOnsiteVisit(false);
              }}
              checked={!isOnsiteVisit}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "clinic-name" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="capturingDate"
              control={control}
              error={errors.capturingDate}
              rules={validationRule.textbox({ required: true })}
              defaultValue={new Date()}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={medicalStaffOptions}
              label={formatMessage({ id: "responsible" })}
              name="responsibleId"
              control={control}
              error={errors.responsibleId}
              rules={validationRule.textbox({ required: true })}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "start-age" })}
              name="startAge"
              control={control}
              error={errors.startAge}
              type="number"
              rules={validationRule.textbox({ type: "number", maxLength: 2 })}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={consultationReasonOptions}
              label={formatMessage({ id: "reason-consultation" })}
              name="consultationReasonId"
              control={control}
              error={errors.consultationReasonId}
              rules={validationRule.textbox({ required: true })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "years-of-infertility" })}
              name="infertilityYears"
              control={control}
              error={errors.infertilityYears}
              rules={validationRule.textbox({ type: "number", required: true, maxLength: 2 })}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={translatorOptions}
              label={formatMessage({ id: "translator" })}
              name="translatorId"
              control={control}
              error={errors.translatorId}
              disabled={watch("otherTranslatorName") ? true : false}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "other-translator-name" })}
              name="otherTranslatorName"
              control={control}
              error={errors.otherTranslatorName}
              rules={validationRule.textbox({ type: "textWithNumber", maxLength: 35 })}
              disabled={watch("translatorId")?.value ? true : false}
            />
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Box>
              <h3 className="formHeading">
                <FormattedMessage id="menstrual-history" />
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "menarche" })}
              name="menarche"
              control={control}
              error={errors.menarche}
              rules={validationRule.textbox({ type: "number", maxLength: 2 })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "lmp" })}
              name="lastMenstrualPeriod"
              control={control}
              error={errors.lastMenstrualPeriod}
              defaultValue={new Date()}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "mp-duration" })}
              name="menstruationDays"
              control={control}
              error={errors.menstruationDays}
              rules={validationRule.textbox({ type: "number", maxLength: 2 })}
            />
          </Grid>
          <Grid item xs={12} lg={1} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "interval" })}
              name="menstrualCycleDays"
              control={control}
              error={errors.menstrualCycleDays}
              rules={validationRule.textbox({ type: "number", maxLength: 2 })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={cycleOptions}
              label={formatMessage({ id: "cycle-type" })}
              name="cycleType"
              control={control}
              error={errors.cycleType}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "cycle-length" })}
              name="cycleLength"
              control={control}
              error={errors.cycleLength}
              rules={validationRule.textbox({ type: "number", maxLength: 2 })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={dysmenorrheaOptions}
              label={formatMessage({ id: "dysmenorrhea" })}
              name="dysmenorrheaId"
              control={control}
              error={errors.dysmenorrheaId}
            />
          </Grid>

          <Grid item xs={12} lg={6} md={12} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "observations-menstrual-history" })}
              name="observationMenstrualHistory"
              control={control}
              error={errors.observationMenstrualHistory}
              rules={validationRule.textbox({ maxLength: 150 })}
            />
          </Grid>

          <Grid item xs={12}>
            <Box >
              <h3 className="formHeading">
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={dressCodeOptions}
              label={formatMessage({ id: "dress-code" })}
              name="dressCodeId"
              control={control}
              error={errors.dressCodeId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={skinColorOptions}
              label={formatMessage({ id: "skin-color" })}
              name="skinColorId"
              control={control}
              error={errors.skinColorId}
            />
          </Grid>


          <Grid item xs={12}>
            <Box>
              <h3 className="formHeading">
                <FormattedMessage id="consanguinity" />
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "couple-consanguinity" })}
              name="coupleConsanguinityId"
              control={control}
              error={errors.coupleConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "female-partner" })}
              name="wifeParentsConsanguinityId"
              control={control}
              error={errors.wifeParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "male-partner" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>

          <Grid item xs={12} lg={6} md={4} sm={6} style={{ display: "flex", alignItems: "center" }}>
            <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "contraception" })} </FormLabel>
            <RadioButton
              label="Yes"
              name="isContraceptions"
              onChange={() => {
                setIsContraceptions(true);
              }}
              checked={isContraceptions}
            />
            <RadioButton
              label="No"
              name="isContraceptions"
              onChange={() => {
                let records = watch("clinicalHistoryContraceptions")?.filter((item: any) => item?.contraceptiveMethodId?.value || item?.duration);
                if (records?.length > 0) {
                  setShowContraceptionConfirmation(true);
                }
                else {
                  setIsContraceptions(false);
                }
              }}
              checked={!isContraceptions}
            />
            <CustomRadioButton
              label="Unknown"
              name="isContraceptionsUnKnown"
              control={control}
              error={errors.isContraceptionsUnKnown}
            />
          </Grid>

          < Grid item xs={12} lg={12} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "50%" }}><FormattedMessage id="method" /></TableCell>
                    <TableCell style={{ width: "15%" }} align="center"><FormattedMessage id="latest-method" /></TableCell>
                    <TableCell style={{ width: "20%" }}><FormattedMessage id="duration" /></TableCell>
                    <TableCell style={{ width: "10%", textAlign: "center", paddingTop: "5px" }}>
                      {isContraceptions ? (<Link onClick={onAddContraceptiveMethod} >
                        <AddBoxOutlinedIcon color="primary" />
                      </Link>)
                        : (<Link><AddBoxOutlinedIcon color="primary" /></Link>)
                      }
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ padding: "9px 0.1rem" }}>
                  {fields.map(({ id }, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                        <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                          <CustomSelect
                            label="Method"
                            options={contraceptiveMethodOptions}
                            name={`clinicalHistoryContraceptions[${index}][contraceptiveMethodId]`}
                            control={control}
                            error={errors?.[`clinicalHistoryContraceptions`]?.[index]?.["contraceptiveMethodId"]}
                            disabled={isContraceptions ? false : true}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <RadioButton
                            label=""
                            name={`clinicalHistoryContraceptions[${index}][isLatest]`}
                            onChange={() => {
                              handleLatestChange(index);
                            }}
                            checked={getValues("clinicalHistoryContraceptions")[index]?.isLatest}
                            disabled={isContraceptions ? false : true}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextBox
                            label=""
                            name={`clinicalHistoryContraceptions[${index}][duration]`}
                            control={control}
                            error={errors?.[`clinicalHistoryContraceptions`]?.[index]?.["duration"]}
                            rules={validationRule.textbox({ type: "textWithNumber", maxLength: 20 })}
                            disabled={isContraceptions ? false : true}
                          />
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {fields.length - 1 !== 0 && isContraceptions && (
                            <TableButtonGroup>
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
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "duration-since-last-dose-stopped", })}
              name="durationSinceLastDoseStopped"
              control={control}
              error={errors.durationSinceLastDoseStopped}
              rules={validationRule.textbox({ maxLength: 20, })}
            />

          </Grid>

          <Grid item xs={6} lg={6} md={6}>
            <Grid className="relevant_notes">
              <Tabs
                value={0}
                indicatorColor="primary"
                className="stimulationhead"
                textColor="primary"
              >
                <Tab
                  className="overviewTab"
                  label={formatMessage({ id: "relevant-notes" })}
                />
              </Tabs>
              <span
                className="tab_icon"
                onClick={() => {
                  setRichTextModalOpen(true);
                  setHeaderLabel("relevant-notes");
                }}
              >
                <Tooltip title="Edit">
                  <BorderColorOutlinedIcon />
                </Tooltip>
              </span>
              <p className="innerBoxData" style={{ height: "105px", overflowY: "auto" }} placeholder="free text 500 character">
                <div dangerouslySetInnerHTML={createMarkup(relevantNotes)} />
              </p>
            </Grid>
          </Grid>

          <Grid item xs={6} lg={6} md={6}>
            <Grid className="relevant_notes">
              <Tabs
                value={1}
                indicatorColor="primary"
                className="stimulationhead"
                textColor="primary"
              >
                <Tab
                  className="overviewTab"
                  label={formatMessage({ id: "treatment-plan" })}
                />
              </Tabs>
              <span
                className="tab_icon"
                onClick={() => {
                  setRichTextModalOpen(true);
                  setHeaderLabel("treatment-plan");
                }}
              >
                <Tooltip title="Edit">
                  <BorderColorOutlinedIcon />
                </Tooltip>
              </span>
              <p className="innerBoxData" style={{ height: "105px", overflowY: "auto" }} aria-placeholder="free text 500 character">
                <div dangerouslySetInnerHTML={createMarkup(treatmentPlan)} />
              </p>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {
        richTextModalOpen && (
          <RichTextModal
            closeModal={() => {
              setRichTextModalOpen(false);
            }}
            setContent={updateRelaventNotesAndTreatmentPlan}
            headerLabel={headerLabel}
            selectedValue={
              headerLabel === "treatment-plan" ? treatmentPlan : relevantNotes
            }
          />
        )
      }
      {showContraceptionConfirmation && (
        <CustomDialog
          open={true}
          onDisagree={handleClose}
          onAgree={onAgree}
          title={formatMessage({ id: "delete-title" })}
          subTitle={formatMessage({ id: "contraception-alert-confirmation-message" })}
        />
      )}

      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default GeneralHistory;
