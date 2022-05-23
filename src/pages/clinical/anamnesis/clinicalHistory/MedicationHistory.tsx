import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import { TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { CustomSelect, CustomTextBox, CustomDatePicker, RadioButton } from "components/forms";
import { HoverLoader } from "components";
import { alcoholConsumptionOptions, smokingDurationOptions, smokingStatusOptions, smokingStatus, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const MedicationHistory = (props: Props) => {
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, watch, reset } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const location = useLocation<any>();

  const [isEditOn, setIsEditOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isMedicationHistory, setIsMedicationHistory] = useState(true);
  const [isCurrentMedications, setIsCurrentMedications] = useState(true);
  const [isTakingBloodThinners, setIsTakingBloodThinners] = useState(true);
  const [isAllergiesHistory, setIsAllergiesHistory] = useState(true);
  const [isLifeStyleDetails, setIsLifeStyleDetails] = useState(true);

  const [isDrugs, setIsDrugs] = useState(false);
  const [isLatexAllergy, setIsLatexAllergy] = useState(false);
  const [isMedicationAllergy, setIsMedicationAllergy] = useState(false);
  const [isPeanutAllergy, setIsPeanutAllergy] = useState(false);
  const [isOtherAllergies, setIsOtherAllergies] = useState(false);
  const [editableIndex, setEditableIndex] = useState(-1);

  const { fields, append, remove } = useFieldArray({ control, name: "currentmedications", });
  const lifeStyleDetail = useFieldArray({ control, name: "lifeStyleDetail", });
  const allergyDetail = useFieldArray({ control, name: "allergyDetail", });
  const medicationHistoryTakingBloodThinners = useFieldArray({ control, name: "medicationHistoryTakingBloodThinners" });

  let patientId = useGetPatientId();

  const { tackingBloodThinnerData, drugData, medicationFrequencyData, medicationRouteData, drugAllergyData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      tackingBloodThinnerData: masterPaginationReducer[masterPaginationServices.takingBloodThinner].data,
      drugData: masterPaginationReducer[masterPaginationServices.drug].data,
      medicationFrequencyData: masterPaginationReducer[masterPaginationServices.medicationFrequency].data,
      medicationRouteData: masterPaginationReducer[masterPaginationServices.medicationRoute].data,
      drugAllergyData: masterPaginationReducer[masterPaginationServices.drugAllergy].data
    }),
    shallowEqual
  );

  let drugOptions = drugData.modelItems?.map((option: any) => ({ label: option.drugName, value: option.id }));
  let medicationFrequencyOptions = medicationFrequencyData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let medicationRouteOptions = medicationRouteData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let tackingBloodThinnerOptions = tackingBloodThinnerData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let drugAllergyOptions = drugAllergyData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.takingBloodThinner, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.drug, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.medicationFrequency, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.medicationRoute, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.drugAllergy, {}));
    if (!isEditOn) {
      addCurrentMedications();
    }
  }, []);

  useEffect(() => {
    if (drugOptions?.length && medicationFrequencyOptions?.length && medicationRouteOptions?.length && tackingBloodThinnerOptions?.length && drugAllergyOptions?.length) {
      onEdit();
    }
  }, [drugOptions?.length && medicationFrequencyOptions?.length && medicationRouteOptions?.length && tackingBloodThinnerOptions?.length && drugAllergyOptions?.length])

  function addCurrentMedications() {
    append({});
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    let lifeStyleList = bodyData.lifeStyleDetail.map((item: any) => ({
      ...item,
      isDrugs: isDrugs,
      smokingStatus: item.smokingStatus ? item.smokingStatus?.value : 0,
      smokingDurationType: item.smokingDurationType ? item.smokingDurationType?.value : 0,
      alcohol: item.alcohol ? item.alcohol?.value : 0,
      lifeStyleDetailDrugs: item?.drugsAllergyId ? item.drugsAllergyId.map((item: any) => ({
        drugsAllergyId: item.value
      })) : [],
      manLifeStyleDetailDrugs: item?.drugsAllergyId ? item.drugsAllergyId.map((item: any) => ({
        drugsAllergyId: item.value
      })) : []
    }));

    let allergyDetailList = bodyData.allergyDetail.map((item: any) => ({
      ...item,
      isLatexAllergy: isLatexAllergy,
      isMedicationAllergy: isMedicationAllergy,
      isPeanutAllergy: isPeanutAllergy,
      isOtherAllergies: isOtherAllergies
    }));

    let currentmedicationsList = bodyData?.currentmedications.map((item: any) => ({
      ...item,
      currentmedicationDate: item.currentmedicationDate ? item.currentmedicationDate : new Date(),
      medicationFrequencyId: item.medicationFrequencyId ? item.medicationFrequencyId?.value : 0,
      medicationGenericId: item.medicationGenericId ? item.medicationGenericId?.value : 0,
      medicationRouteId: item.medicationRouteId ? item.medicationRouteId?.value : 0,
      status: item.status ? item.status?.value : 0
    }));

    let takingBloodThinnerList = bodyData.medicationHistoryTakingBloodId.map((item: any) => ({
      takingBloodThinnerId: item
    }));

    bodyData = {
      ...bodyData,
      id: patientId,
      isMedications: isMedicationHistory,
      isCurrentMedications: isCurrentMedications,
      isTakingBloodThinners: isTakingBloodThinners,
      isAllergies: isAllergiesHistory,
      isLifeStyleDetails: isLifeStyleDetails,
      currentmedications: isCurrentMedications ? currentmedicationsList : [],
      lifeStyleDetail: isLifeStyleDetails ? lifeStyleList[0] : [],
      allergyDetail: isAllergiesHistory ? allergyDetailList[0] : [],
      medicationHistoryTakingBloodThinners: isTakingBloodThinners ? takingBloodThinnerList : []
    }

    if (location.pathname?.indexOf("/male-assessment/medication-history") > -1) {
      bodyData = {
        ...bodyData,
        manCurrentmedications: isCurrentMedications ? currentmedicationsList : [],
        manLifeStyleDetail: isLifeStyleDetails ? lifeStyleList[0] : [],
        manAllergyDetail: isAllergiesHistory ? allergyDetailList[0] : [],
        manMedicationHistoryTakingBloodThinners: isTakingBloodThinners ? takingBloodThinnerList : [],
      }
    }

    setLoading(true);

    let medicationHistoryService = location.pathname?.indexOf("/clinical-history/medication") > -1 ?
      services[(isEditOn ? 'updateMedicationHistory' : 'createMedicationHistory') as keyof typeof services]
      : services[(isEditOn ? 'updateManMedicationHistory' : 'createManMedicationHistory') as keyof typeof services];

    medicationHistoryService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setEditableIndex(-1);
          toastMessage(formatMessage({ id: isEditOn ? "medication-history-update-message" : "medication-history-create-message" }));
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
      MedicationHistoryId: patientId,
      ManMedicationHistoryId: patientId,
    }
    setIsEditOn(false);
    setDeleteLoading(true);

    let medicationHistoryService = services[(location.pathname?.indexOf("/clinical-history/medication") > -1 ? 'deleteMedicationHistory' : 'deleteManMedicationHistory') as keyof typeof services];

    medicationHistoryService(parms)
      .then((res) => {
        setDeleteLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(false);
          setEditableIndex(-1);
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
      MedicationHistoryId: patientId,
      ManMedicationHistoryId: patientId
    }
    setLoading(true);
    let medicationHistoryService = services[(location.pathname?.indexOf("/clinical-history/medication") > -1 ? 'getMedicationHistoryById' : 'getManMedicationHistoryById') as keyof typeof services];

    medicationHistoryService(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setEditableIndex(-1);
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
    addCurrentMedications();
    setIsMedicationHistory(true);
    setIsCurrentMedications(true);
    setIsTakingBloodThinners(true);
    setIsAllergiesHistory(true);
    setIsLifeStyleDetails(true);
    setIsDrugs(true);
    setIsLatexAllergy(true);
    setIsMedicationAllergy(true);
    setIsPeanutAllergy(true);
    setIsOtherAllergies(true);
    setEditableIndex(-1);
  }

  function setFormData(resData: any) {

    if (drugOptions?.length && medicationFrequencyOptions?.length && medicationRouteOptions?.length && tackingBloodThinnerOptions?.length && drugAllergyOptions?.length) {
      let newCurrentmedicationsList = resData?.manCurrentmedications ? resData?.manCurrentmedications?.map((item: any) => ({
        ...item,
        medicationGenericId: { label: item.medicationGenericDrugName, value: item.medicationGenericId },
        medicationFrequencyId: { label: item.medicationFrequencyName, value: item.medicationFrequencyId },
        medicationRouteId: { label: item.medicationRouteName, value: item.medicationRouteId },
        status: smokingStatusOptions?.find((option: any) => option.value == item.status) ?? null,
      })) :
        resData?.currentmedications?.map((item: any) => ({
          ...item,
          medicationGenericId: { label: item.medicationGenericDrugName, value: item.medicationGenericId },
          medicationFrequencyId: { label: item.medicationFrequencyName, value: item.medicationFrequencyId },
          medicationRouteId: { label: item.medicationRouteName, value: item.medicationRouteId },
          status: smokingStatusOptions?.find((option: any) => option.value == item.status) ?? null,
        }));

      let newlifeStyleDetailList = resData?.manLifeStyleDetail ? {
        ...resData.manLifeStyleDetail,
        smokingStatus: smokingStatusOptions?.find((option: any) => option.value == resData?.manLifeStyleDetail?.smokingStatus) ?? null,
        smokingDurationType: smokingDurationOptions?.find((option: any) => option.value == resData?.manLifeStyleDetail?.smokingDurationType) ?? null,
        alcohol: alcoholConsumptionOptions?.find((option: any) => option.value == resData?.manLifeStyleDetail?.alcohol) ?? null,
        drugsAllergyId: resData.manLifeStyleDetail?.manLifeStyleDetailDrugs?.map((option: any) => ({ label: option?.drugsAllergyName, value: option.drugsAllergyId }))

      } :
        {
          ...resData.lifeStyleDetail,
          smokingStatus: smokingStatusOptions?.find((option: any) => option.value == resData?.lifeStyleDetail?.smokingStatus) ?? null,
          smokingDurationType: smokingDurationOptions?.find((option: any) => option.value == resData?.lifeStyleDetail?.smokingDurationType) ?? null,
          alcohol: alcoholConsumptionOptions?.find((option: any) => option.value == resData?.lifeStyleDetail?.alcohol) ?? null,
          drugsAllergyId: resData.lifeStyleDetail?.lifeStyleDetailDrugs?.map((option: any) => ({ label: option?.drugsAllergyName, value: option.drugsAllergyId }))
        }

      let data = {
        ...resData,
        medicationHistoryTakingBloodId: resData.medicationHistoryTakingBloodThinners ? resData.medicationHistoryTakingBloodThinners?.map((option: any) => ({ label: option.takingBloodThinnerName, value: option.takingBloodThinnerId })) :
          resData.manMedicationHistoryTakingBloodThinners?.map((option: any) => ({ label: option.takingBloodThinnerName, value: option.takingBloodThinnerId })),
        currentmedications: newCurrentmedicationsList,
        manCurrentmedications: newCurrentmedicationsList,
        lifeStyleDetail: [newlifeStyleDetailList],
        manLifeStyleDetail: [newlifeStyleDetailList],
        allergyDetail: [resData.allergyDetail],
        manAllergyDetail: [resData.allergyDetail]
      }
      reset(data);

      setIsMedicationHistory(data.isMedications);
      setIsCurrentMedications(data.isCurrentMedications);
      setIsTakingBloodThinners(data.isTakingBloodThinners);
      setIsAllergiesHistory(data.isAllergies);
      setIsLifeStyleDetails(data.isLifeStyleDetails);

      setIsLatexAllergy(resData.allergyDetail ? resData.allergyDetail.isLatexAllergy : resData.manAllergyDetail.isLatexAllergy);
      setIsMedicationAllergy(resData.allergyDetail ? resData.allergyDetail.isMedicationAllergy : resData.manAllergyDetail.isMedicationAllergy);
      setIsPeanutAllergy(resData.allergyDetail ? resData.allergyDetail.isPeanutAllergy : resData.manAllergyDetail.isPeanutAllergy);
      setIsOtherAllergies(resData.allergyDetail ? resData.allergyDetail.isOtherAllergies : resData.manAllergyDetail.isOtherAllergies);

      setIsDrugs(resData.lifeStyleDetail ? resData.lifeStyleDetail.isDrugs : resData.manLifeStyleDetail.isDrugs);
    }
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "clinical-history-medication" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={2} md={3} sm={6} >
            <FormLabel component="legend">{formatMessage({ id: "medications-history" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="isMedicationHistory"
              onChange={() => {
                setIsMedicationHistory(true);
              }}
              checked={isMedicationHistory}
            />
            <RadioButton
              label="No"
              name="isMedicationHistory"
              onChange={() => {
                setIsMedicationHistory(false);
              }}
              checked={!isMedicationHistory}
            />
          </Grid>

          <Grid item xs={12} lg={2} md={3} sm={6}>
            <FormLabel component="legend">{formatMessage({ id: "current-medications" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="isCurrentMedications"
              onChange={() => {
                setIsCurrentMedications(true);
              }}
              checked={isCurrentMedications}
              disabled={isMedicationHistory ? false : true}
            />
            <RadioButton
              label="No"
              name="hasGeneralGynecologicalHistory"
              onChange={() => {
                setIsCurrentMedications(false);
              }}
              checked={!isCurrentMedications}
              disabled={isMedicationHistory ? false : true}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={3} sm={6}>
            <FormLabel component="legend">{formatMessage({ id: "taking-blood-thinner" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="isTakingBloodThinners"
              onChange={() => {
                setIsTakingBloodThinners(true);
              }}
              checked={isTakingBloodThinners}
              disabled={isMedicationHistory ? false : true}
            />
            <RadioButton
              label="No"
              name="isTakingBloodThinners"
              onChange={() => {
                setIsTakingBloodThinners(false);
              }}
              checked={!isTakingBloodThinners}
              disabled={isMedicationHistory ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={3} sm={6}>
            <FormLabel component="legend">&nbsp;</FormLabel>
            <CustomSelect
              options={tackingBloodThinnerOptions}
              label={formatMessage({ id: "options" })}
              name="medicationHistoryTakingBloodId"
              control={control}
              error={errors?.medicationHistoryTakingBloodId}
              multiple
              disabled={isMedicationHistory && isTakingBloodThinners ? false : true}
            />
          </Grid>
          <Grid item xs={12} lg={6} md={6} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "blood-thinner-description" })}
              name="takingBloodThinnerDescription"
              control={control}
              error={errors?.takingBloodThinnerDescription}
              rules={validationRule.textbox({ maxLength: 20 })}
              disabled={isMedicationHistory && isTakingBloodThinners ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="date-year" /></TableCell>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="medication-brand-generic-name" /></TableCell>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="frequency" /></TableCell>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="route" /></TableCell>
                    <TableCell style={{ width: "10%" }}><FormattedMessage id="dose" /></TableCell>
                    <TableCell style={{ width: "10%" }}><FormattedMessage id="duration" /></TableCell>
                    <TableCell style={{ width: "20%" }}><FormattedMessage id="status" /></TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => { addCurrentMedications() }}
                        style={{ padding: "0px 11px", background: "white" }}
                        disabled={isMedicationHistory ? false : true}
                      >
                        <FormattedMessage id="add-new-row" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map(({ id }, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                        <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                          <CustomDatePicker
                            label=""
                            name={`currentmedications[${index}][currentmedicationDate]`}
                            control={control}
                            error={errors?.[`currentmedications`]?.[index]?.["currentmedicationDate"]}
                            disabled={isMedicationHistory ? false : true}
                            defaultValue={new Date()}
                          />
                        </TableCell>
                        <TableCell align="center" style={{ padding: "3px" }}>
                          {!watch(`currentmedications[${index}][medicationname]`) &&
                            <CustomSelect
                              options={drugOptions}
                              label=""
                              name={`currentmedications[${index}][medicationGenericId]`}
                              control={control}
                              error={errors?.[`currentmedications`]?.[index]?.["medicationGenericId"]}
                              style={{ marginBottom: "5px" }}
                              placeholder={formatMessage({ id: "frequency" })}
                              disabled={isMedicationHistory ? false : true}
                            />
                          }

                          {!watch(`currentmedications[${index}][medicationGenericId]`)?.value &&
                            <CustomTextBox
                              label=""
                              name={`currentmedications[${index}][medicationname]`}
                              control={control}
                              error={errors?.[`currentmedications`]?.[index]?.["medicationname"]}
                              rules={validationRule.textbox({ type: "textWithNumber" })}
                              placeholder={formatMessage({ id: "drug-name" })}
                              disabled={isMedicationHistory ? false : true}
                            />
                          }

                        </TableCell>
                        <TableCell style={{ padding: "3px" }}>
                          <CustomSelect
                            options={medicationFrequencyOptions}
                            label=""
                            name={`currentmedications[${index}][medicationFrequencyId]`}
                            control={control}
                            error={errors?.[`currentmedications`]?.[index]?.["medicationFrequencyId"]}
                            placeholder={formatMessage({ id: "frequency" })}
                            disabled={isMedicationHistory ? false : true}
                          />
                        </TableCell>
                        <TableCell style={{ padding: "3px" }}>
                          <CustomSelect
                            options={medicationRouteOptions}
                            label=""
                            name={`currentmedications[${index}][medicationRouteId]`}
                            control={control}
                            error={errors?.[`currentmedications`]?.[index]?.["medicationRouteId"]}
                            placeholder={formatMessage({ id: "route" })}
                            disabled={isMedicationHistory ? false : true}
                          />
                        </TableCell>
                        <TableCell style={{ padding: "3px" }}>
                          <CustomTextBox
                            label=""
                            name={`currentmedications[${index}][dose]`}
                            control={control}
                            error={errors?.[`currentmedications`]?.[index]?.["dose"]}
                            rules={validationRule.textbox({ type: "textWithNumber", maxLength: 20 })}
                            placeholder={formatMessage({ id: "dose" })}
                            disabled={isMedicationHistory ? false : true}
                          />
                        </TableCell>
                        <TableCell style={{ padding: "3px" }}>
                          <CustomTextBox
                            label=""
                            name={`currentmedications[${index}][duration]`}
                            control={control}
                            error={errors?.[`currentmedications`]?.[index]?.["duration"]}
                            rules={validationRule.textbox({ type: "textWithNumber", maxLength: 20 })}
                            placeholder={formatMessage({ id: "duration" })}
                            disabled={isMedicationHistory ? false : true}
                          />
                        </TableCell>
                        <TableCell style={{ padding: "3px" }}>
                          <CustomSelect
                            options={smokingStatusOptions}
                            label=""
                            name={`currentmedications[${index}][status]`}
                            control={control}
                            error={errors?.[`currentmedications`]?.[index]?.["status"]}
                            placeholder={formatMessage({ id: "status" })}
                            disabled={isMedicationHistory ? false : true}
                          />
                        </TableCell>
                        <TableCell>
                          {fields.length - 1 !== 0 && isMedicationHistory && (
                            <TableButtonGroup>
                              {/* <TableEditButton
                                onClick={() => {
                                  setEditableIndex(editableIndex == index ? -1 : index);
                                }}
                              /> */}
                              <DeleteButton
                                onDelete={() => {
                                  remove(index);
                                }}
                              />
                            </TableButtonGroup>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
              <Grid container item xs={12} spacing={1}>
                <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }}>
                  <FormLabel component="legend" style={{ marginRight: "5px" }}>{formatMessage({ id: "allergies-history" })}:</FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isAllergiesHistory"
                    onChange={() => {
                      setIsAllergiesHistory(true);
                    }}
                    checked={isAllergiesHistory}
                  />
                  <RadioButton
                    label="No"
                    name="isAllergiesHistory"
                    onChange={() => {
                      setIsAllergiesHistory(false);
                    }}
                    checked={!isAllergiesHistory}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend">{formatMessage({ id: "latex-allergy" })}</FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isLatexAllergy"
                    onChange={() => {
                      setIsLatexAllergy(true);
                    }}
                    checked={isLatexAllergy}
                    disabled={isAllergiesHistory ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isLatexAllergy"
                    onChange={() => {
                      if (!watch(`allergyDetail[0][latexAllergyDescription]`)) {
                        setIsLatexAllergy(false);
                      }
                    }}
                    checked={!isLatexAllergy}
                    disabled={isAllergiesHistory ? false : true}
                  />
                </Grid>

                <Grid item xs={12} lg={8} md={8} sm={12}>
                  <FormLabel component="legend">&nbsp;</FormLabel>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks" })}
                    name={`allergyDetail[0][latexAllergyDescription]`}
                    control={control}
                    rules={validationRule.textbox({ required: isLatexAllergy ? true : false, maxLength: 50 })}
                    error={isLatexAllergy ? errors?.[`allergyDetail`]?.[0]?.["latexAllergyDescription"] : null}
                    disabled={isLatexAllergy && isAllergiesHistory ? false : true}
                  />
                </Grid>

                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend">{formatMessage({ id: "medication-allergy" })}</FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isMedicationAllergy"
                    onChange={() => {
                      setIsMedicationAllergy(true);
                    }}
                    checked={isMedicationAllergy}
                    disabled={isAllergiesHistory ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isMedicationAllergy"
                    onChange={() => {
                      if (!watch(`allergyDetail[0][medicationAllergyDescription]`)) {
                        setIsMedicationAllergy(false);
                      }
                    }}
                    checked={!isMedicationAllergy}
                    disabled={isAllergiesHistory ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={8} md={8} sm={12}>
                  <FormLabel component="legend">&nbsp;</FormLabel>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks" })}
                    name={`allergyDetail[0][medicationAllergyDescription]`}
                    control={control}
                    disabled={isMedicationAllergy && isAllergiesHistory ? false : true}
                    rules={validationRule.textbox({ required: isMedicationAllergy ? true : false, maxLength: 50 })}
                    error={isMedicationAllergy ? errors?.[`allergyDetail`]?.[0]?.["medicationAllergyDescription"] : null}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend">{formatMessage({ id: "peanut-allergy" })}</FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isPeanutAllergy"
                    onChange={() => {
                      setIsPeanutAllergy(true);
                    }}
                    checked={isPeanutAllergy}
                    disabled={isAllergiesHistory ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isPeanutAllergy"
                    onChange={() => {
                      if (!watch(`allergyDetail[0][peanutAllergyDescription]`)) {
                        setIsPeanutAllergy(false);
                      }
                    }}
                    checked={!isPeanutAllergy}
                    disabled={isAllergiesHistory ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={8} md={8} sm={12}>
                  <FormLabel component="legend">&nbsp;</FormLabel>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks" })}
                    name={`allergyDetail[0][peanutAllergyDescription]`}
                    control={control}
                    disabled={isPeanutAllergy && isAllergiesHistory ? false : true}
                    rules={validationRule.textbox({ required: isPeanutAllergy ? true : false, maxLength: 50 })}
                    error={isPeanutAllergy ? errors?.[`allergyDetail`]?.[0]?.["peanutAllergyDescription"] : null}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend"> {formatMessage({ id: "other-allergy" })}</FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isOtherAllergies"
                    onChange={() => {
                      setIsOtherAllergies(true);
                    }}
                    checked={isOtherAllergies}
                    disabled={isAllergiesHistory ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isOtherAllergies"
                    onChange={() => {
                      if (!watch(`allergyDetail[0][otherAllergiesDescription]`)) {
                        setIsOtherAllergies(false);
                      }
                    }}
                    checked={!isOtherAllergies}
                    disabled={isAllergiesHistory ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={8} md={8} sm={12}>
                  <FormLabel component="legend">&nbsp;</FormLabel>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks", })}
                    name={`allergyDetail[0][otherAllergiesDescription]`}
                    control={control}
                    disabled={isOtherAllergies && isAllergiesHistory ? false : true}
                    rules={validationRule.textbox({ required: isOtherAllergies ? true : false, maxLength: 50 })}
                    error={isOtherAllergies ? errors?.[`allergyDetail`]?.[0]?.["otherAllergiesDescription"] : null}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
              <Grid container item xs={12} spacing={1}>
                <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }}>
                  <FormLabel component="legend" style={{ marginRight: "5px" }}> {formatMessage({ id: "lifestyle-habits" })}: </FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isLifeStyleDetails"
                    onChange={() => {
                      setIsLifeStyleDetails(true);
                    }}
                    checked={isLifeStyleDetails}
                  />
                  <RadioButton
                    label="No"
                    name="isLifeStyleDetails"
                    onChange={() => {
                      setIsLifeStyleDetails(false);
                    }}
                    checked={!isLifeStyleDetails}
                  />
                </Grid>

                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={smokingStatusOptions}
                    label={formatMessage({ id: "smoking" })}
                    name={`lifeStyleDetail[0][smokingStatus]`}
                    control={control}
                    error={errors?.[`lifeStyleDetail][0]?.[smokingStatus`]}
                    disabled={isLifeStyleDetails ? false : true}
                    rules={validationRule.textbox({ required: isLifeStyleDetails ? true : false })}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomTextBox label={formatMessage({ id: "duration" })}
                    name={`lifeStyleDetail[0][smokingDuration]`}
                    control={control}
                    error={errors?.[`lifeStyleDetail][0]?.[smokingDuration`]}
                    rules={validationRule.textbox({ type: "number", required: isLifeStyleDetails ? true : false, maxLength: 3 })}
                    disabled={isLifeStyleDetails && watch(`lifeStyleDetail[0][smokingStatus]`)?.value == (smokingStatus.YesActive || smokingStatus.YesDiscontinued) ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={smokingDurationOptions}
                    label={formatMessage({ id: "duration-type" })}
                    name={`lifeStyleDetail[0][smokingDurationType]`}
                    control={control}
                    error={errors?.[`lifeStyleDetail][0]?.[smokingDurationType`]}
                    disabled={isLifeStyleDetails && watch(`lifeStyleDetail[0][smokingStatus]`)?.value == (smokingStatus.YesActive || smokingStatus.YesDiscontinued) ? false : true}
                    rules={validationRule.textbox({ required: isLifeStyleDetails ? true : false, maxLength: 3 })}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "smokes-per-day", })}
                    name={`lifeStyleDetail[0][smokesPerDay]`}
                    control={control}
                    error={errors?.[`lifeStyleDetail][0]?.[smokesPerDay`]}
                    rules={validationRule.textbox({ type: "number", maxLength: 3 })}
                    disabled={isLifeStyleDetails && watch(`lifeStyleDetail[0][smokingStatus]`)?.value == (smokingStatus.YesActive || smokingStatus.YesDiscontinued) ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={8} md={4} sm={6}>
                  <CustomTextBox
                    placeholder={formatMessage({ id: "remarks" })}
                    name={`lifeStyleDetail[0][smokeDescription]`}
                    control={control}
                    disabled={isLifeStyleDetails && watch(`lifeStyleDetail[0][smokingStatus]`)?.value == (smokingStatus.YesActive || smokingStatus.YesDiscontinued) ? false : true}
                    rules={validationRule.textbox({ maxLength: 100 })}
                  />
                </Grid>

                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={alcoholConsumptionOptions}
                    label={formatMessage({ id: "alcohol" })}
                    name={`lifeStyleDetail[0][alcohol]`}
                    control={control}
                    error={errors?.[`lifeStyleDetail][0]?.[alcohol`]}
                    disabled={isLifeStyleDetails ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={8} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks" })}
                    name={`lifeStyleDetail[0][alcoholDescription]`}
                    control={control}
                    disabled={isLifeStyleDetails ? false : true}
                    rules={validationRule.textbox({ maxLength: 100 })}
                  />
                </Grid>

                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <FormLabel component="legend">{formatMessage({ id: "drugs" })} </FormLabel>
                  <RadioButton
                    label="Yes"
                    name="isDrugs"
                    onChange={() => {
                      setIsDrugs(true);
                    }}
                    checked={isDrugs}
                    disabled={isLifeStyleDetails ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isDrugs"
                    onChange={() => {
                      setIsDrugs(false);
                    }}
                    checked={!isDrugs}
                    disabled={isLifeStyleDetails ? false : true}
                  />
                </Grid>
                <Grid item xs={12} lg={8} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks" })}
                    name={`lifeStyleDetail[0][drugsDescription]`}
                    control={control}
                    disabled={isDrugs && isLifeStyleDetails ? false : true}
                    rules={validationRule.textbox({ maxLength: 100 })}
                  />
                </Grid>

                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomSelect
                    options={drugAllergyOptions}
                    label={formatMessage({ id: "drug-allergy" })}
                    name={`lifeStyleDetail[0][drugsAllergyId]`}
                    control={control}
                    error={errors?.[`lifeStyleDetail][0]?.[drugsAllergyId`]}
                    disabled={isDrugs && isLifeStyleDetails ? false : true}
                    multiple
                  />
                </Grid>

                <Grid item xs={12} lg={8} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks" })}
                    name={`lifeStyleDetail[0][lifeStyleDetailDrugDescription]`}
                    control={control}
                    disabled={watch("lifeStyleDetail[0][drugsAllergyId]")?.value?.some((item: any) => item.includes(5))}
                    rules={validationRule.textbox({ maxLength: 50 })}
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

export default MedicationHistory;
