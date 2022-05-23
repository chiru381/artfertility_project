import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Typography } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';

import { CustomSelect, CustomTextBox, RadioButton, CustomDatePicker, CustomCheckBox, } from "components/forms";
import { masterPaginationServices, painRatingScaleOptions, durationUnitOptions } from "utils/constants";
import { getFormBody, validationRule } from "utils/global";
import { useCreateLookupOptions, useToastMessage, useGetPatientId } from "utils/hooks";
import { getVitalLookUp } from 'redux/actions';
import { getMasterPaginationData } from "redux/actions";
import { RootReducerState } from 'utils/types';
import { services } from "utils/services";
import { HoverLoader } from 'components';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import PainRating from "./PainRating";


interface Props {

}

const PatientNewVitals = (props: Props) => {
  const location = useLocation<any>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { handleSubmit, formState: { errors }, control, reset, watch, setValue, getValues } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [loading, setLoading] = useState(false);

  const [isLatexAllergy, setIsLatexAllergy] = useState(true);
  const [isCOVIDVaccination, setIsCOVIDVaccination] = useState(true);
  const [isBoosterDose, setIsBoosterDose] = useState(true);
  const [isCoviD19Symptoms, setIscovid19Symptoms] = useState(true);
  const [isContactwithCovid19Patient, setIsContactwithCovid19Patient] = useState(true);
  const [isAllergiesHistory, setIsAllergiesHistory] = useState(true);
  const [isMedicationAllergy, setIsMedicationAllergy] = useState(true);
  const [isPeanutAllergy, setIsPeanutAllergy] = useState(true);
  const [isOtherAllergies, setIsOtherAllergies] = useState(true);
  const [expanded, setExpanded] = useState<string | false>("patientDetails");
  const [isNoKnowAllergy, setIsNoKnowAllergy] = useState(true);
  const [patientName, setPatientName] = useState("Patient Name");
  const [patientUHID, setPatientUHID] = useState("UHID12317632");
  const [workingCenter, setWorkingCenter] = useState("Test Clinic");

  let vitalData = location.state ?? {};
  let patientId = useGetPatientId();

  const { painLocationData, painFrequencyData, painDescriptionData, countryData, covidVaccinationData, medicalStaffData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => {
      return ({
        painLocationData: masterPaginationReducer[masterPaginationServices.painLocation].data,
        painFrequencyData: masterPaginationReducer[masterPaginationServices.painFrquency].data,
        painDescriptionData: masterPaginationReducer[masterPaginationServices.painDescription].data,
        countryData: masterPaginationReducer[masterPaginationServices.country].data,
        covidVaccinationData: masterPaginationReducer[masterPaginationServices.covidVaccination].data,
        medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data
      })
    },
    shallowEqual
  );

  let painLocationOptions = painLocationData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let painFrequencyOptions = painFrequencyData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let painDescriptionOptions = painDescriptionData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let countryOptions = countryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let covidVaccinationOptions = covidVaccinationData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.painLocation, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.painFrquency, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.painDescription, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.country, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.covidVaccination, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
  }, []);

  useEffect(() => {
    if (vitalData?.id && painLocationOptions.length && painFrequencyOptions.length && painDescriptionOptions.length && countryOptions.length && covidVaccinationOptions.length && medicalStaffOptions.length) {
      getVitalOnApiCallById();
    }
  }, [vitalData?.id && painLocationOptions.length && painFrequencyOptions.length && painDescriptionOptions.length && countryOptions.length && covidVaccinationOptions.length && medicalStaffOptions.length]);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    bodyData = {
      ...bodyData,
      patientId: patientId,
      coviD19Symptoms: isCoviD19Symptoms,
      isOtherAllergies: isOtherAllergies,
      isNoKnowAllergy: isNoKnowAllergy,
      isPeanutAllergy: isPeanutAllergy,
      isMedicationAllergy: isMedicationAllergy,
      isLatexAllergy: isLatexAllergy,
      isBoosterDose: isBoosterDose,
      isCOVIDVaccination: isCOVIDVaccination,
      isContactwithCovid19Patient: isContactwithCovid19Patient
    };

    if (vitalData?.id) {
      bodyData = {
        ...bodyData,
        id: vitalData?.id
      }
    }

    setLoading(true);
    let VitalService = services[(vitalData?.id ? 'updateVital' : 'createVital') as keyof typeof services];

    VitalService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: vitalData?.id ? "vital-update-message" : "vital-create-message" }));
          history.goBack();
        } else {
          toastMessage(res.data?.message, "error");
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, "error");
      });
  }

  function getVitalOnApiCallById() {
    let paramsData = {
      vitalCapturingId: vitalData?.id
    };
    setLoading(true);
    services.getVitalById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setFormData(res.data.response);
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function setFormData(resData: any) {
    let data = {
      ...resData,
      professionalId: medicalStaffOptions.find((item: any) => item.value == resData.professionalId) ?? null,
      painRatingScale: painRatingScaleOptions.find((item: any) => item.value == resData.painRatingScale) ?? null,
      painLocationId: painLocationOptions.find((item: any) => item.value == resData.painLocationId) ?? null,
      painFrequencyId: painFrequencyOptions.find((item: any) => item.value == resData.painFrequencyId) ?? null,
      painDurationUnit: durationUnitOptions.find((item: any) => item.value == resData.painDurationUnit) ?? null,
      painDescriptionId: painDescriptionOptions.find((item: any) => item.value == resData.painDescriptionId) ?? null,
      vitalCountryId: countryOptions.find((item: any) => item.value == resData.vitalCountryId) ?? null,
      vaccinationId: covidVaccinationOptions.find((item: any) => item.value == resData.vaccinationId) ?? null,
    }
    reset(data);

    setIsLatexAllergy(resData.isLatexAllergy);
    setIsCOVIDVaccination(resData.isCOVIDVaccination);
    setIsBoosterDose(resData.isBoosterDose);
    setIscovid19Symptoms(resData.coviD19Symptoms);
    setIsContactwithCovid19Patient(resData.isContactwithCovid19Patient);
    setIsMedicationAllergy(resData.isMedicationAllergy);
    setIsPeanutAllergy(resData.isPeanutAllergy);
    setIsOtherAllergies(resData.isOtherAllergies);
    setIsNoKnowAllergy(resData.isNoKnowAllergy);
  }

  const handleAccordianToggle = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "vital-patient" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: vitalData?.id ? "Update" : "Save"
      }}
      goBack={() => history.goBack()}
      backButtonProps={{ label: formatMessage({ id: "summary" }) }}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Accordion
            key="patientDetails"
            style={{ marginBottom: '10px', width: "100%" }}
            expanded={expanded === "patientDetails"}
            onChange={handleAccordianToggle("patientDetails")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>{patientName} ({patientUHID})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomDatePicker
                    label={formatMessage({ id: "start-date" })}
                    name="vitalCapturingDate"
                    control={control}
                    error={errors.vitalCapturingDate}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "start-age" })}
                    name="patientAge"
                    control={control}
                    error={errors.patientAge}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={medicalStaffOptions}
                    label={formatMessage({ id: "professional" })}
                    name="professionalId"
                    control={control}
                    error={errors.professionalId}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "clinic" })}
                    name="workingCenter"
                    control={control}
                    error={errors.workingCenter}
                    defaultValue={workingCenter}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "uhid" })}
                    name="vitalPatientUHID"
                    control={control}
                    defaultValue={patientUHID}
                    disabled
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            key="vital-signs"
            style={{ marginBottom: '10px', width: "100%" }}
            expanded={expanded === "vital-signs"}
            onChange={handleAccordianToggle("vital-signs")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Vital Signs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "weight(kg)" })}
                    name="vitalWeight"
                    control={control}
                    error={errors.vitalWeight}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "weight(lb)" })}
                    name="vitalWeight2"
                    control={control}
                    error={errors.vitalWeight2}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "height" })}
                    name="vitalHeight"
                    control={control}
                    error={errors.vitalHeight}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "bmi" })}
                    name="vitalBMI"
                    control={control}
                    error={errors.vitalBMI}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "tempC" })}
                    name="vitalTemperatureC"
                    control={control}
                    error={errors.vitalTemperatureC}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "tempF" })}
                    name="vitalTemperatureF"
                    control={control}
                    error={errors.vitalTemperatureF}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "bp(mmHg)" })}
                    name="vitalBP"
                    control={control}
                    error={errors.vitalBP}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "hr(bpm)" })}
                    name="vitalHR"
                    control={control}
                    error={errors.vitalHR}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "rr(cpm)" })}
                    name="vitalRR"
                    control={control}
                    error={errors.vitalRR}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "waist-circumference" })}
                    name="waistCircumference"
                    control={control}
                    error={errors.waistCircumference}
                    rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            key="pain-assessment"
            style={{ marginBottom: '10px', width: "100%" }}
            expanded={expanded === "pain-assessment"}
            onChange={handleAccordianToggle("pain-assessment")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Pain Assessment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <PainRating />
                </Grid>
                <Grid item xs={12} lg={2} md={3} sm={6}>
                  <CustomSelect
                    options={painRatingScaleOptions}
                    label={formatMessage({ id: "pain-rating-scale" })}
                    name="painRatingScale"
                    control={control}
                    error={errors.painRatingScale}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={3} sm={6}>
                  <CustomSelect
                    options={painLocationOptions}
                    label={formatMessage({ id: "location" })}
                    name="painLocationId"
                    control={control}
                    error={errors.painLocationId}
                    disabled={watch("painRatingScale")?.value == 1}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={3} sm={6}>
                  <CustomSelect
                    options={painFrequencyOptions}
                    label={formatMessage({ id: "frequency" })}
                    name="painFrequencyId"
                    control={control}
                    error={errors.painFrequencyId}
                    disabled={watch("painRatingScale")?.value == 1}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={2} sm={4}>
                  <CustomTextBox
                    label={formatMessage({ id: "duration" })}
                    name="painDuration"
                    control={control}
                    error={errors.painDuration}
                    rules={validationRule.textbox({ type: "number" })}
                    disabled={watch("painRatingScale")?.value == 1}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={3} sm={6}>
                  <CustomSelect
                    options={durationUnitOptions}
                    label={formatMessage({ id: "duration-unit" })}
                    name="painDurationUnit"
                    control={control}
                    error={errors.painDurationUnit}
                    disabled={watch("painRatingScale")?.value == 1}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={3} sm={6}>
                  <CustomSelect
                    options={painDescriptionOptions}
                    label={formatMessage({ id: "pain-discription" })}
                    name="painDescriptionId"
                    control={control}
                    error={errors.painDescriptionId}
                    disabled={watch("painRatingScale")?.value == 1}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomCheckBox
                    name="isPainRateConfirmed"
                    label={formatMessage({ id: "pain-rate-confirmed" })}
                    control={control}
                    labelPlacement="end"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            key="covid19"
            style={{ marginBottom: '10px' }}
            expanded={expanded === "covid19"}
            onChange={handleAccordianToggle("covid19")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Covid 19</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6} md={6} sm={6} style={{ borderRight: "1px solid #c2c2c2" }}>
                  <Grid item xs={12} lg={5} md={8} sm={12} style={{ display: "flex", alignItems: "center" }} >
                    <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                      <span className="text-13 font-medium">{formatMessage({ id: "covid-symptoms" })}</span>
                    </FormControl>
                    <RadioButton
                      label="Yes"
                      name="isCoviD19Symptoms"
                      onChange={() => {
                        setIscovid19Symptoms(true);
                      }}
                      checked={isCoviD19Symptoms}
                    />
                    <RadioButton
                      label="No"
                      name="isCoviD19Symptoms"
                      onChange={() => {
                        setIscovid19Symptoms(false);
                      }}
                      checked={!isCoviD19Symptoms}
                    />
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={2} md={2} sm={4}>
                      <CustomCheckBox
                        name="isCough"
                        label={formatMessage({ id: "cough" })}
                        control={control}
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4} sm={6}>
                      <CustomCheckBox
                        name="isShortnessofBreath"
                        label={formatMessage({ id: "shortness-of-breath" })}
                        control={control}
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid item xs={12} lg={3} md={2} sm={4}>
                      <CustomCheckBox
                        name="isFever"
                        label={formatMessage({ id: "fever" })}
                        control={control}
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid item xs={12} lg={3} md={2} sm={4}>
                      <CustomCheckBox
                        name="isOthers"
                        label={formatMessage({ id: "others" })}
                        control={control}
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextBox
                        label={formatMessage({ id: "remarks" })}
                        name="otherDescription"
                        control={control}
                        error={errors.otherDescription}
                        rules={validationRule.textbox({ maxLength: 50 })}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} lg={6} md={6} sm={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={7} md={9} sm={12} style={{ display: "flex", alignItems: "center" }} >
                      <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                        <span className="text-13 font-medium">{formatMessage({ id: "contact-with-covid-patient" })}</span>
                      </FormControl>
                      <RadioButton
                        label="Yes"
                        name="isContactwithCovid19Patient"
                        onChange={() => {
                          setIsContactwithCovid19Patient(true);
                        }}
                        checked={isContactwithCovid19Patient}
                      />
                      <RadioButton
                        label="No"
                        name="isContactwithCovid19Patient"
                        onChange={() => {
                          setIsContactwithCovid19Patient(false);
                        }}
                        checked={!isContactwithCovid19Patient}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={6} md={6} sm={12}>
                          <CustomDatePicker
                            label={formatMessage({ id: "date-of-exposer" })}
                            name="dateExposure"
                            control={control}
                            error={errors.dateExposure}
                          />
                        </Grid>
                        <Grid item xs={12} lg={6} md={6} sm={12}>
                          <CustomDatePicker
                            label={formatMessage({ id: "covid19-pcr-negative-date" })}
                            name="coviD19PCRNegativeDate"
                            control={control}
                            error={errors.coviD19PCRNegativeDate}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} lg={12} md={12} sm={12} className="formHeading">
                  <CustomCheckBox
                    name="isTravelhistory"
                    label={formatMessage({ id: "travel-history" })}
                    control={control}
                    labelPlacement="end"
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={countryOptions}
                    label={formatMessage({ id: "country" })}
                    name="vitalCountryId"
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomDatePicker
                    label={formatMessage({ id: "arrival-date" })}
                    name="arrivalDate"
                    control={control}
                    error={errors.arrivalDate}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks" })}
                    name="remark"
                    control={control}
                    error={errors.remark}
                    rules={validationRule.textbox({ maxLength: 50 })}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "created-by" })}
                    name="createdBy"
                    control={control}
                    disabled
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            key="covid19-vaccination-status"
            style={{ marginBottom: '10px' }}
            expanded={expanded === "covid19-vaccination-status"}
            onChange={handleAccordianToggle("covid19-vaccination-status")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Covid 19 Vaccination Status</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6} md={6} sm={6} style={{ borderRight: "1px solid #c2c2c2" }}>

                  <Grid item xs={12} lg={5} md={7} sm={8} style={{ display: "flex", alignItems: "center" }} >
                    <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                      <span className="text-13 font-medium">{formatMessage({ id: "covid-vaccination" })}</span>
                    </FormControl>
                    <RadioButton
                      label="Yes"
                      name="isCOVIDVaccination"
                      onChange={() => {
                        setIsCOVIDVaccination(true);
                      }}
                      checked={isCOVIDVaccination}
                    />
                    <RadioButton
                      label="No"
                      name="isCOVIDVaccination"
                      onChange={() => {
                        setIsCOVIDVaccination(false);
                      }}
                      checked={!isCOVIDVaccination}
                    />
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} >
                      <CustomTextBox
                        label={formatMessage({ id: "reason" })}
                        name="reason"
                        control={control}
                        error={errors.reason}
                        rules={validationRule.textbox({ maxLength: 50 })}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6} sm={12}>
                      <CustomSelect
                        options={covidVaccinationOptions}
                        label={formatMessage({ id: "vaccine" })}
                        name="vaccinationId"
                        control={control}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6} sm={12}>
                      <CustomTextBox
                        label={formatMessage({ id: "remarks" })}
                        name="otherVaccinationDescription"
                        control={control}
                        error={errors.otherVaccinationDescription}
                        rules={validationRule.textbox({ maxLength: 50 })}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6} sm={12}>
                      <CustomDatePicker
                        label={'First ' + formatMessage({ id: "dose" })}
                        name="firstDose"
                        control={control}
                        error={errors.firstDose}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6} sm={12}>
                      <CustomDatePicker
                        label={'Second ' + formatMessage({ id: "dose" })}
                        name="secondDose"
                        control={control}
                        error={errors.secondDose}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} lg={6} md={6} sm={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={6} md={6} sm={8} style={{ display: "flex", alignItems: "center" }} >
                      <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                        <span className="text-13 font-medium">{formatMessage({ id: "booster-dose" })}</span>
                      </FormControl>
                      <RadioButton
                        label="Yes"
                        name="isBoosterDose"
                        onChange={() => {
                          setIsBoosterDose(true);
                        }}
                        checked={isBoosterDose}
                      />
                      <RadioButton
                        label="No"
                        name="isBoosterDose"
                        onChange={() => {
                          setIsBoosterDose(false);
                        }}
                        checked={!isBoosterDose}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6} sm={12}>
                      <CustomDatePicker
                        label={formatMessage({ id: "date" })}
                        name="boosterDoseDate"
                        control={control}
                        error={errors.boosterDoseDate}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextBox
                        label={formatMessage({ id: "remarks" })}
                        name="boosterDoseDescription"
                        control={control}
                        error={errors.boosterDoseDescription}
                        rules={validationRule.textbox({ maxLength: 50 })}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>

          </Accordion>

          <Accordion
            key="allergies-section"
            style={{ marginBottom: '10px' }}
            expanded={expanded === "allergies-section"}
            onChange={handleAccordianToggle("allergies-section")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Allergies (New Section)</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }}>
                  <RadioButton
                    label="No Known Allergies"
                    name="isNoKnowAllergy"
                    onChange={() => {
                      setIsNoKnowAllergy(true);
                    }}
                    checked={isNoKnowAllergy}
                  />
                  <RadioButton
                    label="Allergies"
                    name="isNoKnowAllergy"
                    onChange={() => {
                      setIsNoKnowAllergy(false);
                    }}
                    checked={!isNoKnowAllergy}
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={12} sm={12}>
                  <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} padding={2}>
                    <Grid container xs={12} spacing={3}>
                      <Grid item xs={12} lg={4} md={4} sm={6}>
                        <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                          <span className="text-13 font-medium">{formatMessage({ id: "latex-allergy" })}</span>
                        </FormControl>
                        <RadioButton
                          label="Yes"
                          name="isLatexAllergy"
                          onChange={() => {
                            setIsLatexAllergy(true);
                          }}
                          checked={isLatexAllergy}
                          disabled={isNoKnowAllergy ? false : true}
                        />
                        <RadioButton
                          label="No"
                          name="isLatexAllergy"
                          onChange={() => {
                            setIsLatexAllergy(false);
                          }}
                          checked={!isLatexAllergy}
                          disabled={isNoKnowAllergy ? false : true}
                        />
                      </Grid>

                      <Grid item xs={12} lg={8} md={8} sm={12}>
                        <CustomTextBox
                          label={formatMessage({ id: "remarks" })}
                          name="latexAllergyDescription"
                          control={control}
                          disabled={isLatexAllergy && isNoKnowAllergy ? false : true}
                          rules={validationRule.textbox({ maxLength: 50 })}
                        />
                      </Grid>

                      <Grid item xs={12} lg={4} md={4} sm={6}>
                        <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                          <span className="text-13 font-medium">{formatMessage({ id: "medication-allergy" })}</span>
                        </FormControl>
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
                            setIsMedicationAllergy(false);
                          }}
                          checked={!isMedicationAllergy}
                          disabled={isAllergiesHistory ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} lg={8} md={8} sm={12}>
                        <CustomTextBox
                          label={formatMessage({ id: "remarks" })}
                          name="medicationAllergyDescription"
                          control={control}
                          disabled={isMedicationAllergy && isAllergiesHistory ? false : true}
                          rules={validationRule.textbox({ maxLength: 50 })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={4} md={4} sm={6}>
                        <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                          <span className="text-13 font-medium">{formatMessage({ id: "peanut-allergy" })}</span>
                        </FormControl>
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
                            setIsPeanutAllergy(false);
                          }}
                          checked={!isPeanutAllergy}
                          disabled={isAllergiesHistory ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} lg={8} md={8} sm={12}>
                        <CustomTextBox
                          label={formatMessage({ id: "remarks" })}
                          name="peanutAllergyDescription"
                          control={control}
                          disabled={isPeanutAllergy && isAllergiesHistory ? false : true}
                          rules={validationRule.textbox({ maxLength: 50 })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={4} md={4} sm={6}>
                        <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                          <span className="text-13 font-medium">{formatMessage({ id: "other-allergy" })}</span>
                        </FormControl>
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
                            setIsOtherAllergies(false);
                          }}
                          checked={!isOtherAllergies}
                          disabled={isAllergiesHistory ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} lg={8} md={8} sm={12}>
                        <CustomTextBox
                          label={formatMessage({ id: "remarks", })}
                          name="otherAllergiesDescription"
                          control={control}
                          disabled={isOtherAllergies && isAllergiesHistory ? false : true}
                          rules={validationRule.textbox({ maxLength: 50 })}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={6} md={12} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "observation" })}
                    name="observation"
                    control={control}
                    error={errors.observation}
                    multiline
                    rows={4}
                    rules={validationRule.textbox({ maxLength: 100 })}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>

          </Accordion>
        </Grid>
      </Box>
      {loading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default PatientNewVitals;
